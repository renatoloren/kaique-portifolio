"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./About.module.css";

gsap.registerPlugin(ScrollTrigger);

const textParts = [
  {
    text: "Experiência em filmagens, direção de fotografia e edição, crio vídeos que unem estética, ritmo e storytelling ",
  },
  {
    text: "para dar destaque à sua marca, coleção ou projeto pessoal. Qualificado para levar sua visão do papel para a tela com ",
  },
  { text: "criatividade e ", highlight: true },
  { text: "técnica.", highlight: true },
];

const titleParts = [{ text: "Estética, ritmo e storytelling..." }];

const renderAnimatedText = (parts, extraClassName = "") =>
  parts.map((part, partIndex) =>
    part.text.split(/(\s+)/).map((token, tokenIndex) => {
      if (!token.trim()) {
        return (
          <React.Fragment key={`${partIndex}-${tokenIndex}`}>
            {token}
          </React.Fragment>
        );
      }

      return (
        <span key={`${partIndex}-${tokenIndex}`} className={styles.wordWrap}>
          <span
            className={`${styles.wordInner} ${extraClassName} ${
              part.highlight ? styles.highlight : ""
            }`}
          >
            {token}
          </span>
        </span>
      );
    }),
  );

const About = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const titleRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const title = titleRef.current;
    const text = textRef.current;

    if (!section || !image || !title || !text) return;

    const words = [
      ...gsap.utils.toArray(`.${styles.wordInner}`, title),
      ...gsap.utils.toArray(`.${styles.wordInner}`, text),
    ];
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      gsap.set([image, ...words], { clearProps: "all" });
      return;
    }

    const ctx = gsap.context(() => {
      const setup = () => {
        const sectionBox = section.getBoundingClientRect();
        const imageBox = image.getBoundingClientRect();
        const imageStartScale = window.innerWidth <= 690 ? 0.48 : 0.34;
        const targetTop = sectionBox.top + 16;
        const imageCenter = imageBox.left + imageBox.width / 2;
        const targetImageCenter = imageCenter;

        gsap.set(image, {
          x: targetImageCenter - imageCenter,
          y: targetTop - imageBox.top,
          scale: imageStartScale,
          transformOrigin: "top center",
        });

        gsap.set(words, {
          yPercent: 110,
          opacity: 0,
        });
      };

      setup();

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top 82%",
          end: "top 5%",
          scrub: true,
          invalidateOnRefresh: true,
          onRefresh: setup,
        },
      });

      tl.to(image, { x: 0, y: 0, scale: 1, duration: 0.82 }, 0.18).to(
        words,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.16,
          ease: "power3.out",
          stagger: 0.007,
        },
        0.56,
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className={styles.about_section}>
      <img
        ref={imageRef}
        src="images/me_3.GIF"
        className={styles.about_picture}
        alt="Kaique Morais"
      />

      <div className={styles.aboutTextWrapper}>
        <div className={styles.textReveal}>
          <h2 ref={titleRef} className={styles.aboutTitle}>
            {renderAnimatedText(titleParts, styles.aboutTitleWord)}
          </h2>
        </div>

        <div className={styles.textReveal}>
          <p ref={textRef} className={styles.aboutText}>
            {renderAnimatedText(textParts)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
