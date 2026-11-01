// L'Assistant TP & Fils : répond aux questions des clients, en français (par défaut) ou en anglais.
// Fonctionne entièrement dans le navigateur : pas de compte, pas de clé API, pas de frais.
// Il ne répond qu'à partir de knowledge.js (les infos de l'entreprise) et n'invente jamais de prix :
// pour un tarif ou une disponibilité, il oriente vers WhatsApp ou le téléphone.
import { BIZ, SERVICES, FAQ, FOUNDER } from "./knowledge.js?v=202611011218";

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pick = (a) => a[Math.floor(Math.random() * a.length)];


// UI words
const T = {
  fr: { waBtn: "WhatsApp", call: "Appeler", mail: "E-mail", map: "Itinéraire", more: "Voir le service", placeholder: "Posez votre question…", title: "Assistant TP & Fils", sub: "Répond tout de suite · FR / EN", note: "Pour un prix exact, nos équipes vous répondent sur WhatsApp ou au téléphone.", fab: "Une question ?", hello: "Bonjour et bienvenue chez <b>TP & Fils Services</b> ! 👋 Pneus, lubrifiants, vidange, garage, transport, camions grue… Je vous oriente. Que puis-je faire pour vous ?" },
  en: { waBtn: "WhatsApp", call: "Call", mail: "Email", map: "Directions", more: "See the service", placeholder: "Ask your question…", title: "TP & Fils Assistant", sub: "Replies instantly · FR / EN", note: "For an exact price, our team answers on WhatsApp or by phone.", fab: "Questions?", hello: "Hello and welcome to <b>TP & Fils Services</b>! 👋 Tires, lubricants, oil changes, garage, transport, crane trucks… I'll point you in the right direction. How can I help?" },
};
const CHIPS = {
  fr: { start: ["Nos services", "Prix des pneus", "Location camion grue", "Où êtes-vous ?", "Horaires"], after: ["Demander un devis", "Où êtes-vous ?", "Nos services"] },
  en: { start: ["Your services", "Tire prices", "Crane truck rental", "Where are you?", "Opening hours"], after: ["Get a quote", "Where are you?", "Your services"] },
};

const contactBtns = (L, topic, question) => {
  const msg = (L === "fr" ? `Bonjour TP & Fils, je vous contacte depuis votre site web${topic ? ` au sujet de : ${topic}` : ""}.` : `Hello TP & Fils, I'm reaching out from your website${topic ? ` about: ${topic}` : ""}.`) + (question ? `\n\n${question.trim()}` : "");
  return `<div class="chat-actions"><a class="chat-btn chat-btn--wa" href="#contact" data-contact="wa" data-msg="${esc(msg)}">${T[L].waBtn}</a><a class="chat-btn chat-btn--ghost" href="#contact" data-contact="call">${T[L].call}</a><a class="chat-btn chat-btn--ghost" href="#contact" data-contact="mail">${T[L].mail}</a></div>`;
};
const svcName = (s, L) => s[L].name;

