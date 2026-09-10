import { useEffect, useRef } from 'react'

/**
 * Fondo del sitio: la línea de proceso.
 *
 * Rivet no es una licorera artesanal ni un SaaS: es ingeniería alimentaria. Así que
 * el fondo no es un degradado ni una nebulosa, es una retícula de instrumento — la
 * cuadrícula del plano de planta, con marcas de cota cada cuatro luces — y por sus
 * líneas circulan pulsos, que es dosificación recorriendo la tubería.
 *
 * Se dibuja en canvas y no en DOM por una razón concreta: son ~1.400 marcas en una
 * pantalla grande. En DOM eso son 1.400 nodos que el navegador recalcula en cada
 * scroll; aquí es una textura que se pinta una vez y se repite.
 *
 * Presupuesto de render:
 *   · la retícula es un patrón de 224×224 tejido UNA vez y repetido por el motor;
 *     no se redibuja línea a línea en cada frame.
 *   · solo se anima el desplazamiento del patrón y cinco pulsos.
 *   · con la pestaña en segundo plano el bucle se detiene entero.
 *   · con `prefers-reduced-motion` se pinta un solo frame y no hay bucle.
 */

const PASO = 56 // luz de la retícula, en px CSS
const BLOQUE = PASO * 4 // cada cuarta intersección lleva marca de cota
const DERIVA = 0.012 // px por ms — 12 px/s, se percibe pero no distrae
const PULSOS = 5
const ESTELA = 10 // segmentos de cola por pulso

const TEAL = '0, 182, 201'
const AMARILLO = '232, 232, 87'

type Pulso = { eje: 'h' | 'v'; linea: number; pos: number; vel: number; color: string }

