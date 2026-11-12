/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Instagram,
  Linkedin,
  Youtube,
  Check,
  FileDown,
  Menu,
  X,
  Send,
  Loader2,
} from 'lucide-react';

// Foto ritratto di Valentina Palazzo e Gabriele Papparella dalla cartella asset
import valentinaPhoto from '../asset/Valentina.webp';
import gabrielePhoto from '../asset/Gabriele.PNG';

/**
 * =============================================================================
 * LO/OP - PARAMETRI DI CALIBRAZIONE IMPULSI SINAPTICI / SCIENTIFICI
 * Logo LO/OP thin (stroke 2.0px) + Infinito interrotto dalla /
 * Titoli in font Comfortaa, resto del sito in Quicksand (thin, regular, bold)
 * =============================================================================
 */
export const SPARK_CONFIG = {
  // Tratto dell'impulso: bianco con sfumatura azzurrina impercettibile
  sparkColor: '#F0F6FC',

  // Alone glow tenue e discreto
  glowColor: '#D8ECF8',

  // Sfocatura gaussiana minima
  glowStdDeviation: 1.5,

  // Opacità glow tenue
  glowOpacity: 0.25,

  // Micro-oscillazione naturale (0.8px, scientifica, no arcade)
  jitterScale: 0.8,

  // Spessore del contorno base del logo (THIN: 2.0px)
  baseStrokeWidth: 2.0,

  // Spessore degli impulsi (2.0px)
  sparkStrokeWidth: 2.0,

  // Intervallo tra le scariche sinaptiche attraverso "/" (5-8 secondi)
  arcMinIntervalMs: 5000,
  arcMaxIntervalMs: 8000,

  // Durata dell'impulso sinaptico (~180 ms)
  arcDurationMs: 180,
};

