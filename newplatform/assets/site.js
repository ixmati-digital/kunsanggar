(() => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const menuItems = [...document.querySelectorAll('.nav-item-menu')];

  const closeMenus = () => {
    menuItems.forEach((item) => {
      item.classList.remove('is-open');
      const toggle = item.querySelector('.submenu-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  };

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      if (!open) closeMenus();
    });

    navLinks.addEventListener('click', (event) => {
      const submenuToggle = event.target.closest('.submenu-toggle');
      if (submenuToggle) {
        const item = submenuToggle.closest('.nav-item-menu');
        const open = item.classList.toggle('is-open');
        submenuToggle.setAttribute('aria-expanded', String(open));
        menuItems.filter((other) => other !== item).forEach((other) => {
          other.classList.remove('is-open');
          const otherToggle = other.querySelector('.submenu-toggle');
          if (otherToggle) otherToggle.setAttribute('aria-expanded', 'false');
        });
        return;
      }

      if (event.target.closest('a') && window.matchMedia('(max-width: 1100px)').matches) {
        navLinks.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
        closeMenus();
      }
    });
  }

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav-item-menu')) closeMenus();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenus();
      if (navLinks && menuToggle) {
        navLinks.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
        menuToggle.focus();
      }
    }
  });

  const backTop = document.querySelector('.back-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('is-visible', window.scrollY > 500);
    }, { passive: true });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  document.querySelectorAll('a[href],form[action]').forEach((item) => {
    const attr = item.tagName === 'FORM' ? 'action' : 'href';
    const value = item.getAttribute(attr) || '';
    if (value.startsWith('#')) return;
    try {
      const url = new URL(value, window.location.href);
      if (url.origin === window.location.origin && !url.pathname.startsWith('/newplatform/')) {
        item.addEventListener('click', (event) => event.preventDefault());
        item.addEventListener('submit', (event) => event.preventDefault());
      }
    } catch (error) {
      // Ignore incomplete URLs while preserving normal browser navigation.
    }
  });
})();
