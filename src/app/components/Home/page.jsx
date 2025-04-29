'use client';

import Header from '../Header/Header';
import HomeText from '../HomeText/HomeText';
import styles from './Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
        <Header />
        <section className={styles.welcome}>
            <HomeText />
        </section>
    </div>
  );
}
