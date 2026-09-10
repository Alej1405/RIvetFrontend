import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Precio from '@/components/Precio'
import type { Producto } from '@/schemas/ecommerce'

/**
 * Precio decide solo cuándo mostrar el bloque de distribuidor. Es el argumento de
 * venta del sitio: si aparece cuando no debe, se publica un descuento inventado.
 *
 * Los datos son los dos productos reales del ERP.
 */
const producto = (p: Partial<Producto>): Producto => ({
  id: 1, store_category_id: 14, nombre: 'Producto', slug: 'producto',
  descripcion: null, precio_venta: 20, precio_distribuidor: 12,
  cantidad_minima_distribuidor: 12, unidad_precio: 'Unidad',
  publicado: true, destacado: false, orden: 0, sku: null,
  caracteristicas: [], imagenes: [],
  ...p,
} as Producto)

describe('Precio', () => {
  it('muestra el precio público con su unidad', () => {
    render(<Precio producto={producto({})} />)
    expect(screen.getByText(/\$20,00/)).toBeInTheDocument()
    expect(screen.getByText(/por unidad/i)).toBeInTheDocument()
  })

  it('muestra el bloque de distribuidor cuando es menor al público', () => {
    // Pinteno: $20,00 público y $12,00 desde 12 unidades.
    render(<Precio producto={producto({})} />)
    expect(screen.getByText(/\$12,00/)).toBeInTheDocument()
    expect(screen.getByText(/desde 12 unidades/i)).toBeInTheDocument()
  })

  it('calcula el ahorro, no lo lee del ERP', () => {
    render(<Precio producto={producto({})} />)
    expect(screen.getByText('-40%')).toBeInTheDocument()
  })

  it('calcula bien el de la Salsa BBQ', () => {
    // $10,00 → $9,00 son 10 %, no 40.
    render(<Precio producto={producto({ precio_venta: 10, precio_distribuidor: 9, cantidad_minima_distribuidor: 2, unidad_precio: 'Libras' })} />)
    expect(screen.getByText('-10%')).toBeInTheDocument()
    expect(screen.getByText(/por libras/i)).toBeInTheDocument()
  })

  it('oculta el bloque si el ERP no trae precio de distribuidor', () => {
    render(<Precio producto={producto({ precio_distribuidor: 0 })} />)
    expect(screen.queryByText(/desde/i)).not.toBeInTheDocument()
  })

  it('oculta el bloque si el mayorista no es más barato', () => {
    // Un dato mal cargado no puede acabar anunciando un descuento negativo.
    render(<Precio producto={producto({ precio_venta: 10, precio_distribuidor: 15 })} />)
    expect(screen.queryByText(/-\d+%/)).not.toBeInTheDocument()
  })

  it('no rompe si falta la unidad', () => {
    render(<Precio producto={producto({ unidad_precio: null })} />)
    expect(screen.getByText(/\$20,00/)).toBeInTheDocument()
  })
})
