import React, { useRef, useEffect, useState, useCallback } from 'react'
import styles from './Projects.module.css'
import projects from '@/data/projects.json'
import ProjectCard from '../ProjectCard/ProjectCard'

const Projects = () => {
  const sectionRef = useRef(null)
  const [enterProgress, setEnterProgress] = useState(0)
  const [slideProgress, setSlideProgress] = useState(0)

  const cards = projects.filter(p => p.images?.[0])

  const handleScroll = useCallback(() => {
    const section = sectionRef.current
    if (!section) return

    const sectionTopInViewport = section.getBoundingClientRect().top
    const vh = window.innerHeight
    const enter = Math.min(1, Math.max(0, 1 - sectionTopInViewport / vh))
    setEnterProgress(enter)

    const offsetTop = section.getBoundingClientRect().top + window.scrollY
    const scrolled = window.scrollY - offsetTop
    const totalScroll = section.offsetHeight - window.innerHeight
    const raw = (Math.max(0, scrolled) / totalScroll) * (cards.length - 1)
    setSlideProgress(Math.min(cards.length - 1, Math.max(0, raw)))
  }, [cards.length])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const entryScale = 0.3 + enterProgress * 0.7

const getCardStyle = (i) => {
  const offset = i - slideProgress

  // Card saindo para a esquerda
  if (offset < 0) {
    const t = Math.min(1, -offset)
    const x = -t * 130
    const rotY = -t * 45
    const scale = 1 - t * 0.25

    // Fade só começa depois de 40% da transição
    const fadeT = Math.max(0, (-offset - 0.3) / 0.4)
    const opacity = 1 - fadeT

    return {
      transform: `translateX(${x}%) rotateY(${rotY}deg) scale(${scale})`,
      opacity: Math.max(0, opacity),
      zIndex: Math.round(10 + offset * 10),
    }
  }

  // Card ativo
  if (offset === 0) {
    return {
      transform: `translateX(0%) rotateY(0deg) scale(1) translateZ(0px)`,
      opacity: 1,
      zIndex: 10,
    }
  }

  // Cards na fila — opacidade mais alta (0.06 ao invés de 0.15)
  const depth = Math.min(offset, 4)
  const x = depth * 28
  const z = -depth * 120
  const rotY = depth * 8
  const scale = 1 - depth * 0.08
  const opacity = depth >= 3.5 ? 0 : 1 - depth * 0.08 // <-- era 0.15

  if (offset < 1) {
    const t = offset
    return {
      transform: `translateX(${t * 28}%) rotateY(${t * 8}deg) scale(${1 - t * 0.08}) translateZ(${t * -120}px)`,
      opacity: 1,
      zIndex: 9,
    }
  }

  return {
    transform: `translateX(${x}%) rotateY(${rotY}deg) scale(${scale}) translateZ(${z}px)`,
    opacity: Math.max(0, opacity),
    zIndex: Math.round(10 - depth),
  }
}

  return (
    <>
    <div>
      <h2 className={styles.heading}>Projetos ({cards.length})</h2>
<section
      ref={sectionRef}
      className={styles.projects}
      style={{ '--card-count': cards.length }}
    >

      <div className={styles.sticky}>
        <div className={styles.scene}>
          {cards.map((card, i) => {
            const cardStyle = getCardStyle(i)
            const scale = i === 0 && enterProgress < 1
              ? `scale(${entryScale})`
              : ''

            return (
              <div
                key={card.name}
                className={styles.card_wrapper}
                style={{
                  ...cardStyle,
                  // Aplica o scale de entrada apenas antes do sticky ativar
                  transform: enterProgress < 1 && i === 0
                    ? `scale(${entryScale})`
                    : cardStyle.transform,
                }}
              >
                <ProjectCard
                  image={card.images[0]}
                  title={card.name}
                  date={card.date}
                  videoUrl={card.link}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
    </div>
    </>
    
  )
}

export default Projects