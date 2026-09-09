import type { CSSProperties, ReactNode } from 'react'
import { COLORES_FALLBACK, textoLegible, type Colores } from '@/lib/color'
import type { ColoresCms } from '@/schemas/cms'

/**
 * Envuelve una microsite de punto de venta y le inyecta la paleta del propio cliente
 * como CSS variables en runtime. TODO sale de los tres colores de la API: el fondo es el
 * color primario del cliente, y las superficies, bordes y textos se derivan de él con
 * `color-mix`. Nada de base fija — cambiar cualquier color en el ERP cambia la landing.
 *
 * El texto se calcula por luminancia (`textoLegible`), así contrasta tanto si el negocio
 * elige colores oscuros como claros.
 *
 * Uso en className: bg-[var(--c-bg)], text-[var(--c-acento)], text-[var(--c-on-acento)]…
 */
export default function MarcaCliente({
  colores,
  className = '',
  children,
}: {
  colores: ColoresCms | null
  className?: string
  children: ReactNode
}) {
  // Cada campo puede venir null aunque el objeto exista: fallback por campo.
  const c: Colores = {
    primario: colores?.primario ?? COLORES_FALLBACK.primario,
    secundario: colores?.secundario ?? COLORES_FALLBACK.secundario,
    acento: colores?.acento ?? COLORES_FALLBACK.acento,
  }

  const vars = {
    '--c-primario': c.primario,
    '--c-secundario': c.secundario,
    '--c-acento': c.acento,
    // Los TRES colores del cliente, cada uno con su rol:
    //   primario  → fondo de la página
    //   secundario → superficies (cards, mapa, cabeceras)
    //   acento    → botones, precios, detalles
    '--c-bg': c.primario,
    '--c-surface': c.secundario,
    // Texto legible calculado por superficie: uno para el fondo (primario) y otro para
    // las cards (secundario). Así el amarillo, el navy o cualquier color se leen bien.
    '--c-text': textoLegible(c.primario),
    '--c-on-surface': textoLegible(c.secundario),
    '--c-on-acento': textoLegible(c.acento),
    // Textos secundarios y bordes derivados de cada base.
    '--c-text-muted': 'color-mix(in srgb, var(--c-text) 62%, var(--c-bg))',
    '--c-surface-muted': 'color-mix(in srgb, var(--c-on-surface) 60%, var(--c-secundario))',
    '--c-border': 'color-mix(in srgb, var(--c-text) 16%, transparent)',
    '--c-border-surface': 'color-mix(in srgb, var(--c-on-surface) 18%, transparent)',
  } as CSSProperties

  return (
    <div style={vars} className={`min-h-[100dvh] bg-[var(--c-bg)] font-noto text-[var(--c-text)] ${className}`}>
      {children}
    </div>
  )
}
