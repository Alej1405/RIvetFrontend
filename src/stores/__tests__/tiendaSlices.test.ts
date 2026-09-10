import { describe, it, expect } from 'vitest'
import { raices, totalProductos, buscarCategoria, idsConDescendencia } from '@/stores/tiendaSlices'
import type { Categoria } from '@/schemas/ecommerce'

/**
 * El árbol de ejemplo es el que devuelve /ecommerce/categories hoy:
 * Alimentos → Salsas Alitas, y Bebidas → Maserados + vinos.
 */
const cat = (p: Partial<Categoria>): Categoria => ({
  id: 0, parent_id: null, nombre: '', slug: '', descripcion: null, imagen: null,
  banner: null, publicado: true, orden: 0, products_count: 0, children: [],
  ...p,
} as Categoria)

const arbol: Categoria[] = [
  cat({ id: 11, nombre: 'Alimentos', slug: 'alimentos', orden: 0, children: [
    cat({ id: 12, parent_id: 11, nombre: 'Salsas Alitas', slug: 'salsas-alitas', products_count: 1 }),
  ]}),
  cat({ id: 13, nombre: 'Bebidas', slug: 'bebidas', orden: 1, children: [
    cat({ id: 14, parent_id: 13, nombre: 'Maserados', slug: 'maserados', products_count: 1 }),
    cat({ id: 15, parent_id: 13, nombre: 'vinos', slug: 'vinos' }),
  ]}),
]

describe('raices', () => {
  it('devuelve solo las de primer nivel', () => {
    expect(raices(arbol).map((c) => c.slug)).toEqual(['alimentos', 'bebidas'])
  })

  it('respeta el orden del ERP', () => {
    const alReves = [cat({ id: 2, nombre: 'B', slug: 'b', orden: 5 }), cat({ id: 1, nombre: 'A', slug: 'a', orden: 1 })]
    expect(raices(alReves).map((c) => c.slug)).toEqual(['a', 'b'])
  })

  it('deja fuera las despublicadas', () => {
    const conOculta = [...arbol, cat({ id: 99, nombre: 'Oculta', slug: 'oculta', publicado: false })]
    expect(raices(conOculta).map((c) => c.slug)).not.toContain('oculta')
  })
})

describe('totalProductos', () => {
  it('suma los de las hijas, no solo los propios', () => {
    // Bebidas no tiene productos directos: su total sale de Maserados.
    expect(totalProductos(arbol[1])).toBe(1)
    expect(totalProductos(arbol[0])).toBe(1)
  })

  it('una categoría vacía cuenta cero', () => {
    expect(totalProductos(cat({ id: 50, nombre: 'Vacía', slug: 'vacia' }))).toBe(0)
  })
})

describe('buscarCategoria', () => {
  it('encuentra una raíz', () => {
    expect(buscarCategoria(arbol, 'bebidas')?.id).toBe(13)
  })

  it('encuentra una hija anidada', () => {
    // Es lo que hace /catalogo/maserados: el slug puede ser de cualquier nivel.
    expect(buscarCategoria(arbol, 'maserados')?.id).toBe(14)
  })

  it('devuelve null si el slug no existe, para que la página muestre su 404', () => {
    expect(buscarCategoria(arbol, 'inventada')).toBeNull()
  })
})

describe('idsConDescendencia', () => {
  it('incluye la propia y todas sus hijas', () => {
    // Sin esto, entrar a Bebidas no mostraría los productos de Maserados.
    expect(idsConDescendencia(arbol[1])).toEqual([13, 14, 15])
  })

  it('una hoja devuelve solo su id', () => {
    expect(idsConDescendencia(arbol[0].children[0])).toEqual([12])
  })
})
