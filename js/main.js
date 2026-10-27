// Construit la page à partir de knowledge.js, gère FR/EN, le formulaire de devis (WhatsApp), le menu et l'assistant.
import { BIZ, SERVICES, WHY, FAQ, FOUNDER, GALLERY } from "./knowledge.js?v=202610271527";
import { mountAssistant } from "./assistant.js?v=202610271527";
import { openContact } from "./contact.js?v=202610271527";

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// ---------------------------------------------------------------- translations (FR is the page's default text)
const I18N = {
  en: {
    top_wa: "💬 WhatsApp", top_call: "Call", top_mail: "Email", c_reach: "Reach us", c_wa: "WhatsApp", c_call: "Call", c_mail: "Email", c_lines: "Other lines", c_line: "Line", nav_services: "Services", nav_why: "Why us", nav_gallery: "Gallery", hero_real: "Our real trucks, our real premises", gal_kicker: "Our facilities", gal_title: "On the ground, at the Port of Douala", gal_sub: "Our trucks, our tire workshop, our lubricants and our premises: what you'll find when you visit us.", nav_biz: "Businesses", nav_about: "About", nav_contact: "Contact", cta_quote: "Get a quote",
    hero_pill: "Transport · Logistics · Business services",
    hero_title: "Your trusted partner,<br /><span>more than a service, a solution.</span>",
    hero_lead: "At the Port of Douala since 2014: national and international road freight, logistics and warehousing, customs clearance, and tire specialists for cars and heavy trucks.",
    cta_wa: "Message us on WhatsApp", cta_call: "Call now",
    stat_year: "serving Douala", stat_vehicles: "cars & heavy trucks", stat_team: "professionals at your service", stat_services: "services under one roof", stat_rating: "Google rating",
    svc_kicker: "Our services", svc_title: "Everything for your vehicles, in one place", svc_sub: "Individuals, hauliers, worksites and companies: one partner for maintenance, tires, transport and lifting.",
    feat_kicker: "Transport & logistics", feat_title: "For a world without borders", feat_body: "From the port of Douala to the destination, in Cameroon and abroad: we transport, store, clear and deliver your goods. And for heavy loads, our Hiab crane trucks lift and load.",
    feat_li1: "National & international road freight", feat_li2: "Real-time tracking of your loads", feat_li3: "Storage, warehousing & distribution", feat_li4: "Customs clearance & Hiab crane trucks", feat_cta: "Arrange a shipment",
    why_kicker: "Our values", why_title: "Professionalism · Safety · Performance", founder_kicker: "The founder", founder_since: "Founded in 2014", f_motto: "Going further, together!",
    how_kicker: "Quick and simple", how_title: "How it works",
    how1_t: "Contact us", how1_d: "WhatsApp, a call, or a visit to the port zone.", how2_t: "Diagnosis & quote", how2_d: "We listen to your needs and give you a clear price.",
    how3_t: "We get to work", how3_d: "Our team takes care of your vehicle or your load.", how4_t: "Satisfaction", how4_d: "Your satisfaction is our priority. We stay at your service.",
    biz_kicker: "Businesses & fleets", biz_title: "Hauliers, worksites, industry: let's talk about your needs", biz_body: "Fleet maintenance, heavy-truck tires, lubricants, lifting, freight transport and industrial services: we build the right solution for your business.",
    biz_cta: "Discuss my project", biz_mail: "Send an email",
    about_badge: "Founded in Douala", about_kicker: "About us", about_title: "A Cameroonian company based at the Port of Douala",
    about_p1: "TP & FILS Services SARL is a transport, logistics and business services company founded in 2014 in Douala.",
    about_p2: "Based in the port zone, between BRÖLI headquarters and the SOCOMAR garage, we serve individuals, hauliers and businesses with a team of 55+ professionals: national and international road freight, logistics and warehousing, customs clearance, tires of every brand and size, oils and lubricants, a truck and car garage, vehicle rental, staffing and a modern vehicle wash.",
    about_quote: "\"With us, customer satisfaction is our priority.\"",
    faq_title: "Frequently asked questions", contact_kicker: "Contact", contact_title: "Come see us at the Port of Douala",
    c_addr: "Address", c_phone: "Phone", c_hours: "Hours",
    form_title: "Request a quote", form_sub: "Fill in the form: it opens in WhatsApp, ready to send.",
    f_name: "Full name", f_company: "Company (optional)", f_phone: "Phone", f_service: "Service", f_msg: "What you need",
    f_msg_ph: "E.g. 4 tires 315/80 R22.5 for a truck, or lifting a 20-ft container…", f_send: "Send on WhatsApp", f_mail: "Or send by email",
    f_slogan: "Always listening, for better quality of service.", f_services: "Services", f_made: "Website made with ❤️ by Freeman T.", f_credits: "Photo credits",
  },
};
const FR = {}; // captured from the page on load
let lang = (() => { try { return localStorage.getItem("tp.lang") || "fr"; } catch { return "fr"; } })();
const getLang = () => lang;

