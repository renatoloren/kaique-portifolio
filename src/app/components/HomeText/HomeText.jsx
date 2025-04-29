'use client';

import { useEffect, useRef } from 'react';
import styles from './HomeText.module.css'

export default function HomeText() {
  const textRef = useRef(null);

  useEffect(() => {
    const phrases = [
      'Motion Designer',
      'Editor de Vídeos',
      'videomaker',
    ];

    let index = 0;

    const typeText = (text, onComplete) => {
      let i = 0;
      const interval = setInterval(() => {
        if (textRef.current) {
          textRef.current.innerText = text.slice(0, i + 1);
          i++;
          if (i === text.length) {
            clearInterval(interval);
            setTimeout(onComplete, 1500); // espera antes de apagar
          }
        }
      }, 100);
    };

    const deleteText = (onComplete) => {
      const interval = setInterval(() => {
        if (textRef.current) {
          const currentText = textRef.current.innerText;
          if (currentText.length === 0) {
            clearInterval(interval);
            setTimeout(onComplete, 500); // espera antes da próxima frase
          } else {
            textRef.current.innerText = currentText.slice(0, -1); // remove a ÚLTIMA letra
          }
        }
      }, 75);
    };

    const loop = () => {
      const phrase = phrases[index];
      typeText(phrase, () => {
        deleteText(() => {
          index = (index + 1) % phrases.length;
          loop();
        });
      });
    };

    loop(); // inicia o ciclo

  }, []);

  return (
    <div className={styles.title}>
      <h1 className={styles.name}>kaique morais</h1>
      <h1 ref={textRef} className={styles.animationText}/>
    </div>
  );
}
