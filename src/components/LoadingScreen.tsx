import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useAppStore } from '@/stores/useAppStore'

/** Tope duro: pase lo que pase con la API, el splash nunca retiene la web más que esto. */
const MAX_MS = 1100

/**
 * Splash de marca en la primera carga. Solo mobile, donde la app se abre en frío y el
 * logo hace de anclaje.
 *
 * Se va con lo que ocurra primero: que el hero resuelva, o el tope de MAX_MS. Esa
 * segunda condición es la importante. El código anterior tapaba el sitio hasta que
 * resolvieran las 7 peticiones del CMS, así que una API lenta significaba una web
 * en blanco. Aquí la API no puede secuestrar la primera impresión.
 */
export default function LoadingScreen() {
  const heroListo = useAppStore((s) => !s.hero.cargando && (!!s.hero.datos || !!s.hero.error))
  const [expirado, setExpirado] = useState(false)
  const [montado] = useState(() => Date.now())
  const reduce = useReducedMotion()

  useEffect(() => {
    const t = setTimeout(() => setExpirado(true), MAX_MS)
    return () => clearTimeout(t)
  }, [])

  // Si el hero ya estaba en memoria, no parpadear un splash de 20ms.
  const instantaneo = heroListo && Date.now() - montado < 120
  if (instantaneo || heroListo || expirado) return null

  return (
    <motion.div
      // md:hidden: en desktop no hay splash, se pinta directo.
      className="fixed inset-0 z-[100] grid place-items-center bg-background md:hidden"
      initial={false}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
    >
      <motion.img
        src="/Iso_tipo.svg"
        alt="Rivet Ecuador"
        className="h-16 w-auto"
        initial={reduce ? false : { opacity: 0.55, transform: 'scale(0.96)' }}
        animate={reduce ? { opacity: 1 } : { opacity: [0.55, 1, 0.55], transform: 'scale(1)' }}
        transition={
          reduce
            ? { duration: 0.2 }
            : { opacity: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' }, transform: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } }
        }
      />
    </motion.div>
  )
}
