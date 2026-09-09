// Cliente de la API del ERP.
// El token es de solo-lectura y está scoped a la empresa (Rivet). En un front
// público queda visible en el bundle; es un trade-off asumido para contenido público.
import type { ZodType } from 'zod'

const API_URL = import.meta.env.VITE_API_URL as string
const SLUG = import.meta.env.VITE_CMS_SLUG as string
const TOKEN = import.meta.env.VITE_CMS_TOKEN as string

/** Dos carriles distintos del mismo ERP. No se mezclan. */
const CMS = `${API_URL}/cms/${SLUG}`
const TIENDA = `${API_URL}/ecommerce/${SLUG}`

/** Origen del ERP, sin el /api final. Base de los archivos servidos. */
const ORIGEN = API_URL.replace(/\/api\/?$/, '')

/**
 * Las imágenes de producto llegan como ruta relativa ("store/products/x.jpg") y solo
 * resuelven bajo /storage. Las del CMS ya vienen absolutas, así que se dejan pasar.
 */
export function storageUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${ORIGEN}/storage/${path.replace(/^\/+/, '')}`
}

export class ApiError extends Error {
  readonly recurso: string
  readonly causa: 'http' | 'validacion' | 'red'

  constructor(recurso: string, causa: 'http' | 'validacion' | 'red', mensaje: string) {
    super(`${recurso}: ${mensaje}`)
    this.name = 'ApiError'
    this.recurso = recurso
    this.causa = causa
  }
}

/**
 * Pide un recurso y lo valida con su schema.
 *
 * Un fallo de validación se lanza, nunca se traga: si el ERP cambia un contrato,
 * queremos enterarnos en vez de renderizar la web a medias en silencio.
 */
async function pedir<T>(base: string, recurso: string, schema: ZodType<T>): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${base}/${recurso}`, {
      headers: { Authorization: `Bearer ${TOKEN}`, Accept: 'application/json' },
    })
  } catch (e) {
    throw new ApiError(recurso, 'red', e instanceof Error ? e.message : 'sin conexión')
  }

  if (!res.ok) {
    throw new ApiError(recurso, 'http', `HTTP ${res.status}`)
  }

  const crudo: unknown = await res.json()
  const parsed = schema.safeParse(crudo)
  if (!parsed.success) {
    const detalle = parsed.error.issues
      .slice(0, 3)
      .map((i) => `${i.path.join('.') || '(raíz)'}: ${i.message}`)
      .join(' · ')
    throw new ApiError(recurso, 'validacion', `respuesta inesperada. ${detalle}`)
  }
  return parsed.data
}

export const cmsApi = <T>(recurso: string, schema: ZodType<T>) => pedir(CMS, recurso, schema)
export const tiendaApi = <T>(recurso: string, schema: ZodType<T>) => pedir(TIENDA, recurso, schema)
