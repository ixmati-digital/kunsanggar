(function () {
  const progress = document.getElementById("progress");
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 100}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  const reveal = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    reveal.forEach((item) => observer.observe(item));
  } else reveal.forEach((item) => item.classList.add("is-visible"));

  const client = window.KunsangGar?.client;
  const gate = document.getElementById("review-gate");
  const form = document.getElementById("review-form");
  const status = document.getElementById("review-status");
  const reviewer = document.getElementById("review-user");
  const requester = form?.elements.requester;
  async function enablePrivateNotes() {
    if (!client) return;
    const { data } = await client.auth.getSession();
    const user = data.session?.user;
    if (!user) return;
    const profile = await window.KunsangGar.profile(user.id);
    if (!profile || !["ADMIN", "CONTENT_MANAGER"].includes(profile.role)) return;
    gate.hidden = true;
    form.hidden = false;
    reviewer.textContent = profile.full_name || user.email || "Equipo Kunsang Gar";
    if (!requester.value) requester.value = profile.full_name || "";
  }
  enablePrivateNotes().catch(() => {});
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "Guardando de forma privada…";
    const session = await client?.auth.getSession();
    if (!session?.data.session) { status.textContent = "Tu sesión terminó. Inicia sesión otra vez para enviar el comentario."; return; }
    const values = Object.fromEntries(new FormData(form));
    const { error } = await client.from("platform_review_notes").insert({
      section: String(values.section).trim(),
      comment: String(values.comment).trim(),
      priority: values.priority,
      requester: String(values.requester).trim(),
      created_by: session.data.session.user.id
    });
    if (error) { status.textContent = "No se pudo guardar. Revisa tu acceso al CMS e inténtalo de nuevo."; return; }
    form.reset();
    requester.value = reviewer.textContent;
    status.textContent = "Comentario guardado. Solo el equipo autorizado puede consultarlo en el CMS.";
  });
})();
