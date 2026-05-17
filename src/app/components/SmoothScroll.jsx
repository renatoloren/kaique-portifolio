'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function SmoothScroll({ children }) {
  const wrapper = useRef(null);
  const content = useRef(null);

  useEffect(() => {
    // ScrollTrigger precisa saber o scroller ANTES do smoother ser criado
    ScrollTrigger.defaults({ scroller: wrapper.current });

    const smoother = ScrollSmoother.create({
      wrapper: wrapper.current,
      content: content.current,
      smooth: 1.2,
      effects: true,
    });

    window.__smoother = smoother;

    return () => {
      smoother.kill();
      ScrollTrigger.defaults({ scroller: window });
      delete window.__smoother;
    };
  }, []);

  return (
    <div ref={wrapper} id="smooth-wrapper">
      <div ref={content} id="smooth-content">
        {children}
      </div>
    </div>
  );
}