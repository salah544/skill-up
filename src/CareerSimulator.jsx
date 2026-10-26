import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const TRACKS = [
  {
    id: "service-client",
    formationKey: "Customer Service Mastery",
    label: "Relation Client",
    badge: "Excellence Relationnelle",
    title: "Conseiller Client d'Élite & Référent Qualité",
    tagline:
      "Dépassez la simple gestion d'appels pour maîtriser la fidélisation, le traitement des réclamations complexes et les standards d'expérience client premium.",
    fromRole: "Débutant ou Conseiller standard",
    toRole: "Conseiller Expert / Référent Qualité",
    duration: "40 heures · Rythme soir ou weekend",
    metrics: [
      { value: "+35%", label: "Progression primes de qualité" },
      { value: "98%", label: "Taux de satisfaction client (CSAT)" },
      { value: "3 mois", label: "Délai moyen d'évolution constatée" },
    ],
    skills: [
      "Écoute active, synchronisation verbale et calibration émotionnelle",
      "Désamorçage des situations conflictuelles et rétention de clientèle",
      "Maîtrise opérationnelle des indicateurs clés (CSAT, NPS, FCR, DMT)",
    ],
    certification: "Certificat Skillup — Excellence Relationnelle Client",
    accentColor: "var(--cerulean)",
  },
  {
    id: "televente",
    formationKey: "Telesales & Negotiation",
    label: "Télévente & Closing",
    badge: "Performance Commerciale",
    title: "Commercial Sédentaire & Closer Téléphonique",
    tagline:
      "Transformez chaque appel en opportunité concrète. Développez une force de conviction irrésistible et dépassez systématiquement vos objectifs de vente.",
    fromRole: "Téléopérateur ou Prospecteur",
    toRole: "Closer Haute Performance / Superviseur des Ventes",
    duration: "35 heures · Simulations d'appels réels",
    metrics: [
      { value: "+50%", label: "Hausse moyenne des primes sur objectifs" },
      { value: "3.2x", label: "Taux de conversion sur prospects froids" },
      { value: "Immédiat", label: "Applicabilité directe dès le lendemain" },
    ],
    skills: [
      "Accroche percutante et captation de l'attention en 15 secondes",
      "Traitement systématique des objections prix, concurrence et timing",
      "Closing assertif et techniques de rebond commercial stratégique",
    ],
    certification: "Badge d'Élite — Spécialiste Closing & Négociation B2B/B2C",
    accentColor: "var(--orange)",
  },
  {
    id: "communication",
    formationKey: "Communication Skills",
    label: "Aisance & Éloquence",
    badge: "Soft Skills & Voix",
    title: "Communication Professionnelle & Rhétorique",
    tagline:
      "Débloquez votre aisance orale, gagnez en impact et en fluidité verbale. Éliminez les tics de langage pour communiquer avec une autorité naturelle et chaleureuse.",
    fromRole: "Profil réservé ou hésitant à l'oral",
    toRole: "Communicant d'Impact / Référent Formation",
    duration: "30 heures · Ateliers d'éloquence & mises en voix",
    metrics: [
      { value: "100%", label: "Pratique en ateliers d'expression orale" },
      { value: "-75%", label: "Réduction des hésitations et tics de voix" },
      { value: "Clé", label: "Compétence tremplin pour toutes les promotions" },
    ],
    skills: [
      "Pose de voix, modulation de timbre, souffle et articulation nette",
      "Communication assertive sans agressivité ni passivité",
      "Structure d'argumentation rhétorique et persuasion élégante",
    ],
    certification: "Certificat d'Aisance Orale & Communication Stratégique",
    accentColor: "var(--cerulean)",
  },
  {
    id: "leadership",
    formationKey: "Leadership & Management",
    label: "Management d'Équipe",
    badge: "Leadership Opérationnel",
    title: "Team Leader & Responsable d'Équipe de Plateau",
    tagline:
      "Franchissez le cap du management opérationnel. Apprenez à coacher, motiver une équipe de conseillers et piloter la performance collective avec humanité et rigueur.",
    fromRole: "Conseiller senior ou Expert métier",
    toRole: "Team Leader / Superviseur de Plateau",
    duration: "45 heures · Mises en situation managériales",
    metrics: [
      { value: "+40%", label: "Évolution salariale moyenne au poste de TL" },
      { value: "96%", label: "Des stagiaires promus ou recrutés sous 6 mois" },
      { value: "Concret", label: "Outils de coaching et grilles immédiatement utilisables" },
    ],
    skills: [
      "Conduite d'entretiens de coaching individuel et debriefings d'écoutes",
      "Pilotage analytique des indicateurs de production et plans de redressement",
      "Gestion des tensions, animation de briefs matinaux et cohésion d'équipe",
    ],
    certification: "Certification Skillup — Management & Leadership de Plateau",
    accentColor: "var(--white)",
  },
];

