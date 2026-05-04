import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./ScrollShowcase.module.css";
import PROJECTS from "../../../data/projects.json";

/* ══════════════════════════════════════════════
   CONFIGURAÇÃO
══════════════════════════════════════════════ */
const SCROLL_PER_SLIDE = 700;  // px de scroll por projeto
const TRANSITION_ZONE  = 0.3; // fração onde o crossfade começa (0–1)

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
const clamp     = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

/* ══════════════════════════════════════════════
   MODAL YOUTUBE
══════════════════════════════════════════════ */
function YoutubeModal({ youtubeId, onClose }) {
  // Bloqueia scroll da página enquanto o modal estiver aberto
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Fecha com Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className={styles.modalBox}>
        <button className={styles.modalClose} onClick={onClose}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          Fechar
        </button>

        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title="YouTube video"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   CAMADA DE MÍDIA
══════════════════════════════════════════════ */
function MediaLayer({ media, opacity }) {
  return (
    <div className={styles.mediaLayer} style={{ opacity, transition: "none" }}>
      {media.type === "video" ? (
        <video src={media.src} autoPlay muted loop playsInline />
      ) : (
        <img src={media.src} alt="" />
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════ */
export default function ScrollShowcase() {
  const sectionRef = useRef(null);

  const [bgOpacities, setBgOpacities] = useState(() =>
    PROJECTS.map((_, i) => (i === 0 ? 1 : 0))
  );
  const [textStates, setTextStates] = useState(() =>
    PROJECTS.map((_, i) => ({ opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 40 }))
  );
  const [activeDot, setActiveDot] = useState(0);
  const [showHint,  setShowHint]  = useState(true);

  // Modal: guarda o youtubeId do projeto ativo, ou null se fechado
  const [modalId, setModalId] = useState(null);
  const openModal  = useCallback((id) => setModalId(id), []);
  const closeModal = useCallback(() => setModalId(null), []);

  useEffect(() => {
    function onScroll() {
      const section = sectionRef.current;
      if (!section) return;

      const secTop  = section.getBoundingClientRect().top + window.scrollY;
      const scrolled = window.scrollY - secTop;
      const N = PROJECTS.length;

      setShowHint(scrolled < 80);

      if (scrolled <= 0) {
        setBgOpacities(PROJECTS.map((_, i) => (i === 0 ? 1 : 0)));
        setTextStates(PROJECTS.map((_, i) => ({ opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 40 })));
        setActiveDot(0);
        return;
      }

      if (scrolled >= N * SCROLL_PER_SLIDE) {
        setBgOpacities(PROJECTS.map((_, i) => (i === N - 1 ? 1 : 0)));
        setTextStates(PROJECTS.map((_, i) => ({ opacity: i === N - 1 ? 1 : 0, y: i === N - 1 ? 0 : -40 })));
        setActiveDot(N - 1);
        return;
      }

      const globalT = scrolled / SCROLL_PER_SLIDE;
      const baseIdx = Math.floor(globalT);
      const frac    = globalT - baseIdx;
      const curIdx  = clamp(baseIdx, 0, N - 1);
      const nextIdx = clamp(baseIdx + 1, 0, N - 1);

      // — imagens —
      let blendT = frac > (1 - TRANSITION_ZONE)
        ? (frac - (1 - TRANSITION_ZONE)) / TRANSITION_ZONE
        : 0;
      blendT = easeInOut(clamp(blendT, 0, 1));

      setBgOpacities(PROJECTS.map((_, i) => {
        if (i === curIdx  && nextIdx !== curIdx) return 1 - blendT;
        if (i === nextIdx && nextIdx !== curIdx) return blendT;
        if (i === curIdx)  return 1;
        return 0;
      }));

      // — textos —
      const txtStart = 1 - TRANSITION_ZONE * 0.75;
      let textT = frac > txtStart
        ? (frac - txtStart) / (TRANSITION_ZONE * 0.75)
        : 0;
      textT = easeInOut(clamp(textT, 0, 1));

      setTextStates(PROJECTS.map((_, i) => {
        if (i === curIdx  && nextIdx !== curIdx) return { opacity: 1 - textT, y: -40 * textT };
        if (i === nextIdx && nextIdx !== curIdx) return { opacity: textT, y: 40 * (1 - textT) };
        if (i === curIdx)  return { opacity: 1, y: 0 };
        return { opacity: 0, y: i < curIdx ? -40 : 40 };
      }));

      setActiveDot(blendT > 0.5 ? nextIdx : curIdx);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const totalScrollHeight = PROJECTS.length * SCROLL_PER_SLIDE;

  return (
    <div className={styles.projects_container}>
      <h1 className={styles.section_title}>Projetos selecionados</h1>
      <section ref={sectionRef} className={styles.section}>

        {/* ── sticky viewport ── */}
        <div className={styles.sticky}>

          {/* ── camadas de fundo ── */}
          {PROJECTS.map((p, i) => (
            <MediaLayer key={i} media={p.media} opacity={bgOpacities[i]} />
          ))}

          {/* ── vinheta ── */}
          <div className={styles.vignette} />

          {/* ── textos centrais ── */}
          <div className={styles.textWrapper}>
            <div className={styles.textTrack}>
              {PROJECTS.map((p, i) => {
                const ts = textStates[i];
                return (
                  <div
                    key={i}
                    className={styles.textSlide}
                    style={{
                      opacity: ts.opacity,
                      transform: `translateY(${ts.y}px)`,
                      pointerEvents: ts.opacity > 0.5 ? "all" : "none",
                      transition: "none",
                    }}
                  >
                    <span className={styles.textLabel}>{p.label}</span>
                    <span className={styles.textClient}>{p.client}</span>

                    <button
                      className={styles.btn}
                      onClick={() => openModal(p.youtubeId)}
                    >
                      Ver projeto
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2 10L10 2M10 2H4M10 2V8"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── dots laterais ── */}
          <div className={styles.dots}>
            {PROJECTS.map((_, i) => (
              <div
                key={i}
                className={`${styles.dot} ${i === activeDot ? styles.dotActive : ""}`}
              />
            ))}
          </div>

          {/* ── hint de scroll ── */}
          <div className={styles.hint} style={{ opacity: showHint ? 1 : 0 }}>
            <span className={styles.hintLabel}>scroll</span>
            <div className={styles.hintLine}>
              <div className={styles.hintLineInner} />
            </div>
          </div>

        </div>

        {/* ── espaço de scroll ── */}
        <div style={{ height: totalScrollHeight }} />

        {/* ── modal YouTube ── */}
        {modalId && (
          <YoutubeModal youtubeId={modalId} onClose={closeModal} />
        )}

      </section>
    </div>
  );
}
