'use client';

import styles from './Welcome.module.css'

export default function Welcome() {
  return (
      <section className={styles.welcome}>

        <h1 className={styles.welcome_name}>
          kaique morais
        </h1>
        <h1 className={styles.welcome_role}>
            {"Traduzindo ideias como "} 
            <span class={styles.highlight}>{"videomaker "}</span> 
            {"em linguagem visual"}
        </h1>
      </section>
  );
}
