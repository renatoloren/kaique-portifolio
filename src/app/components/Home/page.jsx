'use client';

import Header from '../Header/Header';
import Welcome from '../Welcome/Welcome';
import About from '../About/About';
import Contact from '../Contact/Contact';
import styles from './Home.module.css'
import ScrollShowcase from '../Projects/ScrollShowcase';
import SmoothScroll from '../SmoothScroll';

export default function Home() {
  return (

    <SmoothScroll>
            <Header />
            <Welcome />
            <About/>

            <ScrollShowcase/>

            <Contact />
    </SmoothScroll>
  );
}