function captureFrench() {
  document.querySelectorAll("[data-i18n]").forEach((el) => (FR[el.dataset.i18n] = el.textContent));
  document.querySelectorAll("[data-i18n-html]").forEach((el) => (FR[el.dataset.i18nHtml] = el.innerHTML));
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => (FR[el.dataset.i18nPh] = el.placeholder));
}
const tr = (k) => (lang === "fr" ? FR[k] : I18N.en[k] ?? FR[k]);

function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = tr(el.dataset.i18n)));
  document.querySelectorAll("[data-i18n-html]").forEach((el) => (el.innerHTML = tr(el.dataset.i18nHtml)));
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => (el.placeholder = tr(el.dataset.i18nPh)));
  document.querySelectorAll(".lang button").forEach((b) => b.classList.toggle("is-on", b.dataset.lang === lang));
  render();
  assistant && assistant.render();
}

// ---------------------------------------------------------------- icons (inline SVG, no external library)
const ICONS = {
  tire: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
  oil: '<path d="M4 9h9l3-3h3v4l-3 1v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M8 6h3M20 14c0 1.5-1 2.5-1 2.5s-1-1-1-2.5 1-2.5 1-2.5 1 1 1 2.5z"/>',
  drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8V21h3.2l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  truck: '<path d="M2 6h11v9H2zM13 9h4l3 3v3h-7z"/><circle cx="6" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  crane: '<path d="M3 20h10M5 20V8l11-4 3 6M8 7v13M16 4v6"/><path d="M19 10v3a1.5 1.5 0 1 1-1.5 1.5"/>',
  wash: '<path d="M3 15l2-5h14l2 5v3H3z"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/><path d="M8 3c0 1-1 1.5-1 2.5S8 7 8 7M12 2c0 1-1 1.5-1 2.5S12 6 12 6M16 3c0 1-1 1.5-1 2.5S16 7 16 7"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  stack: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5M3 17.5l9 5 9-5"/>',
  warehouse: '<path d="M3 21V9l9-5 9 5v12"/><path d="M7 21v-8h10v8M7 17h10"/>',
  doc: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/><circle cx="17" cy="17" r="0" />',
  car: '<path d="M5 17h14M3 13l2-5a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 5v4H3z"/><circle cx="7" cy="17" r="1.6"/><circle cx="17" cy="17" r="1.6"/>',
  team: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20a6 6 0 0 1 12 0M14 20a5 5 0 0 1 7-4.6"/>',
  bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  heart: '<path d="M12 20s-7-4.4-9-9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c-2 4.6-9 9-9 9z"/>',
};
const icon = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ""}</svg>`;

// ---------------------------------------------------------------- sections built from knowledge.js
function render() {
  const L = lang;
  $("ticker").innerHTML = [0, 1].map(() => `<div>${SERVICES.map((s) => `<span>${esc(s[L].name)}</span><i>●</i>`).join("")}</div>`).join("");
  $("serviceGrid").innerHTML = SERVICES.map((s) => `
    <article class="svc ${s.img ? "svc--img" : ""}" id="svc-${s.id}">
      ${s.img ? `<div class="svc__img"><img src="assets/img/${s.img}" alt="" loading="lazy" /></div>` : ""}
      <div class="svc__body"><span class="svc__icon">${icon(s.icon)}</span><h3>${esc(s[L].name)}</h3><p>${esc(s[L].short)}</p>
      <button class="svc__more" data-service="${s.id}">${L === "fr" ? "En savoir plus" : "Learn more"} →</button></div>
    </article>`).join("");
  $("whyGrid").innerHTML = WHY.map((w) => `<div class="why__card"><span class="why__icon">${icon(w.icon)}</span><h3>${esc(w[L][0])}</h3><p>${esc(w[L][1])}</p></div>`).join("");
  $("faqList").innerHTML = FAQ.map((f, i) => `<details ${i === 0 ? "open" : ""}><summary>${esc(f[L][0])}<span>+</span></summary><p>${esc(f[L][1])}</p></details>`).join("");
  $("fService").innerHTML = SERVICES.map((s) => `<option>${esc(s[L].name)}</option>`).join("") + `<option>${L === "fr" ? "Autre" : "Other"}</option>`;
  $("footServices").innerHTML = SERVICES.map((s) => `<li><a href="#svc-${s.id}">${esc(s[L].name)}</a></li>`).join("");
  $("cAddr").textContent = BIZ.address[L]; $("cAddr").href = BIZ.maps;
  $("cHours").textContent = BIZ.hours[L];
  $("topHours").textContent = `🕗 ${BIZ.hoursShort[L]}`;
  $("gallery").innerHTML = GALLERY.map((g, i) => `<button class="gal ${i === 0 ? "gal--big" : ""}" data-gal="${i}"><img src="assets/img/${g.img}" alt="${esc(g[L])}" loading="lazy" /><span>${esc(g[L])}</span></button>`).join("");
  const hello = L === "fr" ? "Bonjour TP & Fils, je souhaite un devis." : "Hello TP & Fils, I'd like a quote.";
  ["navWa", "heroWa", "bizWa"].forEach((id) => ($(id).dataset.msg = hello));
  $("featWa").dataset.msg = (L === "fr" ? "Bonjour TP & Fils, je souhaite organiser un transport de marchandises." : "Hello TP & Fils, I'd like to arrange a freight shipment.");
  $("svcCount").textContent = SERVICES.length;
  $("founderRole").textContent = FOUNDER[L].role;
  $("founderText").textContent = FOUNDER[L].text;
  $("founderQuote").textContent = `« ${FOUNDER[L].quote} »`;
  $("founderBy").textContent = `— ${FOUNDER[L].quoteBy}`;
}

// socials + photo credits (required by the photo licenses)
$("socials").innerHTML = BIZ.socials.map((s) => `<a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.name}" class="soc soc--${s.icon}">${s.name}</a>`).join("");
fetch("js/credits.json?v=202610271527").then((r) => r.json()).then((list) => {
  $("creditList").innerHTML = list.map((c) => `<li>${esc(c.file)}: « ${esc(c.title.replace(/\.jpg$/i, ""))} » par ${esc(c.artist)}, <a href="${c.page}" target="_blank" rel="noopener">${esc(c.license)}</a> (Wikimedia Commons), recadrée</li>`).join("");
}).catch(() => {});

