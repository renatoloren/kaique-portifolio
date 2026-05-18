"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Contact.module.css";

gsap.registerPlugin(ScrollTrigger);

const EMAIL = "email@email.com";
const TITLE_WORDS = ["Entre", "em", "contato"];

const renderTitle = () =>
  TITLE_WORDS.map((word) => (
    <span key={word} className={styles.titleWordWrap}>
      <span className={`${styles.revealInner} ${styles.titleWordInner}`}>
        {word}
      </span>
    </span>
  ));

const renderRevealWords = (text) =>
  text.split(/(\s+)/).map((token, index) => {
    if (!token.trim()) {
      return <React.Fragment key={index}>{token}</React.Fragment>;
    }

    return (
      <span key={index} className={styles.revealWrap}>
        <span className={styles.revealInner}>{token}</span>
      </span>
    );
  });

const renderWaveText = (text) =>
  Array.from(text).map((char, index) => (
    <span
      key={`${char}-${index}`}
      className={styles.waveChar}
      style={{ "--wave-index": index }}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));

const Contact = () => {
  const contactRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const contact = contactRef.current;
    const title = titleRef.current;
    const content = contentRef.current;
    if (!contact || !title || !content) return;

    const revealItems = [
      ...gsap.utils.toArray(`.${styles.revealInner}`, title),
      ...gsap.utils.toArray(`.${styles.revealInner}`, content),
    ];
    const titleWords = gsap.utils.toArray(`.${styles.titleWordInner}`, title);
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const fitTitle = () => {
      const isMobile = window.innerWidth <= 690;
      const maxSize = isMobile ? 96 : 220;
      const minSize = isMobile ? 26 : 18;
      let size = isMobile
        ? Math.min(window.innerWidth * 0.2, maxSize)
        : maxSize;

      title.style.setProperty("--contact-title-size", `${size}px`);

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
        title.style.setProperty("--contact-title-size", `${size}px`);
      }
    };

    fitTitle();

    const resizeObserver = new ResizeObserver(fitTitle);
    resizeObserver.observe(title);
    window.addEventListener("resize", fitTitle);
    document.fonts?.ready.then(fitTitle);

    if (reduceMotion) {
      gsap.set(revealItems, { clearProps: "all" });
      return () => {
        resizeObserver.disconnect();
        window.removeEventListener("resize", fitTitle);
      };
    }

    const ctx = gsap.context(() => {
      gsap.set(revealItems, { yPercent: 110, opacity: 0 });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: contact,
            start: "top 78%",
            end: "top 35%",
            scrub: true,
          },
        })
        .to(revealItems, {
          yPercent: 0,
          opacity: 1,
          duration: 0.16,
          ease: "power3.out",
          stagger: 0.02,
        });
    }, contact);

    return () => {
      ctx.revert();
      resizeObserver.disconnect();
      window.removeEventListener("resize", fitTitle);
    };
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="contact" ref={contactRef} className={styles.contact}>
      <h2 ref={titleRef} className={styles.message}>
        {renderTitle()}
      </h2>

      <div ref={contentRef} className={styles.contactContent}>
        <button
          type="button"
          className={styles.email}
          onClick={copyEmail}
          aria-label={`Copiar email ${EMAIL}`}
        >
          <span className={`${styles.emailText} ${styles.revealInner} ${styles.waveText}`}>
            {renderWaveText(copied ? "copiado" : EMAIL)}
          </span>
        </button>

        <footer className={styles.pageFooter}>
          <p className={styles.mark}>{renderRevealWords("kaique morais 2025")}</p>
          <div className={styles.socials}>
            <a>
              <span className={`${styles.revealInner} ${styles.waveText}`}>
                {renderWaveText("linkedin")}
              </span>
            </a>
            <a>
              <span className={`${styles.revealInner} ${styles.waveText}`}>
                {renderWaveText("whatsapp")}
              </span>
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Contact;
