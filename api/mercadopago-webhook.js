// Reuse the audited Mercado Pago webhook without duplicating secret-handling
// logic in the public ROOT tree.
module.exports = require("../landing-eventos/api/mercadopago-webhook");