// service details dialog
function openService(id) {
  const s = SERVICES.find((x) => x.id === id); if (!s) return;
  const L = lang, t = s[L];
  $("svcBody").innerHTML = `<button class="modal__x" data-close aria-label="Fermer">×</button>
    ${s.img ? `<div class="modal__img"><img src="assets/img/${s.img}" alt="" /></div>` : `<div class="modal__img modal__img--icon">${icon(s.icon)}</div>`}
    <div class="modal__copy"><p class="kicker">${L === "fr" ? "Service" : "Service"}</p><h2>${esc(t.name)}</h2><p>${esc(t.body)}</p>
    <div class="modal__ctas"><a class="btn btn--wa" href="#contact" data-contact="wa" data-msg="${esc((L === "fr" ? "Bonjour TP & Fils, je suis intéressé(e) par : " : "Hello TP & Fils, I'm interested in: ") + t.name)}">${L === "fr" ? "Demander un devis" : "Get a quote"}</a><a class="btn btn--light" href="#contact" data-contact="call">${L === "fr" ? "Appeler" : "Call"}</a></div></div>`;
  $("svcModal").showModal();
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-service]"); if (b) openService(b.dataset.service);
  if (e.target.closest("[data-close]") || e.target === $("svcModal")) $("svcModal").close();
  const lb = e.target.closest(".lang button");
  if (lb && lb.dataset.lang !== lang) { lang = lb.dataset.lang; try { localStorage.setItem("tp.lang", lang); } catch {} applyLang(); }
});
window.addEventListener("open-service", (e) => openService(e.detail));

