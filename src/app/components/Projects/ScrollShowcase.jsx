import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ScrollShowcase.module.css";
import PROJECTS from "../../../data/projects.json";
import { createPortal } from "react-dom";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_PER_SLIDE = 700;
const TRANSITION_ZONE = 0.3;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const TITLE_WORDS = ["Projetos", "selecionados"];

const renderAnimatedTitle = () =>
  TITLE_WORDS.map((word) => (
    <span key={word} className={styles.sectionTitleWordWrap}>
      <span className={styles.sectionTitleWordInner}>{word}</span>
    </span>
  ));

function YoutubeModal({ youtubeId, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    // NÃO bloqueia overflow aqui — o smoother controla isso
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!mounted) return null;

  // Renderiza direto no document.body, fora do smooth-wrapper
  return createPortal(
    <div
      className={styles.modalOverlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modalBox}>
        <button className={styles.modalClose} onClick={onClose}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d="M1 1L9 9M9 1L1 9"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
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
    </div>,
    document.body,
  );
}

export default function ScrollShowcase() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const mediaRefs = useRef([]);
  const textRefs = useRef([]);
  const dotRefs = useRef([]);
  const hintRef = useRef(null);
  const N = PROJECTS.length;

  const [modalId, setModalId] = useState(null);
  const openModal = useCallback((id) => setModalId(id), []);
  const closeModal = useCallback(() => setModalId(null), []);

  useEffect(() => {
    const container = containerRef.current;
    const title = titleRef.current;
    if (!container || !title) return;

    const titleWords = gsap.utils.toArray(
      `.${styles.sectionTitleWordInner}`,
      title,
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const fitTitle = () => {
      const isMobile = window.innerWidth <= 690;
      const maxSize = isMobile ? 96 : 220;
      const minSize = isMobile ? 24 : 16;
      let size = isMobile
        ? Math.min(window.innerWidth * 0.22, maxSize)
        : maxSize;

      title.style.setProperty("--project-title-size", `${size}px`);

      const isOverflowing = () => {
        if (isMobile) {
          return titleWords.some(
            (word) => word.getBoundingClientRect().width > title.clientWidth,
          );
        }

        return title.scrollWidth > title.clientWidth;
      };

      while (isOverflowing() && size > minSize) {
        size -= 1;
        title.style.setProperty("--project-title-size", `${size}px`);
      }
    };

    fitTitle();

    const resizeObserver = new ResizeObserver(fitTitle);
    resizeObserver.observe(title);
    window.addEventListener("resize", fitTitle);
    document.fonts?.ready.then(fitTitle);

    if (reduceMotion) {
      gsap.set(titleWords, { clearProps: "all" });
      return () => {
        resizeObserver.disconnect();
        window.removeEventListener("resize", fitTitle);
      };
    }

    const ctx = gsap.context(() => {
      gsap.set(titleWords, {
        yPercent: 110,
        opacity: 0,
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: container,
            start: "top 85%",
            end: "top 35%",
            scrub: true,
          },
        })
        .to(titleWords, {
          yPercent: 0,
          opacity: 1,
          duration: 0.16,
          ease: "power3.out",
          stagger: 0.07,
        });
    }, container);

    return () => {
      ctx.revert();
      resizeObserver.disconnect();
      window.removeEventListener("resize", fitTitle);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky = stickyRef.current;
    if (!section || !sticky) return;

    const totalScrollHeight = N * SCROLL_PER_SLIDE;
    let st;

    // Aguarda o smoother estar pronto antes de criar o ScrollTrigger
    const init = () => {
      const mediaLayers = mediaRefs.current;
      const textSlides = textRefs.current;
      const dots = dotRefs.current;
      const hint = hintRef.current;

      gsap.set(mediaLayers, { opacity: 0, force3D: true });
      gsap.set(mediaLayers[0], { opacity: 1 });
      gsap.set(textSlides, { opacity: 0, y: 40, force3D: true });
      gsap.set(textSlides[0], { opacity: 1, y: 0 });
      gsap.set(dots, { scale: 1, width: 4, height: 4 });
      gsap.set(dots[0], { scale: 1.5, width: 5, height: 5 });

      st = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${totalScrollHeight}`,
        pin: sticky, // ScrollTrigger pina o elemento em vez do CSS sticky
        pinSpacing: false, // o espaço já é dado pelo <div style={{height}}>
        scrub: true,
        onUpdate: (self) => {
          const scrolled = self.progress * totalScrollHeight;

          if (hint) gsap.set(hint, { opacity: scrolled < 80 ? 1 : 0 });

          if (scrolled <= 0) {
            mediaLayers.forEach((el, i) =>
              gsap.set(el, { opacity: i === 0 ? 1 : 0 }),
            );
            textSlides.forEach((el, i) =>
              gsap.set(el, {
                opacity: i === 0 ? 1 : 0,
                y: i === 0 ? 0 : 40,
                pointerEvents: i === 0 ? "all" : "none",
              }),
            );
            dots.forEach((el, i) =>
              gsap.set(el, {
                scale: i === 0 ? 1.5 : 1,
                width: i === 0 ? 5 : 4,
                height: i === 0 ? 5 : 4,
              }),
            );
            return;
          }

          if (scrolled >= totalScrollHeight) {
            mediaLayers.forEach((el, i) =>
              gsap.set(el, { opacity: i === N - 1 ? 1 : 0 }),
            );
            textSlides.forEach((el, i) =>
              gsap.set(el, {
                opacity: i === N - 1 ? 1 : 0,
                y: i === N - 1 ? 0 : -40,
                pointerEvents: i === N - 1 ? "all" : "none",
              }),
            );
            dots.forEach((el, i) =>
              gsap.set(el, {
                scale: i === N - 1 ? 1.5 : 1,
                width: i === N - 1 ? 5 : 4,
                height: i === N - 1 ? 5 : 4,
              }),
            );
            return;
          }

          const globalT = scrolled / SCROLL_PER_SLIDE;
          const baseIdx = Math.floor(globalT);
          const frac = globalT - baseIdx;
          const curIdx = clamp(baseIdx, 0, N - 1);
          const nextIdx = clamp(baseIdx + 1, 0, N - 1);

          let blendT =
            frac > 1 - TRANSITION_ZONE
              ? (frac - (1 - TRANSITION_ZONE)) / TRANSITION_ZONE
              : 0;
          blendT = easeInOut(clamp(blendT, 0, 1));

          mediaLayers.forEach((el, i) => {
            let opacity = 0;
            if (i === curIdx && nextIdx !== curIdx) opacity = 1 - blendT;
            if (i === nextIdx && nextIdx !== curIdx) opacity = blendT;
            if (i === curIdx && nextIdx === curIdx) opacity = 1;
            gsap.set(el, { opacity });
          });

          const txtStart = 1 - TRANSITION_ZONE * 0.75;
          let textT =
            frac > txtStart ? (frac - txtStart) / (TRANSITION_ZONE * 0.75) : 0;
          textT = easeInOut(clamp(textT, 0, 1));

          textSlides.forEach((el, i) => {
            let opacity = 0;
            let y = i < curIdx ? -40 : 40;

            if (i === curIdx && nextIdx !== curIdx) {
              opacity = 1 - textT;
              y = -40 * textT;
            } else if (i === nextIdx && nextIdx !== curIdx) {
              opacity = textT;
              y = 40 * (1 - textT);
            } else if (i === curIdx) {
              opacity = 1;
              y = 0;
            }

            gsap.set(el, {
              opacity,
              y,
              pointerEvents: opacity > 0.5 ? "all" : "none",
            });
          });

          const activeDot = blendT > 0.5 ? nextIdx : curIdx;
          dots.forEach((el, i) => {
            gsap.set(el, {
              scale: i === activeDot ? 1.5 : 1,
              width: i === activeDot ? 5 : 4,
              height: i === activeDot ? 5 : 4,
            });
          });
        },
      });

      return () => st.kill();
    };

    // Pequeno delay para garantir que o ScrollSmoother já inicializou
    const timeout = setTimeout(init, 100);
    return () => {
      clearTimeout(timeout);
      st?.kill();
    };
  }, [N]);

  const totalScrollHeight = N * SCROLL_PER_SLIDE;

  return (
    <div ref={containerRef} className={styles.projects_container}>
      <h1 ref={titleRef} className={styles.section_title}>
        {renderAnimatedTitle()}
      </h1>
      <section ref={sectionRef} className={styles.section}>
        {/* ref aqui — este é o elemento que o ScrollTrigger vai pinar */}
        <div ref={stickyRef} className={styles.sticky}>
          {PROJECTS.map((p, i) => (
            <div
              key={i}
              ref={(el) => {
                mediaRefs.current[i] = el;
              }}
              className={styles.mediaLayer}
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              {p.media.type === "video" ? (
                <video src={p.media.src} autoPlay muted loop playsInline />
              ) : (
                <img src={p.media.src} alt="" />
              )}
            </div>
          ))}

          <div className={styles.vignette} />

          <div className={styles.textWrapper}>
            <div className={styles.textTrack}>
              {PROJECTS.map((p, i) => {
                return (
                  <div
                    key={i}
                    ref={(el) => {
                      textRefs.current[i] = el;
                    }}
                    className={styles.textSlide}
                    style={{
                      opacity: i === 0 ? 1 : 0,
                      transform: `translateY(${i === 0 ? 0 : 40}px)`,
                      pointerEvents: i === 0 ? "all" : "none",
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
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
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

          <div className={styles.dots}>
            {PROJECTS.map((_, i) => (
              <div
                key={i}
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                className={styles.dot}
                style={{
                  width: i === 0 ? 5 : 4,
                  height: i === 0 ? 5 : 4,
                  transform: `scale(${i === 0 ? 1.5 : 1})`,
                }}
              />
            ))}
          </div>

          <div ref={hintRef} className={styles.hint}>
            <span className={styles.hintLabel}>scroll</span>
            <div className={styles.hintLine}>
              <div className={styles.hintLineInner} />
            </div>
          </div>
        </div>

        {/* espaço de scroll — o pin do ScrollTrigger usa isso */}
        <div style={{ height: totalScrollHeight }} />

        {modalId && <YoutubeModal youtubeId={modalId} onClose={closeModal} />}
      </section>
    </div>
  );
}
