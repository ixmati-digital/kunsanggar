(() => {
  'use strict';

  const root = document.querySelector('[data-community-root]');
  const notice = document.querySelector('[data-community-status]');
  const client = window.KunsangGar?.client;
  const en = document.documentElement.lang === 'en' || new URLSearchParams(location.search).get('lang') === 'en';
  const copy = en ? {
    failed: 'The community space could not be loaded. Please try again.',
    missing: 'This conversation is unavailable or no longer visible.',
    title: 'Start a conversation', body: 'Share a question or comment with the community.',
    titleLabel: 'Title', bodyLabel: 'Message', titleHint: '3–160 characters', bodyHint: 'Up to 12,000 characters',
    publish: 'Publish post', reply: 'Reply', sendReply: 'Post reply', edit: 'Edit', save: 'Save changes', cancel: 'Cancel',
    remove: 'Delete', hide: 'Hide', restore: 'Publish', hidden: 'Hidden by a moderator', deleted: 'This post was removed by its author.',
    removedReply: 'This reply was removed by its author.', open: 'Open conversation', back: '← Back to conversations',
    noPosts: 'No conversations yet. You can start one here.', replies: 'Replies', signIn: 'Sign in to join the community.',
    posted: 'Your post is now published.', replied: 'Your reply is now published.', saved: 'Changes saved.', removed: 'Your post was removed.',
    confirmRemove: 'Remove this post from the community?', confirmReply: 'Remove this reply?', wait: 'Please wait a few seconds before posting again.',
    posting: 'Publishing…', replying: 'Posting reply…', nameFallback: 'Kunsang Gar member', errors: 'Could not save your changes. Please try again.'
  } : {
    failed: 'No se pudo cargar el espacio de conversación. Inténtalo de nuevo.',
    missing: 'Esta conversación no está disponible o ya no es visible.',
    title: 'Inicia una conversación', body: 'Comparte una duda o comentario con la comunidad.',
    titleLabel: 'Título', bodyLabel: 'Mensaje', titleHint: 'De 3 a 160 caracteres', bodyHint: 'Hasta 12,000 caracteres',
    publish: 'Publicar conversación', reply: 'Responder', sendReply: 'Publicar respuesta', edit: 'Editar', save: 'Guardar cambios', cancel: 'Cancelar',
    remove: 'Eliminar', hide: 'Ocultar', restore: 'Publicar', hidden: 'Oculta por moderación', deleted: 'La persona autora eliminó esta publicación.',
    removedReply: 'La persona autora eliminó esta respuesta.', open: 'Abrir conversación', back: '← Volver a conversaciones',
    noPosts: 'Todavía no hay conversaciones. Puedes iniciar una aquí.', replies: 'Respuestas', signIn: 'Inicia sesión para participar en la comunidad.',
    posted: 'Tu publicación ya está disponible.', replied: 'Tu respuesta ya está disponible.', saved: 'Cambios guardados.', removed: 'Tu publicación se eliminó de la comunidad.',
    confirmRemove: '¿Quieres quitar esta publicación de la comunidad?', confirmReply: '¿Quieres quitar esta respuesta?', wait: 'Espera unos segundos antes de publicar de nuevo.',
    posting: 'Publicando…', replying: 'Publicando respuesta…', nameFallback: 'Miembro de Kunsang Gar', errors: 'No se pudieron guardar los cambios. Inténtalo de nuevo.'
  };
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const t = (key) => copy[key] || key;
  const formatDate = (value) => new Intl.DateTimeFormat(en ? 'en-US' : 'es-MX', {dateStyle:'medium', timeStyle:'short'}).format(new Date(value));
  let user = null;
  let moderator = false;

  function showNotice(message, error = false) {
    notice.textContent = message;
    notice.dataset.status = error ? 'error' : 'success';
    notice.hidden = false;
  }

  function statusBadge(status) {
    if (status === 'HIDDEN') return `<span class="community-badge">${esc(t('hidden'))}</span>`;
    if (status === 'DELETED') return `<span class="community-badge">${esc(t('remove'))}</span>`;
    return '';
  }

  function postActions(post) {
    const own = post.author_id === user.id && post.status === 'PUBLISHED';
    const moderate = moderator && post.status !== 'DELETED';
    if (!own && !moderate) return '';
    return `<div class="community-actions">${own ? `<button class="btn secondary small" type="button" data-edit-open="${esc(post.id)}">${esc(t('edit'))}</button><button class="btn secondary small" type="button" data-delete-post="${esc(post.id)}">${esc(t('remove'))}</button>` : moderate ? `<button class="btn secondary small" type="button" data-delete-post="${esc(post.id)}">${esc(t('remove'))}</button>` : ''}${moderate ? `<button class="btn secondary small" type="button" data-moderate-post="${esc(post.id)}" data-next-status="${post.status === 'HIDDEN' ? 'PUBLISHED' : 'HIDDEN'}">${esc(t(post.status === 'HIDDEN' ? 'restore' : 'hide'))}</button>` : ''}</div>`;
  }

  function editPostForm(post) {
    return `<form class="community-form community-edit-form" data-edit-post="${esc(post.id)}" hidden><label>${esc(t('titleLabel'))}<input name="title" maxlength="160" minlength="3" required value="${esc(post.title)}"></label><label>${esc(t('bodyLabel'))}<textarea name="body" maxlength="12000" minlength="3" required>${esc(post.body)}</textarea></label><div class="community-actions"><button class="btn small" type="submit">${esc(t('save'))}</button><button class="btn secondary small" type="button" data-edit-cancel="${esc(post.id)}">${esc(t('cancel'))}</button></div></form>`;
  }

  function postMarkup(post, detail = false) {
    const deleted = post.status === 'DELETED';
    const content = deleted ? `<p class="community-body">${esc(t('deleted'))}</p>` : `<p class="community-body">${esc(post.body)}</p>`;
    return `<article class="community-post" data-post-card="${esc(post.id)}"><div class="community-byline"><strong>${esc(post.author_name || t('nameFallback'))}</strong><time datetime="${esc(post.created_at)}">${esc(formatDate(post.created_at))}</time>${statusBadge(post.status)}</div><h2>${detail ? esc(post.title) : `<a href="/community/?id=${encodeURIComponent(post.id)}">${esc(post.title)}</a>`}</h2>${content}${!detail ? `<div class="community-actions"><a class="btn small" href="/community/?id=${encodeURIComponent(post.id)}">${esc(t('open'))}</a></div>` : ''}${postActions(post)}${editPostForm(post)}</article>`;
  }

  function replyMarkup(reply) {
    const own = reply.author_id === user.id && reply.status === 'PUBLISHED';
    const canModerate = moderator && reply.status !== 'DELETED';
    const actions = own || canModerate ? `<div class="community-actions">${own ? `<button class="btn secondary small" type="button" data-edit-reply-open="${esc(reply.id)}">${esc(t('edit'))}</button><button class="btn secondary small" type="button" data-delete-reply="${esc(reply.id)}">${esc(t('remove'))}</button>` : canModerate ? `<button class="btn secondary small" type="button" data-delete-reply="${esc(reply.id)}">${esc(t('remove'))}</button>` : ''}${canModerate ? `<button class="btn secondary small" type="button" data-moderate-reply="${esc(reply.id)}" data-next-status="${reply.status === 'HIDDEN' ? 'PUBLISHED' : 'HIDDEN'}">${esc(t(reply.status === 'HIDDEN' ? 'restore' : 'hide'))}</button>` : ''}</div>` : '';
    const body = reply.status === 'DELETED' ? t('removedReply') : reply.body;
    const edit = own ? `<form class="community-form community-edit-form" data-edit-reply="${esc(reply.id)}" hidden><label>${esc(t('bodyLabel'))}<textarea name="body" maxlength="8000" minlength="1" required>${esc(reply.body)}</textarea></label><div class="community-actions"><button class="btn small" type="submit">${esc(t('save'))}</button><button class="btn secondary small" type="button" data-edit-reply-cancel="${esc(reply.id)}">${esc(t('cancel'))}</button></div></form>` : '';
    return `<article class="community-reply"><div class="community-byline"><h3>${esc(reply.author_name || t('nameFallback'))}</h3><time datetime="${esc(reply.created_at)}">${esc(formatDate(reply.created_at))}</time>${statusBadge(reply.status)}</div><p class="community-body">${esc(body)}</p>${actions}${edit}</article>`;
  }

  function composer() {
    return `<form class="community-composer community-form" data-create-post><h2>${esc(t('title'))}</h2><p>${esc(t('body'))}</p><label>${esc(t('titleLabel'))}<input name="title" minlength="3" maxlength="160" required autocomplete="off"></label><small>${esc(t('titleHint'))}</small><label>${esc(t('bodyLabel'))}<textarea name="body" minlength="3" maxlength="12000" required></textarea></label><small>${esc(t('bodyHint'))}</small><button class="btn" type="submit">${esc(t('publish'))}</button></form>`;
  }

  async function getPost(id) {
    const {data, error} = await client.from('community_posts').select('id,title,body,author_id,author_name,status,created_at,updated_at').eq('id', id).maybeSingle();
    if (error) throw error;
    return data;
  }

  async function loadList() {
    const {data, error} = await client.from('community_posts').select('id,title,body,author_id,author_name,status,created_at,updated_at').order('created_at', {ascending:false}).limit(100);
    if (error) throw error;
    const rows = data || [];
    const list = rows.length ? rows.map((post) => postMarkup(post)).join('') : `<div class="community-empty">${esc(t('noPosts'))}</div>`;
    root.innerHTML = `<div class="community-grid">${composer()}<section class="community-list-column" aria-label="${esc(t('title'))}"><div class="community-post-list">${list}</div></section></div>`;
    bindActions();
  }

  async function loadDetail(id) {
    const post = await getPost(id);
    if (!post) { root.innerHTML = `<div class="community-empty">${esc(t('missing'))}</div>`; return; }
    const {data: replies, error} = await client.from('community_replies').select('id,post_id,body,author_id,author_name,status,created_at,updated_at').eq('post_id', id).order('created_at', {ascending:true});
    if (error) throw error;
    const replyRows = replies || [];
    const replyForm = post.status === 'PUBLISHED' ? `<form class="community-form community-composer" data-create-reply><h2>${esc(t('reply'))}</h2><label>${esc(t('bodyLabel'))}<textarea name="body" minlength="1" maxlength="8000" required></textarea></label><button class="btn" type="submit">${esc(t('sendReply'))}</button></form>` : '';
    root.innerHTML = `<div class="community-detail"><a href="/community/" class="btn secondary small">${esc(t('back'))}</a>${postMarkup(post, true)}<section aria-labelledby="community-replies-heading"><h2 id="community-replies-heading">${esc(t('replies'))} (${replyRows.length})</h2><div class="community-replies">${replyRows.length ? replyRows.map(replyMarkup).join('') : `<div class="community-empty">${en ? 'No replies yet.' : 'Todavía no hay respuestas.'}</div>`}</div></section>${replyForm}</div>`;
    bindActions();
  }

  function refresh() {
    const id = new URLSearchParams(location.search).get('id');
    return id ? loadDetail(id) : loadList();
  }

  function bindActions() {
    root.querySelector('[data-create-post]')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      button.textContent = t('posting');
      const values = new FormData(form);
      try {
        const {data, error} = await client.from('community_posts').insert({title:String(values.get('title')).trim(), body:String(values.get('body')).trim(), author_id:user.id}).select('id').single();
        if (error) throw error;
        location.assign(`/community/?id=${encodeURIComponent(data.id)}`);
      } catch (error) { button.disabled = false; button.textContent = t('publish'); showNotice(error?.message?.includes('wait before') ? t('wait') : t('errors'), true); }
    });
    root.querySelector('[data-create-reply]')?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      button.textContent = t('replying');
      try {
        const body = String(new FormData(form).get('body')).trim();
        const {error} = await client.from('community_replies').insert({post_id:new URLSearchParams(location.search).get('id'), body, author_id:user.id});
        if (error) throw error;
        showNotice(t('replied'));
        await refresh();
      } catch (error) { button.disabled = false; button.textContent = t('sendReply'); showNotice(error?.message?.includes('wait before') ? t('wait') : t('errors'), true); }
    });
    root.querySelectorAll('[data-edit-open]').forEach((button) => button.addEventListener('click', () => {
      const form = root.querySelector(`[data-edit-post="${CSS.escape(button.dataset.editOpen)}"]`);
      if (form) form.hidden = !form.hidden;
    }));
    root.querySelectorAll('[data-edit-cancel]').forEach((button) => button.addEventListener('click', () => { root.querySelector(`[data-edit-post="${CSS.escape(button.dataset.editCancel)}"]`)?.setAttribute('hidden', ''); }));
    root.querySelectorAll('[data-edit-post]').forEach((form) => form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const values = new FormData(form);
      const {error} = await client.from('community_posts').update({title:String(values.get('title')).trim(), body:String(values.get('body')).trim()}).eq('id', form.dataset.editPost);
      if (error) { showNotice(t('errors'), true); return; }
      showNotice(t('saved')); await refresh();
    }));
    root.querySelectorAll('[data-delete-post]').forEach((button) => button.addEventListener('click', async () => {
      if (!confirm(t('confirmRemove'))) return;
      const {error} = await client.from('community_posts').update({status:'DELETED'}).eq('id', button.dataset.deletePost);
      if (error) { showNotice(t('errors'), true); return; }
      showNotice(t('removed')); await refresh();
    }));
    root.querySelectorAll('[data-moderate-post]').forEach((button) => button.addEventListener('click', async () => {
      const {error} = await client.from('community_posts').update({status:button.dataset.nextStatus}).eq('id', button.dataset.moderatePost);
      if (error) { showNotice(t('errors'), true); return; }
      showNotice(t('saved')); await refresh();
    }));
    root.querySelectorAll('[data-edit-reply-open]').forEach((button) => button.addEventListener('click', () => {
      const form = root.querySelector(`[data-edit-reply="${CSS.escape(button.dataset.editReplyOpen)}"]`);
      if (form) form.hidden = !form.hidden;
    }));
    root.querySelectorAll('[data-edit-reply-cancel]').forEach((button) => button.addEventListener('click', () => { root.querySelector(`[data-edit-reply="${CSS.escape(button.dataset.editReplyCancel)}"]`)?.setAttribute('hidden', ''); }));
    root.querySelectorAll('[data-edit-reply]').forEach((form) => form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const body = String(new FormData(form).get('body')).trim();
      const {error} = await client.from('community_replies').update({body}).eq('id', form.dataset.editReply);
      if (error) { showNotice(t('errors'), true); return; }
      showNotice(t('saved')); await refresh();
    }));
    root.querySelectorAll('[data-delete-reply]').forEach((button) => button.addEventListener('click', async () => {
      if (!confirm(t('confirmReply'))) return;
      const {error} = await client.from('community_replies').update({status:'DELETED'}).eq('id', button.dataset.deleteReply);
      if (error) { showNotice(t('errors'), true); return; }
      showNotice(t('saved')); await refresh();
    }));
    root.querySelectorAll('[data-moderate-reply]').forEach((button) => button.addEventListener('click', async () => {
      const {error} = await client.from('community_replies').update({status:button.dataset.nextStatus}).eq('id', button.dataset.moderateReply);
      if (error) { showNotice(t('errors'), true); return; }
      showNotice(t('saved')); await refresh();
    }));
  }

  async function init() {
    if (!client) { root.textContent = t('failed'); showNotice(t('failed'), true); return; }
    const {data, error} = await client.auth.getSession();
    if (error) throw error;
    user = data.session?.user || null;
    if (!user) { location.replace(`/account/?next=${encodeURIComponent('/community/')}`); return; }
    const {data: profile, error: profileError} = await client.from('profiles').select('role').eq('id', user.id).maybeSingle();
    if (profileError) throw profileError;
    moderator = ['ADMIN','CONTENT_MANAGER'].includes(profile?.role);
    await refresh();
  }

  init().catch((error) => {
    console.error('Kunsang Gar community', error);
    root.textContent = t('failed');
    showNotice(t('failed'), true);
  });
})();
