'use client';

import Header from '../Header/Header';
import Welcome from '../Welcome/Welcome';
import About from '../About/About';
import Projects from '../Projects/Projects';
import Contact from '../Contact/Contact';
import styles from './Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
        <Header />
        <Welcome />
        <About/>
        <Projects/>
        <Contact />
    </div>
  );
}