function ArrowStepIcon() {
  return (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  );
}

function CheckmarkIcon() {
  return (
    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

function CertificateBadgeIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
    </svg>
  );
}

export default function CareerSimulator({ onSelectCourse }) {
  const [activeTrackId, setActiveTrackId] = useState("service-client");
  const reduceMotion = useReducedMotion();

  const activeTrack = TRACKS.find((t) => t.id === activeTrackId) || TRACKS[0];

  function handleEnrollClick() {
    if (onSelectCourse) {
      onSelectCourse(activeTrack.formationKey);
    }
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <section id="simulator" className="section simulator-section" aria-labelledby="simulator-title">
      <div className="section__container">
        <div className="section__header">
          <span className="section__tag">Orientation &amp; Trajectoire</span>
          <h2 id="simulator-title" className="section__title">
            Projetez votre ascension professionnelle
          </h2>
          <p className="section__subtitle">
            Sélectionnez votre profil ou objectif pour découvrir le parcours de compétences, l'impact sur vos opportunités et la certification délivrée.
          </p>
        </div>

        {/* Track selector tabs */}
        <div className="simulator__tabs-wrap" role="tablist" aria-label="Filières professionnelles">
          {TRACKS.map((track) => {
            const isSelected = track.id === activeTrackId;
            return (
              <button
                key={track.id}
                role="tab"
                id={`tab-${track.id}`}
                aria-selected={isSelected}
                aria-controls={`panel-${track.id}`}
                className={`simulator__tab ${isSelected ? "simulator__tab--active" : ""}`}
                onClick={() => setActiveTrackId(track.id)}
              >
                {isSelected && !reduceMotion && (
                  <motion.div
                    layoutId="simulatorActivePill"
                    className="simulator__tab-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="simulator__tab-label">{track.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active track interactive display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTrack.id}
            id={`panel-${activeTrack.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTrack.id}`}
            className="simulator__panel card"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? false : { opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Header info */}
            <div className="simulator__panel-header">
              <div
                className="simulator__panel-badge"
                style={{
                  borderColor: `${activeTrack.accentColor}66`,
                  color: "var(--text-primary)",
                  background: `${activeTrack.accentColor}1f`,
                }}
              >
                {activeTrack.badge}
              </div>
              <h3 className="simulator__panel-title">{activeTrack.title}</h3>
              <p className="simulator__panel-tagline">{activeTrack.tagline}</p>
            </div>

            {/* Stepper: from role -> training -> target role */}
            <div className="simulator__stepper" aria-label="Progression de carrière">
              <div className="simulator__step">
                <span className="simulator__step-label">Point de départ</span>
                <strong className="simulator__step-role">{activeTrack.fromRole}</strong>
              </div>

              <div className="simulator__stepper-arrow" aria-hidden="true">
                <span className="simulator__stepper-pill">Formation SkillUp</span>
                <ArrowStepIcon />
              </div>

              <div className="simulator__step simulator__step--target">
                <span className="simulator__step-label">Objectif visé</span>
                <strong className="simulator__step-role">{activeTrack.toRole}</strong>
              </div>
            </div>

            {/* Metrics grid */}
            <div className="simulator__metrics-grid">
              {activeTrack.metrics.map((m) => (
                <div key={m.label} className="simulator__metric-item">
                  <span className="simulator__metric-value">{m.value}</span>
                  <span className="simulator__metric-label">{m.label}</span>
                </div>
              ))}
            </div>

            {/* Competencies and Certification */}
            <div className="simulator__details-grid">
              <div className="simulator__skills-col">
                <h4 className="simulator__col-title">Compétences opérationnelles acquises</h4>
                <ul className="simulator__skills-list">
                  {activeTrack.skills.map((skill, idx) => (
                    <li key={idx} className="simulator__skill-item">
                      <span className="simulator__skill-icon" aria-hidden="true">
                        <CheckmarkIcon />
                      </span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="simulator__cert-col">
                <div className="simulator__cert-box">
                  <div className="simulator__cert-header">
                    <span className="simulator__cert-icon" aria-hidden="true">
                      <CertificateBadgeIcon />
                    </span>
                    <div>
                      <span className="simulator__cert-subtitle">Reconnaissance professionnelle</span>
                      <h5 className="simulator__cert-title">{activeTrack.certification}</h5>
                    </div>
                  </div>
                  <p className="simulator__cert-desc">
                    Format : <strong>{activeTrack.duration}</strong>. Évaluations pratiques par écoutes et mises en situation avec attestation remise en fin de cursus.
                  </p>
                  <motion.button
                    type="button"
                    onClick={handleEnrollClick}
                    className="btn-primary w-full"
                    whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    Postuler pour ce parcours
                    <ArrowStepIcon />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
