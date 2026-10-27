// Contact actions without showing numbers or email on the page.
// Buttons carry data-contact="wa" | "call" | "mail" (+ optional data-msg, data-subject, data-line).
// The numbers and the email are assembled only when someone clicks, so they never appear in the page
// text or HTML (keeps them away from spam bots that scrape websites).
const parts = {
  wa: ["237", "677", "51", "32", "48"],                 // WhatsApp + main line
  lines: [["237", "677", "51", "32", "48"], ["237", "679", "57", "58", "21"], ["237", "697", "14", "43", "97"], ["237", "699", "51", "74", "07"]],
  mail: ["tpfilsdg", "gmail.com"],
};
const join = (a) => a.join("");

export const waUrl = (msg = "") => `https://wa.me/${join(parts.wa)}${msg ? `?text=${encodeURIComponent(msg)}` : ""}`;
export const telUrl = (line = 0) => `tel:+${join(parts.lines[line] || parts.lines[0])}`;
export const mailUrl = (subject = "", body = "") => `mailto:${parts.mail.join("@")}${subject || body ? `?${[subject && `subject=${encodeURIComponent(subject)}`, body && `body=${encodeURIComponent(body)}`].filter(Boolean).join("&")}` : ""}`;
export const lineCount = parts.lines.length;

/** Open the right app for a contact button. */
export function openContact(kind, { msg = "", subject = "", body = "", line = 0 } = {}) {
  if (kind === "wa") window.open(waUrl(msg), "_blank", "noopener");
  else if (kind === "call") location.href = telUrl(line);
  else if (kind === "mail") location.href = mailUrl(subject, body);
}

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-contact]");
  if (!el) return;
  e.preventDefault();
  openContact(el.dataset.contact, { msg: el.dataset.msg || "", subject: el.dataset.subject || "", body: el.dataset.body || "", line: Number(el.dataset.line || 0) });
});
