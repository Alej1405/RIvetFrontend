import { useEffect, useState } from 'react'
import { useAppStore } from '@/stores/useAppStore'

/** Tope duro: pase lo que pase con la API, el splash nunca retiene la web más que esto. */
const MAX_MS = 1300

/**
 * Piso: lo justo para que el llenado del isotipo llegue arriba y la salida se lea
 * intencionada. Ni un ms más. Si la API responde en 250 ms, retener la pantalla medio
 * segundo extra es teatro: se le está cobrando al usuario una animación que no estaba
 * esperando.
 */
const MIN_MS = 620

/**
 * Decide si el splash debe estar en pantalla.
 *
 * Vive aparte del componente por dos razones: el condicional tiene que ejecutarse en
 * el Layout —fuera del `AnimatePresence`, o no hay desmontaje que animar y la salida
 * nunca corre— y un archivo que exporta un hook junto a un componente rompe el fast
 * refresh de Vite.
 *
 * Se va con la condición que se cumpla más tarde de las dos primeras: que el hero
 * resuelva y que el llenado haya terminado. Por encima de todo manda MAX_MS. Esa
 * última es la importante: la versión anterior tapaba el sitio hasta que resolvieran
 * las peticiones del CMS, así que una API lenta significaba una web en blanco. Aquí
 * la API no puede secuestrar la primera impresión.
 */
export function useSplash(): boolean {
  const heroListo = useAppStore((s) => !s.hero.cargando && (!!s.hero.datos || !!s.hero.error))
  const [montado] = useState(() => Date.now())
  const [minimoCumplido, setMinimoCumplido] = useState(false)
  const [expirado, setExpirado] = useState(false)

  useEffect(() => {
    const a = setTimeout(() => setMinimoCumplido(true), MIN_MS)
    const b = setTimeout(() => setExpirado(true), MAX_MS)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [])

  // Si el hero ya estaba en memoria (volver atrás, caché del store), no parpadear un
  // splash de 20 ms: eso se lee como un fallo, no como una carga.
  const instantaneo = heroListo && Date.now() - montado < 120
  return !(instantaneo || expirado || (heroListo && minimoCumplido))
}