export default function FondoRivet() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let ancho = 0
    let alto = 0
    let dpr = 1
    let trama: CanvasPattern | null = null
    let raf = 0
    let previo = 0
    let deriva = 0
    const pulsos: Pulso[] = []

    /* La retícula, tejida una sola vez en un lienzo de 224×224 que luego se repite. */
    const tejer = () => {
      const tile = document.createElement('canvas')
      tile.width = Math.round(BLOQUE * dpr)
      tile.height = Math.round(BLOQUE * dpr)
      const t = tile.getContext('2d')
      if (!t) return null
      t.scale(dpr, dpr)

      // Hilos de la retícula.
      t.strokeStyle = `rgba(${TEAL}, 0.055)`
      t.lineWidth = 1
      for (let i = 0; i <= 4; i++) {
        const p = i * PASO + 0.5
        t.beginPath()
        t.moveTo(p, 0)
        t.lineTo(p, BLOQUE)
        t.moveTo(0, p)
        t.lineTo(BLOQUE, p)
        t.stroke()
      }

      // Marca de cota: una cruz corta en la intersección del bloque. Es el detalle
      // que convierte una cuadrícula genérica en un plano cotado.
      t.strokeStyle = `rgba(${TEAL}, 0.16)`
      t.beginPath()
      t.moveTo(0.5 - 5, 0.5)
      t.lineTo(0.5 + 5, 0.5)
      t.moveTo(0.5, 0.5 - 5)
      t.lineTo(0.5, 0.5 + 5)
      t.stroke()

      const patron = ctx.createPattern(tile, 'repeat')
      // El lienzo está en píxeles de dispositivo y el contexto ya viene escalado por
      // dpr: sin esto la retícula saldría al doble de tamaño en pantallas retina.
      patron?.setTransform(new DOMMatrix().scale(1 / dpr))
      return patron
    }

    const soltarPulso = (p: Pulso, inicial: boolean) => {
      p.eje = Math.random() < 0.62 ? 'h' : 'v'
      const lineas = Math.ceil((p.eje === 'h' ? alto : ancho) / PASO)
      p.linea = Math.floor(Math.random() * Math.max(lineas, 1))
      const largo = p.eje === 'h' ? ancho : alto
      p.pos = inicial ? Math.random() * largo : -120
      p.vel = 0.055 + Math.random() * 0.06
      // Uno de cada cinco en amarillo: los dos colores del logo, sin inventar terceros.
      p.color = Math.random() < 0.2 ? AMARILLO : TEAL
    }

    const pintar = (dt: number) => {
      ctx.clearRect(0, 0, ancho, alto)

      // Retícula. Deriva en diagonal, muy lento: la planta trabajando, no un fondo
      // que se mueve para llamar la atención.
      deriva = (deriva + DERIVA * dt) % BLOQUE
      if (trama) {
        ctx.save()
        ctx.translate(-deriva, -deriva * 0.5)
        ctx.fillStyle = trama
        ctx.fillRect(0, 0, ancho + BLOQUE, alto + BLOQUE)
        ctx.restore()
      }

      if (reduce) return

      // Pulsos: cabeza plena y estela en segmentos, no un degradado difuminado.
      // Se lee como una lectura de instrumento y cuesta lo mismo que 55 rectángulos.
      for (const p of pulsos) {
        p.pos += p.vel * dt
        const largo = p.eje === 'h' ? ancho : alto
        if (p.pos > largo + 140) soltarPulso(p, false)

        const fijo = p.linea * PASO + 0.5
        for (let j = 0; j < ESTELA; j++) {
          const caida = 1 - j / ESTELA
          ctx.fillStyle = `rgba(${p.color}, ${(j === 0 ? 0.5 : 0.26 * caida * caida).toFixed(3)})`
          const d = p.pos - j * 11
          if (d < -20 || d > largo + 20) continue
          if (p.eje === 'h') ctx.fillRect(d, fijo - 1, j === 0 ? 9 : 7, 2)
          else ctx.fillRect(fijo - 1, d, 2, j === 0 ? 9 : 7)
        }
      }
    }

    const bucle = (ahora: number) => {
      // Tope de 50 ms: al volver de otra pestaña el dt sería enorme y los pulsos
      // saltarían media pantalla de golpe.
      const dt = Math.min(ahora - previo, 50)
      previo = ahora
      pintar(dt)
      raf = requestAnimationFrame(bucle)
    }

    const medir = () => {
      // En móvil, la barra del navegador que aparece y desaparece dispara `resize`
      // en cada scroll. Sin este filtro el lienzo se redimensiona y la retícula se
      // vuelve a tejer decenas de veces por gesto: el peor coste posible.
      const anchoNuevo = window.innerWidth
      const altoNuevo = window.innerHeight
      if (ancho && anchoNuevo === ancho && Math.abs(altoNuevo - alto) < 140) return

      dpr = Math.min(window.devicePixelRatio || 1, 2)
      ancho = anchoNuevo
      alto = altoNuevo
      canvas.width = Math.round(ancho * dpr)
      canvas.height = Math.round(alto * dpr)
      canvas.style.width = `${ancho}px`
      canvas.style.height = `${alto}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      trama = tejer()
      if (reduce) pintar(0)
    }

    const arrancar = () => {
      if (reduce || raf) return
      previo = performance.now()
      raf = requestAnimationFrame(bucle)
    }
    const parar = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }
    const visibilidad = () => (document.hidden ? parar() : arrancar())

    medir()
    for (let i = 0; i < PULSOS; i++) {
      const p: Pulso = { eje: 'h', linea: 0, pos: 0, vel: 0, color: TEAL }
      soltarPulso(p, true)
      pulsos.push(p)
    }
    arrancar()

    window.addEventListener('resize', medir)
    document.addEventListener('visibilitychange', visibilidad)
    return () => {
      parar()
      window.removeEventListener('resize', medir)
      document.removeEventListener('visibilitychange', visibilidad)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      // fixed: la trama no hace scroll con el contenido, el contenido pasa por encima
      // de ella. Eso es lo que le da profundidad al sitio, que estaba plano.
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  )
}
