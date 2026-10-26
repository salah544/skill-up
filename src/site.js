/**
 * Site-wide details, in one place.
 *
 * Email — the address published site-wide, and the one contact.php sends
 * enrollment notifications to. Override with VITE_CONTACT_EMAIL only if it
 * moves; if it does, change contact.php to match, or leads will be lost.
 *
 * Phone — deliberately empty, so no phone row is rendered. A placeholder
 * `tel:` link dials a real number that belongs to someone else, so a made-up
 * one is worse than none. To publish one, add to `.env.local` (gitignored):
 *
 *   VITE_CONTACT_PHONE="+212 522 00 00 00"
 *
 * Legal — both pages are real files in public/, so they are always linked.
 */
const env = import.meta.env;

const clean = (value) => (typeof value === "string" ? value.trim() : "");

export const SITE = {
  name: "Skillup Academy",
  location: "Casablanca, Maroc",
  phone: clean(env.VITE_CONTACT_PHONE),
  email: clean(env.VITE_CONTACT_EMAIL) || "contact@skillupacademy.ma",
  legal: [
    { label: "Mentions Légales", href: "/mentions-legales.html" },
    {
      label: "Politique de Confidentialité",
      href: "/politique-confidentialite.html",
    },
  ],
};

/** RFC 3966: a tel: target is digits with an optional leading "+". */
export function telHref(phone) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
