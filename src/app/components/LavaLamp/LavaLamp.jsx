import React, { useRef, useEffect } from 'react'
import styles from './LavaLamp.module.css'

const LavaLamp = () => {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const tRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)
      tRef.current += 0.004

      const t = tRef.current

      // Pontos de controle da onda — todos compartilham a mesma base de lava
      // Frequências ligeiramente diferentes criam a sensação viscosa/orgânica
      const pts = [
        { x: 0,       y: h * (0.45 + 0.18 * Math.sin(t * 1.1)) },
        { x: w * 0.2, y: h * (0.38 + 0.20 * Math.sin(t * 0.9 + 1.2)) },
        { x: w * 0.4, y: h * (0.42 + 0.22 * Math.sin(t * 1.3 + 0.5)) },
        { x: w * 0.6, y: h * (0.36 + 0.19 * Math.sin(t * 0.8 + 2.1)) },
        { x: w * 0.8, y: h * (0.44 + 0.21 * Math.sin(t * 1.2 + 1.7)) },
        { x: w,       y: h * (0.40 + 0.18 * Math.sin(t * 1.0 + 0.9)) },
      ]

      // ── Massa de lava principal ──────────────────────────────
      ctx.beginPath()
      ctx.moveTo(0, h)
      ctx.lineTo(0, pts[0].y)

      // Bezier suavizado entre os pontos (catmull-rom aproximado)
      for (let i = 0; i < pts.length - 1; i++) {
        const cp1x = pts[i].x + (pts[i + 1].x - pts[i].x) * 0.5
        const cp1y = pts[i].y
        const cp2x = pts[i].x + (pts[i + 1].x - pts[i].x) * 0.5
        const cp2y = pts[i + 1].y
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, pts[i + 1].x, pts[i + 1].y)
      }

      ctx.lineTo(w, h)
      ctx.closePath()

      // Gradiente principal: brilho no topo, escuro no fundo
      const grad = ctx.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0,    'rgba(255, 120, 30, 0)')   // topo transparente
      grad.addColorStop(0.15, 'rgb(255, 98, 20)')  // brilho da crista
      grad.addColorStop(0.4,  'rgba(255, 47, 0, 0.85)')  // corpo quente
    //   grad.addColorStop(0.75, 'rgba(160,  20,   5, 1)')  // profundidade
    //   grad.addColorStop(1,    'rgba( 90,   5,   2, 1.0)')   // fundo escuro
      ctx.fillStyle = grad
      ctx.fill()

      // ── Brilho da crista (highlight) ────────────────────────
      // Segunda passagem com opacidade baixa e gradiente radial espalhado
      // para simular o reflexo de luz na superfície da lava
      ctx.beginPath()
      ctx.moveTo(0, h)
      ctx.lineTo(0, pts[0].y)
      for (let i = 0; i < pts.length - 1; i++) {
        const cp1x = pts[i].x + (pts[i + 1].x - pts[i].x) * 0.5
        ctx.bezierCurveTo(cp1x, pts[i].y, cp1x, pts[i + 1].y, pts[i + 1].x, pts[i + 1].y)
      }
      ctx.lineTo(w, h)
      ctx.closePath()

      // Gradiente de brilho: branco/laranja claro só na crista
      const shine = ctx.createLinearGradient(0, 0, 0, h * 0.5)
      shine.addColorStop(0,   'rgba(255,255,255, 0.0)')
      shine.addColorStop(0.3, 'rgba(255,200, 80, 0.18)')
      shine.addColorStop(0.6, 'rgba(255,120, 20, 0.08)')
      shine.addColorStop(1,   'rgba(255,  0,  0, 0.0)')
      ctx.fillStyle = shine
      ctx.fill()

      // ── Sombra interna (profundidade na borda superior) ─────
      // Faixa escura logo abaixo da crista para separar o brilho do corpo
      ctx.beginPath()
      ctx.moveTo(0, h)
      ctx.lineTo(0, pts[0].y + h * 0.06)
      for (let i = 0; i < pts.length - 1; i++) {
        const cp1x = pts[i].x + (pts[i + 1].x - pts[i].x) * 0.5
        ctx.bezierCurveTo(
          cp1x, pts[i].y + h * 0.06,
          cp1x, pts[i + 1].y + h * 0.06,
          pts[i + 1].x, pts[i + 1].y + h * 0.06
        )
      }
      ctx.lineTo(w, h)
      ctx.closePath()

      const shadow = ctx.createLinearGradient(0, 0, 0, h)
      shadow.addColorStop(0,    'rgba(80, 0, 0, 0.0)')
      shadow.addColorStop(0.12, 'rgba(60, 0, 0, 0.35)')
      shadow.addColorStop(0.3,  'rgba(40, 0, 0, 0.0)')
      ctx.fillStyle = shadow
      ctx.fill()

      animRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas ref={canvasRef} className={styles.lava_canvas} />
  )
}

export default LavaLamp