// L'Assistant TP & Fils : répond aux questions des clients, en français (par défaut) ou en anglais.
// Fonctionne entièrement dans le navigateur : pas de compte, pas de clé API, pas de frais.
// Il ne répond qu'à partir de knowledge.js (les infos de l'entreprise) et n'invente jamais de prix :
// pour un tarif ou une disponibilité, il oriente vers WhatsApp ou le téléphone.
import { BIZ, SERVICES, FAQ, FOUNDER } from "./knowledge.js";

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const wa = (text) => `https://wa.me/${BIZ.whatsapp}?text=${encodeURIComponent(text)}`;

// UI words
const T = {
  fr: { waBtn: "Écrire sur WhatsApp", call: "Appeler", mail: "Envoyer un e-mail", map: "Itinéraire", more: "Voir le service", placeholder: "Posez votre question…", title: "Assistant TP & Fils", sub: "Répond tout de suite · FR / EN", note: "Pour un prix exact, nos équipes vous répondent sur WhatsApp ou au téléphone.", fab: "Une question ?", hello: "Bonjour et bienvenue chez <b>TP & Fils Services</b> ! 👋 Pneus, lubrifiants, vidange, garage, transport, camions grue… Je vous oriente. Que puis-je faire pour vous ?" },
  en: { waBtn: "Message on WhatsApp", call: "Call", mail: "Send an email", map: "Directions", more: "See the service", placeholder: "Ask your question…", title: "TP & Fils Assistant", sub: "Replies instantly · FR / EN", note: "For an exact price, our team answers on WhatsApp or by phone.", fab: "Questions?", hello: "Hello and welcome to <b>TP & Fils Services</b>! 👋 Tires, lubricants, oil changes, garage, transport, crane trucks… I'll point you in the right direction. How can I help?" },
};
const CHIPS = {
  fr: { start: ["Nos services", "Prix des pneus", "Location camion grue", "Où êtes-vous ?", "Horaires"], after: ["Demander un devis", "Où êtes-vous ?", "Nos services"] },
  en: { start: ["Your services", "Tire prices", "Crane truck rental", "Where are you?", "Opening hours"], after: ["Get a quote", "Where are you?", "Your services"] },
};

const contactBtns = (L, topic) => {
  const msg = L === "fr" ? `Bonjour TP & Fils, je vous contacte depuis votre site web${topic ? ` au sujet de : ${topic}` : ""}.` : `Hello TP & Fils, I'm reaching out from your website${topic ? ` about: ${topic}` : ""}.`;
  return `<div class="chat-actions"><a class="chat-btn chat-btn--wa" href="${wa(msg)}" target="_blank" rel="noopener">${T[L].waBtn}</a><a class="chat-btn chat-btn--ghost" href="tel:${BIZ.phones[0].tel}">${T[L].call}</a></div>`;
};
const svcName = (s, L) => s[L].name;

