import type { Producto } from '@/schemas/ecommerce'

const dinero = (n: number) =>
  new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(n)

/**
 * Precio de un producto, con el mayorista al lado.
 *
 * El precio de distribuidor se muestra en público a propósito: el objetivo del sitio
 * es empujar la compra masiva, así que el ahorro tiene que leerse de un vistazo. No
 * es un dato reservado.
 */
export default function Precio({ producto, tamano = 'normal' }: { producto: Producto; tamano?: 'normal' | 'grande' }) {
  const { precio_venta, precio_distribuidor, cantidad_minima_distribuidor, unidad_precio } = producto

  // El ERP puede no tener precio mayorista, o tenerlo igual o mayor: en ese caso no
  // hay argumento que mostrar.
  const hayMayoreo = precio_distribuidor > 0 && precio_distribuidor < precio_venta
  const ahorro = hayMayoreo ? Math.round((1 - precio_distribuidor / precio_venta) * 100) : 0

  const grande = tamano === 'grande'

  return (
    <div>
      <div className="flex items-baseline gap-2">
        <span className={`font-heveltica font-bold text-foreground ${grande ? 'text-4xl' : 'text-2xl'}`}>
          {dinero(precio_venta)}
        </span>
        {unidad_precio && (
          <span className="text-xs text-muted-foreground">por {unidad_precio.toLowerCase()}</span>
        )}
      </div>

      {hayMayoreo && (
        <div className={`mt-3 rounded-lg border border-accent/30 bg-accent/[0.06] px-3 py-2.5 ${grande ? '' : 'mt-2'}`}>
          <div className="flex items-baseline gap-2">
            <span className={`font-heveltica font-bold text-accent ${grande ? 'text-2xl' : 'text-lg'}`}>
              {dinero(precio_distribuidor)}
            </span>
            <span className="text-xs font-semibold text-accent">-{ahorro}%</span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Precio distribuidor desde {cantidad_minima_distribuidor} unidades
          </p>
        </div>
      )}
    </div>
  )
}
