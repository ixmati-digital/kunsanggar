(function () {
  const page = document.body.dataset.page || "home";
  const basePath = document.body.dataset.basePath || "";
  const courseSlug = document.body.dataset.courseSlug || "";
  const dataUrl = `${basePath}data/cursos.json`;
  const siteUrl = "https://kunsanggarmexico.com";
  let lastWhatsAppTrackedAt = 0;

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const normalizeText = (value) =>
    String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  const trackMeta = (eventName, payload) => {
    if (typeof window.fbq !== "function") return;
    window.fbq("track", eventName, payload);
  };

  const trackMetaCustom = (eventName, payload) => {
    if (typeof window.fbq !== "function") return;
    window.fbq("trackCustom", eventName, payload);
  };

  const courseUrl = (slug) => `${basePath}cursos/${slug}/`;

  const imageUrl = (path) => {
    if (!path) return `${basePath}kunsaanglogo.jpg`;
    if (/^https?:\/\//i.test(path)) return path;
    return path.startsWith("/") ? `${basePath}${path.slice(1)}` : `${basePath}${path}`;
  };

  const estadoLabel = (estado) => {
    const labels = {
      activo: "Curso activo",
      proximamente: "Próximamente",
      finalizado: "Finalizado"
    };

    return labels[estado] || estado;
  };

  const setText = (selector, value) => {
    const element = $(selector);
    if (element) element.textContent = value || "";
  };

  const renderMeta = (course) => {
    const target = $("[data-featured-meta]");
    if (!target) return;

    const items = [
      course.fechas,
      course.horario,
      course.modalidad,
      course.precio
    ].filter(Boolean);

    target.innerHTML = items.map((item) => `<span>${item}</span>`).join("");
  };

  const renderDetails = (course) => {
    const target = $("[data-course-details]");
    if (!target) return;

    const details = [
      ["Fechas", course.fechas],
      ["Horario", course.horario],
      ["Modalidad", course.modalidad],
      ["Idioma", course.idioma],
      ["Donativo", course.precio],
      ["Maestro", course.maestro]
    ];

    target.innerHTML = details
      .map(([label, value]) => `<div><dt>${label}</dt><dd>${value || "Por confirmar"}</dd></div>`)
      .join("");
  };

  const renderLearning = (course) => {
    const target = $("[data-learning-items]");
    if (!target) return;

    target.innerHTML = (course.aprendizajes || [])
      .map((item, index) => `
        <article class="learning-card reveal">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <h3>${item}</h3>
        </article>
      `)
      .join("");
  };

  const setCourseLinks = (course) => {
    const active = course.estado === "activo";
    $$("[data-primary-cta]").forEach((link) => {
      if (active && course.registration_url) {
        link.href = course.registration_url;
        link.target = "_blank";
        link.rel = "noopener";
      } else {
        link.href = `${basePath}#curso`;
        link.removeAttribute("target");
        link.removeAttribute("rel");
        link.textContent = active ? "Ver cursos activos" : "Ver registro histórico";
      }
    });

    $$("[data-payment-link]").forEach((link) => {
      const enabled = active && course.payment_url;
      link.href = enabled ? course.payment_url : "#";
      link.classList.toggle("is-disabled", !enabled);
      if (!enabled) link.setAttribute("aria-disabled", "true");
      if (!active) link.textContent = "Donativo cerrado";
    });

    $$("[data-registration-link]").forEach((link) => {
      const enabled = active && course.registration_url;
      link.href = enabled ? course.registration_url : "#";
      link.classList.toggle("is-disabled", !enabled);
      if (!enabled) link.setAttribute("aria-disabled", "true");
      if (!active) link.textContent = "Registro cerrado";
    });
  };

  const renderFeaturedCourse = (course) => {
    setText("[data-featured-status]", estadoLabel(course.estado));
    setText("[data-featured-title]", course.titulo);
    setText("[data-featured-subtitle]", course.subtitulo);
    setText("[data-info-title]", course.titulo);
    setText("[data-info-description]", course.descripcion);
    setText("[data-learning-title]", `Qué aprenderás en ${course.titulo}`);
    setText(".courses-section .section-heading h2", course.estado === "activo" ? "Una sola enseñanza abierta en este momento" : "Registro histórico");
    setText(".courses-section .section-heading p", course.estado === "activo" ? "La información publicada corresponde únicamente a la enseñanza actualmente abierta." : "La información se conserva como referencia histórica; no hay inscripción vigente.");

    const image = $("[data-featured-image]");
    if (image) {
      image.src = imageUrl(course.imagen);
      image.alt = course.titulo;
    }

    const detailsCta = $("[data-details-cta]");
    if (detailsCta && page === "home") {
      detailsCta.href = "#detalles";
    }

    renderMeta(course);
    renderDetails(course);
    renderLearning(course);
    setCourseLinks(course);
  };

  const renderCourseCards = (courses) => {
    const target = $("[data-course-cards]");
    if (!target) return;

    target.innerHTML = courses
      .map((course) => {
        const active = course.estado === "activo";
        const href = courseUrl(course.slug);
        const action = active ? "Ver detalles" : "Ver ficha";

        return `
          <article class="course-card reveal ${course.destacado ? "course-card-featured" : ""}">
            <a class="course-image" href="${href}" aria-label="${course.titulo}">
              <img src="${imageUrl(course.imagen)}" alt="${course.titulo}" loading="lazy">
            </a>
            <div class="course-card-copy">
              <span class="status-pill status-${course.estado}">${estadoLabel(course.estado)}</span>
              <h3>${course.titulo}</h3>
              <p>${course.subtitulo}</p>
              <dl>
                <div><dt>Fechas</dt><dd>${course.fechas}</dd></div>
                <div><dt>Maestro</dt><dd>${course.maestro}</dd></div>
              </dl>
              <a class="button ${active ? "" : "button-outline"}" href="${href}">${action}</a>
            </div>
          </article>
        `;
      })
      .join("");
  };

  const initReveal = () => {
    const revealItems = $$(".reveal");

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => observer.observe(item));
  };

  const initInteractions = (course) => {
    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("a, button, [role='button']");
      if (!trigger) return;

      const href = trigger.getAttribute("href") || "";
      const text = normalizeText(`${trigger.textContent} ${trigger.getAttribute("aria-label") || ""}`);
      const isPayment = trigger.matches("[data-payment-link]");
      const isRegistration = trigger.matches("[data-registration-link], [data-primary-cta]");
      const isWhatsApp = /(?:wa\.me|whatsapp|api\.whatsapp\.com)/i.test(href) || text.includes("whatsapp");

      if (trigger.classList.contains("is-disabled")) {
        event.preventDefault();
        return;
      }

      if (isPayment) {
        trackMeta("InitiateCheckout", {
          content_name: course.titulo,
          content_ids: [course.slug],
          currency: "MXN",
          value: Number(String(course.precio || "").replace(/\D/g, "")) || undefined
        });
      }

      if (isRegistration) {
        trackMeta("CompleteRegistration", {
          content_name: course.titulo,
          content_ids: [course.slug],
          status: "started_registration"
        });
      }

      if (isWhatsApp) {
        const now = Date.now();
        if (now - lastWhatsAppTrackedAt > 2000) {
          lastWhatsAppTrackedAt = now;
          trackMetaCustom("WhatsAppClick", { source: page, course: course.slug });
        }
      }
    }, true);

    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (!href || href === "#") return;
        const target = $(href);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    $$("details").forEach((item) => {
      item.addEventListener("toggle", () => {
        if (!item.open) return;
        $$("details").forEach((other) => {
          if (other !== item) other.open = false;
        });
      });
    });

    const stickyCta = $(".mobile-sticky-cta");
    if (stickyCta) {
      const updateStickyCta = () => stickyCta.classList.toggle("is-visible", window.scrollY > 560);
      updateStickyCta();
      window.addEventListener("scroll", updateStickyCta, { passive: true });
    }
  };

  const init = async () => {
    try {
      const response = await fetch(dataUrl, { cache: "no-store" });
      const courses = await response.json();
      const featured = courses.find((course) => course.destacado && course.estado === "activo") || courses[0];
      const currentCourse = page === "course"
        ? courses.find((course) => course.slug === courseSlug) || featured
        : featured;

      renderFeaturedCourse(currentCourse);
      renderCourseCards(courses);
      initReveal();
      initInteractions(currentCourse);

      if (page === "course") {
        trackMeta("ViewContent", {
          content_name: currentCourse.titulo,
          content_ids: [currentCourse.slug],
          content_type: "course"
        });
      }
    } catch (error) {
      console.error("No fue posible cargar los cursos.", error);
      initReveal();
    }
  };

  init();
})();
