import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from './ProjectCard.module.css'

const ProjectCard = ({ image, title, date, videoUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalSize, setModalSize] = useState({ w: '854px', h: '480px' })
  const [mounted, setMounted] = useState(false)
  const iframeRef = useRef(null)

  useEffect(() => { setMounted(true) }, [])

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

  // Detecta se o vídeo é vertical consultando a YouTube oEmbed API
  // e calcula o tamanho ideal do modal para abraçar o vídeo
  useEffect(() => {
    if (!isModalOpen || !videoUrl) return

    const id = (() => {
      const patterns = [
        /youtu\.be\/([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
        /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      ]
      for (const p of patterns) {
        const m = videoUrl.match(p)
        if (m) return m[1]
      }
      return null
    })()

    if (!id) return

    // oEmbed retorna width/height do vídeo
    fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`)
      .then(r => r.json())
      .then(data => {
        const vw = data.width  || 16
        const vh = data.height || 9
        const isVertical = vh > vw

        const maxW = window.innerWidth  - 40
        const maxH = window.innerHeight - 80

        let w, h
        if (isVertical) {
          // Vídeo vertical: limita pela altura
          h = Math.min(maxH, 720)
          w = Math.round(h * vw / vh)
          if (w > maxW) { w = maxW; h = Math.round(w * vh / vw) }
        } else {
          // Vídeo horizontal: limita pela largura
          w = Math.min(maxW, 900)
          h = Math.round(w * vh / vw)
          if (h > maxH) { h = maxH; w = Math.round(h * vw / vh) }
        }

        setModalSize({ w: `${w}px`, h: `${h}px` })
      })
      .catch(() => {
        // Fallback: 16:9 horizontal
        const w = Math.min(window.innerWidth - 40, 900)
        const h = Math.round(w * 9 / 16)
        setModalSize({ w: `${w}px`, h: `${h}px` })
      })
  }, [isModalOpen, videoUrl])

  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === 'Escape') setIsModalOpen(false) }
    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isModalOpen])

  const embedUrl = getYouTubeEmbedUrl(videoUrl)

  const modal = isModalOpen && (
    <div className={styles.modal_overlay} onClick={() => setIsModalOpen(false)}>
      <div
        className={styles.modal_content}
        style={{ '--modal-w': modalSize.w, '--modal-h': modalSize.h }}
        onClick={e => e.stopPropagation()}
      >
        <button className={styles.modal_close} onClick={() => setIsModalOpen(false)}>✕</button>
        <iframe
          ref={iframeRef}
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
        <div className={styles.project_info}>
          <p className={styles.project_title}>{title}</p>
          <p className={styles.project_date}>{date}</p>
        </div>
      </div>

      {mounted && createPortal(modal, document.body)}
    </>
  )
}

export default ProjectCard