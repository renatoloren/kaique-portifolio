'use client';

import styles from './Welcome.module.css';

export default function Welcome() {
  return (
    <section className={styles.welcome_section}>
      {/* Colunas com divisórias e feixes */}
      <div className={styles.col}></div>
      <div className={styles.col}></div>
      <div className={styles.col}></div>
      <div className={styles.col}></div>
      <div className={styles.col}></div>

      {/* Conteúdo sobreposto */}
      <div className={styles.text_content}>
<h1 className={styles.welcome_name}>
  <span className={styles.name_first}>kaique</span>
  {' '}
  <span className={styles.name_last}>morais</span>
</h1>
        <h2 className={styles.welcome_subtitle}>
          {"Traduzindo ideias como "}
          <span className={styles.highlight}>{"videomaker "}</span>
          {"em linguagem visual"}
        </h2>
      </div>
    </section>
  );
}