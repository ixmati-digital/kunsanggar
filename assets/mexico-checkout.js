(() => {
  const form = document.querySelector('[data-mx-payment-form]');
  if (!form) return;

  const params = new URLSearchParams(window.location.search);
  const concept = params.get('evento') || 'donacion_mx';
  const donation = concept === 'donacion_mx';
  const event = {
    sadhana_dakinis: {
      title: 'Sadhana de todas las Dakinis',
      detail: '2 y 3 de octubre de 2026 · Online por Zoom · Donativo único de $600 MXN',
      amount: 600,
      fixed: true
    },
    donacion_mx: {
      title: 'Donación Kunsang Gar México',
      detail: 'Donativo único en MXN mediante Mercado Pago.',
      amount: 300,
      fixed: false
    }
  }[concept] || null;
  const errorBox = document.querySelector('[data-mx-error]');
  const submit = form.querySelector('button[type="submit"]');
  const amount = form.querySelector('[name="monto"]');
  const title = document.querySelector('[data-mx-title]');
  const detail = document.querySelector('[data-mx-detail]');
  const summary = document.querySelector('[data-mx-summary]');

  if (!event) {
    form.hidden = true;
    if (errorBox) { errorBox.hidden = false; errorBox.textContent = 'Concepto de pago no disponible.'; }
    return;
  }

  title.textContent = event.title;
  detail.textContent = event.detail;
  if (event.fixed) {
    amount.value = String(event.amount);
    amount.closest('fieldset')?.setAttribute('hidden', '');
  } else {
    amount.addEventListener('change', () => { summary.textContent = `$${Number(amount.value).toLocaleString('es-MX')} MXN`; });
  }
  summary.textContent = `$${Number(amount.value || event.amount).toLocaleString('es-MX')} MXN`;

  form.addEventListener('submit', async (submitEvent) => {
    submitEvent.preventDefault();
    errorBox.hidden = true;
    submit.disabled = true;
    submit.textContent = 'Conectando con Mercado Pago…';
    const payload = Object.fromEntries(new FormData(form));
    payload.evento = concept;
    payload.monto = Number(payload.monto || event.amount);
    try {
      const apiBase = String(window.KUNSANG_GAR_PAYMENT_API_BASE || '').replace(/\/$/, '');
      const endpoint = window.KUNSANG_GAR_PAYMENT_API || `${apiBase}/api/create-preference`;
      const response = await fetch(endpoint, { method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}, body: JSON.stringify(payload) });
      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } catch { data = {}; }
      if (!response.ok || !data.init_point) throw new Error(data.error || 'El checkout de Mercado Pago todavía no está configurado en este entorno.');
      window.location.assign(data.init_point);
    } catch (error) {
      errorBox.hidden = false;
      errorBox.textContent = error.message || 'No fue posible iniciar el pago.';
      submit.disabled = false;
      submit.textContent = 'Continuar a Mercado Pago';
    }
  });
})();
