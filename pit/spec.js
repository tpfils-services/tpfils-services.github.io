// Tableau de bord TP & FILS : ce que le moteur commun (dash.js) affiche pour ce site. Français par défaut, anglais en option.
const EN_STATUS = { Nouveau: "New", "Contacté": "Contacted", "Devis envoyé": "Quote sent", "Gagné": "Won", Perdu: "Lost" };
window.PIT = {
  url: "https://script.google.com/macros/s/AKfycbzFXxRhDFwdWoLxueRtuXGPgMfjUCBma3QQUeSP1_1uQtZvx5AJzyvVcRt_GvuYdR_m/exec",                                                                   // URL de l'application Web Apps Script (…/exec), la même que dans js/track.js
  langs: ["fr", "en"],
  phoneCountry: { len: 9, code: "237" },                                     // numéros camerounais à 9 chiffres
  t: pitText({
    fr: { title: "Tableau de bord TP & FILS", recTitle: "Demandes de devis", search: "Rechercher nom, entreprise, téléphone…" },
    en: { title: "TP & FILS dashboard", recTitle: "Quote requests", search: "Search name, company, phone…" },
  }),

  rec: {
    statuses: ["Nouveau", "Contacté", "Devis envoyé", "Gagné", "Perdu"],
    kinds: { Nouveau: "warning", "Contacté": "info", "Devis envoyé": "info", "Gagné": "good", Perdu: "critical" },
    label: (s, L) => (L === "en" ? EN_STATUS[s] || s : s),
    filters: [
      { id: "new", label: { fr: "À traiter", en: "To handle" }, test: (o) => o.status === "Nouveau", empty: { fr: "Aucune nouvelle demande. ✓", en: "No new requests. ✓" } },
      { id: "open", label: { fr: "En cours", en: "In progress" }, test: (o) => ["Contacté", "Devis envoyé"].includes(o.status) },
      { id: "won", label: { fr: "Gagnées", en: "Won" }, test: (o) => o.status === "Gagné" },
      { id: "all", label: { fr: "Toutes", en: "All" }, test: () => true },
    ],
    search: (o) => [o.name, o.company, o.phone, o.service, o.id].join(" "),
    card(o, h) {
      const en = h.lang() === "en";
      return `<div class="rec__when"><span>${h.esc(h.day(o.at, { weekday: "short" }))}</span><b>${h.esc(h.day(o.at, { day: "numeric" }))}</b><span>${h.esc(h.day(o.at, { month: "short" }))} · ${h.esc(o.at.slice(11))}</span></div>
        <div class="rec__who">
          <h3>${h.esc(o.name)}${o.company ? ` <span class="badge">${h.esc(o.company)}</span>` : ""} ${h.statusChip(o.status)}</h3>
          <div class="rec__meta"><b>${h.esc(o.service || (en ? "Other" : "Autre"))}</b> · ${h.esc(o.phone)} · ${en ? "sent by" : "envoyé par"} ${h.esc(o.via)} · ${h.esc((o.lang || "fr").toUpperCase())}</div>
          ${o.msg ? `<p class="rec__details">${h.esc(o.msg)}</p>` : ""}
          <div class="rec__ref">${h.esc(o.id)}${o.source ? " · " + (en ? "via " : "via ") + h.esc(h.t("src")[o.source] || o.source) : ""}</div>
        </div>`;
    },
    actions(o, h) {
      const first = o.name.trim().split(/\s+/)[0], fr = (o.lang || "fr") !== "en";
      const msg = fr ? `Bonjour ${first}, ici TP & Fils Services. Merci pour votre demande de devis (${o.service || "service"}). Pouvons-nous en parler maintenant ?`
        : `Hello ${first}, this is TP & Fils Services. Thank you for your quote request (${o.service || "service"}). Can we talk about it now?`;
      return `<a class="btn btn--wa" target="_blank" rel="noopener" href="${h.waLink(o.phone, msg)}">💬 WhatsApp</a>
        <a class="btn btn--ghost" href="tel:${h.esc(o.phone.replace(/[^\d+]/g, ""))}">📞 ${h.lang() === "en" ? "Call" : "Appeler"}</a>`;
    },
  },

  tiles(st, recs, h) {
    const en = h.lang() === "en", waiting = recs.filter((o) => o.status === "Nouveau"), tp = st.cur.taps;
    const rate = st.cur.visitors ? ((st.records.cur / st.cur.visitors) * 100).toFixed(1) + " %" : "–";
    return [
      { label: en ? "New requests" : "Nouvelles demandes", value: h.n(waiting.length), alert: waiting.length > 0, go: "new", note: waiting.length ? h.chip(en ? "New" : "Nouveau", "warning") : (en ? "All handled ✓" : "Tout est traité ✓") },
      { label: en ? "Quote requests" : "Demandes de devis", value: h.n(st.records.cur), note: h.delta(st.records.cur, st.records.prev) },
      { label: en ? "Visitors" : "Visiteurs", value: h.n(st.cur.visitors), note: h.delta(st.cur.visitors, st.prev.visitors) },
      { label: en ? "Request rate" : "Taux de demande", value: rate, note: en ? "of visitors asked for a quote" : "des visiteurs ont demandé un devis" },
      { label: en ? "WhatsApp clicks" : "Clics WhatsApp", value: h.n(tp.wa), note: `${h.n(tp.call)} ${en ? "calls" : "appels"} · ${h.n(tp.mail)} e-mails` },
      { label: en ? "Assistant questions" : "Questions à l'assistant", value: h.n((tp.chat_q || 0) + (tp.chat_miss || 0)), note: `${h.n(tp.chat_miss)} ${en ? "sent to WhatsApp" : "envoyées sur WhatsApp"}` },
    ];
  },
  charts(st, h) {
    const en = h.lang() === "en", tp = st.cur.taps;
    return [
      { title: en ? "Requests by service" : "Demandes par service", sub: en ? "What clients ask for" : "Ce que les clients demandent", entries: (st.records.summary || {}).byService },
      { title: en ? "Visitors' language" : "Langue des visiteurs", sub: en ? "Share of visits" : "Part des visites", pct: true, entries: st.details.visit, label: (k) => ({ fr: "Français", en: "English" })[k] || k },
      { title: en ? "Clicks" : "Clics", sub: en ? "How visitors reached out" : "Comment les visiteurs vous contactent",
        entries: { WhatsApp: tp.wa, [en ? "Call" : "Appel"]: tp.call, "E-mail": tp.mail, [en ? "Quote form" : "Formulaire de devis"]: tp.quote, [en ? "Assistant opened" : "Assistant ouvert"]: tp.chat_open } },
    ];
  },

  // ---------- données d'exemple (?demo)
  demo() {
    let seed = 11; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const names = [["Exemple : Paul N.", "BTP Douala"], ["Exemple : Aïcha M.", ""], ["Exemple : Jean-Claude E.", "Transports Ekwalla"], ["Exemple : Marie T.", ""], ["Exemple : Samuel K.", "Chantier Bonabéri"], ["Exemple : Brice O.", "Logistique Wouri"]];
    const svcs = ["Location camion grue", "Pneus et équilibrage", "Lavage camions", "Pièces détachées", "Lubrifiants ELF", "Mobile Money (MTN / Orange)", "Location de véhicules"];
    const msgs = ["Besoin d'une grue 25 t mardi prochain à Bonabéri.", "Prix pour 6 pneus 315/80 R22.5 ?", "Lavage de 4 camions chaque semaine.", "", "Huile moteur 15W40 en fût, quel prix ?"];
    const k = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`, records = [];
    for (let i = 0; i < 20; i++) {
      const at = new Date(Date.now() - (i < 3 ? i * 0.5 : 1.5 + r() * 80) * 864e5), [name, company] = names[i % names.length], en = r() < .15;
      records.push({ id: "TP-" + k(at).slice(5).replace("-", "") + "-" + Math.random().toString(36).slice(2, 6).toUpperCase(), at: k(at) + "T" + String(8 + Math.floor(r() * 9)).padStart(2, "0") + ":" + String(Math.floor(r() * 60)).padStart(2, "0"),
        name, company, phone: "+237 6 9" + Math.floor(r() * 10) + " 00 1" + (i % 10) + " 2" + (i % 10), service: svcs[Math.floor(r() * svcs.length)], msg: msgs[Math.floor(r() * msgs.length)],
        via: r() < .8 ? "WhatsApp" : "E-mail", lang: en ? "en" : "fr", status: i < 3 ? "Nouveau" : ["Contacté", "Devis envoyé", "Gagné", "Gagné", "Perdu"][Math.floor(r() * 5)], notes: "", source: ["google", "direct", "qr", "facebook", "whatsapp"][Math.floor(r() * 5)] });
    }
    return { records };
  },
  demoStats(days, records) {
    let seed = days * 5 + 2; const r = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const k = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`, daily = [];
    for (let i = days - 1; i >= 0; i--) { const d = new Date(Date.now() - i * 864e5), v = Math.round((d.getDay() ? 22 : 9) + r() * 16); daily.push({ day: k(d), visitors: v, visits: Math.round(v * 1.2) }); }
    const vis = daily.reduce((a, d) => a + d.visitors, 0), f = days / 30, cur = records.filter((o) => o.at.slice(0, 10) >= daily[0].day), by = {};
    cur.forEach((o) => (by[o.service] = (by[o.service] || 0) + 1));
    return { cur: { visits: Math.round(vis * 1.2), visitors: vis, taps: { wa: Math.round(58 * f), call: Math.round(21 * f), mail: Math.round(6 * f), quote: cur.length, chat_open: Math.round(40 * f), chat_q: Math.round(66 * f), chat_miss: Math.round(11 * f) } },
      prev: { visits: 0, visitors: Math.round(vis * .9), taps: {} }, daily,
      sources: { google: Math.round(vis * .44), direct: Math.round(vis * .24), whatsapp: Math.round(vis * .14), facebook: Math.round(vis * .1), qr: Math.round(vis * .08) },
      devices: { phone: Math.round(vis * .82), desktop: Math.round(vis * .16), tablet: Math.round(vis * .02) },
      details: { visit: { fr: Math.round(vis * .86), en: Math.round(vis * .14) }, quote: by },
      records: { cur: cur.length, prev: Math.round(cur.length * .75), summary: { byService: by, won: cur.filter((o) => o.status === "Gagné").length } },
      chat: [["combien coûte la location d'une grue par jour", 1], ["vous faites le dépôt orange money ?", 1], ["avez-vous des pneus michelin 315/80", 0], ["où êtes-vous situés", 1], ["do you rent trucks with driver", 1], ["vous livrez à Yaoundé ?", 0]]
        .map(([q, a], i) => ({ at: k(new Date(Date.now() - i * 2.1 * 864e5)) + "T1" + i + ":1" + i, q, answered: !!a })) };
  },
};
