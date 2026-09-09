import { storageUrl } from '@/lib/api'
import type { Producto } from '@/schemas/ecommerce'

/**
 * La imagen marcada `es_principal`; si no hay ninguna, la primera por `orden`.
 * Vive aquí y no junto al componente: mezclarla con un componente rompe fast refresh.
 */
export const imagenPrincipal = (p: Producto): string | null => {
  const orden = [...p.imagenes].sort((a, b) => a.orden - b.orden)
  return storageUrl((orden.find((i) => i.es_principal) ?? orden[0])?.path)
}
