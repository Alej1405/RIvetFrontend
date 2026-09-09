// Utilidades de color para el branding dinámico de cada punto de venta.
// La API manda `colores` (primario/secundario/acento) en hex, distintos por cliente.
// De ahí se derivan el tema de la microsite y el color de texto legible sobre cada uno.

export interface Colores {
  primario: string
  secundario: string
  acento: string
}

/** Paleta neutra si un cliente no tiene colores cargados en el ERP. */
export const COLORES_FALLBACK: Colores = {
  primario: '#0e1d1f',
  secundario: '#112630',
  acento: '#00b6c9',
}

const clamp = (n: number) => Math.max(0, Math.min(255, n))

/** #rgb o #rrggbb → [r,g,b]. Devuelve null si no parsea. */
function hexToRgb(hex: string): [number, number, number] | null {
  const h = hex.trim().replace(/^#/, '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ]
}

/** Luminancia relativa (WCAG) 0–1. Blanco = 1, negro = 0. */
export function luminancia(hex: string): number {
  const rgb = hexToRgb(hex)
  if (!rgb) return 0
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** True si el color es oscuro (texto claro encima). */
export const esOscuro = (hex: string): boolean => luminancia(hex) < 0.4

/**
 * Color de texto legible sobre un fondo dado. Usa off-white / off-black en vez de
 * puro para conservar profundidad (regla de la skill de diseño).
 */
export const textoLegible = (fondo: string): string =>
  esOscuro(fondo) ? '#f7fafc' : '#0b0f14'

/** Aclara u oscurece un hex mezclándolo hacia blanco (+) o negro (-). */
export function ajustar(hex: string, delta: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  const objetivo = delta >= 0 ? 255 : 0
  const t = Math.abs(delta)
  const [r, g, b] = rgb.map((v) => clamp(Math.round(v + (objetivo - v) * t)))
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`
}
