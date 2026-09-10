import { motion, useReducedMotion } from 'framer-motion'
import { SALIDA } from '@/lib/movimiento'

/**
 * Splash de marca de la primera carga.
 *
 * El isotipo se LLENA de abajo a arriba. No es un adorno: Rivet envasa, y un envase
 * que se llena es la única animación de carga que dice lo que hace la empresa. Se
 * hace con `clip-path: inset()` sobre una copia del logo, encima de una copia apagada,
 * así que el logo no se deforma ni se redibuja — solo se recorta, que va a GPU.
 *
 * Dos condiciones para irse, y se va con la que se cumpla más tarde de las dos
 * primeras: que el hero resuelva y que el llenado haya llegado arriba. Por encima de
 * todo manda MAX_MS. Esa última es la importante: la versión anterior tapaba el sitio
 * hasta que resolvieran las peticiones del CMS, así que una API lenta significaba una
 * web en blanco. Aquí la API no puede secuestrar la primera impresión.
 */
export default function LoadingScreen() {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className="fixed inset-0 z-[100] grid place-items-center bg-background"
      initial={false}
      // Sale hacia adelante, no se desvanece sin más: el sitio queda debajo y el
      // splash se aparta. 260 ms, que la salida siempre va más rápida que la entrada.
      exit={{ opacity: 0, transform: 'scale(1.03)' }}
      transition={{ duration: 0.26, ease: SALIDA }}
    >
      <div className="flex flex-col items-center gap-7">
        <div className="relative h-20 w-auto">
          {/* Capa apagada: el envase vacío. Nunca se anima desde la nada — el logo
              está ahí desde el primer frame, solo que sin llenar. */}
          <img src="/Iso_tipo.svg" alt="" aria-hidden className="h-20 w-auto opacity-[0.14]" />

          {/* Capa llena, recortada desde abajo. */}
          <motion.img
            src="/Iso_tipo.svg"
            alt="Rivet Ecuador"
            className="absolute inset-0 h-20 w-auto"
            initial={reduce ? { clipPath: 'inset(0% 0 0 0)' } : { clipPath: 'inset(100% 0 0 0)' }}
            animate={{ clipPath: 'inset(0% 0 0 0)' }}
            transition={{ duration: reduce ? 0 : 0.6, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>

        {/* Regla de nivel: el mismo dato que el llenado, leído como instrumento.
            No es una barra de progreso falsa, va sincronizada con el clip. */}
        <div className="h-px w-28 overflow-hidden bg-border">
          <motion.div
            className="h-full bg-primary"
            initial={reduce ? { transform: 'scaleX(1)' } : { transform: 'scaleX(0)' }}
            animate={{ transform: 'scaleX(1)' }}
            transition={{ duration: reduce ? 0 : 0.6, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformOrigin: 'left' }}
          />
        </div>
      </div>
    </motion.div>
  )
}