// gallery lightbox
document.addEventListener("click", (e) => {
  const g = e.target.closest("[data-gal]");
  if (g) { const it = GALLERY[Number(g.dataset.gal)]; $("lbImg").src = `assets/img/${it.img}`; $("lbImg").alt = it[lang]; $("lbCap").textContent = it[lang]; $("lightbox").showModal(); }
  if (e.target.closest("[data-close-lb]") || e.target === $("lightbox")) $("lightbox").close();
});

// quote form → WhatsApp (or email)
function composeQuote() {
  const f = new FormData($("quoteForm"));
  const L = lang;
  return (L === "fr"
    ? `Bonjour TP & Fils,\nJe souhaite un devis.\n\nNom : ${f.get("name")}${f.get("company") ? `\nEntreprise : ${f.get("company")}` : ""}\nTéléphone : ${f.get("phone")}\nService : ${f.get("service")}\n\n${f.get("msg")}`
    : `Hello TP & Fils,\nI'd like a quote.\n\nName: ${f.get("name")}${f.get("company") ? `\nCompany: ${f.get("company")}` : ""}\nPhone: ${f.get("phone")}\nService: ${f.get("service")}\n\n${f.get("msg")}`);
}
$("quoteForm").addEventListener("submit", (e) => { e.preventDefault(); openContact("wa", { msg: composeQuote() }); });
$("sendMail").addEventListener("click", () => {
  if (!$("quoteForm").reportValidity()) return;
  openContact("mail", { subject: lang === "fr" ? "Demande de devis (site web)" : "Quote request (website)", body: composeQuote() });
});

// menu + header
$("navToggle").addEventListener("click", () => document.body.classList.toggle("menu-open"));
$("navLinks").addEventListener("click", (e) => { if (e.target.closest("a")) document.body.classList.remove("menu-open"); });
const onScroll = () => $("nav").classList.toggle("is-scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

// reveal on scroll
const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: 0.1 }) : null;
const watchReveal = () => document.querySelectorAll(".section .head, .svc, .why__card, .steps li, .feature, .about, .contact > *, .gal").forEach((el) => { if (!el.classList.contains("reveal")) { el.classList.add("reveal"); io ? io.observe(el) : el.classList.add("in"); } });

$("year").textContent = new Date().getFullYear();
captureFrench();
let assistant = null;
assistant = mountAssistant(getLang);
applyLang();
watchReveal();
new MutationObserver(watchReveal).observe($("serviceGrid"), { childList: true });
new MutationObserver(watchReveal).observe($("gallery"), { childList: true });
