import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import Precio from '@/components/Precio'
import { imagenPrincipal } from '@/lib/imagenes'
import { entra } from '@/lib/movimiento'
import type { Producto } from '@/schemas/ecommerce'

/**
 * Card de producto. Figma manda: 340×460 con la foto en 340×255 y escala FIT.
 *
 * La regla es que la CARD tiene medida fija y la FOTO se adapta dentro. Con
 * `object-cover` la foto llenaba la caja recortando el producto, y una botella
 * vertical y un frasco de salsa cuadrado daban dos cards de altura distinta en la
 * misma fila. Ahora:
 *
 *   · la caja de imagen es 4/3 — exactamente los 340×255 del componente de Figma;
 *   · `object-contain` mete la foto entera dentro sin deformarla ni recortarla;
 *   · el título reserva dos líneas y el SKU su línea aunque no exista, así el cuerpo
 *     mide siempre lo mismo y no hay cards altas y bajas mezcladas.
 *
 * El padding alrededor de la foto no es decoración: sin él, un PNG recortado al
 * milímetro toca los bordes y otro con aire alrededor se ve la mitad de grande.
 */
export default function ProductoCard({ producto, indice = 0 }: { producto: Producto; indice?: number }) {
  const imagen = imagenPrincipal(producto)
  const reduce = useReducedMotion()

  return (
    <motion.div {...entra(indice, reduce)} className="h-full">
      <Link
        to={`/producto/${producto.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-[border-color,transform] duration-200 ease-out hover:border-primary/50 focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:scale-[0.99]"
      >
        <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-secondary">
          {imagen ? (
            <img
              src={imagen}
              alt={producto.nombre}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-contain p-5 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="grid h-full place-items-center font-heveltica text-5xl font-bold text-primary/15">
              {producto.nombre.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between p-4 md:p-5">
          <div>
            <h3 className="line-clamp-2 min-h-[2.6rem] font-heveltica text-lg font-bold leading-tight text-foreground">
              {producto.nombre}
            </h3>
            {/* La línea del SKU se reserva siempre: si desaparece cuando el ERP no lo
                manda, esa card mide 20 px menos que la de al lado. */}
            <p className="mt-1 min-h-[1rem] text-xs text-muted-foreground">
              {producto.sku ? `SKU ${producto.sku}` : ''}
            </p>
          </div>
          <div className="mt-4">
            <Precio producto={producto} />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
