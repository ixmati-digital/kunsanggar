// Single source of truth remains in the historical Mercado Pago function.
// This wrapper exposes the Mexico V1 endpoint when ROOT is deployed with a
// serverless runtime; it contains no credentials.
module.exports = require("../landing-eventos/api/create-preference");
