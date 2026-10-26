import { useState, useEffect, useRef, Fragment } from "react";
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from "motion/react";
import ContactForm from "./ContactForm";
import CareerSimulator from "./CareerSimulator";
import { SITE, telHref } from "./site";

/* ═══════════════════════════════════════════════════════════════════
   ICONS (inline SVGs) & SCROLL PROGRESS
   ═══════════════════════════════════════════════════════════════════ */

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;
  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX: scrollYProgress }}
      aria-hidden="true"
    />
  );
}

function BrandLogo({ height = 34, className = "" }) {
  const width = Math.round(height * 3.05);
  return (
    <div className={`brand-logo-pill ${className}`}>
      <img
        src="/logo.png"
        alt="Skillup Academy"
        className="brand-logo-img"
        style={{ height: `${height}px`, width: "auto" }}
        width={width}
        height={height}
        loading="eager"
      />
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#f28c00" stroke="none" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

/* Feature Icons */
function GraduationIcon() {
  return (
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
    </svg>
  );
}

function CertificateIcon() {
  return (
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
  );
}

function PhoneFooterIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
    </svg>
  );
}

function EmailFooterIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ANIMATION HELPERS (motion.dev)
   ═══════════════════════════════════════════════════════════════════ */

const easeOut = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut },
  },
};

const stagger = (delay = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: delay },
  },
});

function Section({ children, id, className = "" }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id={id}
      className={className}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
    >
      {children}
    </motion.section>
  );
}