// which service is the message about?
const SVC_WORDS = [
  ["mobilemoney", /\b(mobile money|momo|orange money|om|mtn|retraits?|retirer|d[ée]p[oô]ts?|d[ée]poser|cash ?(in|out)|withdraw\w*|deposit\w*|eneo|camwater|[ée]lectricit[ée]|electricity|factures? d'(eau|[ée]lectricit[ée])|(water|electricity|power) bills?)\b/],
  ["dedouanement", /\b(d[ée]douan\w*|douanes?|customs|transit\w*|formalit[ée]s?|clearance|clear(ing)? (my |the |a )?(container|goods|cargo|shipment)s?)\b/],
  ["logistique", /\b(logistiques?|logistics|stock\w*|entrep[oô]\w*|warehous\w*|storage|magasin\w*|distribution|gestion de flux)\b/],
  ["location", /\b(location de (v[ée]hicules?|voitures?|4x4|suv)|louer (une|un) (voiture|v[ée]hicule|4x4|suv|jeep)|car rental|rent(al)? (a )?(car|vehicle|suv|4x4)|voitures? de location)\b/],
  ["personnel", /\b(mise [àa] disposition de personnel|personnel|main[- ]d'?(oe|œ)uvre|staffing|manpower|manutentionnaires?|int[ée]rim)\b/],
  ["hiab", /\b(hiab|grue|grues|crane|levage|lifting|lever|manutention|handling|conteneurs?|containers?)\b/],
  ["pneus", /\b(pneus?|pneumatiques?|tyres?|tires?|jantes?|rims?|crevaison|puncture|[ée]quilibrage|balancing|montage|parall[ée]lisme|alignment|g[ée]om[ée]trie|regonfl\w*|inflat\w*)\b/],
  ["lubrifiants", /\b(lubrifiants?|lubricants?|huiles?|oils?|graisses?|grease|hydraulique|hydraulic)\b/],
  ["vidange", /\b(vidanges?|oil change|graissage|greasing|filtres?|filters?)\b/],
  ["transport", /\b(transport\w*|livr\w*|delivery|deliver\w*|marchandises?|goods|freight|fret|cargo|camionnage|haulage|acheminer|ship|international\w*|tchad|chad|rca|gabon|congo|nigeria|cemac|suivi|tracking|tonnes?|tons?|yaound[ée]|kribi|bafoussam|garoua|ngaound[ée]r[ée]|bertoua|ebolowa|limb[ée]|buea|kumba|bamenda|maroua|edea|nkongsamba|desserv\w*)\b/],
  ["laverie", /\b(laverie|lavage|laver|wash\w*|nettoyage|clean\w*)\b/],
  ["pieces", /\b(pi[eè]ces?|parts?|accessoires?|accessor\w*|batteries?|plaquettes?|brake pads?|amortisseurs?)\b/],
  ["garage", /\b(garage|m[ée]cani\w*|mechanic\w*|r[ée]paration|repair\w*|entretien|maintenance|diagnostic\w*|moteur|engine|panne|breakdown|frein\w*|brakes?|embrayage|clutch)\b/],
  ["prestations", /\b(prestations?|industriel\w*|industrial|entreprises?|business|soci[ée]t[ée]s?|flottes?|fleet|contrat|contract)\b/],
];
// Details we can repeat back to the customer (never prices: those come from the team).
const CITIES = ["Yaoundé", "Kribi", "Bafoussam", "Garoua", "Ngaoundéré", "Bertoua", "Ebolowa", "Limbé", "Buea", "Kumba", "Bamenda", "Maroua", "Edéa", "Nkongsamba", "Douala", "N'Djamena", "Bangui", "Libreville", "Malabo", "Brazzaville", "Lagos"];
const MAKES = ["Toyota", "Mercedes", "Renault", "MAN", "Volvo", "Scania", "DAF", "Iveco", "Hyundai", "Nissan", "Mitsubishi", "Isuzu", "Sinotruk", "Howo", "Shacman", "Kia", "Peugeot", "Ford", "Land Cruiser", "Hilux", "Prado", "Actros", "Caterpillar"];
const strip = (x) => x.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
function details(raw) {
  const t = strip(raw), d = {};
  let m;
  if ((m = raw.match(/\b(\d{3}\s?\/\s?\d{2}\s?[rR]?\s?\d{2}(?:[.,]5)?|\d{2}(?:[.,]\d)?\s?[rR]\s?\d{2}(?:[.,]5)?)\b/))) d.size = m[1].replace(/\s+/g, "").replace(",", ".").toUpperCase();
  if ((m = t.match(/\b(\d+(?:[.,]\d+)?)\s*(tonnes?|tons?|t)\b/))) d.tons = m[1].replace(",", ".");
  if ((m = t.match(/\b(\d+)\s*(conteneurs?|containers?|tc)\b/))) d.containers = m[1];
  if ((m = t.match(/\b(20|40)\s*(pieds|ft|')\b/))) d.feet = m[1];
  d.city = CITIES.find((c) => new RegExp(`\\b${strip(c).replace("'", "'?")}\\b`).test(t));
  if (d.city === "Douala" && !/\b(vers|a|to|jusqu'?a|pour)\s+douala\b/.test(t)) d.city = null;
  d.make = MAKES.find((x) => new RegExp(`\\b${strip(x)}\\b`).test(t));
  if ((m = t.match(/\b(ciment|sable|bois|riz|farine|sucre|engrais|ferraille|fer|carburant|mais|cacao|cafe|coton|materiaux|cement|sand|timber|wood|rice|flour|sugar|fertili[sz]er|steel|fuel|cocoa|coffee|cotton)\b/))) d.goods = m[1];
  if ((m = t.match(/\b(total(?: quartz)?|elf|shell|mobil|castrol|motul|5w-?\d0|10w-?\d0|15w-?\d0|20w-?\d0)\b/))) d.product = /^\d/.test(m[1]) ? m[1].toUpperCase() : m[1].replace(/\b\w/g, (x) => x.toUpperCase());
  d.car = /\b(voiture|vl|vehicules? legers?|4x4|suv|cars?|pick-?up)\b/.test(t) && !/\b(camion|poids lourds?|truck|pl)\b/.test(t);
  d.truck = /\b(camion|poids lourds?|trucks?|pl|semi|remorque|tracteur)\b/.test(t);
  d.driver = /\b(chauffeur|driver)\b/.test(t);
  return d;
}

// What the team needs to answer fast, per service
const NEEDS = {
  pneus: { fr: ["la dimension (écrite sur le flanc, ex. 315/80 R22.5)", "la marque souhaitée, si vous en avez une", "la quantité"], en: ["the size (printed on the sidewall, e.g. 315/80 R22.5)", "your preferred brand, if any", "the quantity"] },
  transport: { fr: ["la marchandise et le tonnage", "le départ et la destination", "la date souhaitée"], en: ["the goods and tonnage", "pick-up and destination", "the date you need"] },
  hiab: { fr: ["le poids et le type de charge", "le lieu d'intervention", "la date et la durée"], en: ["the weight and type of load", "the job site", "the date and duration"] },
  dedouanement: { fr: ["le type de marchandise", "vos documents (connaissement, facture)", "la date d'arrivée au port"], en: ["the type of goods", "your documents (bill of lading, invoice)", "the arrival date at port"] },
  logistique: { fr: ["le volume ou le nombre de colis", "la durée de stockage", "la destination finale"], en: ["the volume or number of packages", "how long to store", "the final destination"] },
  lubrifiants: { fr: ["la référence ou la viscosité (ex. 15W-40)", "la quantité", "le véhicule ou l'engin concerné"], en: ["the product or grade (e.g. 15W-40)", "the quantity", "the vehicle or machine"] },
  vidange: { fr: ["la marque et le modèle du véhicule", "le kilométrage", "le jour où vous souhaitez passer"], en: ["the vehicle make and model", "the mileage", "the day you'd like to come"] },
  garage: { fr: ["le véhicule (marque, modèle)", "ce que vous constatez (bruit, voyant, fuite…)", "où se trouve le véhicule"], en: ["the vehicle (make, model)", "what you notice (noise, warning light, leak…)", "where the vehicle is"] },
  pieces: { fr: ["la marque, le modèle et l'année", "la pièce recherchée (une photo aide beaucoup)"], en: ["make, model and year", "the part you need (a photo helps a lot)"] },
  location: { fr: ["les dates", "le type de véhicule (berline, 4x4, SUV…)", "avec ou sans chauffeur"], en: ["the dates", "the type of vehicle (sedan, 4x4, SUV…)", "with or without a driver"] },
  personnel: { fr: ["les profils (chauffeurs, manutentionnaires, techniciens…)", "le nombre de personnes", "la durée et le lieu"], en: ["the profiles (drivers, handlers, technicians…)", "how many people", "duration and location"] },
  laverie: { fr: ["le type de véhicule"], en: ["the type of vehicle"] },
};
const b = (x) => `<b>${esc(x)}</b>`;
/** A first sentence that answers what was actually asked, using the details found. */
function lead(svc, d, L, raw) {
  const fr = L === "fr", t = strip(raw);
  switch (svc.id) {
    case "pneus": return fr
      ? `Oui, nous vendons des pneus neufs ${d.car ? "pour véhicules légers, 4x4 et utilitaires" : d.truck ? "poids lourds" : "pour véhicules légers <b>et</b> poids lourds"}, et nous les montons et équilibrons sur place.${d.size ? ` Pour la dimension ${b(d.size)}, nos équipes vérifient le stock et vous donnent le prix.` : ""}`
      : `Yes, we sell new tires for ${d.car ? "cars, 4x4s and vans" : d.truck ? "heavy trucks" : "cars <b>and</b> heavy trucks"}, with fitting and balancing on site.${d.size ? ` For size ${b(d.size)}, our team checks stock and gives you the price.` : ""}`;
    case "transport": {
      const what = [d.tons && `${d.tons} ${fr ? "tonnes" : "tons"}`, d.goods && (fr ? `de ${d.goods}` : `of ${d.goods}`)].filter(Boolean).join(" ");
      return fr
        ? `Oui, nous transportons vos marchandises par la route, partout au Cameroun et à l'international, au départ du Port de Douala.${what || d.city ? ` Pour ${what ? b(what) : "votre chargement"}${d.city ? ` vers ${b(d.city)}` : ""}, envoyez-nous les détails et nous vous faisons un devis.` : ""}`
        : `Yes, we move goods by road across Cameroon and internationally, from the Port of Douala.${what || d.city ? ` For ${what ? b(what) : "your load"}${d.city ? ` to ${b(d.city)}` : ""}, send us the details and we'll quote it.` : ""}`;
    }
    case "dedouanement": return fr
      ? `Oui, nous nous occupons du dédouanement de vos marchandises au Port de Douala${d.containers ? `, y compris pour vos ${b(d.containers + " conteneurs")}` : ""}, avec un seul interlocuteur du début à la fin.`
      : `Yes, we handle customs clearance for your goods at the Port of Douala${d.containers ? `, including your ${b(d.containers + " containers")}` : ""}, with one point of contact from start to finish.`;
    case "hiab": return fr ? `Oui, nous louons des camions équipés de grue Hiab pour lever et charger conteneurs, matériaux et équipements${d.tons ? ` (charge indiquée : ${b(d.tons + " t")})` : ""}.` : `Yes, we rent Hiab crane trucks to lift and load containers, materials and equipment${d.tons ? ` (load mentioned: ${b(d.tons + " t")})` : ""}.`;
    case "garage": {
      const part = (t.match(/\b(frein\w*|embrayage|moteur|boite|suspension|direction|batterie|demarr\w*|brakes?|clutch|engine|gearbox|battery)\b/) || [])[0];
      return fr ? `Notre garage répare les ${d.truck ? "camions" : d.car ? "véhicules légers" : "camions et véhicules légers"}${d.make ? `, ${b(d.make)} compris` : ""}${part ? `, y compris les problèmes de ${b(part)}` : ""} : diagnostic, réparation et entretien préventif.${part && /frein|brake/.test(part) ? " Par sécurité, roulez le moins possible en attendant." : ""}`
        : `Our garage repairs ${d.truck ? "trucks" : d.car ? "cars" : "trucks and cars"}${d.make ? `, ${b(d.make)} included` : ""}${part ? `, including ${b(part)} problems` : ""}: diagnostics, repairs and preventive maintenance.${part && /frein|brake/.test(part) ? " For safety, drive as little as possible until it's checked." : ""}`;
    }
    case "vidange": return fr ? `Oui, nous faisons la vidange${d.make ? ` des ${b(d.make)}` : ""} et de toutes les marques, véhicules légers et poids lourds, avec remplacement des filtres et graissage.` : `Yes, we do oil changes${d.make ? ` on ${b(d.make)}` : ""} and all makes, cars and heavy trucks, with filter replacement and greasing.`;
    case "lubrifiants": return fr ? `Nous distribuons des huiles moteur, de boîte, hydrauliques et des graisses pour VL, PL et engins.${d.product ? ` Pour ${b(d.product)}, nos équipes vous confirment la disponibilité et le prix.` : ""}` : `We distribute engine, gearbox and hydraulic oils and greases for cars, trucks and machinery.${d.product ? ` For ${b(d.product)}, our team confirms availability and price.` : ""}`;
    case "location": return fr ? `Nous louons des véhicules, dont des 4x4 et SUV, pour vos déplacements professionnels ou personnels.${d.driver ? " Besoin d'un chauffeur ? Nous proposons aussi des chauffeurs (mise à disposition de personnel) : précisez-le dans votre demande." : ""}` : `We rent vehicles, including 4x4s and SUVs, for business or personal trips.${d.driver ? " Need a driver? We also provide drivers (staffing): just mention it in your request." : ""}`;
    case "mobilemoney": return /\b(accept\w*|payer (par|avec|en)|pay (with|by|using)|regler|reglement|paiement)\b/.test(t) && !/facture|bill|eneo|camwater/.test(t)
      ? (fr ? "Nous avons un <b>point MTN Mobile Money et Orange Money</b> sur place : retrait, dépôt, factures ENEO et CAMWATER. Pour régler nos prestations par Mobile Money, nos équipes vous confirment les modalités." : "We have an <b>MTN Mobile Money and Orange Money point</b> on site: withdrawals, deposits, ENEO and CAMWATER bills. To pay for our services by Mobile Money, our team will confirm how.")
      : null;
    default: return null;
  }
}
const needsList = (svc, L) => NEEDS[svc.id] ? `<p>${L === "fr" ? "Pour une réponse rapide, envoyez-nous :" : "For a fast answer, send us:"}</p><ul>${NEEDS[svc.id][L].map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : "";
const timing = { fr: { dedouanement: "Le délai de dédouanement dépend surtout des documents et du type de marchandise : avec un dossier complet, tout va beaucoup plus vite.", transport: "Le délai dépend de la destination, du chargement et de l'état des routes.", default: "Le délai dépend de votre demande." }, en: { dedouanement: "Clearance time depends mostly on your documents and the type of goods: a complete file makes everything much faster.", transport: "Timing depends on the destination, the load and road conditions.", default: "Timing depends on your request." } };

const serviceIn = (t) => { for (const [id, re] of SVC_WORDS) if (re.test(t)) return SERVICES.find((s) => s.id === id); return null; };

const INTENTS = [
  { id: "sellcars", re: /\b(vend\w* des (voitures|vehicules|camions|vehicule)|achet\w* (une|un|des) (voiture|vehicule|camion)s?|buy (a|an) (car|truck|vehicle)|(cars?|trucks?|vehicles?) for sale|sell (cars|trucks|vehicles))\b/, w: 3.3,
    a: (L, c, raw) => (L === "fr" ? "Nous ne vendons pas de véhicules. En revanche, nous proposons la <b>location de véhicules</b> (dont 4x4 et SUV), les <b>pièces détachées</b> et tout l'entretien de vos voitures et camions." : "We don't sell vehicles. We do offer <b>vehicle rental</b> (including 4x4s and SUVs), <b>spare parts</b> and full maintenance for your cars and trucks.") + contactBtns(L, "", raw) },
  { id: "timing", re: /\b(combien de temps|quel delai|delais?|duree|how long|how many days|turnaround|en combien de jours)\b/, w: 3.5,
    a: (L, c, raw) => `${esc(timing[L][c.svc?.id] || timing[L].default)} ${L === "fr" ? "Nos équipes vous donnent une estimation précise pour votre cas." : "Our team will give you a precise estimate for your case."}${c.svc ? needsList(c.svc, L) : ""}${contactBtns(L, c.svc ? svcName(c.svc, L) : "", raw)}` },
  { id: "greet", re: /^\s*(bonjour|bonsoir|salut|bjr|hello|hi|hey|good (morning|afternoon|evening)|coucou|yo|allo)\b/, w: 3,
    a: (L) => L === "fr" ? pick(["Bonjour ! 😊 Bienvenue chez TP & Fils. Dites-moi ce dont vous avez besoin : pneus, vidange, garage, transport, camion grue…", "Bonjour et bienvenue ! On est ensemble 🤝 Comment puis-je vous aider aujourd'hui ?"]) : pick(["Hello! 😊 Welcome to TP & Fils. Tell me what you need: tires, oil change, garage, transport, crane truck…", "Hi and welcome! How can I help you today?"]) },
  { id: "thanks", re: /\b(merci|thanks?|thank you|thx|super|parfait|perfect|great|cool|d'accord|ok merci)\b/, w: 2,
    a: (L) => L === "fr" ? pick(["Avec plaisir ! On est ensemble 🤝 Autre chose ?", "Je vous en prie ! N'hésitez pas si vous avez une autre question.", "C'est nous qui vous remercions ! À bientôt chez TP & Fils."]) : pick(["My pleasure! Anything else?", "You're welcome! Feel free to ask anything else.", "Thank you! See you soon at TP & Fils."]) },
  { id: "services", re: /\b(services?|offrez|proposez|faites|activit[ée]s?|que faites|what do you (do|offer)|offer|menu|catalogue)\b/, w: 2.5,
    a: (L) => `${L === "fr" ? "Voici ce que nous faisons, pour véhicules légers <b>et</b> poids lourds :" : "Here's what we do, for cars <b>and</b> heavy trucks:"}<ul>${SERVICES.map((s) => `<li><b>${esc(s[L].name)}</b> : ${esc(s[L].short)}</li>`).join("")}</ul>${L === "fr" ? "Lequel vous intéresse ?" : "Which one interests you?"}` },
  { id: "price", re: /\b(prix|tarifs?|co[uû]te?|combien|price|prices|cost|how much|devis|quote|cotation|r[ée]duction|discount|promo)\b/, w: 3,
    a: (L, c, raw) => (L === "fr"
      ? `Nos prix dépendent ${c.svc?.id === "pneus" ? "de la <b>dimension</b> et de la marque du pneu (la dimension est écrite sur le flanc, par ex. 315/80 R22.5)" : c.svc?.id === "transport" ? "de la <b>marchandise</b>, du tonnage et de la destination" : c.svc?.id === "hiab" ? "du <b>poids à lever</b>, de la durée et du lieu d'intervention" : "du véhicule, de la pièce ou du volume"}. Pour un prix juste et rapide, envoyez-nous les détails sur WhatsApp : nos équipes vous répondent avec un devis. Je préfère ne pas vous donner un chiffre au hasard 🙂`
      : `Our prices depend on ${c.svc?.id === "pneus" ? "the <b>tire size</b> and brand (the size is printed on the sidewall, e.g. 315/80 R22.5)" : c.svc?.id === "transport" ? "the <b>goods</b>, tonnage and destination" : c.svc?.id === "hiab" ? "the <b>weight to lift</b>, duration and job site" : "the vehicle, part or volume"}. For a fair, fast price, send us the details on WhatsApp and our team will reply with a quote. I'd rather not guess a number 🙂`) + contactBtns(L, c.svc ? svcName(c.svc, L) : (L === "fr" ? "un devis" : "a quote"), raw) },
  { id: "where", re: /\b(o[uù] (êtes|etes|se trouve)|adresse|address|located|location|localisation|situ[ée]s?|itin[ée]raire|directions?|map|carte|plan|where|trouver|venir)\b/, w: 3,
    a: (L) => `${L === "fr" ? "Nous sommes dans la" : "We're in the"} <b>${esc(BIZ.address[L])}</b>.<br>${L === "fr" ? "Boîte postale" : "P.O. Box"} : ${esc(BIZ.po)}${L === "fr" ? "<br>Passez nous voir, les camions y accèdent facilement !" : "<br>Come see us, trucks get in easily!"}<div class="chat-actions"><a class="chat-btn" href="${BIZ.maps}" target="_blank" rel="noopener">${T[L].map} ↗</a></div>` },
  { id: "hours", re: /\b(horaires?|heures?|ouvert\w*|ferm\w*|hours?|open\w*|clos\w*|samedi|dimanche|saturday|sunday|week-?end|aujourd'hui|today|demain|tomorrow)\b/, w: 3,
    a: (L) => `${esc(BIZ.hours[L])}. ${L === "fr" ? "En dehors de ces heures ou en cas d'urgence, appelez-nous ou laissez un message WhatsApp." : "Outside these hours or in an emergency, call us or leave a WhatsApp message."}${contactBtns(L)}` },
  { id: "contact", re: /\b(contact\w*|t[ée]l[ée]phone|phone|num[ée]ro|number|appeler|call|joindre|reach|whatsapp|wa|email|e-mail|mail|courriel|joignable)\b/, w: 3,
    a: (L) => (L === "fr" ? "Le plus rapide, c'est WhatsApp 💬 Vous pouvez aussi nous appeler ou nous écrire un e-mail : touchez un bouton ci-dessous, votre application s'ouvre directement." : "WhatsApp is fastest 💬 You can also call or email us: tap a button below and your app opens directly.") + contactBtns(L) },
  { id: "founder", re: /\b(fondateur|founder|directeur|dg|patron|boss|owner|propri[ée]taire|talla|ceo|pdg|g[ée]rant)\b/, w: 3.2,
    a: (L) => L === "fr" ? `TP & FILS Services SARL a été fondée en ${BIZ.founded} par <b>M. ${FOUNDER.name}</b>, ${FOUNDER.fr.role}. Sous sa direction, l'entreprise est devenue une référence dans le transport, la logistique et les services au Port de Douala. Sa vision : un partenaire de confiance qui gère tout sous un même toit, des pneumatiques jusqu'au dédouanement.` : `TP & FILS Services SARL was founded in ${BIZ.founded} by <b>Mr. ${FOUNDER.name}</b>, ${FOUNDER.en.role}. Under his leadership, the company has become a reference in transport, logistics and services at the Port of Douala. His vision: a trusted partner that handles everything under one roof, from tires to customs clearance.` },
  { id: "about", re: /\b(qui (êtes|etes)|about|histoire|history|depuis|since|founded|cr[ée][ée]e?|fond[ée]e?|entreprise|company|employ[ée]s|staff|exp[ée]rience)\b/, w: 2.2,
    a: (L) => L === "fr" ? `<b>TP & FILS Services SARL</b> a été fondée en <b>${BIZ.founded}</b> à Douala par M. ${FOUNDER.name}, et compte aujourd'hui plus de 55 collaborateurs. Installés en zone portuaire, nous sommes spécialistes en pneumatique et nous accompagnons particuliers, transporteurs et entreprises : transport routier national et international, logistique et entreposage, dédouanement, camions Hiab, lubrifiants, garage, location de véhicules, point MTN et Orange Money, et plus encore. ${esc(BIZ.tagline.fr)}` : `<b>TP & FILS Services SARL</b> was founded in <b>${BIZ.founded}</b> in Douala by Mr. ${FOUNDER.name} and today has a team of 55+ professionals. Based in the port zone, we're tire specialists and we serve individuals, hauliers and businesses: national and international road freight, logistics and warehousing, customs clearance, Hiab crane trucks, lubricants, garage, vehicle rental and more. ${esc(BIZ.tagline.en)}` },
  { id: "rating", re: /\b(avis|reviews?|note|rating|fiable|reliable|confiance|trust|s[ée]rieux|serious|recommand\w*)\b/, w: 2.4,
    a: (L) => L === "fr" ? `Nos clients nous notent <b>${BIZ.rating.score}/5 sur Google</b> ⭐ Depuis ${BIZ.founded}, notre priorité reste la même : votre satisfaction. Vous êtes client ? Un avis Google nous aide beaucoup 🙏` : `Customers rate us <b>${BIZ.rating.scoreEn}/5 on Google</b> ⭐ Since ${BIZ.founded}, our priority hasn't changed: your satisfaction. Already a customer? A Google review helps us a lot 🙏` },
  { id: "pay", re: /\b(paiement|payer|payment|pay|mobile money|momo|orange money|om|esp[eè]ces|cash|carte|card|ch[eè]que|virement|transfer|cr[ée]dit|facture|invoice)\b/, w: 2.6,
    a: (L) => (L === "fr" ? "Pour les moyens de paiement et la facturation (particuliers comme entreprises), le plus simple est de voir directement avec nos équipes : elles vous confirment tout rapidement." : "For payment methods and invoicing (individuals or companies), it's easiest to check directly with our team: they'll confirm everything quickly.") + contactBtns(L, L === "fr" ? "le paiement" : "payment") },
  { id: "jobs", re: /\b(emploi|recrut\w*|job|jobs|travail|stage|internship|cv|candidature|hiring|career|carri[eè]re|postuler|apply)\b/, w: 3,
    a: (L) => L === "fr" ? `Merci de votre intérêt pour TP & Fils ! Envoyez votre CV et une lettre de motivation par e-mail, en précisant le poste visé (mécanicien, chauffeur, etc.).<div class="chat-actions"><a class="chat-btn" href="#contact" data-contact="mail" data-subject="Candidature">Envoyer ma candidature</a></div>` : `Thanks for your interest in TP & Fils! Send your CV and a cover letter by email, stating the role you're interested in (mechanic, driver, etc.).<div class="chat-actions"><a class="chat-btn" href="#contact" data-contact="mail" data-subject="Job application">Send my application</a></div>` },
  { id: "urgent", re: /\b(urgent\w*|urgence|emergency|vite|asap|maintenant|right now|bloque[es]?|stuck|en panne|tombe en panne|broke down|creve|crevaison|flat tire|sur la route|autoroute|on the road|highway)\b/, w: 3.4,
    a: (L, c, raw) => (L === "fr" ? "Pas de panique, on est là 🙏 <b>Appelez-nous directement</b> ou écrivez sur WhatsApp en indiquant <b>votre véhicule, le problème et votre position exacte</b> : nos équipes voient ce qu'elles peuvent faire au plus vite." : "Don't worry, we're here 🙏 <b>Call us directly</b> or message us on WhatsApp with <b>your vehicle, the problem and your exact location</b>: our team will see what they can do as fast as possible.") + contactBtns(L, L === "fr" ? "une urgence" : "an emergency", raw) },
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
  const t = ` ${strip(text).replace(/[’']/g, "'")} `; // accents removed so "crevé" matches like "creve"
  const svc = serviceIn(t), d = details(text);
  const c = { ...ctx, svc: svc || ctx.svc || null, lang: L };
  let best = null, score = 0;
  for (const it of INTENTS) if (it.id !== "greet" && it.re.test(t) && it.w > score) { best = it; score = it.w; }
  const GREET = INTENTS.find((i) => i.id === "greet"), greeted = GREET.re.test(t);
  const hi = greeted && (svc || best) ? (L === "fr" ? "Bonjour ! 😊 " : "Hello! 😊 ") : "";

  // a service is named: answer about it, using the details in the message
  const combinable = ["services", "about", "thanks", "price", "where", "pay"];
  if (svc && (!best || combinable.includes(best.id)) && !(best?.id === "where" && !/livr|deliver|desserv|vous allez|do you go/.test(t))) {
    const s = svc[L], first = lead(svc, d, L, text);
    const price = best?.id === "price" && svc.id !== "mobilemoney"
      ? `<p>${L === "fr" ? "Côté prix, je préfère ne pas vous donner un chiffre au hasard 🙂 Il dépend de votre demande exacte : nos équipes vous répondent vite avec un devis." : "On price, I'd rather not guess a number 🙂 It depends on your exact request: our team replies quickly with a quote."}</p>` : "";
    return {
      html: `${hi}<b>${esc(s.name)}</b><p>${first || esc(s.body)}</p>${price}${needsList(svc, L)}${contactBtns(L, s.name, text)}<div class="chat-actions"><a class="chat-btn chat-btn--ghost" href="#svc-${svc.id}" data-open-service="${svc.id}">${T[L].more}</a></div>`,
      chips: L === "fr" ? ["Et le prix ?", "Quel délai ?", "Où êtes-vous ?"] : ["What about price?", "How long does it take?", "Where are you?"], ctx: c, lang: L,
    };
  }
  if (best) return { html: hi + best.a(L, c, text), chips: CHIPS[L].after, ctx: c, lang: L };
  if (greeted) return { html: GREET.a(L, c), chips: CHIPS[L].start, ctx: c, lang: L };

  // an FAQ question that shares words with the message
  const words = t.split(/\W+/).filter((w) => w.length > 4);
  const f = FAQ.find((q) => words.filter((w) => strip(q[L][0]).includes(w)).length >= 2);
  if (f) return { html: esc(f[L][1]), chips: CHIPS[L].after, ctx: c, lang: L };

  return { html: (L === "fr" ? "Je ne suis pas sûr de bien comprendre, et je préfère ne pas vous dire n'importe quoi 🙂 Envoyez votre question à nos équipes, elles vous répondent directement :" : "I'm not sure I understood, and I'd rather not guess 🙂 Send your question to our team, they'll answer you directly:") + contactBtns(L, "", text) + (L === "fr" ? "<br>Vous pouvez aussi me demander : nos services, les prix, notre adresse, nos horaires, la location de camions grue…" : "<br>You can also ask me about: our services, prices, our address, opening hours, crane truck rental…"), chips: CHIPS[L].start, ctx: c, lang: L };
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
