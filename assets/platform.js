/* Kunsang Gar browser client. Never place service_role here. */
(function () {
  const cfg = window.KUNSANG_GAR_CONFIG || {};
  const hasConfig = Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase);
  const client = hasConfig ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey) : null;
  const bucket = cfg.storageBucket || "protected-content";
  const siteMediaBucket = cfg.siteMediaBucket || "site-media";
  const language = () => document.documentElement.lang === "en" ? "en" : "es";
  const localized = (row, key) => language() === "en" ? (row?.[`${key}_en`] || "") : (row?.[key] || "");
  const safeNext = (value) => value?.startsWith("/") && !value.startsWith("//") ? value : null;
  const publicImageUrl = (path) => {
    if (!path) return "";
    if (/^(https?:)?\/\//i.test(path) || path.startsWith("/")) return path;
    return client?.storage.from(siteMediaBucket).getPublicUrl(path).data.publicUrl || "";
  };

  const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;", "'":"&#39;", '"':"&quot;"}[c]));
  const status = (message, kind = "info") => document.querySelectorAll("[data-platform-status]").forEach((el) => {
    el.textContent = message;
    el.dataset.status = kind;
    el.hidden = false;
  });
  const fail = (error) => { console.error("Kunsang Gar", error); status("No se pudo completar. Inténtalo de nuevo.", "error"); };
  const authError = (error, mode) => {
    const message = String(error?.message || "").toLowerCase();
    if (message.includes("invalid login") || message.includes("invalid credentials")) return "El correo o la contraseña no son correctos.";
    if (message.includes("already registered") || message.includes("already been registered")) return "Ya existe una cuenta con ese correo. Inicia sesión.";
    if (message.includes("password") && (message.includes("least") || message.includes("short"))) return "La contraseña debe tener al menos 8 caracteres.";
    if (message.includes("email") && (message.includes("invalid") || message.includes("valid"))) return "Revisa el correo electrónico e inténtalo de nuevo.";
    return mode === "register" ? "No se pudo crear la cuenta. Revisa los datos e inténtalo de nuevo." : "No se pudo iniciar sesión. Revisa tus datos e inténtalo de nuevo.";
  };
  const slugify = (text) => String(text || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
  const fmtDate = (value) => value ? new Intl.DateTimeFormat("es-MX", { dateStyle: "medium" }).format(new Date(value)) : "";
  const current = () => client?.auth.getSession().then(({ data }) => data.session) || Promise.resolve(null);
  const profile = async (userId) => {
    if (!client || !userId) return null;
    const { data, error } = await client.from("profiles").select("id,full_name,role").eq("id", userId).maybeSingle();
    if (error) throw error;
    return data;
  };

  async function guard(role) {
    if (!client) {
      status("El acceso no está disponible en este momento. Inténtalo más tarde.", "error");
      return null;
    }
    const session = await current();
    if (!session) {
      const loginPath = role === "ADMIN" ? "/admin/login/" : "/account/";
      window.location.replace(`${loginPath}?next=${encodeURIComponent(location.pathname + location.search)}`);
      return null;
    }
    const me = await profile(session.user.id);
    const allowed = role === "CMS" ? ["ADMIN", "CONTENT_MANAGER"] : role === "ADMIN" ? ["ADMIN"] : null;
    if (allowed && !allowed.includes(me?.role)) {
      window.location.replace("/admin/login/?access=admin-required");
      return null;
    }
    return { session, profile: me };
  }

  async function login(email, password) {
    if (!client) throw new Error("El acceso no está disponible en este momento.");
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const profileData = await profile(data.user.id);
    const expectedRole = document.body.dataset.authRole || "PRACTITIONER";
    const allowedRoles = expectedRole === "ADMIN" ? ["ADMIN"] : expectedRole === "CMS" ? ["ADMIN", "CONTENT_MANAGER"] : [expectedRole];
    if (!profileData || !allowedRoles.includes(profileData.role)) {
      await client.auth.signOut();
      throw new Error(["ADMIN", "CMS"].includes(expectedRole)
        ? "Esta cuenta no tiene acceso al CMS. Comprueba tus datos o contacta al administrador."
        : "Esta cuenta no tiene acceso al área de estudiantes.");
    }
    const requested = new URLSearchParams(location.search).get("next");
    window.location.replace(safeNext(requested) || (["ADMIN", "CMS"].includes(expectedRole) ? "/admin/" : "/account/"));
  }

  async function register(fullName, email, password) {
    if (!client) throw new Error("El registro no está disponible en este momento.");
    const { data, error } = await client.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
    if (error) throw error;
    return data;
  }

  function loginView() {
    const form = document.querySelector("[data-login-form]");
    if (!form) return;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = form.querySelector("button[type=submit]");
      button.disabled = true;
      status("Iniciando sesión…");
      try { await login(form.email.value.trim(), form.password.value); }
      catch (error) { button.disabled = false; status(authError(error, "login"), "error"); }
    });
    const registerForm = document.querySelector("[data-register-form]");
    registerForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = registerForm.querySelector("button[type=submit]");
      const notice = document.querySelector("[data-register-status]");
      button.disabled = true;
      try {
        const data = await register(registerForm.full_name.value.trim(), registerForm.email.value.trim(), registerForm.password.value);
        if (data.session) window.location.replace(safeNext(new URLSearchParams(location.search).get("next")) || "/account/");
        else { notice.textContent = "Cuenta creada. Revisa tu correo para confirmar el acceso y después inicia sesión."; notice.hidden = false; }
      } catch (error) { button.disabled = false; notice.textContent = authError(error, "register"); notice.dataset.status = "error"; notice.hidden = false; }
    });
  }

  async function accountPage() {
    if (!client) { loginView(); return; }
    const session = await current();
    const loginBox = document.querySelector("[data-login-box]");
    const accountBox = document.querySelector("[data-account-box]");
    if (!session) { loginBox?.removeAttribute("hidden"); accountBox?.setAttribute("hidden", ""); loginView(); return; }
    const me = await profile(session.user.id);
    if (me?.role === "ADMIN") {
      window.location.replace("/admin/");
      return;
    }
    loginBox?.setAttribute("hidden", "");
    accountBox?.removeAttribute("hidden");
    document.querySelectorAll("[data-user-email]").forEach((el) => el.textContent = session.user.email || "");
    document.querySelectorAll("[data-user-name]").forEach((el) => el.textContent = me?.full_name || session.user.email || "Practicante");
    document.querySelectorAll("[data-logout]").forEach((el) => el.addEventListener("click", async () => { await client.auth.signOut(); window.location.replace("/account/"); }));
    const registrationList = document.createElement("section");
    registrationList.className = "account-class-registrations";
    registrationList.innerHTML = `<h3>${language() === "en" ? "Class registration requests" : "Solicitudes de inscripción"}<\/h3><div data-class-registrations>${language() === "en" ? "Loading…" : "Cargando…"}<\/div>`;
    accountBox.appendChild(registrationList);
    const { data: registrations, error: registrationError } = await client.from("class_registrations").select("status,payment_status,created_at,events(title,starts_at)").eq("user_id", session.user.id).order("created_at", { ascending: false });
    if (registrationError) throw registrationError;
    const list = registrationList.querySelector("[data-class-registrations]");
    const labels = { PENDING: language() === "en" ? "Awaiting review" : "Pendiente de revisión", APPROVED: language() === "en" ? "Approved" : "Aprobada", REJECTED: language() === "en" ? "Not approved" : "No aprobada", CANCELLED: language() === "en" ? "Cancelled" : "Cancelada" };
    list.innerHTML = registrations?.length ? registrations.map((row) => `<p><strong>${esc(row.events?.title || (language() === "en" ? "Class" : "Clase"))}</strong> · ${esc(labels[row.status] || row.status)} · ${esc(row.payment_status === "CONFIRMED" ? (language() === "en" ? "Payment verified" : "Pago verificado") : (language() === "en" ? "Payment not verified" : "Pago sin verificar"))}</p>`).join("") : `<p>${language() === "en" ? "You have no class requests yet." : "Todavía no tienes solicitudes de inscripción."}</p>`;
  }

  async function adminLoginPage() {
    if (!client) {
      status("El acceso no está disponible en este momento. Inténtalo más tarde.", "error");
      return;
    }
    const session = await current();
    if (session) {
      const me = await profile(session.user.id);
      if (["ADMIN", "CONTENT_MANAGER"].includes(me?.role)) {
        const requested = new URLSearchParams(location.search).get("next");
        window.location.replace(safeNext(requested) || "/admin/");
        return;
      }
    }
    const params = new URLSearchParams(location.search);
    if (params.get("access") === "admin-required") {
      status("Esta cuenta no tiene acceso al CMS. Inicia sesión con una cuenta autorizada.", "error");
    }
    loginView();
  }

  function programCard(program) {
    const title = localized(program, "title");
    const description = localized(program, "description");
    const levels = language() === "en"
      ? { Beginner: "Beginner", Intermediate: "Intermediate", Advanced: "Advanced" }
      : { Beginner: "Inicial", Intermediate: "Intermedio", Advanced: "Avanzado" };
    const meta = [levels[program.level] || program.level, program.teacher].filter(Boolean).join(" · ");
    const action = program.allow_self_enrollment
      ? `<button class="btn small" type="button" data-enroll-program="${esc(program.id)}">${language() === "en" ? "Join class" : "Inscribirme"}</button>`
      : `<a class="btn small" href="/library/?program=${encodeURIComponent(program.id)}">${language() === "en" ? "View materials" : "Ver materiales"}</a>`;
    return `<article class="root-page-card"><h3>${esc(title)}</h3>${description ? `<p>${esc(description)}</p>` : ""}${meta ? `<p class="platform-meta">${esc(meta)}</p>` : ""}<div class="root-page-actions">${action}</div></article>`;
  }

  async function renderProgramList(target, { selfEnrollOnly = false, emptyMessage } = {}) {
    const { data, error } = await client.from("programs").select("*").eq("status", "PUBLISHED").order("created_at", { ascending: false });
    if (error) throw error;
    const available = language() === "en" ? (data || []).filter((program) => program.title_en) : (data || []);
    const rows = selfEnrollOnly ? available.filter((program) => program.allow_self_enrollment) : available;
    target.innerHTML = rows.length ? rows.map(programCard).join("") : `<div class="root-page-note">${emptyMessage || (language() === "en" ? "There are no classes available to join right now." : "No hay clases disponibles para inscribirse por el momento.")}</div>`;
    target.querySelectorAll("[data-enroll-program]").forEach((button) => button.addEventListener("click", () => enrollInProgram(button.dataset.enrollProgram)));
  }

  async function enrollInProgram(programId) {
    const session = await current();
    const programPath = `/programs/?enroll=${encodeURIComponent(programId)}`;
    if (!session) {
      window.location.href = `/account/?next=${encodeURIComponent(programPath)}`;
      return;
    }
    const { data: existing, error: lookupError } = await client.from("enrollments").select("id,status").eq("user_id", session.user.id).eq("program_id", programId).maybeSingle();
    if (lookupError) throw lookupError;
    if (existing?.status === "ACTIVE") {
      window.location.href = `/library/?program=${encodeURIComponent(programId)}`;
      return;
    }
    if (existing?.status === "PENDING") {
      status(language() === "en" ? "Your request is awaiting administrator review. Access is not active yet." : "Tu solicitud está pendiente de revisión. El acceso todavía no está activo.");
      return;
    }
    if (existing) {
      status(language() === "en" ? "Contact Kunsang Gar to request reactivation." : "Contacta a Kunsang Gar para solicitar la reactivación.", "error");
      return;
    }
    const { error } = await client.from("enrollments").insert({ user_id: session.user.id, program_id: programId, status: "PENDING" });
    if (error) throw error;
    status(language() === "en" ? "Request sent. The administrator will review your registration and payment before enabling access." : "Solicitud enviada. El administrador revisará la inscripción y el pago antes de habilitar el acceso.");
  }

  async function loadPrograms(target) {
    await renderProgramList(target);
  }

  async function programsPage() {
    const target = document.querySelector("[data-program-catalog]");
    if (!target) return;
    if (!client) { status("No fue posible cargar los programas. Inténtalo más tarde.", "error"); return; }
    try {
      await loadPrograms(target);
      const programId = new URLSearchParams(location.search).get("enroll");
      if (programId) await enrollInProgram(programId);
    } catch (error) { fail(error); }
  }

  function eventCard(event, past = false) {
    const title = localized(event, "title");
    const description = localized(event, "description");
    const format = localized(event, "format");
    const locationText = localized(event, "location");
    const formatter = new Intl.DateTimeFormat(language() === "en" ? "en-US" : "es-MX", { dateStyle: "long" });
    const date = event.starts_at ? formatter.format(new Date(event.starts_at)) : "";
    const endDate = event.ends_at ? formatter.format(new Date(event.ends_at)) : "";
    const when = date && endDate && date !== endDate ? `${date} – ${endDate}` : date;
    const image = publicImageUrl(event.image_path);
    const registration = !past && event.registration_enabled ? `<a class="btn small" href="/class.html?slug=${encodeURIComponent(event.slug)}">${language() === "en" ? "Details and registration" : "Detalles e inscripción"}</a>` : (!past && event.registration_url ? `<a class="btn small" href="${esc(event.registration_url)}" target="_blank" rel="noopener">${language() === "en" ? "Register" : "Inscribirme"} ↗</a>` : "");
    const typeLabel = event.event_type === "CLASS" ? (language() === "en" ? "Class" : "Clase") : event.event_type === "COMMUNITY" ? "Sangha" : (language() === "en" ? "Event" : "Evento");
    const teacher = localized(event, "teacher");
    const price = event.price_mxn != null ? new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(Number(event.price_mxn)) : "";
    return `<article class="root-page-card event-card">${image ? `<img class="event-card-image" src="${esc(image)}" alt="${esc(title)}" loading="lazy">` : ""}<span class="pill">${esc(typeLabel)}${format ? ` · ${esc(format)}` : ""}</span><h3>${esc(title)}</h3>${when ? `<p class="platform-meta">${esc(when)}${locationText ? ` · ${esc(locationText)}` : ""}</p>` : ""}${teacher ? `<p class="platform-meta">${language() === "en" ? "Teacher" : "Maestro"}: ${esc(teacher)}</p>` : ""}${price ? `<p class="platform-meta">${language() === "en" ? "Price" : "Precio"}: ${esc(price)}</p>` : ""}${description ? `<p>${esc(description)}</p>` : ""}${registration ? `<div class="root-page-actions">${registration}</div>` : ""}</article>`;
  }

  async function registerForClass(eventId) {
    const session = await current();
    const event = await client.from("events").select("slug,title").eq("id", eventId).eq("status", "PUBLISHED").maybeSingle();
    if (event.error) throw event.error;
    if (!event.data) throw new Error("La clase ya no está disponible.");
    if (!session) {
      const next = `/class.html?slug=${encodeURIComponent(event.data.slug)}&register=1`;
      window.location.href = `/account/?next=${encodeURIComponent(next)}`;
      return;
    }
    const { data: existing, error: lookupError } = await client.from("class_registrations").select("id,status").eq("event_id", eventId).eq("user_id", session.user.id).maybeSingle();
    if (lookupError) throw lookupError;
    if (existing) {
      status(existing.status === "APPROVED" ? "Tu inscripción está aprobada." : "Tu solicitud ya está registrada y espera revisión.");
      return;
    }
    const { error } = await client.from("class_registrations").insert({ event_id: eventId, user_id: session.user.id });
    if (error) throw error;
    status("Solicitud enviada. El pago no está confirmado; el equipo revisará tu inscripción.");
    const button = document.querySelector("[data-register-class]");
    if (button) { button.disabled = true; button.textContent = "Solicitud enviada"; }
  }

  async function classDetailPage() {
    const target = document.querySelector("[data-class-detail]");
    if (!target || !client) return;
    const params = new URLSearchParams(location.search);
    const slug = params.get("slug");
    if (!slug) { target.textContent = "No se encontró esta clase."; return; }
    const { data: event, error } = await client.from("events").select("*").eq("slug", slug).eq("status", "PUBLISHED").maybeSingle();
    if (error) throw error;
    if (!event) { target.textContent = "Esta clase no está disponible."; return; }
    const title = localized(event, "title");
    document.title = `${title} | Kunsang Gar México`;
    const description = localized(event, "description");
    const format = localized(event, "format");
    const locationText = localized(event, "location");
    const teacher = localized(event, "teacher");
    const image = publicImageUrl(event.image_path);
    const date = event.starts_at ? fmtDate(event.starts_at) : "";
    const end = event.ends_at ? fmtDate(event.ends_at) : "";
    const when = date && end && date !== end ? `${date} – ${end}` : date;
    const price = event.price_mxn != null ? new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(Number(event.price_mxn)) : "";
    target.innerHTML = `${image ? `<img class="event-card-image" src="${esc(image)}" alt="${esc(title)}">` : ""}<p class="eyebrow">Clase</p><h1>${esc(title)}</h1>${when ? `<p class="platform-meta">${esc(when)}</p>` : ""}${teacher ? `<p><strong>Maestro:</strong> ${esc(teacher)}</p>` : ""}${format ? `<p><strong>Modalidad:</strong> ${esc(format)}</p>` : ""}${locationText ? `<p><strong>Lugar:</strong> ${esc(locationText)}</p>` : ""}${price ? `<p><strong>Precio:</strong> ${esc(price)}</p>` : ""}${description ? `<p>${esc(description)}</p>` : ""}<div data-platform-status class="root-page-note" hidden></div>${event.registration_enabled ? `<p>La solicitud de inscripción queda pendiente de revisión. El pago no se confirma automáticamente.</p><button class="btn" type="button" data-register-class data-event-id="${esc(event.id)}">${language() === "en" ? "Request registration" : "Solicitar inscripción"}</button>` : `<p>El registro aún no está abierto.</p>`}${event.payment_url ? `<p><a class="btn secondary" href="${esc(event.payment_url)}" target="_blank" rel="noopener">${language() === "en" ? "Open payment page" : "Abrir página de pago"}</a></p>` : `<p>${language() === "en" ? "Payment details are not configured yet." : "Los datos de pago están pendientes de configuración."}</p>`}`;
    document.querySelector("[data-register-class]")?.addEventListener("click", () => registerForClass(event.id).catch(fail));
    if (params.get("register") === "1") await registerForClass(event.id).catch(fail);
  }

  async function renderTestimonials(target) {
    const { data, error } = await client.from("testimonials").select("name,country,body,image_path").eq("status", "PUBLISHED").order("sort_order", { ascending: true }).order("created_at", { ascending: true });
    if (error) throw error;
    target.innerHTML = (data || []).map((row) => {
      const image = publicImageUrl(row.image_path);
      return `<article class="root-page-card testimonial-card">${image ? `<img class="testimonial-image" src="${esc(image)}" alt="${esc(row.name)}" loading="lazy">` : ""}<blockquote>${esc(localized(row, "body"))}</blockquote><p class="platform-meta"><strong>${esc(row.name)}</strong>${row.country ? ` · ${esc(row.country)}` : ""}</p></article>`;
    }).join("");
  }

  async function renderEvents(target, { past = false, type = null } = {}) {
    let query = client.from("events").select("*").eq("status", "PUBLISHED").order("starts_at", { ascending: !past });
    if (type) query = query.eq("event_type", type);
    const { data, error } = await query;
    if (error) throw error;
    const now = Date.now();
    const rows = (data || []).filter((event) => {
      if (language() === "en" && !event.title_en) return false;
      const date = event.ends_at || event.starts_at;
      return past ? Boolean(date && new Date(date).getTime() < now) : Boolean(date && new Date(date).getTime() >= now);
    });
    target.innerHTML = rows.length ? rows.map((event) => eventCard(event, past)).join("") : `<div class="root-page-note">${language() === "en" ? (past ? "Past events will appear here." : "New classes and activities will be announced here.") : (past ? "Aquí aparecerán los eventos pasados." : "Aquí se anunciarán las próximas clases y actividades.")}</div>`;
  }

  async function renderGallery(target) {
    const { data, error } = await client.from("gallery_items").select("*").eq("status", "PUBLISHED").order("sort_order", { ascending: true }).order("created_at", { ascending: true });
    if (error) throw error;
    target.innerHTML = (data || []).map((item) => {
      const title = localized(item, "title");
      const alt = localized(item, "alt_text") || title;
      const image = publicImageUrl(item.image_path);
      return image ? `<figure><img src="${esc(image)}" alt="${esc(alt || title)}" loading="lazy"></figure>` : "";
    }).join("");
  }

  async function publicClassesPage() {
    const eventTarget = document.querySelector("[data-public-classes]");
    const programTarget = document.querySelector("[data-public-programs]");
    const upcomingTarget = document.querySelector("[data-upcoming-events]");
    const pastTargets = document.querySelectorAll("[data-past-events]");
    const galleryTarget = document.querySelector("[data-gallery-items]");
    const testimonialsTarget = document.querySelector("[data-testimonials]");
    if (!client) return;
    const tasks = [];
    if (eventTarget) tasks.push(renderEvents(eventTarget, { type: "CLASS" }));
    if (upcomingTarget) tasks.push(renderEvents(upcomingTarget));
    pastTargets.forEach((target) => tasks.push(renderEvents(target, { past: true })));
    if (programTarget) tasks.push(renderProgramList(programTarget, { selfEnrollOnly: true }));
    if (galleryTarget) tasks.push(renderGallery(galleryTarget));
    if (testimonialsTarget) tasks.push(renderTestimonials(testimonialsTarget));
    const results = await Promise.allSettled(tasks);
    results.filter((result) => result.status === "rejected").forEach((result) => fail(result.reason));
  }

  async function libraryPage() {
    const target = document.querySelector("[data-library]");
    if (!target) return;
    if (!client) { status("No fue posible cargar los recursos. Inténtalo más tarde.", "error"); return; }
    try {
      const params = new URLSearchParams(location.search);
      let query = client.from("content_items").select("id,title,title_en,description,description_en,content_type,access_level,storage_path,external_url,programs(title,title_en)").eq("status", "PUBLISHED").order("created_at", { ascending: false });
      if (params.get("program")) query = query.eq("program_id", params.get("program"));
      const { data, error } = await query;
      if (error) throw error;
      const session = await current();
      const rows = [];
      const availableItems = language() === "en" ? (data || []).filter((item) => item.title_en) : (data || []);
      for (const item of availableItems) {
        let href = item.external_url || "";
        if (item.storage_path && (session || item.access_level === "PUBLIC")) {
          const signed = await client.storage.from(bucket).createSignedUrl(item.storage_path, 300);
          if (!signed.error) href = signed.data.signedUrl;
        }
        const typeLabels = language() === "en" ? { VIDEO: "Video", AUDIO: "Audio", PDF: "PDF", TEXT: "Text", OTHER: "Resource" } : { VIDEO: "Video", AUDIO: "Audio", PDF: "PDF", TEXT: "Texto", OTHER: "Recurso" };
        rows.push(`<article class="root-page-card"><span class="pill">${esc(typeLabels[item.content_type] || "Recurso")}</span><h3>${esc(localized(item, "title"))}</h3>${localized(item, "description") ? `<p>${esc(localized(item, "description"))}</p>` : ""}${item.programs ? `<p class="platform-meta">${esc(localized(item.programs, "title"))}</p>` : ""}${href ? `<a class="btn small" href="${esc(href)}" target="_blank" rel="noopener">${language() === "en" ? "Open resource" : "Abrir recurso"}</a>` : `<span class="platform-locked">${language() === "en" ? "Not available right now." : "No disponible en este momento."}</span>`}</article>`);
      }
      target.innerHTML = rows.length ? rows.join("") : `<div class="root-page-note">${language() === "en" ? "There are no resources available yet." : "Aún no hay recursos disponibles."}</div>`;
    } catch (error) { fail(error); }
  }

  window.KunsangGar = { client, cfg, esc, slugify, fmtDate, status, fail, current, profile, guard, login, register, loadPrograms, bucket, siteMediaBucket };
  async function boot() {
    try {
      const path = location.pathname;
      if ((document.body.dataset.protected === "admin" || path.startsWith("/admin/")) && !path.startsWith("/admin/login/")) {
        const access = await guard("ADMIN");
        if (!access) return;
      }
      if (document.body.dataset.platformPage === "account" || path.startsWith("/account")) await accountPage();
      if (document.body.dataset.platformPage === "admin-login") await adminLoginPage();
      if (document.body.dataset.platformPage === "programs" || path.startsWith("/programs")) await programsPage();
      if (document.body.dataset.platformPage === "library" || path.startsWith("/library")) await libraryPage();
      if (path === "/class.html") await classDetailPage();
      if (["home", "classes", "events", "sangha"].includes(document.body.dataset.platformPage) || document.querySelector("[data-public-classes],[data-public-programs],[data-upcoming-events],[data-past-events],[data-gallery-items]")) await publicClassesPage();
    } catch (error) { fail(error); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
})();
