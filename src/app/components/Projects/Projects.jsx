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

  const GAP = 40

  // No último card, não rotaciona
  const cubeRotation = isLast ? 0 : progress * 90

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
              transform: `perspective(1200px) rotateX(${cubeRotation}deg)`,
            }}
          >
            {cards[activeIndex] && (
              <div
                className={`${styles.face} ${styles.face_front}`}
                style={{ '--gap': `${GAP}px` }}
              >
                <ProjectCard
                  image={cards[activeIndex].images[0]}
                  title={cards[activeIndex].name}
                  date={cards[activeIndex].date}
                  videoUrl={cards[activeIndex].link}
                />
              </div>
            )}

            {!isLast && cards[activeIndex + 1] && (
              <div
                className={`${styles.face} ${styles.face_bottom}`}
                style={{ '--gap': `${GAP}px` }}
              >
                <ProjectCard
                  image={cards[activeIndex + 1].images[0]}
                  title={cards[activeIndex + 1].name}
                  date={cards[activeIndex + 1].date}
                  videoUrl={cards[activeIndex + 1].link}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Projects