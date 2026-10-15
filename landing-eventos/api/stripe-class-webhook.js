const crypto = require("crypto");

const sendJson = (res, code, payload) => {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

const readRawBody = (req) => new Promise((resolve, reject) => {
  if (Buffer.isBuffer(req.body)) return resolve(req.body);
  if (typeof req.body === "string") return resolve(Buffer.from(req.body));
  const chunks = [];
  let size = 0;
  req.on("data", (chunk) => {
    size += chunk.length;
    if (size > 1024 * 1024) {
      reject(new Error("Request body too large"));
      req.destroy();
      return;
    }
    chunks.push(chunk);
  });
  req.on("end", () => resolve(Buffer.concat(chunks)));
  req.on("error", reject);
});

const validStripeSignature = (rawBody, header, secret) => {
  if (!header || !secret) return false;
  const pieces = header.split(",").map((part) => part.split("=", 2));
  const timestamp = pieces.find(([key]) => key === "t")?.[1];
  const signatures = pieces.filter(([key]) => key === "v1").map(([, value]) => value);
  if (!timestamp || !/^\d+$/.test(timestamp) || !signatures.length) return false;
  if (Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp)) > 300) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${timestamp}.`).update(rawBody).digest();
  return signatures.some((signature) => {
    if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
    const received = Buffer.from(signature, "hex");
    return received.length === expected.length && crypto.timingSafeEqual(received, expected);
  });
};

const supabaseConfig = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service credentials are not configured.");
  return { url: url.replace(/\/$/, ""), key };
};

const updateRegistration = async (registrationId, session) => {
  const { url, key } = supabaseConfig();
  const paymentIntent = typeof session.payment_intent === "string"
    ? session.payment_intent
    : session.payment_intent?.id || null;
  const response = await fetch(
    `${url}/rest/v1/class_registrations?id=eq.${encodeURIComponent(registrationId)}&status=in.(PENDING,APPROVED)&payment_status=in.(UNVERIFIED,REPORTED)`,
    {
      method: "PATCH",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation"
      },
      body: JSON.stringify({
        payment_status: "CONFIRMED",
        payment_method: "STRIPE",
        payment_reference: session.id,
        stripe_checkout_session_id: session.id,
        stripe_payment_intent_id: paymentIntent,
        payment_verified_by: null,
        payment_verified_at: new Date().toISOString()
      })
    }
  );
  const payload = await response.json().catch(() => []);
  if (!response.ok) throw new Error(payload?.message || "Supabase rejected Stripe payment evidence.");
  return Array.isArray(payload) ? payload.length : 0;
};

module.exports = async function stripeClassWebhook(req, res) {
  if (req.method !== "POST") return sendJson(res, 405, { error: "Method not allowed" });
  const signingSecret = process.env.STRIPE_CLASS_WEBHOOK_SECRET;
  const expectedPaymentLink = process.env.STRIPE_CLASS_PAYMENT_LINK_ID;
  if (!signingSecret || !expectedPaymentLink) {
    return sendJson(res, 503, { error: "Stripe class webhook is not configured." });
  }

  let rawBody;
  try {
    rawBody = await readRawBody(req);
  } catch {
    return sendJson(res, 400, { error: "Invalid request body." });
  }

  if (!validStripeSignature(rawBody, req.headers["stripe-signature"], signingSecret)) {
    return sendJson(res, 400, { error: "Invalid Stripe signature." });
  }

  let event;
  try {
    event = JSON.parse(rawBody.toString("utf8"));
  } catch {
    return sendJson(res, 400, { error: "Invalid event payload." });
  }
  if (!["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)) {
    return sendJson(res, 200, { received: true });
  }

  const session = event.data?.object;
  const paymentLinkId = typeof session?.payment_link === "string" ? session.payment_link : session?.payment_link?.id;
  const reference = String(session?.client_reference_id || "");
  if (paymentLinkId !== expectedPaymentLink || session?.object !== "checkout.session"
    || session?.mode !== "payment" || session?.payment_status !== "paid"
    || session?.currency !== "mxn" || !/^cs_(?:test|live)_[A-Za-z0-9]+$/.test(session?.id || "")
    || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(reference)) {
    return sendJson(res, 200, { received: true, matched: false });
  }

  try {
    const updated = await updateRegistration(reference, session);
    return sendJson(res, 200, { received: true, matched: updated === 1 });
  } catch (error) {
    console.error("Stripe class webhook reconciliation failed:", error.message);
    return sendJson(res, 500, { error: "Payment could not be reconciled." });
  }
};

module.exports.config = { api: { bodyParser: false } };
