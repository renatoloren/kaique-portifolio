'use client';

import LavaLamp from '../LavaLamp/LavaLamp';
import styles from './Welcome.module.css'

export default function Welcome() {
  return (
    <>
      <section className={styles.welcome}>
        <h1 className={styles.welcome_name}>
          kaique morais
        </h1>
        <h1 className={styles.welcome_role}>
          videomaker
        </h1>
      </section>
      <div className={styles.lavaWrapper}>
        <LavaLamp />
        <div className={styles.transition}></div>
      </div>
    </>

  );
}
