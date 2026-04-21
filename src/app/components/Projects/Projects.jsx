import React, { useRef, useEffect, useState, useCallback } from 'react'
import styles from './Projects.module.css'
import projects from '@/data/projects.json'
import ProjectCard from '../ProjectCard/ProjectCard'

const Projects = () => {
  const sectionRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  const cards = projects.filter(p => p.images?.[0])
  const isLast = activeIndex === cards.length - 1

  const handleScroll = useCallback(() => {
    const section = sectionRef.current
    if (!section) return

    const offsetTop = section.getBoundingClientRect().top + window.scrollY
    const scrolled = window.scrollY - offsetTop
    const totalScroll = section.offsetHeight - window.innerHeight

    if (scrolled <= 0) {
      setActiveIndex(0)
      setProgress(0)
      return
    }
    if (scrolled >= totalScroll) {
      setActiveIndex(cards.length - 1)
      setProgress(0)
      return
    }

    const cardProgress = (scrolled / totalScroll) * cards.length
    const index = Math.min(Math.floor(cardProgress), cards.length - 1)
    const frac = cardProgress - Math.floor(cardProgress)

    setActiveIndex(index)
    setProgress(frac)
  }, [cards.length])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const totalRotation = isLast ? activeIndex * 60 : (activeIndex + progress) * 60

  const CARD_H = 350
  const RADIUS = CARD_H * (Math.sqrt(3) / 2)  // raio do hexágono (60°)

  return (
    <section
      ref={sectionRef}
      className={styles.projects}
      style={{ '--card-count': cards.length }}
    >
      <div className={styles.sticky}>
        <h2 className={styles.heading}>Projetos</h2>

        <div className={styles.scene}>
          <div
            className={styles.cube}
            style={{
              transform: `perspective(900px) rotateX(${totalRotation}deg)`,
            }}
          >
            {cards.map((card, i) => {
              const current = activeIndex + progress
              const distance = Math.abs(i - current)
              const opacity = isLast
                  ? (i === activeIndex ? 1 : 0.3)
                  : Math.max(0.2, 1 - distance * 1)

                  return (
                    <div
                      key={card.name}
                      className={styles.face}
                      style={{
                        transform: `rotateX(${-i * 60}deg) translateZ(${RADIUS}px)`,
                        opacity,
                        transition: 'opacity 0.2s linear'
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
      </div>
    </section>
  )
}

export default Projects