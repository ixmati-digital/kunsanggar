(() => {
  const copy = {
    es: {
      menu: 'Menú', 'nav-needs': 'Necesidades', 'nav-services': 'Servicios', 'nav-projects': 'Implementaciones', 'nav-package': 'Paquete',
      'hero-kicker': 'Una visión compartida', 'hero-title': 'Una<br>comunidad<br>sin fronteras.',
      'hero-subtitle': 'Un plan claro para cuidar la presencia digital de Kunsang Gar y acercar sus enseñanzas a comunidades de distintos países.',
      'hero-cta': 'Explorar la propuesta', 'hero-footer': 'Continuidad · Comunidad · Crecimiento', 'hero-link': 'Ver la propuesta mensual ↓',
      'needs-kicker': '02 · Una base compartida', 'needs-title': 'Tres necesidades internacionales.',
      'needs-intro': 'Para compartir las enseñanzas entre países, Kunsang Gar necesita una presencia confiable, una forma de llegar a nuevas comunidades y comunicación institucional clara.',
      'need-security-title': 'Continuidad', 'need-security': 'El sitio, sus contenidos y herramientas necesitan atención preventiva para seguir disponibles.',
      'need-reach-title': 'Alcance', 'need-reach': 'Las comunidades que aún no conocen Kunsang Gar necesitan poder encontrar sus actividades.',
      'need-communication-title': 'Comunicación', 'need-communication': 'Maestros, equipo y comunidades necesitan comunicarse con una identidad institucional común.',
      'services-kicker': '03 · Servicios individuales', 'services-title': 'Cada servicio resuelve una necesidad.', 'services-intro': 'Se pueden contratar por separado o reunir en una operación coordinada.',
      'security-kicker': 'Resguardo y continuidad', 'security-title': 'Seguridad y continuidad digital',
      'problem-label': 'Problema', 'solution-label': 'Solución', 'benefit-label': 'Beneficio',
      'security-problem': 'Una interrupción o un cambio no detectado puede afectar el acceso a la plataforma y sus contenidos.',
      'security-solution': 'Supervisión preventiva, revisión de seguridad, verificación de respaldos y control de accesos.',
      'security-benefit': 'Atención de incidencias y mantenimiento preventivo para dar continuidad a la plataforma existente.',
      'security-task-1': 'Supervisión y revisión de seguridad', 'security-task-2': 'Verificación de respaldos y accesos',
      'security-task-3': 'Atención de incidencias técnicas', 'security-task-4': 'Mantenimiento preventivo recurrente',
      'monthly-label': 'Por mes', 'security-note': 'No se vuelve a cobrar el desarrollo ni la infraestructura inicial. La supervisión reduce riesgos, pero no puede garantizar seguridad absoluta.',
      'ads-kicker': 'Descubrimiento y alcance', 'ads-title': 'Gestión internacional de Google Ads',
      'ads-problem': 'Las personas interesadas en las enseñanzas pueden no encontrar las actividades de Kunsang Gar.',
      'ads-solution': 'Campañas segmentadas por país e idioma, con optimización continua y seguimiento.',
      'ads-benefit': 'Una presencia medible para llegar a comunidades nuevas y aprender qué contenidos generan interés.',
      'ads-task-1': 'México y Estados Unidos', 'ads-task-2': 'Preparación para expansión futura a Europa',
      'ads-task-3': 'Optimización y seguimiento de campañas', 'ads-task-4': 'Informes de rendimiento',
      'ads-note': 'Honorarios de gestión. El presupuesto publicitario se paga directamente a Google y no está incluido. No se garantizan resultados.',
      'email-kicker': 'Identidad y comunicación', 'email-title': 'Correo institucional',
      'email-problem': 'La comunicación del equipo necesita una identidad profesional y una administración común.',
      'email-solution': 'Administración centralizada de cuentas y apoyo para proteger y organizar el servicio.',
      'email-benefit': 'Una comunicación institucional más clara, con herramientas y soporte para el equipo.',
      'email-task-1': 'Cuentas institucionales y administración centralizada', 'email-task-2': 'Protección contra amenazas',
      'email-task-3': 'Automatizaciones y configuración', 'email-task-4': 'Soporte para la administración del correo',
      'email-note': 'La capacidad por buzón depende del plan de correo contratado; aquí no se presupone un límite de almacenamiento.',
      'individual-total-label': 'Total de los tres servicios individuales',
      'projects-kicker': '04 · Proyectos independientes', 'projects-title': 'Implementaciones opcionales.',
      'projects-intro': 'Son proyectos de una sola vez. No son requisito para contratar la operación mensual.',
      'ads-project-kicker': 'Preparación de campañas', 'ads-project-title': 'Implementación de Google Ads',
      'ads-project-copy': 'Definición de objetivos, estructura, segmentación, medición y lanzamiento inicial de campañas.',
      'one-time-label': 'Pago único', 'ad-spend-label': 'Pauta recomendada · presupuesto constante',
      'ad-spend-copy': 'Durante 3 meses. Se paga directamente a Google. Al terminar, Kunsang Gar evalúa los resultados y decide si continúa.',
      'store-kicker': 'Comercio digital', 'store-title': 'Tienda internacional',
      'store-copy': 'Una implementación para administrar un catálogo de hasta 250 productos.',
      'store-1': 'Catálogo y variantes', 'store-2': 'Carrito y pagos', 'store-3': 'Pedidos e inventario',
      'store-4': 'Descuentos y envíos', 'store-5': 'Administración de productos y pedidos',
      'store-optional': 'Opcional: la tienda no es necesaria para contratar el paquete mensual.',
      'package-kicker': '05 · Una sola operación', 'package-lead': 'Seguridad + Publicidad + Correo.',
      'package-copy': 'La tarifa especial reúne los tres servicios bajo una operación coordinada, con una sola mensualidad y responsabilidades claras.',
      'package-1': 'Seguridad y continuidad digital', 'package-2': 'Gestión internacional de Google Ads', 'package-3': 'Correo institucional',
      'special-rate': 'Tarifa especial', 'individual-label': 'Por separado', 'save-label': 'Ahorro',
      'package-exclusion': 'El paquete incluye honorarios de operación y gestión. No incluye la inversión publicitaria que se paga a Google ni nuevos desarrollos.',
      'summary-cta': 'Ver resumen de inversión', 'summary-kicker': '06 · Resumen de inversión', 'summary-title': 'Qué se paga y cuándo.',
      'summary-intro': 'Los honorarios y la pauta aparecen separados para que el presupuesto de Google no se confunda con los servicios profesionales.',
      'summary-package': 'Kunsang Gar International Care', 'summary-package-note': 'Seguridad + gestión de Google Ads + correo institucional',
      'summary-implementation': 'Implementación de Google Ads', 'summary-implementation-note': 'Honorarios de preparación y lanzamiento',
      'summary-spend': 'Pauta recomendada', 'summary-spend-note': 'Presupuesto constante por 3 meses; pago directo a Google',
      'summary-phase-title': 'Durante los primeros 3 meses', 'summary-phase-note': 'Paquete + pauta. La implementación se cobra una sola vez aparte.',
      'summary-store': 'Tienda internacional opcional', 'summary-store-note': 'Hasta 250 productos. No se incluye en el total mensual de la fase inicial.',
      'one-time-short': 'pago único',
      'summary-footnote': 'Al concluir los tres meses de pauta recomendada, Kunsang Gar evalúa el rendimiento antes de decidir el siguiente presupuesto. No hay garantía de resultados publicitarios.',
      'closing-kicker': 'Kunsang Gar · comunidades internacionales', 'closing-title': 'Una comunidad.<br>Sin fronteras.',
      'return-site': 'Volver a Kunsang Gar <span aria-hidden="true">↗</span>', 'back-top': 'Volver arriba ↑'
    },
    en: {
      menu: 'Menu', 'nav-needs': 'Needs', 'nav-services': 'Services', 'nav-projects': 'Implementations', 'nav-package': 'Package',
      'hero-kicker': 'A shared vision', 'hero-title': 'One<br>community<br>without<br>borders.',
      'hero-subtitle': 'A clear plan to care for Kunsang Gar’s digital presence and bring its teachings closer to communities in different countries.',
      'hero-cta': 'Explore the proposal', 'hero-footer': 'Continuity · Community · Growth', 'hero-link': 'View the monthly proposal ↓',
      'needs-kicker': '02 · A shared foundation', 'needs-title': 'Three international needs.',
      'needs-intro': 'To share the teachings across countries, Kunsang Gar needs a dependable online presence, a way to reach new communities, and clear institutional communication.',
      'need-security-title': 'Continuity', 'need-security': 'The website, its content, and its tools need preventive care to remain available.',
      'need-reach-title': 'Reach', 'need-reach': 'People who have not yet discovered Kunsang Gar need a way to find its activities.',
      'need-communication-title': 'Communication', 'need-communication': 'Teachers, the team, and communities need to communicate under a shared institutional identity.',
      'services-kicker': '03 · Individual services', 'services-title': 'Each service meets a specific need.', 'services-intro': 'Choose services individually or bring them together under one coordinated operation.',
      'security-kicker': 'Protection and continuity', 'security-title': 'Digital security and continuity',
      'problem-label': 'Problem', 'solution-label': 'Solution', 'benefit-label': 'Benefit',
      'security-problem': 'An outage or an unnoticed change can affect access to the platform and its content.',
      'security-solution': 'Preventive monitoring, security reviews, backup checks, and access control.',
      'security-benefit': 'Incident support and preventive maintenance to help keep the existing platform running.',
      'security-task-1': 'Monitoring and security reviews', 'security-task-2': 'Backup and access checks',
      'security-task-3': 'Technical incident support', 'security-task-4': 'Ongoing preventive maintenance',
      'monthly-label': 'Per month', 'security-note': 'There is no second charge for the original development or initial infrastructure. Monitoring reduces risk but cannot guarantee absolute security.',
      'ads-kicker': 'Discovery and reach', 'ads-title': 'International Google Ads management',
      'ads-problem': 'People interested in the teachings may not find Kunsang Gar’s activities.',
      'ads-solution': 'Campaigns targeted by country and language, with ongoing optimization and monitoring.',
      'ads-benefit': 'A measurable way to reach new communities and learn which content draws interest.',
      'ads-task-1': 'Mexico and the United States', 'ads-task-2': 'Preparation for future expansion into Europe',
      'ads-task-3': 'Campaign monitoring and optimization', 'ads-task-4': 'Performance reports',
      'ads-note': 'Management fee only. Ad spend is paid directly to Google and is not included. Results are not guaranteed.',
      'email-kicker': 'Identity and communication', 'email-title': 'Institutional email',
      'email-problem': 'The team needs professional communication and shared administration.',
      'email-solution': 'Centralized account administration and help protecting and organizing the service.',
      'email-benefit': 'Clearer institutional communication, with tools and support for the team.',
      'email-task-1': 'Institutional accounts and centralized administration', 'email-task-2': 'Protection against threats',
      'email-task-3': 'Automations and setup', 'email-task-4': 'Email administration support',
      'email-note': 'Mailbox capacity depends on the email plan under contract; no storage limit is assumed here.',
      'individual-total-label': 'Total for all three individual services',
      'projects-kicker': '04 · Independent projects', 'projects-title': 'Optional implementations.',
      'projects-intro': 'These are one-time projects. They are not required to choose the monthly service.',
      'ads-project-kicker': 'Campaign preparation', 'ads-project-title': 'Google Ads implementation',
      'ads-project-copy': 'Set objectives, structure, targeting, measurement, and the initial campaign launch.',
      'one-time-label': 'One-time fee', 'ad-spend-label': 'Recommended ad spend · steady budget',
      'ad-spend-copy': 'For 3 months, paid directly to Google. At the end, Kunsang Gar reviews performance and decides whether to continue.',
      'store-kicker': 'Digital commerce', 'store-title': 'International store',
      'store-copy': 'A one-time implementation to manage a catalog of up to 250 products.',
      'store-1': 'Catalog and variants', 'store-2': 'Cart and payments', 'store-3': 'Orders and inventory',
      'store-4': 'Discounts and shipping', 'store-5': 'Product and order administration',
      'store-optional': 'Optional: the store is not required to choose the monthly package.',
      'package-kicker': '05 · One coordinated operation', 'package-lead': 'Security + Advertising + Email.',
      'package-copy': 'The special rate brings all three services together under one coordinated operation, with one monthly fee and clear responsibilities.',
      'package-1': 'Digital security and continuity', 'package-2': 'International Google Ads management', 'package-3': 'Institutional email',
      'special-rate': 'Special rate', 'individual-label': 'Separate services', 'save-label': 'You save',
      'package-exclusion': 'The package covers service and management fees. It excludes ad spend paid to Google and new development work.',
      'summary-cta': 'See the investment summary', 'summary-kicker': '06 · Investment summary', 'summary-title': 'What is paid, and when.',
      'summary-intro': 'Professional fees and ad spend are shown separately, so Google’s budget is not confused with service fees.',
      'summary-package': 'Kunsang Gar International Care', 'summary-package-note': 'Security + Google Ads management + institutional email',
      'summary-implementation': 'Google Ads implementation', 'summary-implementation-note': 'Professional fee for setup and launch',
      'summary-spend': 'Recommended ad spend', 'summary-spend-note': 'Steady budget for 3 months; paid directly to Google',
      'summary-phase-title': 'During the first 3 months', 'summary-phase-note': 'Package + ad spend. The one-time implementation fee is separate.',
      'summary-store': 'Optional international store', 'summary-store-note': 'Up to 250 products. Not included in the initial monthly total.',
      'one-time-short': 'one-time',
      'summary-footnote': 'After the three-month recommended ad period, Kunsang Gar reviews performance before deciding on the next budget. Advertising results are not guaranteed.',
      'closing-kicker': 'Kunsang Gar · international communities', 'closing-title': 'One community.<br>Without borders.',
      'return-site': 'Return to Kunsang Gar <span aria-hidden="true">↗</span>', 'back-top': 'Back to top ↑'
    }
  };

  const languageButtons = [...document.querySelectorAll('[data-language]')];
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const langFromUrl = new URLSearchParams(location.search).get('lang');
  let language = langFromUrl === 'en' || langFromUrl === 'es' ? langFromUrl : 'es';

  const setLanguage = next => {
    language = next;
    document.documentElement.lang = next;
    document.title = next === 'es' ? 'Propuesta internacional | Kunsang Gar' : 'International proposal | Kunsang Gar';
    document.querySelector('meta[name="description"]').content = next === 'es'
      ? 'Una propuesta internacional clara para acompañar a Kunsang Gar con continuidad digital, comunicación y crecimiento entre comunidades.'
      : 'A clear international proposal to support Kunsang Gar with digital continuity, communication, and growth across communities.';
    document.querySelectorAll('[data-copy]').forEach(element => {
      const value = copy[next][element.dataset.copy];
      if (value) element.innerHTML = value;
    });
    languageButtons.forEach(button => {
      const active = button.dataset.language === next;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    const url = new URL(location.href);
    url.searchParams.set('lang', next);
    history.replaceState(null, '', url);
  };

  languageButtons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
  setLanguage(language);

  const closeMenu = () => {
    nav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };
  menuToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  const progress = document.querySelector('.progress span');
  const updateProgress = () => {
    const range = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${range > 0 ? scrollY / range * 100 : 0}%`;
  };
  addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
})();
