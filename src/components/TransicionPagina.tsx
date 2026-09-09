import { motion, useReducedMotion } from 'framer-motion'

/**
 * Transición entre páginas.
 *
 * Deliberadamente barata: opacidad y un desplazamiento de 8px, ambos compuestos por
 * GPU. Nada de layout ni de blur. 220ms de entrada con ease-out para que se sienta
 * inmediata; la salida es más corta porque el usuario ya decidió irse.
 *
 * Se usa `transform` completo en vez del shorthand `y` de Framer Motion: el shorthand
 * corre en el hilo principal y dropea frames justo cuando la página nueva está
 * pidiendo datos.
 */
export default function TransicionPagina({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()

  if (reduce) return <>{children}</>

  return (
    <motion.div
      initial={{ opacity: 0, transform: 'translateY(8px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)' }}
      // Entrada 220ms, salida 140ms: el usuario ya decidió irse, no le hagas esperar.
      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
      exit={{ opacity: 0, transform: 'translateY(-4px)', transition: { duration: 0.14 } }}
    >
      {children}
    </motion.div>
  )
}