export default function App() {
  // Stato per l'impulso sinaptico tra i due anelli spezzati
  const [isArcActive, setIsArcActive] = useState(false);
  const [arcPathD, setArcPathD] = useState('');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Navigazione mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form contatti con invio reale a vale.palazzo@gmail.com
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    messaggio: '',
    privacy: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Modale Cookie Policy
  const [cookieModalOpen, setCookieModalOpen] = useState(false);

  const arcTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const arcDurationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scarica sinaptica che unisce i due anelli tondi attraverso la barra "/"
  const generateSynapticArc = () => {
    const yCenter = 56;
    const dy = (Math.random() - 0.5) * 8;
    return `M 244 56 Q 253 ${yCenter + dy} 262 56`;
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleMotionChange);

    const scheduleNextArc = () => {
      if (mediaQuery.matches) return;

      const randomInterval =
        Math.floor(
          Math.random() *
            (SPARK_CONFIG.arcMaxIntervalMs - SPARK_CONFIG.arcMinIntervalMs)
        ) + SPARK_CONFIG.arcMinIntervalMs;

      arcTimeoutRef.current = setTimeout(() => {
        setArcPathD(generateSynapticArc());
        setIsArcActive(true);

        arcDurationTimeoutRef.current = setTimeout(() => {
          setIsArcActive(false);
          scheduleNextArc();
        }, SPARK_CONFIG.arcDurationMs);
      }, randomInterval);
    };

    if (!mediaQuery.matches) {
      scheduleNextArc();
    }

    return () => {
      mediaQuery.removeEventListener('change', handleMotionChange);
      if (arcTimeoutRef.current) clearTimeout(arcTimeoutRef.current);
      if (arcDurationTimeoutRef.current) clearTimeout(arcDurationTimeoutRef.current);
    };
  }, []);

  // Invio reale del form a vale.palazzo@gmail.com
  const handleSubmitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      errors.nome = 'Inserisci il tuo nome';
    }

    if (!formData.email.trim()) {
      errors.email = 'Inserisci la tua email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Inserisci un indirizzo email valido';
    }

    if (!formData.privacy) {
      errors.privacy = 'È necessario acconsentire al trattamento dei dati';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch('https://formsubmit.co/ajax/vale.palazzo@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          messaggio: formData.messaggio || '(Nessun messaggio fornito)',
          _subject: `Iscrizione workshop LO/OP da ${formData.nome}`,
          _replyto: formData.email,
        }),
      });

      if (response.ok) {
        setFormSubmitted(true);
      } else {
        window.location.href = `mailto:vale.palazzo@gmail.com?subject=${encodeURIComponent(
          'Iscrizione Workshop LO/OP'
        )}&body=${encodeURIComponent(
          `Nome: ${formData.nome}\nEmail: ${formData.email}\nMessaggio: ${formData.messaggio}`
        )}`;
        setFormSubmitted(true);
      }
    } catch {
      window.location.href = `mailto:vale.palazzo@gmail.com?subject=${encodeURIComponent(
        'Iscrizione Workshop LO/OP'
      )}&body=${encodeURIComponent(
        `Nome: ${formData.nome}\nEmail: ${formData.email}\nMessaggio: ${formData.messaggio}`
      )}`;
      setFormSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Coordinate vettoriali del logo LO/OP (viewBox 0 0 500 156)
  // Geometria pura: le due 'O' sono perfettamente tonde, la barra diagonale '/'
  // attraversa al centro l'intero lockup dall'alto al basso, dividendo sia LO/OP che Longevity/Optimized.
  const pathL = 'M 122 20 L 122 78 Q 122 92 136 92 L 158 92';
  const pathO1 = 'M 244 48 A 35 35 0 1 0 244 64';
  const pathSlash = 'M 259 12 L 241 146';
  const pathO2 = 'M 262 64 A 35 35 0 1 0 262 48';
  const pathP = 'M 348 92 L 348 20 L 376 20 A 18 18 0 0 1 376 56 L 348 56';

  // Coordinate vettoriali per il logo "LO/OP" del titolo della sezione (viewBox 109 6 280 96)
  const pathSlashTitle = 'M 256 12 L 244 100';
  const arcPathTitle = 'M 244 56 Q 253 56 262 56';

  return (
    <div className="min-h-screen lab-ambient-bg text-white font-sans selection:bg-white selection:text-black flex flex-col justify-between">
      {/* =====================================================================
          1. HEADER & TOP BAR
          ===================================================================== */}
      <header className="sticky top-0 z-50 bg-[#06080b]/85 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-8">
          <a
            href="#hero"
            className="font-title text-sm tracking-wider font-bold text-white hover:text-white/80 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-full px-2 py-1"
          >
            LO/OP
          </a>

          <nav
            aria-label="Navigazione principale"
            className="hidden md:flex items-center gap-8 text-xs tracking-wide text-white/70"
          >
            <a
              href="#cose"
              className="hover:text-white transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-full px-2 py-1"
            >
              Cos&apos;è
            </a>
            <a
              href="#perche"
              className="hover:text-white transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-full px-2 py-1"
            >
              Perché
            </a>
            <a
              href="#chi-siamo"
              className="hover:text-white transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-full px-2 py-1"
            >
              Chi siamo
            </a>
            <a
              href="#brochure"
              className="hover:text-white transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white rounded-full px-2 py-1"
            >
              Brochure
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4 shrink-0">
            <a
              href="#contatti"
              className="text-xs font-medium px-5 py-2 rounded-full border border-white/70 text-white hover:bg-white hover:text-black transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            >
              Contatti
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white/80 hover:text-white rounded-full border border-white/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Chiudi menu' : 'Apri menu di navigazione'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav
            aria-label="Menu mobile"
            className="md:hidden bg-[#07090d] border-b border-white/10 px-6 py-6 flex flex-col gap-4 text-sm tracking-wide"
          >
            <a
              href="#cose"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/80 hover:text-white py-1"
            >
              Cos&apos;è
            </a>
            <a
              href="#perche"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/80 hover:text-white py-1"
            >
              Perché
            </a>
            <a
              href="#chi-siamo"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/80 hover:text-white py-1"
            >
              Chi siamo
            </a>
            <a
              href="#brochure"
              onClick={() => setMobileMenuOpen(false)}
              className="text-white/80 hover:text-white py-1"
            >
              Brochure
            </a>
            <a
              href="#contatti"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-block text-center mt-2 px-6 py-3 rounded-full border border-white text-white hover:bg-white hover:text-black transition-all"
            >
              Scrivici
            </a>
          </nav>
        )}
      </header>

      {/* =====================================================================
          2. HERO SECTION
          - Logo vettoriale BOLD
          - Longevity e Optimized con il font arrotondato sans-serif COMFORTAA
          ===================================================================== */}
      <section
        id="hero"
        className="relative pt-16 pb-24 md:pt-28 md:pb-36 px-5 sm:px-8"
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Logo SVG Ingrandito e BOLD (50vw su desktop, centrato) */}
          <div className="w-[88%] sm:w-[70%] md:w-[50vw] max-w-2xl mx-auto mb-10">
            <svg
              viewBox="0 0 500 156"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto overflow-visible select-none"
              role="img"
              aria-label="LO/OP, longevity optimized"
            >
              <defs>
                <filter
                  id="spark-filter"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                  filterUnits="userSpaceOnUse"
                >
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.09"
                    numOctaves="2"
                    result="noise"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="noise"
                    scale={SPARK_CONFIG.jitterScale}
                    xChannelSelector="R"
                    yChannelSelector="G"
                    result="jittered"
                  />
                  <feGaussianBlur
                    in="jittered"
                    stdDeviation={SPARK_CONFIG.glowStdDeviation}
                    result="blurred"
                  />
                  <feFlood
                    floodColor={SPARK_CONFIG.glowColor}
                    floodOpacity={SPARK_CONFIG.glowOpacity}
                    result="glowFlood"
                  />
                  <feComposite
                    in="glowFlood"
                    in2="blurred"
                    operator="in"
                    result="coloredGlow"
                  />
                  <feMerge>
                    <feMergeNode in="coloredGlow" />
                    <feMergeNode in="jittered" />
                  </feMerge>
                </filter>
              </defs>

              {/* CONTORNO BASE DEL LOGO - THIN ELEGANTE (strokeWidth: 2.0px) */}
              <g
                stroke="#FFFFFF"
                strokeWidth={SPARK_CONFIG.baseStrokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.95"
              >
                <path d={pathL} />
                <path d={pathO1} />
                <path d={pathSlash} strokeWidth="1.8" />
                <path d={pathO2} />
                <path d={pathP} />
              </g>

              {/* SEGMENTI LUMINOSI DEGLI IMPULSI */}
              {!prefersReducedMotion && (
                <g
                  stroke={SPARK_CONFIG.sparkColor}
                  strokeWidth={SPARK_CONFIG.sparkStrokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  filter="url(#spark-filter)"
                  fill="none"
                >
                  <path
                    d={pathL}
                    strokeDasharray="16 110"
                    className="spark-stream-a"
                  />
                  <path
                    d={pathO1}
                    strokeDasharray="24 180"
                    className="spark-stream-b"
                  />
                  <path
                    d={pathSlash}
                    strokeDasharray="18 130"
                    className="spark-stream-c"
                  />
                  <path
                    d={pathO2}
                    strokeDasharray="24 180"
                    className="spark-stream-a"
                  />
                  <path
                    d={pathP}
                    strokeDasharray="20 160"
                    className="spark-stream-b"
                  />

                  {/* IMPULSO SINAPTICO NELLA ROTTURA DEL LOOP */}
                  {isArcActive && arcPathD && (
                    <path
                      d={arcPathD}
                      stroke={SPARK_CONFIG.sparkColor}
                      strokeWidth={SPARK_CONFIG.sparkStrokeWidth + 0.4}
                      className="spark-arc-active"
                    />
                  )}
                </g>
              )}

              {/* LONGEVITY E OPTIMIZED IN FONT COMFORTAA SEPARATI DALLA BARRA CENTRALE EXTENDED */}
              <text
                x="226"
                y="132"
                textAnchor="end"
                className="select-none font-title"
                fill="#E2E8F0"
                fontSize="20"
                fontWeight="300"
                letterSpacing="0.03em"
                style={{ fontFamily: "'Comfortaa', sans-serif" }}
              >
                Longevity
              </text>

              <text
                x="260"
                y="132"
                textAnchor="start"
                className="select-none font-title"
                fill="#E2E8F0"
                fontSize="20"
                fontWeight="300"
                letterSpacing="0.03em"
                style={{ fontFamily: "'Comfortaa', sans-serif" }}
              >
                Optimized
              </text>
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4 max-w-2xl text-balance">
            Break the loop. Play the long game.
          </h1>
          <p className="text-base sm:text-lg text-white/70 max-w-2xl mb-10 leading-relaxed font-normal">
            Il tuo cervello funziona in pilota automatico. LO/OP ti insegna a riprendere i comandi, con abitudini e respirazione per aggiungere anni buoni alla tua vita.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full max-w-md">
            <a
              href="#brochure"
              className="px-8 py-3.5 bg-white text-black font-medium text-sm tracking-wide rounded-full border-2 border-white hover:bg-transparent hover:text-white transition-all duration-200 text-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            >
              Scarica la brochure
            </a>

            <a
              href="#contatti"
              className="px-8 py-3.5 bg-transparent text-white font-medium text-sm tracking-wide rounded-full border border-white/35 hover:border-white hover:bg-white/5 transition-all duration-200 text-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            >
              Scrivici
            </a>
          </div>
        </div>
      </section>

      {/* LINEA SEZIONALE CON RIFLESSO DINAMICO */}
      <div className="relative w-full h-[1px] bg-white/10 overflow-hidden">
        <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent line-sheen-sweep" />
      </div>

      {/* =====================================================================
          2.5 SEZIONE PROBLEMA
          ===================================================================== */}
      <section className="py-20 md:py-28 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white mb-6 font-title text-balance leading-tight">
              Questo automatismo non ti porta verso ciò che vuoi.
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed font-normal">
              Riprendi i comandi: usa il respiro per vivere più a lungo, per avere il controllo del presente e costruisci routine che ti aiutino a raggiungere i tuoi obiettivi.
            </p>
          </div>
        </div>
      </section>

      {/* LINEA SEZIONALE CON RIFLESSO DINAMICO */}
      <div className="relative w-full h-[1px] bg-white/10 overflow-hidden">
        <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent line-sheen-sweep" />
      </div>

      {/* =====================================================================
          3. SEZIONE "COS'È"
          ===================================================================== */}
      <section id="cose" className="py-20 md:py-28 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Titolo: "Cos'è" in Comfortaa normale sopra "LO/OP" in stile logo con animazione luce */}
          <div className="mb-12 flex flex-col items-center justify-center text-center">
            <h2 className="sr-only">Cos&apos;è LO/OP</h2>
            <div
              className="font-title text-2xl sm:text-3xl md:text-4xl font-normal text-white/90 tracking-tight mb-3 select-none"
              style={{ fontFamily: "'Comfortaa', sans-serif" }}
            >
              Cos&apos;è
            </div>
            <div
              className="w-[180px] sm:w-[220px] md:w-[250px] max-w-xs mx-auto"
              aria-hidden="true"
            >
              <svg
                viewBox="109 6 280 96"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto overflow-visible select-none"
                role="img"
                aria-label="LO/OP"
              >
                <defs>
                  <filter
                    id="spark-filter-title"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                    filterUnits="userSpaceOnUse"
                  >
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency="0.09"
                      numOctaves="2"
                      result="noise"
                    />
                    <feDisplacementMap
                      in="SourceGraphic"
                      in2="noise"
                      scale={SPARK_CONFIG.jitterScale}
                      xChannelSelector="R"
                      yChannelSelector="G"
                      result="jittered"
                    />
                    <feGaussianBlur
                      in="jittered"
                      stdDeviation={SPARK_CONFIG.glowStdDeviation}
                      result="blurred"
                    />
                    <feFlood
                      floodColor={SPARK_CONFIG.glowColor}
                      floodOpacity={SPARK_CONFIG.glowOpacity}
                      result="glowFlood"
                    />
                    <feComposite
                      in="glowFlood"
                      in2="blurred"
                      operator="in"
                      result="coloredGlow"
                    />
                    <feMerge>
                      <feMergeNode in="coloredGlow" />
                      <feMergeNode in="jittered" />
                    </feMerge>
                  </filter>
                </defs>

                {/* CONTORNO BASE: LO/OP */}
                <g
                  stroke="#FFFFFF"
                  strokeWidth="2.0"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.95"
                >
                  <path d={pathL} />
                  <path d={pathO1} />
                  <path d={pathSlashTitle} strokeWidth="1.8" />
                  <path d={pathO2} />
                  <path d={pathP} />
                </g>

                {/* ANIMAZIONE DELLA LUCE: IMPULSI BIO-ELETTRICI CORRENTI */}
                {!prefersReducedMotion && (
                  <g
                    stroke={SPARK_CONFIG.sparkColor}
                    strokeWidth="2.0"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#spark-filter-title)"
                    fill="none"
                  >
                    <path
                      d={pathL}
                      strokeDasharray="16 110"
                      className="spark-stream-a"
                    />
                    <path
                      d={pathO1}
                      strokeDasharray="24 180"
                      className="spark-stream-b"
                    />
                    <path
                      d={pathSlashTitle}
                      strokeDasharray="16 110"
                      className="spark-stream-c"
                    />
                    <path
                      d={pathO2}
                      strokeDasharray="24 180"
                      className="spark-stream-a"
                    />
                    <path
                      d={pathP}
                      strokeDasharray="20 160"
                      className="spark-stream-b"
                    />

                    {/* Impulso dell'arco sinaptico nella cesura centrale */}
                    {isArcActive && (
                      <path
                        d={arcPathTitle}
                        stroke={SPARK_CONFIG.sparkColor}
                        strokeWidth="2.2"
                        className="spark-arc-active"
                      />
                    )}
                  </g>
                )}
              </svg>
            </div>
          </div>

          {/* Frase in evidenza con animazione a impulsi e riflesso dinamico */}
          <div className="relative overflow-hidden bg-[#090d14]/85 border border-white/20 synaptic-callout rounded-2xl p-6 sm:p-8 mb-8 text-center max-w-3xl mx-auto shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-[2px] card-specular-edge" />
            <div className="absolute inset-0 pointer-events-none opacity-25">
              <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent line-sheen-sweep" />
            </div>
            <p className="font-title text-lg sm:text-xl md:text-2xl font-semibold text-white tracking-tight leading-relaxed text-balance relative z-10">
              Due approcci scientifici, un solo obiettivo: la tua salute e la tua longevità
            </p>
          </div>

          <div className="text-base sm:text-lg text-white/80 leading-relaxed max-w-3xl mx-auto text-center font-normal">
            <p>
              LO/OP è un workshop di behaviour change e respirazione. Capisci come funziona
              un&apos;abitudine, dove intervenire per eliminarla o sostituirla e capisci come
              regolare il tuo sistema nervoso allenando il respiro. Teoria, dati ed esercizi
              pratici, con un piano da portare a casa.
            </p>
          </div>
        </div>
      </section>

      {/* LINEA SEZIONALE CON RIFLESSO DINAMICO */}
      <div className="relative w-full h-[1px] bg-white/10 overflow-hidden">
        <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent line-sheen-sweep-delayed" />
      </div>

      {/* =====================================================================
          4. SEZIONE "PERCHÉ"
          ===================================================================== */}
      <section id="perche" className="py-20 md:py-28 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white">
              Perché abitudini e respiro
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative group overflow-hidden bg-[#090c10]/75 border border-white/10 hover:border-white/25 rounded-2xl p-7 flex flex-col items-center text-center justify-center transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-[1.5px] card-specular-edge" />

              <h3 className="text-lg font-semibold text-white mb-3 text-center">
                I tuoi goal
              </h3>
              <p className="text-sm text-white/70 leading-relaxed font-normal text-center">
                Hai degli obiettivi che vorresti raggiungere, ma è difficile uscire dall&apos;automatismo e ricordarsi di lavorarci ogni giorno
              </p>
            </div>

            <div className="relative group overflow-hidden bg-[#090c10]/75 border border-white/10 hover:border-white/25 rounded-2xl p-7 flex flex-col items-center text-center justify-center transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-[1.5px] card-specular-edge" />

              <h3 className="text-lg font-semibold text-white mb-3 text-center">
                Il respiro
              </h3>
              <p className="text-sm text-white/70 leading-relaxed font-normal text-center">
                Respirare è automatico, ma è l&apos;unica funzione automatica che possiamo
                prendere in mano: per questo è il punto d&apos;ingresso per cambiare tutto il
                resto.
              </p>
            </div>

            <div className="relative group overflow-hidden bg-[#090c10]/75 border border-white/10 hover:border-white/25 rounded-2xl p-7 flex flex-col items-center text-center justify-center transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-[1.5px] card-specular-edge" />

              <h3 className="text-lg font-semibold text-white mb-3 text-center">
                Le abitudini
              </h3>
              <p className="text-sm text-white/70 leading-relaxed font-normal text-center">
                Non possiamo agire sul risultato: possiamo agire sul comportamento che ci
                porta al risultato.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          FASCIA STATEMENT: I TUOI COMPORTAMENTI DI OGGI...
          (Ingrigita leggermente per risultare naturale e armoniosa con il tema scuro)
          ===================================================================== */}
      <section className="w-full bg-[#d5d9df] text-[#090c10] py-12 sm:py-16 md:py-20 px-5 sm:px-8 relative z-10 shadow-lg border-y border-black/5">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-title text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-[#090c10] text-balance leading-snug">
            I tuoi comportamenti di oggi creano il te di domani
          </p>
        </div>
      </section>

      {/* =====================================================================
          5. SEZIONE "CHI SIAMO"
          - Foto integrale 2:3 di Valentina Palazzo con visibile il tavolo del workshop
          ===================================================================== */}
      <section id="chi-siamo" className="py-20 md:py-28 px-5 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white">
              Chi siamo
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Valentina Palazzo - Fotografia completa 2:3 non croppata con tavolo del workshop visibile */}
            <div className="relative group overflow-hidden bg-[#080b0f]/80 border border-white/10 hover:border-white/25 rounded-2xl p-6 sm:p-8 flex flex-col transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-[1.5px] card-specular-edge" />

              <div className="w-full aspect-[2/3] bg-[#0b0e14] border border-white/15 rounded-xl mb-6 overflow-hidden relative shadow-lg">
                <img
                  src={valentinaPhoto}
                  alt="Valentina Palazzo - behavioural designer al tavolo di lavoro del workshop"
                  className="w-full h-full object-cover object-bottom group-hover:scale-[1.01] transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/asset/Valentina.webp';
                  }}
                />
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">
                Valentina Palazzo
              </h3>
              <p className="text-sm text-white/75 leading-relaxed font-normal">
                Behavioural Designer e CEO. Usa behavioural design e gamification per costruire abitudini che reggono.
              </p>
            </div>

            {/* Gabriele Papparella con proporzioni coerenti 2:3 */}
            <div className="relative group overflow-hidden bg-[#080b0f]/80 border border-white/10 hover:border-white/25 rounded-2xl p-6 sm:p-8 flex flex-col transition-all duration-300">
              <div className="absolute top-0 left-0 right-0 h-[1.5px] card-specular-edge" />

              <div className="w-full aspect-[2/3] bg-[#0b0e14] border border-white/15 rounded-xl mb-6 overflow-hidden relative shadow-lg">
                <img
                  src={gabrielePhoto}
                  alt="Gabriele Papparella - istruttore avanzato Oxygen Advantage, coach di longevity e breathwork"
                  className="w-full h-full object-cover object-top group-hover:scale-[1.01] transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/asset/Gabriele.PNG';
                  }}
                />
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">
                Gabriele Papparella
              </h3>
              <p className="text-sm text-white/75 leading-relaxed font-normal">
                Istruttore avanzato Oxygen Advantage. Coach del respiro, Performance &amp; Longevità
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LINEA SEZIONALE CON RIFLESSO DINAMICO */}
      <div className="relative w-full h-[1px] bg-white/10 overflow-hidden">
        <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent line-sheen-sweep-delayed" />
      </div>

      {/* =====================================================================
          6. SEZIONE "BROCHURE"
          ===================================================================== */}
      <section id="brochure" className="py-20 md:py-28 px-5 sm:px-8">
        <div className="relative overflow-hidden max-w-4xl mx-auto bg-[#080b0f]/80 border border-white/10 rounded-2xl p-8 sm:p-12 text-center">
          <div className="absolute top-0 left-0 right-0 h-[1.5px] card-specular-edge" />

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white mb-8">
            Scarica la brochure del workshop
          </h2>

          <div className="inline-flex flex-col items-center">
            <a
              href="/LO%20OP%20%C2%B7%20Brochure.pdf"
              download="LO OP · Brochure.pdf"
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-white text-black font-medium text-sm tracking-wide border-2 border-white hover:bg-transparent hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
            >
              <FileDown className="w-4 h-4" />
              <span>Scarica il PDF</span>
            </a>
          </div>
        </div>
      </section>

      {/* LINEA SEZIONALE CON RIFLESSO DINAMICO */}
      <div className="relative w-full h-[1px] bg-white/10 overflow-hidden">
        <div className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent line-sheen-sweep" />
      </div>

      {/* =====================================================================
          7. SEZIONE "CONTATTI"
          ===================================================================== */}
      <section id="contatti" className="py-20 md:py-28 px-5 sm:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white mb-3">
              Scrivici
            </h2>
            <p className="text-sm text-white/60 font-normal">
              Scrivici per ricevere informazioni su posti e disponibilità per i prossimi moduli.
            </p>
          </div>

          {formSubmitted ? (
            <div className="relative overflow-hidden bg-[#080b0f]/85 border border-white/20 rounded-2xl p-8 sm:p-10 text-center">
              <div className="absolute top-0 left-0 right-0 h-[1.5px] card-specular-edge" />
              <div className="w-11 h-11 rounded-full border border-white mx-auto flex items-center justify-center mb-4">
                <Check className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Richiesta inviata con successo
              </h3>
              <p className="text-sm text-white/70 max-w-md mx-auto mb-6 leading-relaxed font-normal">
                Grazie {formData.nome}, il tuo messaggio è stato inoltrato a Valentina Palazzo. Ti risponderemo all&apos;indirizzo {formData.email} con tutti i dettagli.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFormSubmitted(false);
                  setFormData({ nome: '', email: '', messaggio: '', privacy: false });
                }}
                className="text-xs text-white/60 hover:text-white underline underline-offset-4"
              >
                Invia un&apos;altra richiesta
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitContact} noValidate className="space-y-6">
              <div>
                <label
                  htmlFor="contact-nome"
                  className="block text-xs text-white/80 mb-2 uppercase tracking-wider font-medium"
                >
                  Nome <span className="text-white/40">*</span>
                </label>
                <input
                  id="contact-nome"
                  type="text"
                  value={formData.nome}
                  onChange={(e) => {
                    setFormData({ ...formData, nome: e.target.value });
                    if (formErrors.nome) setFormErrors({ ...formErrors, nome: '' });
                  }}
                  placeholder="Nome e cognome"
                  className="w-full bg-[#0a0d12] border border-white/20 focus:border-white rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus-visible:outline-none transition-colors"
                />
                {formErrors.nome && (
                  <p className="text-xs text-white/80 mt-1.5">{formErrors.nome}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-xs text-white/80 mb-2 uppercase tracking-wider font-medium"
                >
                  Email <span className="text-white/40">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                  }}
                  placeholder="nome@dominio.it"
                  className="w-full bg-[#0a0d12] border border-white/20 focus:border-white rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus-visible:outline-none transition-colors"
                />
                {formErrors.email && (
                  <p className="text-xs text-white/80 mt-1.5">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-messaggio"
                  className="block text-xs text-white/80 mb-2 uppercase tracking-wider font-medium"
                >
                  Messaggio <span className="text-white/40">(opzionale)</span>
                </label>
                <textarea
                  id="contact-messaggio"
                  rows={4}
                  value={formData.messaggio}
                  onChange={(e) => setFormData({ ...formData, messaggio: e.target.value })}
                  placeholder="Domande specifiche, obiettivi o moduli di interesse..."
                  className="w-full bg-[#0a0d12] border border-white/20 focus:border-white rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus-visible:outline-none transition-colors resize-y"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.privacy}
                    onChange={(e) => {
                      setFormData({ ...formData, privacy: e.target.checked });
                      if (formErrors.privacy) setFormErrors({ ...formErrors, privacy: '' });
                    }}
                    className="mt-0.5 h-4 w-4 rounded-md bg-[#0a0d12] border border-white/30 checked:bg-white checked:border-white focus:ring-0 focus:outline-none cursor-pointer"
                  />
                  <span className="text-xs text-white/70 leading-relaxed group-hover:text-white/90 transition-colors">
                    Dichiaro di aver letto la{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCookieModalOpen(true);
                      }}
                      className="underline underline-offset-2 hover:text-white"
                    >
                      privacy e cookie policy
                    </button>{' '}
                    e acconsento al trattamento dei dati personali per ricevere informazioni sul workshop LO/OP.
                  </span>
                </label>
                {formErrors.privacy && (
                  <p className="text-xs text-white/80 mt-1.5">{formErrors.privacy}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-full bg-white text-black font-semibold text-sm tracking-wide border-2 border-white hover:bg-transparent hover:text-white transition-all duration-200 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Inoltro in corso...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Invia</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* =====================================================================
          8. FOOTER
          ===================================================================== */}
      <footer className="border-t border-white/10 bg-[#040608]/90 py-16 px-5 sm:px-8 mt-auto">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div>
              <span className="font-title text-base font-bold tracking-wider text-white">
                LO/OP
              </span>
              <p className="font-title text-xs text-white/50 mt-0.5">
                Longevity Optimized
              </p>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-xs text-white/60 tracking-wide font-medium">
                Seguici:
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  aria-label="Seguici su Instagram [URL da inserire]"
                  className="p-2.5 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                <a
                  href="#"
                  aria-label="Seguici su LinkedIn [URL da inserire]"
                  className="p-2.5 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                >
                  <Linkedin className="w-4 h-4" />
                </a>

                <a
                  href="#"
                  aria-label="Seguici su YouTube [URL da inserire]"
                  className="p-2.5 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-white transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          <div className="text-xs text-white/50 leading-relaxed max-w-3xl border-l border-white/20 pl-4 py-1">
            <p>
              Contenuti a scopo educativo, non sostituiscono il parere medico. Alcune
              pratiche di respirazione non sono adatte a tutti (es. gravidanza,
              epilessia, problemi cardiovascolari): in caso di dubbi chiedi al tuo
              medico.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 border-t border-white/10 font-mono text-xs text-white/50">
            <div>
              © LO/OP {new Date().getFullYear()}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>Valentina Palazzo - P.IVA: 13006440013</span>
              <span className="hidden sm:inline opacity-30">·</span>
              <span>Gabriele Papparella - P.IVA: 02982530301</span>
            </div>
            <div>
              <button
                type="button"
                onClick={() => setCookieModalOpen(true)}
                className="hover:text-white transition-colors underline underline-offset-2"
              >
                cookie policy
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* =====================================================================
          9. MODALE COOKIE POLICY & PRIVACY
          ===================================================================== */}
      {cookieModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-title"
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-[#0b0e14] border border-white/20 rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <h3 id="cookie-modal-title" className="font-semibold text-white text-base">
                Informativa Cookie & Privacy
              </h3>
              <button
                type="button"
                onClick={() => setCookieModalOpen(false)}
                className="text-white/60 hover:text-white p-1 rounded-full"
                aria-label="Chiudi finestra modale"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-white/75 space-y-3 leading-relaxed">
              <p>
                Questo sito utilizza esclusivamente cookie tecnici necessari al corretto funzionamento e alla navigazione delle sezioni.
              </p>
              <p>
                Nessun dato di tracciamento o cookie di profilazione di terze parti viene installato. I dati inseriti nel modulo di contatto sono inoltrati per esclusiva finalità di risposta alle richieste informative sul workshop LO/OP a vale.palazzo@gmail.com.
              </p>
              <p className="font-mono text-[11px] text-white/50">
                Valentina Palazzo - P.IVA: 13006440013 · Gabriele Papparella - P.IVA: 02982530301
              </p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setCookieModalOpen(false)}
                className="px-6 py-2 rounded-full bg-white text-black text-xs font-medium hover:bg-white/80 transition-colors font-mono"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
