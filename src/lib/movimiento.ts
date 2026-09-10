/**
 * Sistema de movimiento de Rivet.
 *
 * Un solo archivo para que todas las secciones entren igual. Antes cada página
 * repetía su propio `initial`/`transition` con curvas y tiempos distintos, así que
 * el sitio se movía de siete maneras diferentes.
 *
 * Dos decisiones que se aplican en todo:
 *
 * 1. `transform` completo en vez del atajo `y` de Framer Motion. El atajo corre en
 *    el hilo principal; el string va a GPU y no pierde frames mientras la página
 *    está pidiendo datos al ERP.
 * 2. Curvas propias. Las de CSS (`ease-out`) son flojas y el movimiento se siente
 *    accidental en vez de intencionado.
 */

/** Entradas y salidas: arranca rápido, se sienta despacio. */
export const SALIDA = [0.23, 1, 0.32, 1] as const

/** Algo que se mueve o se transforma ya estando en pantalla. */
export const MORFO = [0.77, 0, 0.175, 1] as const

/** Tope de escalonado. Con 30 productos, `i * 0.05` dejaba el último a 1,5 s. */
const TOPE = 6
const ESCALON = 0.05

/**
 * Entrada al llegar por scroll. Para secciones y tarjetas que están más abajo.
 * `once: true` porque una sección que reaparece cada vez que vuelves a subir cansa.
 */
export function aparece(indice = 0, reduce: boolean | null = false) {
  if (reduce) return { initial: false as const }
  return {
    initial: { opacity: 0, transform: 'translateY(18px)' },
    whileInView: { opacity: 1, transform: 'translateY(0px)' },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.45, delay: Math.min(indice, TOPE) * ESCALON, ease: SALIDA },
  }
}

/**
 * Entrada al montar. Para lo que ya está en el primer viewport y no espera scroll:
 * cabeceras de página y la primera fila de una grilla.
 */
export function entra(indice = 0, reduce: boolean | null = false) {
  if (reduce) return { initial: false as const }
  return {
    initial: { opacity: 0, transform: 'translateY(12px)' },
    animate: { opacity: 1, transform: 'translateY(0px)' },
    transition: { duration: 0.4, delay: Math.min(indice, TOPE) * ESCALON, ease: SALIDA },
  }
}
