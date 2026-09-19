(() => {
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const params = new URLSearchParams(window.location.search);
  const reference = params.get('external_reference') || params.get('externalReference') || '';
  const paymentId = params.get('payment_id') || params.get('collection_id') || '';
  const status = params.get('status') || params.get('collection_status') || 'returned';
  const statusTarget = document.querySelector('[data-result-status]');
  const details = document.querySelector('[data-result-details]');
  const note = document.querySelector('[data-result-note]');
  const rows = [['Estado recibido', status], ['Referencia', reference || 'No recibida'], ['Identificador de pago', paymentId || 'Pendiente de confirmación']];
  if (details) details.innerHTML = rows.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('');
  if (!reference) { if (note) note.textContent = 'El retorno no incluyó una referencia de orden. Confirma el resultado por WhatsApp si es necesario.'; return; }
  if (['localhost', '127.0.0.1'].includes(window.location.hostname) && !window.KUNSANG_GAR_PAYMENT_STATUS_API) {
    if (note) note.textContent = 'Demo local: el estado real se consulta cuando el endpoint seguro de Supabase esté configurado.';
    return;
  }
  const apiBase = String(window.KUNSANG_GAR_PAYMENT_API_BASE || '').replace(/\/$/, '');
  const endpoint = window.KUNSANG_GAR_PAYMENT_STATUS_API || `${apiBase}/api/payment-status?external_reference=${encodeURIComponent(reference)}`;
  fetch(endpoint).then(response => response.ok ? response.json() : Promise.reject(new Error('status unavailable'))).then(data => {
    const order = data.order || {};
    if (statusTarget) statusTarget.textContent = order.payment_status || status;
    if (details) details.innerHTML = [['Estado de la orden', order.payment_status || status], ['Concepto', order.event_name || 'Kunsang Gar México'], ['Monto', order.total_amount ? `$${Number(order.total_amount).toLocaleString('es-MX')} MXN` : 'Pendiente'], ['Referencia', order.external_reference || reference], ['Identificador de pago', order.payment_id || paymentId || 'Pendiente']].map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join('');
    if (note) note.textContent = 'El estado mostrado proviene de la orden registrada. La confirmación definitiva depende del webhook de Mercado Pago.';
  }).catch(() => { if (note) note.textContent = 'El pago regresó a la plataforma, pero el estado de la orden aún no puede consultarse. La confirmación depende del webhook de Mercado Pago.'; });
})();
