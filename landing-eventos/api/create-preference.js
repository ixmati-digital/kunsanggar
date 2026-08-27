const MERCADOPAGO_PREFERENCES_URL = "https://api.mercadopago.com/checkout/preferences";
const allowedOriginPatterns = [
  /^https:\/\/kunsanggar\.vercel\.app$/,
  /^https:\/\/(www\.)?kunsanggarmexico\.com$/,
  /^https:\/\/(www\.)?kunsanggarmexico\.org$/,
  /^https:\/\/[a-z0-9-]+\.hostingersite\.com$/
];

const numberFromEnv = (name, fallback) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

const events = {
  tsa_lung: {
    name: "TSA Lung | 20 y 21 junio 2026",
    price: numberFromEnv("TSA_LUNG_PRICE", 2000),
    active: false
  },
  mil_ofrendas: {
    name: "Mil Ofrendas a Nampar Gyalwa | 26, 27 y 28 junio 2026",
    price: numberFromEnv("MIL_OFRENDAS_PRICE", 2000),
    active: true
  }
};

const setCorsHeaders = (req, res) => {
  const origin = req.headers.origin || "";
  const allowedOrigin = allowedOriginPatterns.some((pattern) => pattern.test(origin)) ? origin : "https://kunsanggar.vercel.app";

  res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");
};

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

const parseBody = (req) => {
  if (!req.body) return {};

  if (typeof req.body !== "string") {
    return req.body;
  }

  const contentType = req.headers["content-type"] || "";

  if (contentType.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(req.body));
  }

  return JSON.parse(req.body);
};

const getSupabaseConfig = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
  }

  return {
    url: url.replace(/\/$/, ""),
    key
  };
};

const supabaseRequest = async (path, options = {}) => {
  const { url, key } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || "Error consultando Supabase.");
  }

  return data;
};

const createExternalReference = (eventSlug) =>
  `${eventSlug}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

module.exports = async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const siteUrl = (process.env.PUBLIC_SITE_URL || "https://kunsanggarmexico.com").replace(/\/$/, "");
  const contentType = req.headers["content-type"] || "";
  const acceptsHtml = String(req.headers.accept || "").includes("text/html");
  const shouldRedirectToCheckout = contentType.includes("application/x-www-form-urlencoded") || acceptsHtml;

  if (!accessToken) {
    return sendJson(res, 500, { error: "Falta configurar MERCADOPAGO_ACCESS_TOKEN." });
  }

  let body = {};

  try {
    body = parseBody(req);
  } catch (error) {
    return sendJson(res, 400, { error: "JSON inválido." });
  }

  const eventSlug = String(body.evento || "").trim().replace(/-/g, "_");
  const event = events[eventSlug];
  const quantity = Number.parseInt(body.cantidad || 1, 10);
  const ticketType = String(body.tipo_ticket || body.tipoBoleto || "General").trim();

  if (!event) {
    return sendJson(res, 400, { error: "Evento no permitido." });
  }

  if (!event.active) {
    return sendJson(res, 400, { error: "Este evento ya concluyó." });
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return sendJson(res, 400, { error: "La cantidad debe ser mayor a 0." });
  }

  const externalReference = createExternalReference(eventSlug);
  const totalAmount = event.price * quantity;
  const buyerName = String(body.nombre || "Pendiente Mercado Pago").trim();
  const buyerEmail = String(body.email || body.correo || `pendiente+${externalReference}@kunsanggarmexico.local`).trim();
  const buyerPhone = String(body.telefono || "Pendiente").trim();

  try {
    await supabaseRequest("ticket_orders", {
      method: "POST",
      headers: {
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        external_reference: externalReference,
        event_slug: eventSlug,
        event_name: event.name,
        ticket_type: ticketType,
        quantity,
        unit_price: event.price,
        total_amount: totalAmount,
        buyer_name: buyerName,
        buyer_email: buyerEmail,
        buyer_phone: buyerPhone,
        payment_status: "created"
      })
    });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || "No fue posible guardar la orden." });
  }

  const preference = {
    items: [
      {
        id: eventSlug,
        title: `${event.name} - Boleto ${ticketType}`,
        quantity,
        unit_price: event.price,
        currency_id: "MXN"
      }
    ],
    back_urls: {
      success: `${siteUrl}/success.html`,
      failure: `${siteUrl}/failure.html`,
      pending: `${siteUrl}/pending.html`
    },
    auto_return: "approved",
    external_reference: externalReference,
    notification_url: `${siteUrl}/api/mercadopago-webhook`,
    metadata: {
      external_reference: externalReference,
      nombre: buyerName,
      email: buyerEmail,
      telefono: buyerPhone,
      evento: eventSlug,
      tipo_ticket: ticketType,
      cantidad: quantity
    }
  };

  if (body.email || body.correo || body.nombre || body.telefono) {
    preference.payer = {
      name: buyerName,
      email: buyerEmail,
      phone: {
        number: buyerPhone
      }
    };
  }

  try {
    const response = await fetch(MERCADOPAGO_PREFERENCES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(preference)
    });

    const data = await response.json();

    if (!response.ok) {
      return sendJson(res, response.status, {
        error: data.message || "Mercado Pago rechazó la preferencia.",
        details: data
      });
    }

    await supabaseRequest(`ticket_orders?external_reference=eq.${encodeURIComponent(externalReference)}`, {
      method: "PATCH",
      headers: {
        Prefer: "return=minimal"
      },
      body: JSON.stringify({
        preference_id: data.id,
        updated_at: new Date().toISOString()
      })
    });

    if (shouldRedirectToCheckout) {
      res.statusCode = 303;
      res.setHeader("Location", data.init_point);
      return res.end();
    }

    return sendJson(res, 200, {
      init_point: data.init_point,
      preference_id: data.id,
      external_reference: externalReference,
      total_amount: totalAmount
    });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || "Error creando la preferencia de Mercado Pago." });
  }
};
