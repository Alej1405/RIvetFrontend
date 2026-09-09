import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from '@phosphor-icons/react'
import { storageUrl } from '@/lib/api'
import { totalProductos } from '@/stores/tiendaSlices'
import type { Categoria } from '@/schemas/ecommerce'

/**
 * Card de categoría raíz. Decide por dato, no por configuración:
 *
 * - Con imagen: la foto manda y el texto se apoya sobre ella.
 * - Sin imagen: la tipografía manda. No es un estado degradado ni un placeholder
 *   gris, es un diseño legítimo. Hoy todas las categorías vienen sin imagen; el día
 *   que se suban al ERP la card cambia sola.
 */
export default function CategoriaCard({ categoria, indice }: { categoria: Categoria; indice: number }) {
  const reduce = useReducedMotion()
  const imagen = storageUrl(categoria.banner ?? categoria.imagen)
  const total = totalProductos(categoria)
  const hijas = categoria.children.filter((h) => h.publicado)

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, transform: 'translateY(12px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)' }}
      transition={{ duration: 0.4, delay: indice * 0.06, ease: [0.23, 1, 0.32, 1] }}
    >
      <Link
        to={`/catalogo/${categoria.slug}`}
        className="group relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card p-6 transition-colors duration-200 hover:border-primary/50 focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:min-h-[26rem] md:p-8"
      >
        {imagen ? (
          <>
            <img
              src={imagen}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
            {/* Scrim: sin esto el texto no llega al 4.5:1 sobre una foto cualquiera. */}
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
          </>
        ) : (
          // Modo tipográfico: la inicial hace de materia visual, sin inventar una foto.
          <div
            aria-hidden
            className="pointer-events-none absolute -right-6 -bottom-16 select-none font-heveltica text-[13rem] font-bold leading-none text-primary/[0.07] transition-colors duration-300 group-hover:text-primary/[0.11] md:text-[17rem]"
          >
            {categoria.nombre.charAt(0)}
          </div>
        )}

        <div className="relative">
          <h3 className="font-heveltica text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {categoria.nombre}
          </h3>
          {categoria.descripcion && (
            <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
              {categoria.descripcion}
            </p>
          )}
        </div>

        <div className="relative mt-8">
          {hijas.length > 0 && (
            <ul className="mb-5 flex flex-wrap gap-2">
              {hijas.map((h) => (
                <li
                  key={h.id}
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                >
                  {h.nombre}
                </li>
              ))}
            </ul>
          )}
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Ver {total === 1 ? 'el producto' : `los ${total} productos`}
            <ArrowRight
              size={16}
              weight="bold"
              className="transition-transform duration-200 ease-out group-hover:translate-x-1"
            />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
