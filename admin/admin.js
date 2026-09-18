const adminPages={
  "index.html":"overview",
  "programs.html":"programs",
  "program-editor.html":"program-editor",
  "content.html":"content",
  "upload.html":"upload",
  "students.html":"students",
  "student.html":"student",
  "events.html":"events",
  "event-editor.html":"event-editor",
  "library.html":"library",
  "access.html":"access",
  "donations.html":"donations",
  "settings.html":"settings"
};
const nav=[
  ["Overview","index.html"],["Programs","programs.html"],["Content","content.html"],["Students","students.html"],["Events","events.html"],["Digital Library","library.html"],["Access Control","access.html"],["Donations","donations.html"],["Settings","settings.html"]
];
const programs=[
  ["Sacred Women of the Great Perfection","Published","Geshe Dangsong Namgyal","Advanced","Live online","86","8","Jul 25, 2026","Restricted"],
  ["Nampar Gyalwa","Draft","Geshe Dangsong Namgyal","Intermediate","Hybrid","42","6","Sep 12, 2026","Members"],
  ["Tsa Lung","Published","Geshe Dangsong Namgyal","Advanced","In person","31","10","Oct 03, 2026","Teacher Approval"],
  ["Foundations of Bon Meditation","Published","Practice Team","Beginner","Self-paced","214","12","Open enrollment","Public"],
  ["Introduction to Yungdrung Bon","Published","Kunsang Gar Facilitators","Beginner","Online","168","5","Monthly orientation","Public"]
];
const contentRows=[
  ["Opening Teaching for Sacred Women","Sacred Women of the Great Perfection","Video","English","Restricted","Published","Aug 28, 2026"],
  ["Foundations Practice Guide","Foundations of Bon Meditation","PDF","English","Public","Published","Aug 25, 2026"],
  ["Tsa Lung Preparation Audio","Tsa Lung","Audio","English","Teacher Approval","Scheduled","Aug 24, 2026"],
  ["Nampar Gyalwa Session Notes","Nampar Gyalwa","Teaching Notes","English","Members","Draft","Aug 21, 2026"],
  ["Practice Text Alignment","Introduction to Yungdrung Bon","Sacred Text / Pecha","Tibetan","Restricted","Review","Aug 18, 2026"]
];
const students=[
  ["Tenzin Wangmo","tenzin.wangmo@example.org","United States","English","2","Restricted","Today","Active"],
  ["Mariana Ortega","mariana.ortega@example.org","Mexico","Spanish","3","Members","Yesterday","Active"],
  ["Lobsang Dorje","lobsang.dorje@example.org","Canada","English","1","Teacher Approval","Aug 30, 2026","Pending"],
  ["Sofia Rinchen","sofia.rinchen@example.org","Spain","Spanish","2","Members","Aug 29, 2026","Active"],
  ["Pema Alvarez","pema.alvarez@example.org","Mexico","English","1","Public","Aug 25, 2026","Active"]
];
const events=[
  ["Sacred Women of the Great Perfection","Geshe Dangsong Namgyal","Jul 25, 2026","10:00","America/Mexico City","Online","86","Donation","Published"],
  ["Monthly Open Practice","Practice Team","Sep 06, 2026","09:30","America/Mexico City","Online","124","Free","Published"],
  ["Foundations Practice Weekend","Kunsang Gar Facilitators","Oct 17, 2026","10:00","America/Mexico City","Hybrid","56","MXN","Draft"],
  ["Tsa Lung Retreat Preparation","Geshe Dangsong Namgyal","Nov 14, 2026","11:00","America/Mexico City","In Person","31","Donation","Scheduled"]
];
const donations=[
  ["Mariana Ortega","1,200","MXN","Scholarships","Sep 01, 2026","Completed"],
  ["Tenzin Wangmo","108","USD","Translation Projects","Aug 30, 2026","Completed"],
  ["Sofia Rinchen","75","EUR","General Support","Aug 28, 2026","Completed"],
  ["Pema Alvarez","600","MXN","Monastic Support","Aug 24, 2026","Completed"],
  ["Kunsang Gar Study Circle","4,500","MXN","Gar Development","Aug 20, 2026","Completed"]
];
function pageId(){
  const name=location.pathname.split("/").pop()||"index.html";
  return document.body.dataset.page||adminPages[name]||"overview";
}
function badge(text){
  const low=text.toLowerCase();
  let cls="badge";
  if(["published","active","completed","approved"].some(v=>low.includes(v))) cls+=" green";
  if(["restricted","teacher approval","pending","review"].some(v=>low.includes(v))) cls+=" red";
  if(["draft","scheduled","members"].some(v=>low.includes(v))) cls+=" gray";
  return `<span class="${cls}">${text}</span>`;
}
function button(text,href,kind="secondary"){
  const toast=text.includes("Publish")?"Event published successfully":text.includes("Save")?"Draft saved":text.includes("Preview")?"Preview opened":"";
  return `<a class="btn ${kind}" href="${href}" ${toast?`data-toast="${toast}"` : ""}>${text}</a>`;
}
function buildShell(){
  const current=pageId();
  return `<div class="admin-shell">
    <aside class="admin-sidebar" id="admin-sidebar">
      <a class="admin-brand" href="/index.html"><img src="/assets/kunsaanglogo.jpg" alt=""><span>Kunsang Gar Mexico<br>Administration</span></a>
      <nav class="admin-nav" aria-label="Administration navigation">${nav.map(([label,href])=>`<a href="/admin/${href}" ${adminPages[href]===current?'aria-current="page"':""}><span class="nav-dot"></span>${label}</a>`).join("")}</nav>
      <div class="sidebar-actions"><a class="side-link" href="/account/index.html">View Student Experience</a><a class="side-link" href="/index.html">Platform Presentation</a></div>
    </aside>
    <div class="admin-main">
      <header class="admin-topbar">
        <button class="icon-button mobile-menu" type="button" data-menu aria-label="Open navigation">Menu</button>
        <label class="search"><input type="search" placeholder="Search programs, students, resources"></label>
        <button class="icon-button" type="button" aria-label="Notifications">3</button>
        <div class="profile"><span class="avatar">KG</span><span>Administrator</span></div>
      </header>
      <main class="page" id="main">${render(current)}</main>
    </div>
  </div><div class="toast" id="toast" role="status" aria-live="polite"></div><div class="drawer" id="drawer"></div>`;
}
function head(kicker,title,copy,actions=""){
  return `<div class="crumbs"><a href="/admin/index.html">Administration</a><span>/</span><span>${kicker}</span></div><div class="page-head"><div><span class="eyebrow">${kicker}</span><h1>${title}</h1>${copy?`<p>${copy}</p>`:""}</div><div class="actions">${actions}</div></div>`;
}
function table(headers,rows,actions=true){
  return `<div class="card table-wrap"><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}${actions?"<th>Actions</th>":""}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((cell,i)=>`<td>${i>0&&["Published","Active","Completed","Draft","Scheduled","Restricted","Teacher Approval","Pending","Review","Members","Approved","Denied"].includes(cell)?badge(cell):cell}</td>`).join("")}${actions?`<td><div class="row-actions">${typeof actions==="function"?actions(row):'<button class="link-button" type="button" data-toast="Selection updated">Edit</button><button class="link-button" type="button" data-toast="Access panel opened">Manage</button>'}</div></td>`:""}</tr>`).join("")}</tbody></table></div>`;
}
function overview(){
  return `${head("Overview","Administration Dashboard","Operations, publishing, registrations and access review for Kunsang Gar Mexico.",button("Upload Content","upload.html","")+button("Create Program","program-editor.html"))}
  <section class="grid kpi-grid">
    ${["Active Students|541|+24 this month","Active Programs|5|3 published","Upcoming Events|8|2 this week","Published Resources|126|18 restricted"].map(item=>{const [a,b,c]=item.split("|");return `<article class="card kpi"><span>${a}</span><strong>${b}</strong><p>${c}</p></article>`}).join("")}
  </section>
  <section class="grid two-grid" style="margin-top:16px">
    <article class="card card-pad"><h2>Program Activity</h2><div class="chart">${[44,72,54,88,64,96,78,112].map(v=>`<span style="height:${v}px"></span>`).join("")}</div></article>
    <article class="card card-pad"><h2>Content Awaiting Publication</h2><div class="list">${["Nampar Gyalwa Session Notes|Teaching Notes|Review","Tsa Lung Preparation Audio|Audio|Scheduled","Practice Text Alignment|Sacred Text / Pecha|Review"].map(i=>row(i)).join("")}</div></article>
  </section>
  <section class="grid three-grid" style="margin-top:16px">
    <article class="card card-pad"><h2>Recent Activity</h2><div class="list">${["Program updated|Sacred Women of the Great Perfection","Access approved|Tenzin Wangmo","Resource uploaded|Foundations Practice Guide"].map(i=>row(i)).join("")}</div></article>
    <article class="card card-pad"><h2>Upcoming Teachings</h2><div class="list">${["Sacred Women of the Great Perfection|Jul 25, 2026","Monthly Open Practice|Sep 06, 2026","Foundations Practice Weekend|Oct 17, 2026"].map(i=>row(i)).join("")}</div></article>
    <article class="card card-pad"><h2>Recent Registrations</h2><div class="list">${["Lobsang Dorje|Tsa Lung","Sofia Rinchen|Foundations of Bon Meditation","Pema Alvarez|Introduction to Yungdrung Bon"].map(i=>row(i)).join("")}</div><h2 style="margin-top:18px">Recent Donations</h2><div class="list">${["Mariana Ortega|MXN 1,200","Tenzin Wangmo|USD 108"].map(i=>row(i)).join("")}</div></article>
  </section>`;
}
function row(item){const [a,b,c]=item.split("|");return `<div class="list-row"><div><strong>${a}</strong><div class="meta">${b||""}</div></div>${c?badge(c):""}</div>`}
function programsPage(){
  return `${head("Programs","Programs","Manage learning paths, access, schedules and publication status.",button("Create Program","program-editor.html",""))}${table(["Program","Status","Teacher","Level","Format","Students","Lessons","Next Session","Access Type"],programs.map(p=>[p[0],p[1],p[2],p[3],p[4],p[5],p[6],p[7],p[8]]),()=>'<a class="link-button" href="/admin/program-editor.html">Edit</a><a class="link-button" href="/admin/content.html">Manage Content</a><a class="link-button" href="/admin/students.html">Manage Students</a><button class="link-button" type="button" data-toast="Publication status updated">Publish / Unpublish</button>')}`;
}
function editor(kind){
  const isEvent=kind==="event";
  const title=isEvent?"Create Event":"Create Program";
  return `${head(isEvent?"Events":"Programs",title,isEvent?"Set event details, registration, access and publication.":"Set curriculum, access, multilingual details and publication.",button("Save Draft","#","secondary")+button("Preview","#","secondary")+button(isEvent?"Publish Event":"Publish","#",""))}
  <section class="editor-layout">
    <form class="card card-pad" data-form-toast="${isEvent?"Event published":"Program published"}">
      <div class="language-tabs" aria-label="Languages"><button type="button" class="is-active">EN</button><button type="button">ES</button><button type="button">TIB</button></div>
      <h2 style="margin-top:18px">${isEvent?"Event Information":"Program Information"}</h2>
      <div class="form-grid">${(isEvent?eventFields():programFields()).map(f=>field(f)).join("")}</div>
      <h2 style="margin-top:22px">${isEvent?"Access Requirements":"Learning Structure"}</h2>
      ${isEvent?`<div class="form-grid">${["Public registration","Members only","Registered students","Teacher approval required"].map(x=>field([x,"select",["Enabled","Disabled"]])).join("")}</div>`:`<div class="module-list">${["Introduction","Foundations","Deepening"].map((m,i)=>`<div class="module-item"><strong>${m}</strong><span class="meta">${i+2} lessons</span></div>`).join("")}</div><h2 style="margin-top:22px">Access</h2><div class="segmented"><button type="button" class="is-active">Public</button><button type="button">Registered Students</button><button type="button">Restricted</button><button type="button">Teacher Approval Required</button></div><h2 style="margin-top:22px">Publishing</h2><div class="segmented"><button type="button">Draft</button><button type="button" class="is-active">Published</button><button type="button">Scheduled</button></div>`}
    </form>
    <aside class="card card-pad"><h2>Publishing Checklist</h2><div class="list">${["English content complete|Ready","Spanish translation|In progress","Tibetan reference fields|Ready","Access reviewed|Ready","Cover image|Ready"].map(i=>row(i)).join("")}</div></aside>
  </section>`;
}
function programFields(){return [["Program title","text","Sacred Women of the Great Perfection"],["Subtitle","text","Teachings and practice in the Dzogchen Bon tradition"],["Description","textarea",""],["Teacher","select",["Geshe Dangsong Namgyal","Kunsang Gar Facilitators","Practice Team"]],["Category","select",["Dzogchen","Foundations","Meditation","Sacred Text"]],["Level","select",["Beginner","Intermediate","Advanced"]],["Language","select",["English","Spanish","Tibetan"]],["Format","select",["Live online","In person","Hybrid","Self-paced"]],["Start date","date",""],["End date","date",""],["Schedule","text","Saturdays, 10:00"],["Time zone","select",["America/Mexico City","America/New York","Europe/Madrid"]],["Price / Donation","text","Donation"],["Cover image","file",""]]}
function eventFields(){return [["Event title","text","Sacred Women of the Great Perfection"],["Description","textarea",""],["Teacher","select",["Geshe Dangsong Namgyal","Kunsang Gar Facilitators","Practice Team"]],["Date","date",""],["Start time","time",""],["End time","time",""],["Reference time zone","select",["America/Mexico City","America/New York","Europe/Madrid"]],["Format","select",["Online","In person","Hybrid"]],["Zoom / streaming link","url","https://"],["Venue","text","Kunsang Gar Mexico"],["Capacity","number","120"],["Price / Donation","text","Donation"],["Currency","select",["MXN","USD","EUR"]],["Registration link","url","/account/event.html"],["Cover image","file",""],["Language","select",["English","Spanish","Tibetan"]],["Translation available","select",["Yes","No"]]]}
function field(f){const [label,type,value]=f;const full=["Description","Cover image","Registration link","Zoom / streaming link"].includes(label)?" full":"";if(type==="textarea")return `<label class="field${full}">${label}<textarea placeholder="${label}"></textarea></label>`;if(type==="select")return `<label class="field${full}">${label}<select>${value.map(v=>`<option>${v}</option>`).join("")}</select></label>`;return `<label class="field${full}">${label}<input type="${type}" placeholder="${value||label}" value="${type==="file"?"":(value||"")}"></label>`}
function contentPage(){
  return `${head("Content","Content Management","Editorial workspace for teachings, recordings, texts and program materials.",button("Upload Content","upload.html",""))}<div class="toolbar"><div class="filters">${["Program","Content Type","Level","Language","Access","Status"].map(x=>`<select><option>${x}</option></select>`).join("")}</div></div>${table(["Title","Program","Type","Language","Access","Status","Updated"],contentRows,()=>'<button class="link-button" type="button" data-toast="Resource opened">Edit</button><button class="link-button" type="button" data-toast="Preview opened">Preview</button><button class="link-button" type="button" data-toast="Publication status updated">Publish</button>')}
  <section class="grid two-grid" style="margin-top:16px"><article class="card card-pad"><h2>Sacred Text / Pecha</h2><div class="pecha-editor"><label class="field">Tibetan text<textarea placeholder="Tibetan passage reference"></textarea></label><label class="field">Transliteration<textarea placeholder="Transliteration field"></textarea></label><label class="field">Translation<textarea placeholder="Translation field"></textarea></label><label class="field">Recitation audio<input type="file"></label></div></article><article class="card card-pad"><h2>Resource Settings</h2><div class="list">${["Access restriction|Teacher Approval","Program association|Introduction to Yungdrung Bon","Editorial status|Review"].map(i=>row(i)).join("")}</div></article></section>`;
}
function uploadPage(){
  return `${head("Content","Upload Teaching","Add a teaching, practice recording, text or resource to the platform.")}
  <section class="upload-steps">
    <aside class="card card-pad"><div class="step-list">${["Content Type","Upload","Details","Access","Publishing"].map((s,i)=>`<button class="step-link ${i===0?"is-active":""}" type="button" data-step="${i}"><span class="step-number">${i+1}</span>${s}</button>`).join("")}</div></aside>
    <div class="card card-pad">
      <div class="upload-step is-active"><h2>Content Type</h2><div class="choice-grid">${["Video","Audio","PDF","Sacred Text / Pecha","Image","Other Resource"].map((c,i)=>`<button class="choice ${i===0?"is-active":""}" type="button" data-choice>${c}<p>${choiceCopy(c)}</p></button>`).join("")}</div><div class="actions"><button class="btn" type="button" data-next>Continue</button></div></div>
      <div class="upload-step"><h2>Upload</h2><div class="dropzone"><div><strong>Drop file here</strong><p>or choose a file from your computer</p><button class="btn secondary" type="button" data-fake-upload>Choose File</button></div></div><div class="upload-progress" id="upload-progress"><strong>teaching-recording.mp4</strong><div class="meter"><span style="width:72%"></span></div><p>Uploading and preparing media</p></div><div class="actions"><button class="btn secondary" type="button" data-prev>Back</button><button class="btn" type="button" data-next>Continue</button></div></div>
      <div class="upload-step"><h2>Details</h2><div class="language-tabs"><button type="button" class="is-active">EN</button><button type="button">ES</button><button type="button">TIB</button></div><div class="form-grid">${[["Title","text","Opening Teaching for Sacred Women"],["Description","textarea",""],["Teacher","select",["Geshe Dangsong Namgyal","Practice Team"]],["Program","select",programs.map(p=>p[0])],["Module","select",["Introduction","Foundations","Deepening"]],["Lesson","text","Lesson 1"],["Language","select",["English","Spanish","Tibetan"]],["Tags","text","Dzogchen, practice, teaching"]].map(field).join("")}</div><div class="actions"><button class="btn secondary" type="button" data-prev>Back</button><button class="btn" type="button" data-next>Continue</button></div></div>
      <div class="upload-step"><h2>Access</h2><div class="segmented" data-access><button type="button">Public</button><button type="button">Students Enrolled in Program</button><button type="button">Members Only</button><button type="button" class="is-active" data-restricted>Restricted Teaching</button><button type="button">Geshe Approval Required</button></div><div class="restricted-panel is-visible" id="restricted-panel" style="margin-top:16px"><h2>Prerequisites</h2><div class="form-grid">${["Previous transmission required","Program completion required","Manual teacher approval"].map(x=>field([x,"select",["Required","Not required"]])).join("")}</div></div><div class="actions"><button class="btn secondary" type="button" data-prev>Back</button><button class="btn" type="button" data-next>Continue</button></div></div>
      <div class="upload-step"><h2>Publishing</h2><div class="segmented"><button type="button">Save as Draft</button><button type="button">Schedule</button><button type="button" class="is-active">Publish Now</button></div><div class="notice" style="margin-top:16px">Restricted access will require administrator review before students can open this resource.</div><div class="actions" style="margin-top:16px"><button class="btn secondary" type="button" data-prev>Back</button><button class="btn" type="button" data-publish>Publish Content</button></div></div>
    </div>
  </section>`;
}
function choiceCopy(c){return {Video:"Teaching recordings and streamed sessions.",Audio:"Chants, practice guidance and recitations.",PDF:"Guides, notes and reading material.","Sacred Text / Pecha":"Structured text, transliteration and translation.",Image:"Cover images and visual references.","Other Resource":"Additional program material."}[c]}
function studentsPage(){return `${head("Students","Students","Manage registrations, enrollments, status and access.",button("Enroll Student","#","secondary"))}<div class="toolbar"><div class="filters">${["Program","Country","Level","Access","Status"].map(x=>`<select><option>${x}</option></select>`).join("")}</div></div>${table(["Name","Email","Country","Language","Active Programs","Access Level","Last Activity","Status"],students.map(s=>[`<a href="/admin/student.html"><strong>${s[0]}</strong></a>`,s[1],s[2],s[3],s[4],s[5],s[6],s[7]]),()=>'<a class="link-button" href="/admin/student.html">View Profile</a><a class="link-button" href="/admin/access.html">Manage Access</a><button class="link-button" type="button" data-toast="Student enrolled">Enroll</button><button class="link-button" type="button" data-toast="Student suspended">Suspend</button>')}`}
function studentPage(){return `${head("Students","Tenzin Wangmo","Student profile, learning history, access permissions and contributions.",button("Manage Access","access.html",""))}<section class="grid two-grid"><article class="card card-pad"><h2>Student Information</h2><div class="list">${["Name|Tenzin Wangmo","Email|tenzin.wangmo@example.org","Country|United States","Preferred language|English","Time zone|America/New York"].map(i=>row(i)).join("")}</div><h2 style="margin-top:20px">Enrollment</h2><div class="list">${["Current programs|Sacred Women, Foundations","Completed programs|Introduction to Yungdrung Bon","Upcoming events|Sacred Women of the Great Perfection"].map(i=>row(i)).join("")}</div></article><article class="card card-pad"><h2>Practice Access</h2><div class="list">${["Public teachings|Enabled","Restricted teachings|Pending approval","Pending approvals|Tsa Lung preparation"].map(i=>row(i)).join("")}</div><h2 style="margin-top:20px">Content History</h2><div class="list">${["Recently viewed|Opening Teaching for Sacred Women","Saved resources|Foundations Practice Guide"].map(i=>row(i)).join("")}</div><h2 style="margin-top:20px">Donations</h2><div class="list">${["Recent contributions|USD 108 Translation Projects"].map(i=>row(i)).join("")}</div></article></section>`}
function accessPage(){return `${head("Access Control","Restricted Teaching Access","Review requests for Tsa Lung, Dzogchen and restricted transmissions.",button("Request More Information","#","secondary"))}<section class="card card-pad"><div class="filters" style="margin-bottom:12px"><button class="btn secondary" type="button">Pending</button><button class="btn secondary" type="button">Approved</button><button class="btn secondary" type="button">Denied</button></div><div class="notice" style="margin-bottom:12px">Access decisions are reviewed by the teacher and administration.</div>${table(["Student","Requested Teaching","Prerequisites","Previous Programs","Date Requested"],[["Tenzin Wangmo","Tsa Lung Preparation","Transmission required","Foundations complete","Sep 01, 2026"],["Lobsang Dorje","Dzogchen Teaching Archive","Teacher review","Introduction complete","Aug 31, 2026"],["Sofia Rinchen","Restricted transmissions","Manual teacher approval","Sacred Women active","Aug 29, 2026"]],false)}<div class="actions" style="margin-top:14px"><button class="btn" type="button" data-toast="Access approved">Approve</button><button class="btn danger" type="button" data-toast="Access denied">Deny</button><button class="btn secondary" type="button" data-toast="Information requested">Request More Information</button></div></section>`}
function eventsPage(){return `${head("Events","Events","Manage upcoming, live, past and draft events.",button("Create Event","event-editor.html",""))}<div class="filters" style="margin-bottom:14px">${["Upcoming","Live","Past","Draft"].map(x=>`<button class="btn secondary" type="button">${x}</button>`).join("")}</div>${table(["Title","Teacher","Date","Time","Time Zone","Format","Registered Students","Price / Donation","Status"],events,()=>'<a class="link-button" href="/admin/event-editor.html">Edit</a><button class="link-button" type="button" data-toast="Registration list opened">Registrations</button><button class="link-button" type="button" data-toast="Event published">Publish</button>')}`
}
function libraryPage(){return `${head("Digital Library","Digital Library","Manage videos, audio, PDFs, pechas, teachings and practice resources.",button("Upload Content","upload.html",""))}<section class="grid kpi-grid">${["Storage Used|418 GB|Media and documents","Resources Published|126|Across all programs","Restricted Resources|18|Teacher approval","Practice Resources|44|Audio, PDF and notes"].map(i=>{const[a,b,c]=i.split("|");return `<article class="card kpi"><span>${a}</span><strong>${b}</strong><p>${c}</p></article>`}).join("")}</section><section class="grid three-grid" style="margin-top:16px">${["Videos","Audio","PDFs","Pechas","Teachings","Practice Resources"].map(x=>`<article class="card card-pad"><h2>${x}</h2><div class="meter"><span style="width:${40+Math.round(Math.random()*45)}%"></span></div><p style="margin-top:10px">Organized by program, level, language and access.</p></article>`).join("")}</section>`}
function donationsPage(){return `${head("Donations","Donations","Review contributions by purpose, currency and status.")}<section class="grid three-grid" style="margin-bottom:16px">${["General Support","Events","Scholarships","Translation Projects","Monastic Support","Gar Development"].map(x=>`<article class="card card-pad"><h2>${x}</h2><p>Active contribution category</p></article>`).join("")}</section>${table(["Contributor","Amount","Currency","Purpose","Date","Status"],donations)}`}
function settingsPage(){return `${head("Settings","Settings","Organization, roles, languages, content access and integrations.")}<section class="grid two-grid">${["Organization|Organization name,Kunsang Gar Mexico|Main language,English|Default timezone,America/Mexico City","Languages|English,Enabled|Spanish,Enabled|Tibetan,Enabled","Payments|MXN,Enabled|USD,Enabled|EUR,Enabled","Roles|Administrator,Full access|Content Manager,Publishing|Teacher,Review|Student Support,Students","Content Access|Public,Enabled|Members,Enabled|Restricted,Enabled|Teacher Approval,Enabled","Integrations|Zoom,Connected|Stripe,Configured|PayPal,Configured|Email,Connected|Video Storage,Connected"].map(block=>{const parts=block.split("|");return `<article class="card card-pad"><h2>${parts[0]}</h2><div class="list">${parts.slice(1).map(p=>row(p.replace(",","|"))).join("")}</div></article>`}).join("")}</section>`}
function render(id){
  return ({overview,programs:programsPage,"program-editor":()=>editor("program"),content:contentPage,upload:uploadPage,students:studentsPage,student:studentPage,events:eventsPage,"event-editor":()=>editor("event"),library:libraryPage,access:accessPage,donations:donationsPage,settings:settingsPage}[id]||overview)();
}
document.getElementById("admin-app").innerHTML=buildShell();
const sidebar=document.getElementById("admin-sidebar");
document.querySelector("[data-menu]")?.addEventListener("click",()=>sidebar.classList.toggle("is-open"));
document.addEventListener("click",event=>{
  const toast=event.target.closest("[data-toast]");
  if(toast) showToast(toast.dataset.toast);
  if(event.target.matches(".language-tabs button,.segmented button,.choice")){
    const group=event.target.parentElement;
    group.querySelectorAll("button").forEach(b=>b.classList.remove("is-active"));
    event.target.classList.add("is-active");
    if(group.dataset.access!==undefined) document.getElementById("restricted-panel")?.classList.toggle("is-visible",event.target.textContent.includes("Restricted"));
  }
});
function showToast(message){
  const toast=document.getElementById("toast");
  toast.textContent=message;
  toast.classList.add("is-visible");
  clearTimeout(window.toastTimer);
  window.toastTimer=setTimeout(()=>toast.classList.remove("is-visible"),2400);
}
let step=0;
function setStep(next){
  const steps=[...document.querySelectorAll(".upload-step")];
  const links=[...document.querySelectorAll(".step-link")];
  if(!steps.length)return;
  step=Math.max(0,Math.min(steps.length-1,next));
  steps.forEach((el,i)=>el.classList.toggle("is-active",i===step));
  links.forEach((el,i)=>el.classList.toggle("is-active",i===step));
}
document.addEventListener("click",event=>{
  if(event.target.closest("[data-next]")) setStep(step+1);
  if(event.target.closest("[data-prev]")) setStep(step-1);
  if(event.target.closest("[data-step]")) setStep(Number(event.target.closest("[data-step]").dataset.step));
  if(event.target.closest("[data-fake-upload]")) document.getElementById("upload-progress")?.classList.add("is-visible");
  if(event.target.closest("[data-publish]")){
    showToast("Content published successfully");
    setTimeout(()=>location.href="/admin/content.html",1100);
  }
});
document.querySelectorAll("form[data-form-toast]").forEach(form=>{
  form.addEventListener("submit",event=>event.preventDefault());
  form.querySelectorAll(".btn").forEach(btn=>btn.addEventListener("click",event=>{
    if(event.currentTarget.textContent.includes("Publish")) showToast(form.dataset.formToast);
    if(event.currentTarget.textContent.includes("Save")) showToast("Draft saved");
    if(event.currentTarget.textContent.includes("Preview")) showToast("Preview opened");
  }));
});
document.querySelectorAll("a[href]").forEach(link=>{
  const href=link.getAttribute("href")||"";
  if(href.startsWith("#"))return;
  const url=new URL(href,location.href);
  if(url.origin!==location.origin) link.addEventListener("click",event=>event.preventDefault());
});
