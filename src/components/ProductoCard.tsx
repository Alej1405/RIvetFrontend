import { Link } from 'react-router-dom'
import Precio from '@/components/Precio'
import { imagenPrincipal } from '@/lib/imagenes'
import type { Producto } from '@/schemas/ecommerce'

export default function ProductoCard({ producto }: { producto: Producto }) {
  const imagen = imagenPrincipal(producto)

  return (
    <Link
      to={`/producto/${producto.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200 hover:border-primary/50 focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <div className="aspect-[4/3] overflow-hidden bg-secondary">
        {imagen ? (
          <img
            src={imagen}
            alt={producto.nombre}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full place-items-center font-heveltica text-5xl font-bold text-primary/15">
            {producto.nombre.charAt(0)}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-4 md:p-5">
        <div>
          <h3 className="font-heveltica text-lg font-bold leading-tight text-foreground">
            {producto.nombre}
          </h3>
          {producto.sku && <p className="mt-1 text-xs text-muted-foreground">SKU {producto.sku}</p>}
        </div>
        <div className="mt-4">
          <Precio producto={producto} />
        </div>
      </div>
    </Link>
  )
}
