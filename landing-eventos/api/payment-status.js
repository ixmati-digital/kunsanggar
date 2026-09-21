// V1 ROOT payment-status entrypoint for the existing Vercel project root.
// Reuse the audited handler; do not duplicate payment or secret handling.
module.exports = require("../../api/payment-status");
