"use client";

import Header from "../Header/Header";
import Welcome from "../Welcome/Welcome";
import About from "../About/About";
import Contact from "../Contact/Contact";
import styles from "./Home.module.css";
import ScrollShowcase from "../Projects/ScrollShowcase";
import SmoothScroll from "../SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
      <Header />
      <div className={styles.container}>
        <div className={styles.gridDecor} aria-hidden="true">
          <div className={styles.col}></div>
          <div className={styles.col}></div>
          <div className={styles.col}></div>
          <div className={styles.col}></div>
          <div className={styles.col}></div>
        </div>

        <Welcome />
        <About />

        <ScrollShowcase />

        <Contact />
      </div>
    </SmoothScroll>
  );
}
