'use client';

import styles from './Welcome.module.css';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
export default function Welcome() {
    const nameRef     = useRef(null);
  const subtitleRef = useRef(null);

  useEffect(() => {
    const lines    = nameRef.current?.querySelectorAll(`.${styles.line_inner}`);
    const subtitle = subtitleRef.current;

    // Estado inicial via GSAP (não depende do CSS)
    gsap.set(lines,    { yPercent: 110 });
    gsap.set(subtitle, { opacity: 0, y: 20 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to(lines,    { yPercent: 0, duration: 1, stagger: 0.12 })
      .to(subtitle, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4');

    return () => { tl.kill(); };
  }, []);

  return (
    <section className={styles.welcome_section}>

    <div className={styles.text_content}>
            <h1 ref={nameRef} className={styles.welcome_name}>
              <span className={styles.line_wrap}>
                <span className={`${styles.line_inner} ${styles.name_first}`}>kaique</span>
              </span>
              {' '}
              <span className={styles.line_wrap}>
                <span className={`${styles.line_inner} ${styles.name_last}`}>morais</span>
              </span>
            </h1>

            <h2 ref={subtitleRef} className={styles.welcome_subtitle}>
              {"Traduzindo ideias como "}
              <span className={styles.highlight}>{"videomaker "}</span>
              {"em linguagem visual"}
            </h2>
          </div>
    </section>
  );
}