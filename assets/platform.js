/* Kunsang Gar V1: browser-only Supabase integration. Never put service_role here. */
(function () {
  const cfg = window.KUNSANG_GAR_CONFIG || {};
  const hasConfig = Boolean(cfg.supabaseUrl && cfg.supabaseAnonKey && window.supabase);
  const client = hasConfig ? window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey) : null;
  const bucket = cfg.storageBucket || "protected-content";

  const esc = (value) => String(value ?? "").replace(/[&<>'"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;", "'":"&#39;", '"':"&quot;"}[c]));
  const status = (message, kind = "info") => document.querySelectorAll("[data-platform-status]").forEach((el) => {
    el.textContent = message;
    el.dataset.status = kind;
    el.hidden = false;
  });
  const fail = (error) => { console.error("Kunsang Gar V1", error); status(error?.message || "No se pudo completar la operación.", "error"); };
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
      status("Supabase no está configurado. Carga supabaseUrl y supabaseAnonKey en la configuración runtime.", "error");
      return null;
    }
    const session = await current();
    if (!session) {
      const loginPath = role === "ADMIN" ? "/admin/login/" : "/account/";
      window.location.replace(`${loginPath}?next=${encodeURIComponent(location.pathname + location.search)}`);
      return null;
    }
    const me = await profile(session.user.id);
    if (role === "ADMIN" && me?.role !== "ADMIN") {
      window.location.replace("/admin/login/?access=admin-required");
      return null;
    }
    return { session, profile: me };
  }

  async function login(email, password) {
    if (!client) throw new Error("Supabase no está configurado en esta instalación.");
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const profileData = await profile(data.user.id);
    const expectedRole = document.body.dataset.authRole || "PRACTITIONER";
    if (!profileData || profileData.role !== expectedRole) {
      await client.auth.signOut();
      throw new Error(expectedRole === "ADMIN"
        ? "Esta cuenta no tiene privilegios administrativos. Usa una cuenta ADMIN autorizada."
        : "Esta cuenta no es de practicante. Usa el acceso administrativo correspondiente.");
    }
    const requested = new URLSearchParams(location.search).get("next");
    const safeNext = requested?.startsWith("/") && !requested.startsWith("//") ? requested : null;
    window.location.replace(safeNext || (expectedRole === "ADMIN" ? "/admin/" : "/account/"));
  }

  async function register(fullName, email, password) {
    if (!client) throw new Error("Supabase no está configurado en esta instalación.");
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
      catch (error) { button.disabled = false; fail(error); }
    });
    const registerForm = document.querySelector("[data-register-form]");
    registerForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = registerForm.querySelector("button[type=submit]");
      const notice = document.querySelector("[data-register-status]");
      button.disabled = true;
      try {
        const data = await register(registerForm.full_name.value.trim(), registerForm.email.value.trim(), registerForm.password.value);
        if (data.session) window.location.replace("/account/");
        else { notice.textContent = "Cuenta creada. Revisa tu correo para confirmar el acceso y después inicia sesión."; notice.hidden = false; }
      } catch (error) { button.disabled = false; notice.textContent = error.message || "No se pudo crear la cuenta."; notice.dataset.status = "error"; notice.hidden = false; }
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
    document.querySelectorAll("[data-user-role]").forEach((el) => el.textContent = me?.role || "PRACTITIONER");
    document.querySelectorAll("[data-logout]").forEach((el) => el.addEventListener("click", async () => { await client.auth.signOut(); window.location.replace("/account/"); }));
  }

  async function adminLoginPage() {
    if (!client) {
      status("El acceso administrativo no está disponible porque falta la configuración de Supabase.", "error");
      return;
    }
    const session = await current();
    if (session) {
      const me = await profile(session.user.id);
      if (me?.role === "ADMIN") {
        const requested = new URLSearchParams(location.search).get("next");
        const safeNext = requested?.startsWith("/") && !requested.startsWith("//") ? requested : null;
        window.location.replace(safeNext || "/admin/");
        return;
      }
    }
    const params = new URLSearchParams(location.search);
    if (params.get("access") === "admin-required") {
      status("La cuenta activa no tiene rol ADMIN. Inicia sesión con una cuenta administrativa autorizada.", "error");
    }
    loginView();
  }

  async function loadPrograms(target) {
    const { data, error } = await client.from("programs").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    target.innerHTML = data?.length ? data.map((p) => `<article class="root-page-card"><span class="pill">${esc(p.access_level)}</span><h3>${esc(p.title)}</h3><p>${esc(p.description || "Programa de estudio y práctica.")}</p><p class="platform-meta">${esc(p.level || "")} ${p.teacher ? `· ${esc(p.teacher)}` : ""}</p><div class="root-page-actions"><a class="btn small" href="/library/?program=${encodeURIComponent(p.id)}">Ver contenido</a></div></article>`).join("") : `<div class="root-page-note">Aún no hay programas publicados.</div>`;
  }

  async function programsPage() {
    const target = document.querySelector("[data-program-catalog]");
    if (!target) return;
    if (!client) { status("Supabase no está configurado; el catálogo no puede cargar datos reales.", "error"); return; }
    try { await loadPrograms(target); } catch (error) { fail(error); }
  }

  async function libraryPage() {
    const target = document.querySelector("[data-library]");
    if (!target) return;
    if (!client) { status("Supabase no está configurado; la biblioteca no puede cargar contenido.", "error"); return; }
    try {
      const params = new URLSearchParams(location.search);
      let query = client.from("content_items").select("id,title,description,content_type,access_level,storage_path,external_url,programs(title)").eq("status", "PUBLISHED").order("created_at", { ascending: false });
      if (params.get("program")) query = query.eq("program_id", params.get("program"));
      const { data, error } = await query;
      if (error) throw error;
      const session = await current();
      const rows = [];
      for (const item of data || []) {
        let href = item.external_url || "";
        if (item.storage_path && (session || item.access_level === "PUBLIC")) {
          const signed = await client.storage.from(bucket).createSignedUrl(item.storage_path, 300);
          if (!signed.error) href = signed.data.signedUrl;
        }
        rows.push(`<article class="root-page-card"><span class="pill">${esc(item.access_level)} · ${esc(item.content_type)}</span><h3>${esc(item.title)}</h3><p>${esc(item.description || "Recurso asociado a un programa publicado.")}</p><p class="platform-meta">${esc(item.programs?.title || "Kunsang Gar")}</p>${href ? `<a class="btn small" href="${esc(href)}" target="_blank" rel="noopener">Abrir recurso</a>` : `<span class="platform-locked">Inicia sesión o solicita autorización para acceder.</span>`}</article>`);
      }
      target.innerHTML = rows.length ? rows.join("") : `<div class="root-page-note">No hay recursos disponibles para este usuario.</div>`;
    } catch (error) { fail(error); }
  }

  window.KunsangGar = { client, cfg, esc, slugify, fmtDate, status, fail, current, profile, guard, login, register, loadPrograms, bucket };
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
    } catch (error) { fail(error); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true }); else boot();
})();
