const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
};

const getSupabaseConfig = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.");
  return { url: url.replace(/\/$/, ""), key };
};

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed" });

  const externalReference = String(req.query?.external_reference || "").trim();
  if (!externalReference || externalReference.length > 160) {
    return sendJson(res, 400, { error: "Falta external_reference." });
  }

  try {
    const { url, key } = getSupabaseConfig();
    const response = await fetch(`${url}/rest/v1/ticket_orders?external_reference=eq.${encodeURIComponent(externalReference)}&select=external_reference,event_slug,event_name,total_amount,payment_status,payment_status_detail,payment_id,preference_id,date_approved,created_at,updated_at`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }
    });
    const data = await response.json();
    if (!response.ok) return sendJson(res, response.status, { error: data?.message || "Error consultando la orden." });
    if (!Array.isArray(data) || !data[0]) return sendJson(res, 404, { error: "Orden no encontrada." });
    return sendJson(res, 200, { order: data[0] });
  } catch (error) {
    return sendJson(res, 500, { error: error.message || "No fue posible consultar el estado." });
  }
};