// which service is the message about?
const SVC_WORDS = [
  ["dedouanement", /\b(d[ée]douan\w*|douanes?|customs|transit\w*|formalit[ée]s?|clearance)\b/],
  ["logistique", /\b(logistiques?|logistics|stock\w*|entrep[oô]\w*|warehous\w*|storage|magasin\w*|distribution|gestion de flux)\b/],
  ["location", /\b(location de (v[ée]hicules?|voitures?|4x4|suv)|louer (une|un) (voiture|v[ée]hicule|4x4|suv|jeep)|car rental|rent(al)? (a )?(car|vehicle|suv|4x4)|voitures? de location)\b/],
  ["personnel", /\b(mise [àa] disposition de personnel|personnel|main[- ]d'?(oe|œ)uvre|staffing|manpower|manutentionnaires?|int[ée]rim)\b/],
  ["hiab", /\b(hiab|grue|grues|crane|levage|lifting|lever|manutention|handling|conteneurs?|containers?)\b/],
  ["pneus", /\b(pneus?|pneumatiques?|tyres?|tires?|jantes?|rims?|crevaison|puncture|[ée]quilibrage|balancing|montage|parall[ée]lisme|alignment|g[ée]om[ée]trie|regonfl\w*|inflat\w*)\b/],
  ["lubrifiants", /\b(lubrifiants?|lubricants?|huiles?|oils?|graisses?|grease|hydraulique|hydraulic)\b/],
  ["vidange", /\b(vidanges?|oil change|graissage|greasing|filtres?|filters?)\b/],
  ["transport", /\b(transport\w*|livraison|delivery|deliver|marchandises?|goods|freight|fret|cargo|camionnage|haulage|acheminer|ship|international\w*|tchad|chad|rca|gabon|congo|nigeria|cemac|suivi|tracking|yaound[ée])\b/],
  ["laverie", /\b(laverie|lavage|laver|wash\w*|nettoyage|clean\w*)\b/],
  ["pieces", /\b(pi[eè]ces?|parts?|accessoires?|accessor\w*|batteries?|plaquettes?|brake pads?|amortisseurs?)\b/],
  ["garage", /\b(garage|m[ée]cani\w*|mechanic\w*|r[ée]paration|repair\w*|entretien|maintenance|diagnostic\w*|moteur|engine|panne|breakdown|frein\w*|brakes?|embrayage|clutch)\b/],
  ["prestations", /\b(prestations?|industriel\w*|industrial|entreprises?|business|soci[ée]t[ée]s?|flottes?|fleet|contrat|contract)\b/],
];
const serviceIn = (t) => { for (const [id, re] of SVC_WORDS) if (re.test(t)) return SERVICES.find((s) => s.id === id); return null; };

const INTENTS = [
  { id: "greet", re: /^\s*(bonjour|bonsoir|salut|bjr|hello|hi|hey|good (morning|afternoon|evening)|coucou|yo|allo)\b/, w: 3,
    a: (L) => L === "fr" ? pick(["Bonjour ! 😊 Bienvenue chez TP & Fils. Dites-moi ce dont vous avez besoin : pneus, vidange, garage, transport, camion grue…", "Bonjour et bienvenue ! On est ensemble 🤝 Comment puis-je vous aider aujourd'hui ?"]) : pick(["Hello! 😊 Welcome to TP & Fils. Tell me what you need: tires, oil change, garage, transport, crane truck…", "Hi and welcome! How can I help you today?"]) },
  { id: "thanks", re: /\b(merci|thanks?|thank you|thx|super|parfait|perfect|great|cool|d'accord|ok merci)\b/, w: 2,
    a: (L) => L === "fr" ? pick(["Avec plaisir ! On est ensemble 🤝 Autre chose ?", "Je vous en prie ! N'hésitez pas si vous avez une autre question.", "C'est nous qui vous remercions ! À bientôt chez TP & Fils."]) : pick(["My pleasure! Anything else?", "You're welcome! Feel free to ask anything else.", "Thank you! See you soon at TP & Fils."]) },
  { id: "services", re: /\b(services?|offrez|proposez|faites|activit[ée]s?|que faites|what do you (do|offer)|offer|menu|catalogue)\b/, w: 2.5,
    a: (L) => `${L === "fr" ? "Voici ce que nous faisons, pour véhicules légers <b>et</b> poids lourds :" : "Here's what we do, for cars <b>and</b> heavy trucks:"}<ul>${SERVICES.map((s) => `<li><b>${esc(s[L].name)}</b> : ${esc(s[L].short)}</li>`).join("")}</ul>${L === "fr" ? "Lequel vous intéresse ?" : "Which one interests you?"}` },
  { id: "price", re: /\b(prix|tarifs?|co[uû]te?|combien|price|prices|cost|how much|devis|quote|cotation|r[ée]duction|discount|promo)\b/, w: 3,
    a: (L, c) => (L === "fr"
      ? `Nos prix dépendent ${c.svc?.id === "pneus" ? "de la <b>dimension</b> et de la marque du pneu (la dimension est écrite sur le flanc, par ex. 315/80 R22.5)" : c.svc?.id === "transport" ? "de la <b>marchandise</b>, du tonnage et de la destination" : c.svc?.id === "hiab" ? "du <b>poids à lever</b>, de la durée et du lieu d'intervention" : "du véhicule, de la pièce ou du volume"}. Pour un prix juste et rapide, envoyez-nous les détails sur WhatsApp : nos équipes vous répondent avec un devis. Je préfère ne pas vous donner un chiffre au hasard 🙂`
      : `Our prices depend on ${c.svc?.id === "pneus" ? "the <b>tire size</b> and brand (the size is printed on the sidewall, e.g. 315/80 R22.5)" : c.svc?.id === "transport" ? "the <b>goods</b>, tonnage and destination" : c.svc?.id === "hiab" ? "the <b>weight to lift</b>, duration and job site" : "the vehicle, part or volume"}. For a fair, fast price, send us the details on WhatsApp and our team will reply with a quote. I'd rather not guess a number 🙂`) + contactBtns(L, c.svc ? svcName(c.svc, L) : (L === "fr" ? "un devis" : "a quote")) },
  { id: "where", re: /\b(o[uù] (êtes|etes|se trouve)|adresse|address|located|location|localisation|situ[ée]s?|itin[ée]raire|directions?|map|carte|plan|where|trouver|venir)\b/, w: 3,
    a: (L) => `${L === "fr" ? "Nous sommes dans la" : "We're in the"} <b>${esc(BIZ.address[L])}</b>.<br>${L === "fr" ? "Boîte postale" : "P.O. Box"} : ${esc(BIZ.po)}${L === "fr" ? "<br>Passez nous voir, les camions y accèdent facilement !" : "<br>Come see us, trucks get in easily!"}<div class="chat-actions"><a class="chat-btn" href="${BIZ.maps}" target="_blank" rel="noopener">${T[L].map} ↗</a></div>` },
  { id: "hours", re: /\b(horaires?|heures?|ouvert\w*|ferm\w*|hours?|open\w*|clos\w*|samedi|dimanche|saturday|sunday|week-?end|aujourd'hui|today|demain|tomorrow)\b/, w: 3,
    a: (L) => `${esc(BIZ.hours[L])}. ${L === "fr" ? "En dehors de ces heures ou en cas d'urgence, appelez-nous ou laissez un message WhatsApp." : "Outside these hours or in an emergency, call us or leave a WhatsApp message."}${contactBtns(L)}` },
  { id: "contact", re: /\b(contact\w*|t[ée]l[ée]phone|phone|num[ée]ro|number|appeler|call|joindre|reach|whatsapp|wa|email|e-mail|mail|courriel|joignable)\b/, w: 3,
    a: (L) => `📞 ${BIZ.phones.map((p) => `<a href="tel:${p.tel}">${p.label}</a>`).join(" · ")}<br>💬 WhatsApp : <a href="${wa(L === "fr" ? "Bonjour TP & Fils" : "Hello TP & Fils")}" target="_blank" rel="noopener">${BIZ.phones.find((p) => p.whatsapp).label}</a><br>✉️ <a href="mailto:${BIZ.email}">${BIZ.email}</a>${contactBtns(L)}` },
  { id: "founder", re: /\b(fondateur|founder|directeur|dg|patron|boss|owner|propri[ée]taire|talla|ceo|pdg|g[ée]rant)\b/, w: 3.2,
    a: (L) => L === "fr" ? `TP & FILS Services SARL a été fondée en ${BIZ.founded} par <b>M. ${FOUNDER.name}</b>, ${FOUNDER.fr.role}. Sous sa direction, l'entreprise est devenue une référence dans le transport, la logistique et les services au Port de Douala. Sa vision : un partenaire de confiance qui gère tout sous un même toit, des pneumatiques jusqu'au dédouanement.` : `TP & FILS Services SARL was founded in ${BIZ.founded} by <b>Mr. ${FOUNDER.name}</b>, ${FOUNDER.en.role}. Under his leadership, the company has become a reference in transport, logistics and services at the Port of Douala. His vision: a trusted partner that handles everything under one roof, from tires to customs clearance.` },
  { id: "about", re: /\b(qui (êtes|etes)|about|histoire|history|depuis|since|founded|cr[ée][ée]e?|fond[ée]e?|entreprise|company|employ[ée]s|staff|exp[ée]rience)\b/, w: 2.2,
    a: (L) => L === "fr" ? `<b>TP & FILS Services SARL</b> a été fondée en <b>${BIZ.founded}</b> à Douala par M. ${FOUNDER.name}, avec aujourd'hui une équipe de 11 à 50 personnes. Installés en zone portuaire, nous sommes spécialistes en pneumatique et nous accompagnons particuliers, transporteurs et entreprises : transport routier national et international, logistique et entreposage, dédouanement, camions Hiab, lubrifiants, garage, location de véhicules et plus encore. ${esc(BIZ.tagline.fr)}` : `<b>TP & FILS Services SARL</b> was founded in <b>${BIZ.founded}</b> in Douala by Mr. ${FOUNDER.name} and today has a team of 11–50 people. Based in the port zone, we're tire specialists and we serve individuals, hauliers and businesses: national and international road freight, logistics and warehousing, customs clearance, Hiab crane trucks, lubricants, garage, vehicle rental and more. ${esc(BIZ.tagline.en)}` },
  { id: "rating", re: /\b(avis|reviews?|note|rating|fiable|reliable|confiance|trust|s[ée]rieux|serious|recommand\w*)\b/, w: 2.4,
    a: (L) => L === "fr" ? `Nos clients nous notent <b>${BIZ.rating.score}/5 sur Google</b> ⭐ Depuis ${BIZ.founded}, notre priorité reste la même : votre satisfaction. Vous êtes client ? Un avis Google nous aide beaucoup 🙏` : `Customers rate us <b>${BIZ.rating.scoreEn}/5 on Google</b> ⭐ Since ${BIZ.founded}, our priority hasn't changed: your satisfaction. Already a customer? A Google review helps us a lot 🙏` },
  { id: "pay", re: /\b(paiement|payer|payment|pay|mobile money|momo|orange money|om|esp[eè]ces|cash|carte|card|ch[eè]que|virement|transfer|cr[ée]dit|facture|invoice)\b/, w: 2.6,
    a: (L) => (L === "fr" ? "Pour les moyens de paiement et la facturation (particuliers comme entreprises), le plus simple est de voir directement avec nos équipes : elles vous confirment tout rapidement." : "For payment methods and invoicing (individuals or companies), it's easiest to check directly with our team: they'll confirm everything quickly.") + contactBtns(L, L === "fr" ? "le paiement" : "payment") },
  { id: "jobs", re: /\b(emploi|recrut\w*|job|jobs|travail|stage|internship|cv|candidature|hiring|career|carri[eè]re|postuler|apply)\b/, w: 3,
    a: (L) => L === "fr" ? `Merci de votre intérêt pour TP & Fils ! Envoyez votre CV et une lettre de motivation à <a href="mailto:${BIZ.email}?subject=Candidature">${BIZ.email}</a>, en précisant le poste visé (mécanicien, chauffeur, etc.).` : `Thanks for your interest in TP & Fils! Send your CV and a cover letter to <a href="mailto:${BIZ.email}?subject=Job%20application">${BIZ.email}</a>, stating the role you're interested in (mechanic, driver, etc.).` },
  { id: "urgent", re: /\b(urgent\w*|urgence|emergency|vite|asap|maintenant|right now|bloqu[ée]|stuck|en panne|broke down|crev[ée]|flat)\b/, w: 3.2,
    a: (L) => (L === "fr" ? "Pas de panique, on est là 🙏 Appelez-nous directement ou écrivez sur WhatsApp en indiquant votre véhicule, le problème et votre position : nos équipes voient ce qu'elles peuvent faire au plus vite." : "Don't worry, we're here 🙏 Call us directly or message us on WhatsApp with your vehicle, the problem and your location: our team will see what they can do as fast as possible.") + contactBtns(L, L === "fr" ? "une urgence" : "an emergency") },
];

function detectLang(text, siteLang) {
  const t = ` ${text.toLowerCase()} `;
  const en = (t.match(/\b(the|you|your|do|does|how|what|where|when|is|are|can|i|my|price|hours|truck|tires?|rent|thanks|hello|hi)\b/g) || []).length;
  const fr = (t.match(/\b(le|la|les|vous|votre|vos|est|sont|quel|quels|quelle|comment|combien|où|ou|je|mon|ma|bonjour|merci|des|une|un|pneus?|camion)\b/g) || []).length;
  if (en > fr && en >= 2) return "en";
  if (fr > en && fr >= 1) return "fr";
  return siteLang;
}

/** Answer one message. ctx remembers the last service mentioned, for follow-ups ("et le prix ?"). */
export function reply(text, ctx = {}, siteLang = "fr") {
  const L = detectLang(text, siteLang);
  const t = ` ${text.toLowerCase().replace(/[’']/g, "'")} `;
  const svc = serviceIn(t);
  const c = { ...ctx, svc: svc || ctx.svc || null, lang: L };
  let best = null, score = 0;
  for (const it of INTENTS) if (it.re.test(t) && it.w > score) { best = it; score = it.w; }

  // a service named, and no stronger intent → explain the service
  if (svc && (!best || ["services", "about", "thanks"].includes(best.id))) {
    const s = svc[L];
    return { html: `<b>${esc(s.name)}</b><p>${esc(s.body)}</p>${contactBtns(L, s.name)}<div class="chat-actions"><a class="chat-btn chat-btn--ghost" href="#svc-${svc.id}" data-open-service="${svc.id}">${T[L].more}</a></div>`, chips: L === "fr" ? ["Et le prix ?", "Où êtes-vous ?", "Horaires"] : ["What about price?", "Where are you?", "Opening hours"], ctx: c, lang: L };
  }
  if (best) return { html: best.a(L, c), chips: CHIPS[L].after, ctx: c, lang: L };

  // an FAQ question that shares words with the message
  const words = t.split(/\W+/).filter((w) => w.length > 4);
  const f = FAQ.find((q) => words.filter((w) => q[L][0].toLowerCase().includes(w)).length >= 2);
  if (f) return { html: esc(f[L][1]), chips: CHIPS[L].after, ctx: c, lang: L };

  return { html: (L === "fr" ? "Je ne suis pas sûr de bien comprendre, et je préfère ne pas vous dire n'importe quoi 🙂 Nos équipes peuvent vous répondre directement :" : "I'm not sure I understood, and I'd rather not guess 🙂 Our team can answer you directly:") + contactBtns(L) + (L === "fr" ? "<br>Vous pouvez aussi me demander : nos services, les prix, notre adresse, nos horaires, la location de camions grue…" : "<br>You can also ask me about: our services, prices, our address, opening hours, crane truck rental…"), chips: CHIPS[L].start, ctx: c, lang: L };
}

// ---------------------------------------------------------------- chat widget
export function mountAssistant(getLang) {
  const root = document.getElementById("assistant");
  let ctx = {}, opened = false;
  const $ = (id) => document.getElementById(id);
  const render = () => {
    const L = getLang();
    root.querySelector(".asst-fab span").innerHTML = `${T[L].fab} <b>${L === "fr" ? "Discutons" : "Let's chat"}</b>`;
    root.querySelector(".asst-head b").textContent = T[L].title;
    root.querySelector(".asst-head small").textContent = T[L].sub;
    $("asstIn").placeholder = T[L].placeholder;
    root.querySelector(".asst-note").textContent = T[L].note;
  };
  root.innerHTML = `
    <button class="asst-fab" id="asstFab" aria-label="Chat"><img src="assets/img/favicon.png" alt="" /><span></span></button>
    <section class="asst-panel" id="asstPanel" role="dialog" aria-label="Assistant" hidden>
      <header class="asst-head"><img src="assets/img/favicon.png" alt="" /><div><b></b><small></small></div><button class="asst-x" id="asstClose" aria-label="Fermer">×</button></header>
      <div class="asst-log" id="asstLog" aria-live="polite"></div>
      <div class="asst-chips" id="asstChips"></div>
      <form class="asst-form" id="asstForm"><input id="asstIn" autocomplete="off" aria-label="Message" /><button aria-label="Envoyer">➤</button></form>
      <p class="asst-note"></p>
    </section>`;
  render();
  const log = $("asstLog");
  const add = (who, html) => { const d = document.createElement("div"); d.className = `msg msg--${who}`; d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; };
  const chips = (list) => { $("asstChips").innerHTML = (list || []).map((x) => `<button type="button">${esc(x)}</button>`).join(""); };
  const ask = (text) => {
    if (!text.trim()) return;
    add("me", esc(text)); chips([]);
    const typing = add("bot", `<span class="typing"><i></i><i></i><i></i></span>`);
    const r = reply(text, ctx, getLang()); ctx = r.ctx;
    setTimeout(() => { typing.innerHTML = r.html; log.scrollTop = log.scrollHeight; chips(r.chips); }, 450 + Math.min(900, r.html.length));
  };
  const open = () => {
    $("asstPanel").hidden = false; root.classList.add("is-open");
    if (!opened) { opened = true; const L = getLang(); add("bot", T[L].hello); chips(CHIPS[L].start); }
    setTimeout(() => $("asstIn").focus(), 50);
  };
  $("asstFab").onclick = open;
  $("asstClose").onclick = () => { $("asstPanel").hidden = true; root.classList.remove("is-open"); };
  $("asstForm").onsubmit = (e) => { e.preventDefault(); const v = $("asstIn").value; $("asstIn").value = ""; ask(v); };
  $("asstChips").onclick = (e) => { const b = e.target.closest("button"); if (b) ask(b.textContent); };
  log.addEventListener("click", (e) => { const a = e.target.closest("[data-open-service]"); if (a) { e.preventDefault(); window.dispatchEvent(new CustomEvent("open-service", { detail: a.dataset.openService })); } });
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-ask]"); if (b) { open(); ask(b.dataset.ask); } });
  return { open, ask, render };
}
