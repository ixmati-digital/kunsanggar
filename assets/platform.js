/* Kunsang Gar browser client. Never place service_role here. */
(function () {
  const cfg = window.KUNSANG_GAR_CONFIG || {};
  const hasConfig = Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase);
  const client = hasConfig ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey) : null;
  const bucket = cfg.storageBucket || "protected-content";
  const siteMediaBucket = cfg.siteMediaBucket || "site-media";
  const stripeClassPaymentLink = "https://buy.stripe.com/6oUdR93H804FaNO6eFg7e0t";
  const language = () => document.documentElement.lang === "en" ? "en" : "es";
  const localized = (row, key) => language() === "en" ? (row?.[`${key}_en`] || row?.[key] || "") : (row?.[key] || "");
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
      const loginPath = ["ADMIN", "CMS"].includes(role) ? "/admin/login/" : "/account/";
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
    registrationList.innerHTML = `<h3>${language() === "en" ? "My classes and registrations" : "Mis clases e inscripciones"}<\/h3><p class="account-registration-intro">${language() === "en" ? "Continue to Stripe to complete an outstanding contribution. Your access becomes available after payment verification and team approval." : "Continúa a Stripe para completar una aportación pendiente. El acceso se habilita después de verificar el pago y aprobar la inscripción."}</p><div data-class-registrations>${language() === "en" ? "Loading…" : "Cargando…"}<\/div>`;
    accountBox.appendChild(registrationList);
    const { data: registrations, error: registrationError } = await client.from("class_registrations").select("id,status,payment_status,created_at,events(title,slug,starts_at,program_id,price_mxn)").eq("user_id", session.user.id).order("created_at", { ascending: false });
    if (registrationError) throw registrationError;
    const list = registrationList.querySelector("[data-class-registrations]");
    const labels = { PENDING: language() === "en" ? "Awaiting review" : "Pendiente de revisión", APPROVED: language() === "en" ? "Approved" : "Aprobada", REJECTED: language() === "en" ? "Not approved" : "No aprobada", CANCELLED: language() === "en" ? "Cancelled" : "Cancelada" };
    const isPaid = (row) => ["CONFIRMED", "WAIVED"].includes(row.payment_status);
    const registrationCards = (registrations || []).map((row) => {
      const title = row.events?.title || (language() === "en" ? "Class" : "Clase");
      const registrationStatus = labels[row.status] || row.status;
      const paymentStatus = isPaid(row)
        ? (language() === "en" ? (row.payment_status === "WAIVED" ? "Payment waived" : "Payment verified") : (row.payment_status === "WAIVED" ? "Pago exento" : "Pago verificado"))
        : (language() === "en" ? "Payment pending" : "Pago pendiente");
      const date = row.events?.starts_at ? fmtDate(row.events.starts_at) : "";
      const active = ["PENDING", "APPROVED"].includes(row.status);
      const classHref = row.events?.slug ? `/class.html?slug=${encodeURIComponent(row.events.slug)}` : "/classes.html";
      const paymentUrl = new URL(stripeClassPaymentLink);
      paymentUrl.searchParams.set("client_reference_id", row.id);
      const paymentAmount = row.events?.price_mxn != null
        ? (language() === "en" ? `Stripe contribution: MXN $${Number(row.events.price_mxn).toLocaleString("en-US")}.` : `Aportación indicada: $${Number(row.events.price_mxn).toLocaleString("es-MX")} MXN.`)
        : (language() === "en" ? "Use the contribution amount provided for this class." : "Ingresa en Stripe el monto de aportación indicado para esta clase.");
      let nextStep = "";
      if (!isPaid(row) && active) {
        nextStep = `<p class="account-registration-next">${language() === "en" ? "When you’re ready, continue your contribution in Stripe. Returning here does not confirm payment; the team will review your registration." : "Cuando estés listo, continúa tu aportación en Stripe. Volver a esta página no confirma el pago; el equipo revisará tu inscripción."} ${esc(paymentAmount)}</p><div class="root-page-actions account-registration-actions"><a class="btn" href="${esc(paymentUrl.toString())}" target="_blank" rel="noopener noreferrer">${language() === "en" ? "Continue to Stripe payment ↗" : "Continuar al pago con Stripe ↗"}</a><a class="btn secondary" href="${esc(classHref)}">${language() === "en" ? "Return to this class" : "Volver a esta clase"}</a></div>`;
      } else if (isPaid(row) && row.status === "APPROVED") {
        const materialsUrl = row.events?.program_id ? `/library/?program=${encodeURIComponent(row.events.program_id)}` : "/library/";
        nextStep = `<div class="root-page-actions account-registration-actions"><a class="btn" href="${materialsUrl}">${language() === "en" ? "Open my materials" : "Acceder a mis materiales"}</a><a class="btn secondary" href="${esc(classHref)}">${language() === "en" ? "View this class" : "Ver esta clase"}</a></div>`;
      } else if (isPaid(row) && row.status === "PENDING") {
        nextStep = `<p class="account-registration-next">${language() === "en" ? "Payment verified. The team still needs to approve access to the class materials." : "Pago verificado. El equipo aún debe aprobar el acceso a los materiales de la clase."}</p><div class="root-page-actions account-registration-actions"><a class="btn secondary" href="${esc(classHref)}">${language() === "en" ? "View this class" : "Ver esta clase"}</a></div>`;
      } else if (isPaid(row)) {
        nextStep = `<p class="account-registration-next">${language() === "en" ? "Payment verified, but this request is closed. Contact Kunsang Gar for help." : "Pago verificado, pero esta solicitud está cerrada. Contacta a Kunsang Gar para recibir ayuda."}</p><div class="root-page-actions account-registration-actions"><a class="btn secondary" href="/contact.html">${language() === "en" ? "Contact the team" : "Contactar al equipo"}</a></div>`;
      } else {
        nextStep = `<p class="account-registration-next">${language() === "en" ? "This request is closed. Contact Kunsang Gar if you need help." : "Esta solicitud está cerrada. Contacta a Kunsang Gar si necesitas ayuda."}</p><div class="root-page-actions account-registration-actions"><a class="btn secondary" href="/contact.html">${language() === "en" ? "Contact the team" : "Contactar al equipo"}</a></div>`;
      }
      return `<article class="account-registration-card"><div class="account-registration-heading"><h4>${esc(title)}</h4>${date ? `<span>${esc(date)}</span>` : ""}</div><p class="account-registration-status"><span>${esc(registrationStatus)}</span><span>${esc(paymentStatus)}</span></p>${nextStep}</article>`;
    });
    list.className = "account-registration-list";
    list.innerHTML = registrationCards.length ? registrationCards.join("") : `<div class="root-page-note">${language() === "en" ? "You have no class requests yet." : "Todavía no tienes solicitudes de inscripción."}<div class="root-page-actions"><a class="btn" href="/classes.html">${language() === "en" ? "Explore classes" : "Explorar clases"}</a></div></div>`;
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
    const available = data || [];
    const rows = selfEnrollOnly ? available.filter((program) => program.allow_self_enrollment) : available;
    const defaultEmptyMessage = selfEnrollOnly
      ? (language() === "en" ? "No programs are open for direct enrollment. See the public classes above." : "No hay programas con inscripción directa abierta. Consulta las clases públicas que aparecen arriba.")
      : (language() === "en" ? "No programs are available right now." : "No hay programas disponibles por el momento.");
    target.innerHTML = rows.length ? rows.map(programCard).join("") : `<div class="root-page-note">${emptyMessage || defaultEmptyMessage}</div>`;
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
      const [programResult, eventResult] = await Promise.all([
        client.from("programs").select("*").eq("status", "PUBLISHED").order("created_at", { ascending: false }),
        client.from("events").select("*").eq("status", "PUBLISHED").eq("event_type", "CLASS").eq("registration_enabled", true).order("starts_at", { ascending: true })
      ]);
      if (programResult.error) throw programResult.error;
      if (eventResult.error) throw eventResult.error;
      const programs = (programResult.data || []).filter((program) => program.allow_self_enrollment);
      const now = Date.now();
      const events = (eventResult.data || []).filter((event) => {
        const date = event.ends_at || event.starts_at;
        return date && new Date(date).getTime() >= now;
      });
      const cards = [...events.map((event) => eventCard(event)), ...programs.map(programCard)];
      target.innerHTML = cards.length ? cards.join("") : `<div class="root-page-note">${language() === "en" ? "No class registrations are open in this catalog right now. Browse all public classes and activities." : "No hay inscripciones abiertas en este catálogo por el momento. Consulta las clases y actividades públicas."}<div class="root-page-actions"><a class="btn small" href="/classes.html#sadhana">${language() === "en" ? "Browse public classes" : "Ver clases abiertas"}</a></div></div>`;
      target.querySelectorAll("[data-enroll-program]").forEach((button) => button.addEventListener("click", () => enrollInProgram(button.dataset.enrollProgram)));
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

  async function renderPendingClassPayments() {
    const target = document.querySelector("[data-pending-class-payments]");
    if (!target || !client) return;
    const session = await current();
    if (!session) return;
    const { data, error } = await client.from("class_registrations").select("id,status,payment_status,events(title,slug,starts_at,registration_enabled)").eq("user_id", session.user.id).order("created_at", { ascending: false });
    if (error) throw error;
    const pending = (data || []).filter((row) => ["PENDING", "APPROVED"].includes(row.status) && !["CONFIRMED", "WAIVED"].includes(row.payment_status) && row.events?.registration_enabled);
    if (!pending.length) return;
    const entries = pending.map((row) => {
      const title = row.events?.title || (language() === "en" ? "Your class" : "Tu clase");
      const classHref = row.events?.slug ? `/class.html?slug=${encodeURIComponent(row.events.slug)}` : "/account/";
      const paymentUrl = new URL(stripeClassPaymentLink);
      paymentUrl.searchParams.set("client_reference_id", row.id);
      return `<li><strong>${esc(title)}</strong><div class="class-payment-nudge-actions"><a href="${esc(classHref)}">${language() === "en" ? "Return to class details" : "Volver a los detalles de la clase"}</a><a class="btn small" href="${esc(paymentUrl.toString())}" target="_blank" rel="noopener noreferrer">${language() === "en" ? "Continue when ready ↗" : "Continuar cuando quieras ↗"}</a></div></li>`;
    }).join("");
    target.innerHTML = `<aside class="class-payment-nudge" aria-label="${language() === "en" ? "Your pending class registration" : "Tu inscripción pendiente"}"><div class="class-payment-nudge-inner"><div><p class="eyebrow">${language() === "en" ? "Registration in progress" : "Inscripción en curso"}</p><p>${language() === "en" ? "Your class is saved. You can return to its details or continue your contribution whenever you’re ready." : "Tu clase está guardada. Puedes volver a sus detalles o continuar tu aportación cuando quieras."}</p><ul>${entries}</ul></div><a class="class-payment-nudge-account" href="/account/">${language() === "en" ? "My account" : "Mi cuenta"}</a></div></aside>`;
    document.body.classList.add("has-pending-class-payment");
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
    const { data: existing, error: lookupError } = await client.from("class_registrations").select("id,status,payment_status").eq("event_id", eventId).eq("user_id", session.user.id).maybeSingle();
    if (lookupError) throw lookupError;
    if (existing) {
      if (existing.payment_status === "CONFIRMED" || existing.payment_status === "WAIVED") {
        status(existing.status === "APPROVED" ? "Pago verificado. Tu acceso está aprobado." : "Pago verificado. La solicitud espera aprobación del equipo.");
      } else {
        status(existing.status === "APPROVED" ? "Tu solicitud está aprobada; espera la confirmación del pago." : "Tu solicitud está registrada. Completa el pago en Stripe; el acceso requiere aprobación del equipo.");
        window.location.assign(`${stripeClassPaymentLink}?client_reference_id=${encodeURIComponent(existing.id)}`);
      }
      return;
    }
    const { data: registration, error } = await client.from("class_registrations").insert({ event_id: eventId, user_id: session.user.id }).select("id").single();
    if (error) throw error;
    status("Solicitud enviada. Completa el pago en Stripe; el acceso requiere aprobación del equipo.");
    window.location.assign(`${stripeClassPaymentLink}?client_reference_id=${encodeURIComponent(registration.id)}`);
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
    target.innerHTML = `${image ? `<img class="event-card-image" src="${esc(image)}" alt="${esc(title)}">` : ""}<p class="eyebrow">Clase</p><h1>${esc(title)}</h1>${when ? `<p class="platform-meta">${esc(when)}</p>` : ""}${teacher ? `<p><strong>Maestro:</strong> ${esc(teacher)}</p>` : ""}${format ? `<p><strong>Modalidad:</strong> ${esc(format)}</p>` : ""}${locationText ? `<p><strong>Lugar:</strong> ${esc(locationText)}</p>` : ""}${price ? `<p><strong>Precio:</strong> ${esc(price)}</p>` : ""}${description ? `<p>${esc(description)}</p>` : ""}<div data-platform-status class="root-page-note" hidden></div>${event.registration_enabled ? `<p>Completa el pago en Stripe. El equipo verificará la inscripción y aprobará el acceso a los materiales.</p><button class="btn" type="button" data-register-class data-event-id="${esc(event.id)}">${language() === "en" ? "Request registration" : "Solicitar inscripción y pagar con Stripe"}</button><p><a href="/account/">${language() === "en" ? "View my account and registrations" : "Ver mi cuenta e inscripciones"}</a></p>` : `<p>El registro aún no está abierto.</p>`}`;
    document.querySelector("[data-register-class]")?.addEventListener("click", async (clickEvent) => {
      const button = clickEvent.currentTarget;
      button.disabled = true;
      try { await registerForClass(event.id); }
      catch (error) { button.disabled = false; fail(error); }
    });
    const session = await current();
    if (session && event.registration_enabled) {
      const { data: registration, error: registrationError } = await client.from("class_registrations").select("id,status,payment_status").eq("event_id", event.id).eq("user_id", session.user.id).maybeSingle();
      if (registrationError) throw registrationError;
      const button = document.querySelector("[data-register-class]");
      if (registration) {
        const paid = ["CONFIRMED", "WAIVED"].includes(registration.payment_status);
        const closed = ["REJECTED", "CANCELLED"].includes(registration.status);
        status(closed
          ? "Esta solicitud está cerrada. Contacta al equipo si necesitas ayuda."
          : paid ? (registration.status === "APPROVED" ? "Pago verificado y acceso aprobado." : "Pago verificado; solicitud pendiente de aprobación del equipo.") : "Solicitud registrada. Completa el pago en Stripe; el acceso requiere aprobación.");
        if (button) {
          const statefulButton = button.cloneNode(true);
          button.replaceWith(statefulButton);
          statefulButton.textContent = closed ? "Solicitud cerrada" : paid ? (registration.status === "APPROVED" ? (event.program_id ? "Acceder a mis materiales" : "Ver mi inscripción") : "Esperando aprobación") : "Continuar al pago con Stripe";
          if (closed) {
            statefulButton.disabled = true;
            const contactLink = document.createElement("a");
            contactLink.className = "btn secondary";
            contactLink.href = "/contact.html";
            contactLink.textContent = "Contactar al equipo";
            statefulButton.after(contactLink);
          } else if (paid) {
            statefulButton.disabled = registration.status !== "APPROVED";
            if (registration.status === "APPROVED") statefulButton.addEventListener("click", () => { window.location.href = event.program_id ? `/library/?program=${encodeURIComponent(event.program_id)}` : "/account/"; });
          } else statefulButton.addEventListener("click", () => { window.location.assign(`${stripeClassPaymentLink}?client_reference_id=${encodeURIComponent(registration.id)}`); });
        }
      }
    }
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
      const date = event.ends_at || event.starts_at;
      return past ? Boolean(date && new Date(date).getTime() < now) : Boolean(date && new Date(date).getTime() >= now);
    });
    target.innerHTML = rows.length ? rows.map((event) => eventCard(event, past)).join("") : `<div class="root-page-note">${language() === "en" ? (past ? "Past events will appear here." : "New classes and activities will be announced here.") : (past ? "Aquí aparecerán los eventos pasados." : "Aquí se anunciarán las próximas clases y actividades.")}</div>`;
  }

  async function renderGallery(target) {
    const { data, error } = await client.from("gallery_items").select("*").eq("status", "PUBLISHED").is("album_id", null).order("sort_order", { ascending: true }).order("created_at", { ascending: true });
    if (error) throw error;
    target.innerHTML = (data || []).map((item) => {
      const title = localized(item, "title");
      const alt = localized(item, "alt_text") || title;
      const image = publicImageUrl(item.image_path);
      return image ? `<figure><img src="${esc(image)}" alt="${esc(alt || title)}" loading="lazy"></figure>` : "";
    }).join("");
  }

  async function renderSanghaAlbums(target) {
    const { data: albums, error } = await client.from("gallery_albums").select("*, events(title,starts_at,location)").eq("status", "PUBLISHED").order("sort_order", { ascending: true }).order("created_at", { ascending: true });
    if (error) throw error;
    const visibleAlbums = albums || [];
    if (!visibleAlbums.length) {
      target.innerHTML = `<div class="root-page-note">${language() === "en" ? "Community activity albums will appear here." : "Aquí aparecerán los álbumes de las actividades de la comunidad."}</div>`;
      return;
    }
    const groups = await Promise.all(visibleAlbums.map(async (album) => {
      const { data: photos, error: photosError } = await client.from("gallery_items").select("title,title_en,description,description_en,alt_text,alt_text_en,image_path,sort_order").eq("album_id", album.id).eq("status", "PUBLISHED").order("sort_order", { ascending: true }).order("created_at", { ascending: true });
      if (photosError) throw photosError;
      const event = album.events;
      const coverPath = album.cover_image_path || photos?.[0]?.image_path;
      const cover = publicImageUrl(coverPath);
      const remainingPhotos = (photos || []).filter((photo) => photo.image_path !== coverPath);
      const context = [event?.title, event?.starts_at ? fmtDate(event.starts_at) : "", event?.location].filter(Boolean).join(" · ");
      const photoMarkup = remainingPhotos.map((photo) => {
        const title = localized(photo, "title") || photo.title || "";
        const description = localized(photo, "description") || photo.description || "";
        const alt = localized(photo, "alt_text") || photo.alt_text || title;
        const url = publicImageUrl(photo.image_path);
        return url ? `<figure><img src="${esc(url)}" alt="${esc(alt)}" loading="lazy">${description ? `<figcaption>${esc(description)}</figcaption>` : ""}</figure>` : "";
      }).join("");
      const description = localized(album, "description") || album.description || "";
      const title = localized(album, "title") || album.title;
      return `<article class="sangha-album"><div class="sangha-album-cover">${cover ? `<img src="${esc(cover)}" alt="${esc(title)}" loading="lazy">` : `<div class="sangha-album-placeholder" aria-hidden="true">Kunsang Gar</div>`}</div><div class="sangha-album-copy"><p class="eyebrow">${language() === "en" ? "Community activity" : "Actividad de la comunidad"}</p><h3>${esc(title)}</h3>${context ? `<p class="sangha-album-meta">${esc(context)}</p>` : ""}${description ? `<p>${esc(description)}</p>` : ""}</div>${photoMarkup ? `<div class="sangha-album-photos">${photoMarkup}</div>` : `<p class="sangha-album-empty">${language() === "en" ? "More photographs will be added soon." : "Pronto se agregarán más fotografías."}</p>`}</article>`;
    }));
    target.innerHTML = groups.join("");
  }

  async function publicClassesPage() {
    const eventTarget = document.querySelector("[data-public-classes]");
    const programTarget = document.querySelector("[data-public-programs]");
    const upcomingTarget = document.querySelector("[data-upcoming-events]");
    const pastTargets = document.querySelectorAll("[data-past-events]");
    const galleryTarget = document.querySelector("[data-gallery-items]");
    const sanghaGalleryTarget = document.querySelector("[data-sangha-gallery]");
    const testimonialsTarget = document.querySelector("[data-testimonials]");
    if (!client) return;
    const tasks = [];
    tasks.push(renderPendingClassPayments());
    if (eventTarget) tasks.push(renderEvents(eventTarget, { type: "CLASS" }));
    if (upcomingTarget) tasks.push(renderEvents(upcomingTarget));
    pastTargets.forEach((target) => tasks.push(renderEvents(target, { past: true })));
    if (programTarget) tasks.push(renderProgramList(programTarget, { selfEnrollOnly: true }));
    if (galleryTarget) tasks.push(renderGallery(galleryTarget));
    if (sanghaGalleryTarget) tasks.push(renderSanghaAlbums(sanghaGalleryTarget));
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
      const availableItems = data || [];
      for (const item of availableItems) {
        let href = item.external_url || "";
        if (item.storage_path && (session || item.access_level === "PUBLIC")) {
          const signed = await client.storage.from(bucket).createSignedUrl(item.storage_path, 300);
          if (!signed.error) href = signed.data.signedUrl;
        }
        const typeLabels = language() === "en" ? { VIDEO: "Video", AUDIO: "Audio", PDF: "PDF", TEXT: "Text", OTHER: "Resource" } : { VIDEO: "Video", AUDIO: "Audio", PDF: "PDF", TEXT: "Texto", OTHER: "Recurso" };
        rows.push(`<article class="root-page-card"><span class="pill">${esc(typeLabels[item.content_type] || "Recurso")}</span><h3>${esc(localized(item, "title"))}</h3>${localized(item, "description") ? `<p>${esc(localized(item, "description"))}</p>` : ""}${item.programs ? `<p class="platform-meta">${esc(localized(item.programs, "title"))}</p>` : ""}${href ? `<a class="btn small" href="${esc(href)}" target="_blank" rel="noopener">${language() === "en" ? "Open resource" : "Abrir recurso"}</a>` : `<span class="platform-locked">${language() === "en" ? "Not available right now." : "No disponible en este momento."}</span>`}</article>`);
      }
      if (rows.length) target.innerHTML = rows.join("");
      // Keep the curated public brochures and student access card already in the page when no CMS resource is published.
    } catch (error) { fail(error); }
  }

  window.KunsangGar = { client, cfg, esc, slugify, fmtDate, status, fail, current, profile, guard, login, register, loadPrograms, bucket, siteMediaBucket };
  async function boot() {
    try {
      const path = location.pathname;
      if (document.body.dataset.protected === "admin" && !path.startsWith("/admin/login/")) {
        const access = await guard("ADMIN");
        if (!access) return;
      }
      if (document.body.dataset.platformPage === "account" || path.startsWith("/account")) await accountPage();
      if (document.body.dataset.platformPage === "admin-login") await adminLoginPage();
      if (document.body.dataset.platformPage === "programs" || path.startsWith("/programs")) {
        const results = await Promise.allSettled([programsPage(), renderPendingClassPayments()]);
        results.filter((result) => result.status === "rejected").forEach((result) => fail(result.reason));
      }
      if (document.body.dataset.platformPage === "library" || path.startsWith("/library")) await libraryPage();
      if (path === "/class.html") await classDetailPage();
      if (["home", "classes", "events", "sangha"].includes(document.body.dataset.platformPage) || document.querySelector("[data-public-classes],[data-public-programs],[data-upcoming-events],[data-past-events],[data-gallery-items],[data-sangha-gallery]")) await publicClassesPage();
    } catch (error) { fail(error); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
})();
