import { ApiError } from '@/lib/api'

/**
 * Estado de un recurso remoto.
 *
 * `error` existe a propósito: un fallo de contrato con el ERP tiene que ser visible.
 * El front anterior hacía safeParse y devolvía undefined en silencio, y la web se
 * renderizaba a medias sin que nadie se enterara.
 */
export interface Recurso<T> {
  datos: T
  cargando: boolean
  error: string | null
}

export const recursoVacio = <T>(datos: T): Recurso<T> => ({
  datos,
  cargando: false,
  error: null,
})

/**
 * Envuelve una carga con su ciclo de estado. Devuelve el recurso resultante para que
 * el slice decida dónde guardarlo.
 *
 * `set` se llama dos veces: una al empezar (para que la UI pinte su skeleton) y otra
 * al terminar.
 */
export async function cargarRecurso<T>(
  previo: Recurso<T>,
  cargar: () => Promise<T>,
  set: (r: Recurso<T>) => void,
): Promise<void> {
  if (previo.cargando) return
  set({ ...previo, cargando: true, error: null })
  try {
    set({ datos: await cargar(), cargando: false, error: null })
  } catch (e) {
    const mensaje = e instanceof ApiError || e instanceof Error ? e.message : 'error desconocido'
    console.error(`[rivet] ${mensaje}`)
    set({ ...previo, cargando: false, error: mensaje })
  }
}