function SectionHeader({ tag, title, subtitle }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="section__header"
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={stagger()}
    >
      <motion.span className="section__tag" variants={fadeUp}>
        {tag}
      </motion.span>
      <motion.h2 className="section__title" variants={fadeUp}>
        {title}
      </motion.h2>
      <motion.p className="section__subtitle" variants={fadeUp}>
        {subtitle}
      </motion.p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════════════════════ */

const NAV_LINKS = [
  { label: "Accueil", href: "#hero" },
  { label: "À Propos", href: "#about" },
  { label: "Simulateur", href: "#simulator" },
  { label: "Formations", href: "#courses" },
  { label: "Témoignages", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    menuRef.current?.querySelector("a")?.focus();
    // stop the page scrolling behind the open menu
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  function closeMenuTo(href) {
    setMobileOpen(false);
    const id = href.slice(href.indexOf("#") + 1);
    requestAnimationFrame(() => {
      const target = document.getElementById(id);
      if (!target) return;
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  }

  return (
    <nav
      className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}
      aria-label="Navigation principale"
    >
      <div className="navbar__inner">
        <a href="#hero" className="navbar__logo" aria-label="Skillup Academy — Accueil">
          <BrandLogo height={44} />
        </a>

        {/* Desktop links */}
        <div className="navbar__links">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="navbar__link">
              {link.label}
            </a>
          ))}
          <a href="#contact" className="btn-primary btn-primary--sm">
            S'inscrire
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          ref={toggleRef}
          className="navbar__hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
          aria-expanded={mobileOpen}
          aria-controls={mobileOpen ? "mobile-menu" : undefined}
        >
          <span className={`hamburger-line ${mobileOpen ? "open" : ""}`} />
          <span className={`hamburger-line ${mobileOpen ? "open" : ""}`} />
          <span className={`hamburger-line ${mobileOpen ? "open" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            ref={menuRef}
            className="navbar__mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: easeOut }}
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="navbar__mobile-link"
                onClick={() => closeMenuTo(link.href)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="btn-primary btn-primary--sm"
              style={{ width: "100%", textAlign: "center", marginTop: "8px" }}
              onClick={() => closeMenuTo("#contact")}
            >
              S'inscrire
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   HERO SECTION
   ═══════════════════════════════════════════════════════════════════ */

function Hero() {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const watermarkY = useTransform(scrollY, [0, 600], [0, 100]);
  const watermarkOpacity = useTransform(scrollY, [0, 500], [0.16, 0.03]);
  const statsY = useTransform(scrollY, [0, 450], [0, 20]);

  const container = reduceMotion ? {} : stagger(0.15);

  return (
    <section id="hero" className="hero">
      <div className="hero__bg" aria-hidden="true">
        <img src="/hero-bg.jpg" alt="" width="1920" height="1080" className="hero__bg-img" />
        <div className="hero__bg-glow" />
        <motion.div
          className="hero__bg-watermark"
          style={reduceMotion ? undefined : { y: watermarkY, opacity: watermarkOpacity }}
        >
          <img
            src="/logo-watermark-2x.png"
            alt=""
            className="hero__bg-logo"
            width="1710"
            height="560"
            loading="eager"
          />
        </motion.div>
        <div className="hero__overlay" />
      </div>

      <motion.div
        className="hero__content"
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        variants={container}
      >
        <motion.div className="hero__badge" variants={fadeUp}>
          Les inscriptions sont ouvertes
        </motion.div>

        <motion.h1 className="hero__title" variants={fadeUp}>
          Développez vos compétences,
          <br />
          transformez votre carrière.
        </motion.h1>

        <motion.p className="hero__subtitle" variants={fadeUp}>
          Rejoignez <strong>Skillup Academy</strong> et accédez à des formations
          professionnelles en service client, télévente, communication et
          leadership.
        </motion.p>

        <motion.div className="hero__actions" variants={fadeUp}>
          <motion.a
            href="#contact"
            className="btn-primary btn-primary--lg"
            whileHover={reduceMotion ? undefined : { scale: 1.04 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            Commencer maintenant
            <ArrowRightIcon />
          </motion.a>
          <motion.a
            href="#simulator"
            className="btn-ghost"
            whileHover={reduceMotion ? undefined : { scale: 1.04 }}
            whileTap={reduceMotion ? undefined : { scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            Simuler mon parcours
          </motion.a>
        </motion.div>

        <motion.div
          className="hero__stats"
          variants={fadeUp}
          style={reduceMotion ? undefined : { y: statsY }}
        >
          {[
            { number: "1200+", label: "Diplômés" },
            { number: "96%", label: "Satisfaction" },
            { number: "4", label: "Formations" },
            { number: "15+", label: "Ans d'expérience" },
          ].map((stat, i) => (
            <Fragment key={stat.label}>
              {i > 0 && <div className="hero__stat-divider" />}
              <div className="hero__stat">
                <span className="hero__stat-number">{stat.number}</span>
                <span className="hero__stat-label">{stat.label}</span>
              </div>
            </Fragment>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ABOUT / FEATURES SECTION
   ═══════════════════════════════════════════════════════════════════ */

const FEATURES = [
  {
    icon: <GraduationIcon />,
    title: "Formations certifiantes",
    desc: "Programmes reconnus, conçus par des professionnels en activité.",
  },
  {
    icon: <CertificateIcon />,
    title: "Certification reconnue",
    desc: "Un certificat valorisable auprès de tout employeur au Maroc.",
  },
  {
    icon: <UsersIcon />,
    title: "Groupes réduits",
    desc: "Un accompagnement individualisé pour progresser efficacement.",
  },
  {
    icon: <ChartIcon />,
    title: "Résultats mesurables",
    desc: "96\u00A0% de nos diplômés constatent une amélioration concrète.",
  },
];

function About() {
  const reduceMotion = useReducedMotion();

  return (
    <Section id="about" className="section about">
      <div className="section__container">
        <SectionHeader
          tag="À propos"
          title="Pourquoi choisir Skillup Academy"
          subtitle="Depuis plus de 15 ans, nous formons les professionnels de demain avec des méthodes éprouvées et un accompagnement sur mesure."
        />

        <motion.div
          className="features-grid"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger()}
        >
          {FEATURES.map((f) => (
            <motion.div
              key={f.title}
              className="feature-card"
              variants={fadeUp}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -6,
                      scale: 1.02,
                      transition: { duration: 0.25, ease: easeOut },
                    }
              }
            >
              <div className="feature-card__icon">{f.icon}</div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   COURSES SECTION (Option 1: Interactive Animated Syllabus)
   ═══════════════════════════════════════════════════════════════════ */

const COURSE_CATEGORIES = [
  { id: "all", label: "Tous les programmes" },
  { id: "service", label: "Relation Client" },
  { id: "sales", label: "Télévente & Négociation" },
  { id: "comm", label: "Communication" },
  { id: "lead", label: "Leadership" },
];

const COURSES = [
  {
    id: "service",
    category: "service",
    title: "Customer Service Mastery",
    subtitle: "Maîtrise du service client",
    desc: "Techniques avancées de gestion de la relation client, résolution de conflits et création d'expériences mémorables.",
    duration: "40 heures",
    level: "Tous niveaux",
    color: "#0072ba",
    modules: [
      {
        num: "01",
        title: "Posture d'accueil & écoute active",
        desc: "Prise en charge professionnelle, questionnement ouvert, détection des besoins implicites et synchronisation vocale.",
      },
      {
        num: "02",
        title: "Gestion des litiges & désescalade",
        desc: "Techniques de communication non-violente, prise de recul face à l'agressivité et transformation du mécontentement.",
      },
      {
        num: "03",
        title: "Excellence relationnelle & KPIs (NPS/CSAT)",
        desc: "Règles d'or de l'écrit et du téléphone, respect de la DMT sans sacrifier la qualité perçue par le client.",
      },
    ],
    prerequisite: "Aisance orale de base en français ou anglais.",
    delivery: "Présentiel Casablanca ou sessions intensives du soir/samedi.",
  },
  {
    id: "sales",
    category: "sales",
    title: "Telesales & Negotiation",
    subtitle: "Télévente & négociation",
    desc: "Stratégies de vente par téléphone, techniques de persuasion et négociation commerciale.",
    duration: "35 heures",
    level: "Intermédiaire",
    color: "#f28c00",
    modules: [
      {
        num: "01",
        title: "Accroche percutante & diagnostic des freins",
        desc: "Casser les réflexes de rejet dès les 20 premières secondes, découverte active des leviers d'achat.",
      },
      {
        num: "02",
        title: "Traitement systématique des objections",
        desc: "Démantèlement des freins 'trop cher', 'pas le temps', 'envoyez un mail'. Négociation sur la valeur perçue.",
      },
      {
        num: "03",
        title: "Closing assertif & rebond commercial",
        desc: "Techniques d'engagement direct, vente croisée (cross-sell / up-sell) et maximisation des primes de vente.",
      },
    ],
    prerequisite: "Bonne fluidité verbale, goût du challenge et tempérament commercial.",
    delivery: "Simulations intensives avec enregistrements et debriefings personnalisés.",
  },
  {
    id: "comm",
    category: "comm",
    title: "Communication Skills",
    subtitle: "Compétences en communication",
    desc: "Aisance orale, communication non-verbale et capacité à convaincre en contexte professionnel.",
    duration: "30 heures",
    level: "Tous niveaux",
    color: "#0072ba",
    modules: [
      {
        num: "01",
        title: "Maîtrise du souffle, débit & diction",
        desc: "Respiration ventrale, placement du ton, élimination des tics verbaux et des hésitations parasitaires.",
      },
      {
        num: "02",
        title: "Assertivité & communication sous pression",
        desc: "Exprimer son point de vue avec clarté et fermeté bienveillante, savoir dire non sans détériorer la relation.",
      },
      {
        num: "03",
        title: "Rhétorique, structure du discours & impact",
        desc: "Techniques de cadrage, storytelling professionnel et captation de l'auditoire en réunion ou entretien.",
      },
    ],
    prerequisite: "Accessible à tous sans prérequis technique spécifique.",
    delivery: "Ateliers pratiques d'éloquence en effectif très restreint.",
  },
  {
    id: "lead",
    category: "lead",
    title: "Leadership & Management",
    subtitle: "Leadership & gestion d'équipe",
    desc: "Leadership transformationnel, gestion d'équipe et prise de décision stratégique.",
    duration: "45 heures",
    level: "Avancé",
    color: "#ffffff",
    modules: [
      {
        num: "01",
        title: "Rôle du Team Leader & posture managériale",
        desc: "Passer d'expert métier à manager d'équipe, établir sa légitimité et instaurer une culture d'exigence et de confiance.",
      },
      {
        num: "02",
        title: "Coaching individuel & debriefings d'écoutes",
        desc: "Méthode d'écoute double, debriefing formatif, fixation d'objectifs SMART et plans de progrès personnalisés.",
      },
      {
        num: "03",
        title: "Pilotage des KPIs de plateau & cohésion",
        desc: "Analyser les tableaux de bord (DMT, absentéisme, QS), animer des réunions stimulantes et réguler les tensions.",
      },
    ],
    prerequisite: "Expérience minimale en relation client ou premier rôle de coordination.",
    delivery: "Études de cas réels d'entreprises partenaires et simulations de situations managériales.",
  },
];

function Courses({ onSelectCourse }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedCourseTitle, setExpandedCourseTitle] = useState(null);
  const reduceMotion = useReducedMotion();

  const filteredCourses =
    activeCategory === "all"
      ? COURSES
      : COURSES.filter((c) => c.category === activeCategory);

  function handleEnroll(courseTitle) {
    if (onSelectCourse) {
      onSelectCourse(courseTitle);
    }
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <Section id="courses" className="section courses">
      <div className="section__container">
        <SectionHeader
          tag="Nos formations"
          title="Des programmes concrets, orientés terrain"
          subtitle="Choisissez la formation qui correspond à vos ambitions et découvrez le détail de chaque module pédagogique."
        />

        {/* Category filter tabs with layout animation */}
        <div className="courses__filters-wrap" role="tablist" aria-label="Catégories de formations">
          {COURSE_CATEGORIES.map((cat) => {
            const isSelected = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isSelected}
                className={`courses__filter-btn ${isSelected ? "courses__filter-btn--active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {isSelected && !reduceMotion && (
                  <motion.div
                    layoutId="courseFilterPill"
                    className="courses__filter-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="courses__filter-label">{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Courses grid with layout animations */}
        <motion.div
          className="courses-grid"
          layout={!reduceMotion}
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger()}
        >
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((c) => {
              const isExpanded = expandedCourseTitle === c.title;

              return (
                <motion.article
                  key={c.title}
                  layout={!reduceMotion}
                  className="course-card"
                  variants={fadeUp}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: easeOut }}
                  whileHover={
                    reduceMotion
                      ? undefined
                      : {
                          y: -6,
                          transition: { duration: 0.25, ease: easeOut },
                        }
                  }
                >
                  <div
                    className="course-card__accent"
                    style={{ background: c.color }}
                  />
                  <div className="course-card__body">
                    <div
                      className="course-card__badge"
                      style={{
                        background: `${c.color}26`,
                        color: "#ffffff",
                        border: `1px solid ${c.color}59`,
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      {c.level}
                    </div>
                    <h3 className="course-card__title">{c.subtitle}</h3>
                    <p className="course-card__desc">{c.desc}</p>
                    <div className="course-card__meta">
                      <span className="course-card__meta-item">
                        <ClockIcon />
                        {c.duration}
                      </span>
                    </div>

                    {/* Syllabus accordion toggle */}
                    <button
                      type="button"
                      className="course-card__syllabus-toggle"
                      onClick={() =>
                        setExpandedCourseTitle(isExpanded ? null : c.title)
                      }
                      aria-expanded={isExpanded}
                      aria-controls={`syllabus-${c.id}`}
                    >
                      <span>
                        {isExpanded
                          ? "Masquer les modules"
                          : "Consulter le syllabus"}
                      </span>
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.25 }}
                        style={{ display: "inline-flex" }}
                      >
                        <ChevronDownIcon />
                      </motion.span>
                    </button>

                    {/* Expandable Syllabus Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          id={`syllabus-${c.id}`}
                          className="course-card__syllabus"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <div className="course-card__syllabus-inner">
                            <h4 className="course-card__syllabus-title">
                              Programme de formation
                            </h4>
                            <ol className="course-card__modules-list">
                              {c.modules.map((m) => (
                                <li
                                  key={m.num}
                                  className="course-card__module-item"
                                >
                                  <span className="course-card__module-num">
                                    {m.num}
                                  </span>
                                  <div className="course-card__module-content">
                                    <strong>{m.title}</strong>
                                    <p>{m.desc}</p>
                                  </div>
                                </li>
                              ))}
                            </ol>
                            <div className="course-card__syllabus-footer">
                              <span className="course-card__prereq">
                                <strong>Prérequis :</strong> {c.prerequisite}
                              </span>
                              <span className="course-card__delivery">
                                <strong>Format :</strong> {c.delivery}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      type="button"
                      onClick={() => handleEnroll(c.title)}
                      className="course-card__cta"
                      whileHover={reduceMotion ? undefined : { x: 4 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                    >
                      S'inscrire
                      <ArrowRightIcon />
                    </motion.button>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TESTIMONIALS SECTION
   ═══════════════════════════════════════════════════════════════════ */

const TESTIMONIALS = [
  {
    name: "Fatima Zahra B.",
    role: "Responsable service client — Marjane",
    text: "J'ai décroché une promotion 3 mois après la formation. Le programme m'a donné des outils directement applicables.",
    avatar: "FZ",
    rating: 5,
  },
  {
    name: "Youssef El Idrissi",
    role: "Commercial — Inwi",
    text: "Mes résultats de vente ont augmenté de 40\u00A0% le mois suivant. L'approche est pragmatique, sans jargon inutile.",
    avatar: "YE",
    rating: 5,
  },
  {
    name: "Nadia Amrani",
    role: "Chef d'équipe — Webhelp",
    text: "Les formateurs connaissent leur métier. Le contenu est applicable dès le lendemain en entreprise.",
    avatar: "NA",
    rating: 5,
  },
];

function Testimonials() {
  const reduceMotion = useReducedMotion();

  return (
    <Section id="testimonials" className="section testimonials">
      <div className="section__container">
        <SectionHeader
          tag="Témoignages"
          title="Ce que disent nos diplômés"
          subtitle="Des retours d'anciens étudiants qui ont concrètement fait évoluer leur carrière."
        />

        <motion.div
          className="testimonials-grid"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={stagger()}
        >
          {TESTIMONIALS.map((t) => (
            <motion.figure
              key={t.name}
              className="testimonial-card"
              variants={fadeUp}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                      y: -6,
                      scale: 1.02,
                      transition: { duration: 0.25, ease: easeOut },
                    }
              }
            >
              <div
                className="testimonial-card__stars"
                role="img"
                aria-label={`Note : ${t.rating} sur 5`}
              >
                {Array.from({ length: t.rating }).map((_, j) => (
                  <motion.span
                    key={j}
                    initial={reduceMotion ? false : { scale: 0, rotate: -30 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: reduceMotion ? 0 : 0.4 + j * 0.06,
                      type: "spring",
                      stiffness: 350,
                      damping: 18,
                    }}
                    style={{ display: "inline-flex" }}
                  >
                    <StarIcon />
                  </motion.span>
                ))}
              </div>
              <blockquote className="testimonial-card__text">
                «&nbsp;{t.text}&nbsp;»
              </blockquote>
              <figcaption className="testimonial-card__author">
                <motion.div
                  className="testimonial-card__avatar"
                  aria-hidden="true"
                  whileHover={
                    reduceMotion ? undefined : { rotate: 8, scale: 1.1 }
                  }
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                >
                  {t.avatar}
                </motion.div>
                <div>
                  <div className="testimonial-card__name">{t.name}</div>
                  <div className="testimonial-card__role">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   CONTACT / ENROLLMENT SECTION
   ═══════════════════════════════════════════════════════════════════ */

function ContactSection({ selectedFormation }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      id="contact"
      className="section"
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
    >
      <ContactForm selectedFormation={selectedFormation} />
    </motion.section>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════════════ */

function Footer() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.footer
      className="footer"
      initial={reduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: reduceMotion ? 0 : 0.5 }}
    >
      <div className="footer__inner">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <a href="#hero" className="navbar__logo" aria-label="Skillup Academy — Accueil" style={{ marginBottom: "16px" }}>
              <BrandLogo height={52} />
            </a>
            <p className="footer__desc">
              Formations professionnelles à Casablanca. Des programmes courts,
              concrets, dispensés par des praticiens.
            </p>
          </div>

          {/* Quick links */}
          <div className="footer__col">
            <h4 className="footer__col-title">Navigation</h4>
            <a href="#hero" className="footer__link">Accueil</a>
            <a href="#about" className="footer__link">À Propos</a>
            <a href="#simulator" className="footer__link">Simulateur</a>
            <a href="#courses" className="footer__link">Formations</a>
            <a href="#testimonials" className="footer__link">Témoignages</a>
            <a href="#contact" className="footer__link">Contact</a>
          </div>

          {/* Formations */}
          <div className="footer__col">
            <h4 className="footer__col-title">Formations</h4>
            <a href="#courses" className="footer__link">Service Client</a>
            <a href="#courses" className="footer__link">Télévente &amp; Négociation</a>
            <a href="#courses" className="footer__link">Communication</a>
            <a href="#courses" className="footer__link">Leadership</a>
          </div>

          {/* Contact — each row appears only once a real value is configured */}
          <div className="footer__col">
            <h4 className="footer__col-title">Contact</h4>
            <div className="footer__contact-item">
              <LocationIcon />
              <span>{SITE.location}</span>
            </div>
            {SITE.phone && (
              <div className="footer__contact-item">
                <PhoneFooterIcon />
                <a href={telHref(SITE.phone)}>{SITE.phone}</a>
              </div>
            )}
            {SITE.email && (
              <div className="footer__contact-item">
                <EmailFooterIcon />
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </div>
            )}
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2026 {SITE.name}. Tous droits réservés.</p>
          {SITE.legal.length > 0 && (
            <div className="footer__bottom-links">
              {SITE.legal.map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.footer>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   APP — Root Component
   ═══════════════════════════════════════════════════════════════════ */

export default function App() {
  const [selectedFormation, setSelectedFormation] = useState("");
  const { scrollY } = useScroll();
  const reduceMotion = useReducedMotion();
  const siteEmblemY = useTransform(scrollY, [0, 3000], [0, -140]);

  function handleSelectCourse(courseKey) {
    setSelectedFormation(courseKey);
  }

  return (
    <>
      <ScrollProgressBar />
      <motion.img
        src="/logo-emblem-hd.png"
        alt=""
        className="site-bg-watermark"
        aria-hidden="true"
        width="834"
        height="771"
        style={reduceMotion ? undefined : { y: siteEmblemY }}
      />
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <CareerSimulator onSelectCourse={handleSelectCourse} />
        <Courses onSelectCourse={handleSelectCourse} />
        <Testimonials />
        <ContactSection selectedFormation={selectedFormation} />
      </main>
      <Footer />
    </>
  );
}
