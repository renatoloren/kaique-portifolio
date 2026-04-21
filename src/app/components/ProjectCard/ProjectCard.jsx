import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './ProjectCard.module.css'

const ProjectCard = ({ image, title, date, videoUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null

    const patterns = [
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=1`
    }

    return null
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false)
    }
    if (isModalOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isModalOpen])

  const embedUrl = getYouTubeEmbedUrl(videoUrl)

  const modal = isModalOpen && (
    <div className={styles.modal_overlay} onClick={() => setIsModalOpen(false)}>
      <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modal_close} onClick={() => setIsModalOpen(false)}>
          ✕
        </button>
        <iframe
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )

  return (
    <>
      <div
        className={styles.project}
        style={{ backgroundImage: `url('${image}')` }}
        onClick={() => embedUrl && setIsModalOpen(true)}
      >
        <p className={styles.project_title}>{title}</p>
        <p className={styles.project_date}>{date}</p>
      </div>

      {/* Portal renderiza o modal direto no document.body,
          escapando do transform-style: preserve-3d do cubo */}
      {mounted && createPortal(modal, document.body)}
    </>
  )
}

export default ProjectCard