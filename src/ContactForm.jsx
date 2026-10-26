import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

/* ── Formation Options ─────────────────────────────────────────── */
const FORMATIONS = [
  { value: "", label: "Choisir une formation…" },
  { value: "Customer Service Mastery", label: "Maîtrise du service client" },
  { value: "Telesales & Negotiation", label: "Télévente & négociation" },
  { value: "Communication Skills", label: "Compétences en communication" },
  { value: "Leadership & Management", label: "Leadership & gestion d'équipe" },
];

function CheckIcon() {
  return (
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 12.75 6 6 9-13.5"
      />
    </svg>
  );
}

/* ── Form Field ────────────────────────────────────────────────── */
function FormField({ id, label, children }) {
  return (
    <div>
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      {children}
    </div>
  );
}

/* ── Contact Form Component ────────────────────────────────────── */
const CONTACT_ENDPOINT =
  import.meta.env.VITE_CONTACT_ENDPOINT || "/contact.php";

export default function ContactForm({ selectedFormation = "" }) {
  const reduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    formation: selectedFormation || "",
    website: "", // honeypot — must stay empty
  });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (selectedFormation) {
      setFormData((prev) => ({ ...prev, formation: selectedFormation }));
      setFieldErrors((prev) => ({ ...prev, formation: undefined }));
    }
  }, [selectedFormation]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Veuillez entrer votre nom complet.";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Le nom doit contenir au moins 2 caractères.";
    }
    if (!formData.email.trim()) {
      errors.email = "Veuillez entrer votre adresse email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Format d'email invalide. Ex. vous@exemple.com";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Veuillez entrer votre numéro de téléphone.";
    } else if (formData.phone.replace(/\D/g, "").length < 7) {
      errors.phone = "Numéro invalide. Ex. +212 6XX XXX XXX";
    }
    if (!formData.formation) {
      errors.formation = "Veuillez sélectionner une formation.";
    }
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstField = ["name", "email", "phone", "formation"].find(
        (k) => errors[k]
      );
      const el = document.getElementById(firstField);
      el?.focus();
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (res.ok && data?.status === "success") {
        setStatus("success");
      } else {
        setErrorMsg(
          data?.message ||
            "Une erreur est survenue. Veuillez réessayer dans un instant."
        );
        setStatus("error");
      }
    } catch {
      setErrorMsg(
        "Erreur réseau. Vérifiez votre connexion puis réessayez."
      );
      setStatus("error");
    }
  }

  /* ── Render ────────────────────────────────────────────────── */
  return (
    <div className="relative z-10 w-full max-w-lg mx-auto">
      {/* ─ Header ─ */}
      <div className="text-center mb-10">
        <div className="section__tag">Inscription</div>
        <h2 className="section__title">Commencez votre parcours</h2>
        <p className="section__subtitle">
          Un membre de l'équipe vous recontacte sous 24&nbsp;h pour valider
          votre place.
        </p>
      </div>

      {/* Status region for screen readers */}
      <div aria-live="polite" className="sr-only">
        {status === "loading" && "Envoi en cours…"}
        {status === "success" && "Inscription réussie."}
        {status === "error" && errorMsg}
      </div>

      <AnimatePresence mode="wait">
        {status === "success" ? (
          /* ─── Success State ─── */
          <motion.div
            key="success"
            className="card p-10 flex flex-col items-center text-center gap-4"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{
              duration: reduceMotion ? 0 : 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <motion.div
              className="success-ring"
              initial={reduceMotion ? false : { scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: reduceMotion ? 0 : 0.1,
                type: "spring",
                stiffness: 320,
                damping: 18,
              }}
            >
              <CheckIcon />
            </motion.div>

            <h3 className="text-xl font-semibold">Inscription reçue</h3>

            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Merci, <strong style={{ color: "var(--text-primary)" }}>{formData.name}</strong>.
              Nous vous contactons à{" "}
              <strong style={{ color: "var(--text-primary)" }}>{formData.email}</strong>{" "}
              sous 24&nbsp;h pour confirmer votre place en{" "}
              <strong style={{ color: "var(--text-primary)" }}>{formData.formation}</strong>.
            </p>

            <button
              className="btn-ghost mt-2"
              onClick={() => {
                setStatus("idle");
                setFormData({ name: "", email: "", phone: "", formation: "", website: "" });
                setFieldErrors({});
                requestAnimationFrame(() => {
                  document.getElementById("name")?.focus();
                });
              }}
            >
              Nouvelle inscription
            </button>
          </motion.div>
        ) : (
          /* ─── Form State ─── */
          <motion.div
            key="form"
            className="card p-8 sm:p-10"
            initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{
              duration: reduceMotion ? 0 : 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-5"
              noValidate
            >
              {/* Nom Complet */}
              <FormField id="name" label="Nom complet">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="ex. Mohammed Alami"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  aria-invalid={fieldErrors.name ? true : undefined}
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                />
                {fieldErrors.name && (
                  <span id="name-error" className="field-error" role="alert">
                    {fieldErrors.name}
                  </span>
                )}
              </FormField>

              {/* Email */}
              <FormField id="email" label="Adresse email">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  spellCheck={false}
                  placeholder="vous@exemple.com"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={fieldErrors.email ? true : undefined}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                />
                {fieldErrors.email && (
                  <span id="email-error" className="field-error" role="alert">
                    {fieldErrors.email}
                  </span>
                )}
              </FormField>

              {/* Téléphone */}
              <FormField id="phone" label="Téléphone">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="+212 6XX XXX XXX"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                  aria-invalid={fieldErrors.phone ? true : undefined}
                  aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                />
                {fieldErrors.phone && (
                  <span id="phone-error" className="field-error" role="alert">
                    {fieldErrors.phone}
                  </span>
                )}
              </FormField>

              {/* Formation */}
              <FormField id="formation" label="Formation souhaitée">
                <select
                  id="formation"
                  name="formation"
                  required
                  autoComplete="off"
                  className="form-input form-select"
                  value={formData.formation}
                  onChange={handleChange}
                  aria-invalid={fieldErrors.formation ? true : undefined}
                  aria-describedby={fieldErrors.formation ? "formation-error" : undefined}
                >
                  {FORMATIONS.map((f) => (
                    <option key={f.value} value={f.value} disabled={f.value === ""}>
                      {f.label}
                    </option>
                  ))}
                </select>
                {fieldErrors.formation && (
                  <span id="formation-error" className="field-error" role="alert">
                    {fieldErrors.formation}
                  </span>
                )}
              </FormField>

              {/* Honeypot (hidden from humans & screen readers) */}
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="website">Ne remplissez pas ce champ</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {status === "error" && errorMsg && (
                  <motion.div
                    className="rounded-lg px-4 py-3 text-sm"
                    role="alert"
                    style={{
                      /* orange tint over a neutral scrim: the glass card lightens
                         the navy, and the orange text needs the darker well to
                         clear AA contrast */
                      background:
                        "linear-gradient(rgba(242, 140, 0, 0.12), rgba(242, 140, 0, 0.12)), rgba(0, 0, 0, 0.4)",
                      border: "1px solid rgba(242, 140, 0, 0.55)",
                      color: "var(--orange)",
                    }}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.2 }}
                  >
                    {errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="btn-submit mt-2"
                disabled={status === "loading"}
                whileHover={reduceMotion ? undefined : { scale: 1.01 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="spinner" aria-hidden="true" />
                    Envoi en cours…
                  </span>
                ) : (
                  "S'inscrire"
                )}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─ Footer note ─ */}
      <p
        className="text-center text-xs mt-6"
        style={{ color: "var(--text-muted)" }}
      >
        En vous inscrivant, vous acceptez nos conditions d'utilisation et notre
        politique de confidentialité.
      </p>
    </div>
  );
}
