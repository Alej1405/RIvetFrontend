// Slices del carril ecommerce. Separado del CMS a propósito: son APIs distintas con
// convenciones distintas y no se mezclan.
import type { StateCreator } from 'zustand'
import { tiendaApi } from '@/lib/api'
import {
  CategoriaListaSchema, ProductoListaSchema, ProductoPaginadoSchema,
} from '@/schemas/ecommerce'
import type { Categoria, Producto } from '@/schemas/ecommerce'
import { cargarRecurso, recursoVacio, type Recurso } from './recurso'

export interface CategoriasSlice {
  categorias: Recurso<Categoria[]>
  fetchCategorias: () => Promise<void>
}

export const categoriasSlice: StateCreator<CategoriasSlice> = (set, get) => ({
  categorias: recursoVacio<Categoria[]>([]),
  fetchCategorias: () =>
    cargarRecurso(
      get().categorias,
      () => tiendaApi('categories', CategoriaListaSchema),
      (categorias) => set({ categorias }),
    ),
})

export interface ProductosSlice {
  productos: Recurso<Producto[]>
  destacados: Recurso<Producto[]>
  fetchProductos: () => Promise<void>
  fetchDestacados: () => Promise<void>
}

export const productosSlice: StateCreator<ProductosSlice> = (set, get) => ({
  productos: recursoVacio<Producto[]>([]),
  destacados: recursoVacio<Producto[]>([]),

  // /products responde con el paginador de Laravel: el listado real vive en .data
  fetchProductos: () =>
    cargarRecurso(
      get().productos,
      async () => (await tiendaApi('products', ProductoPaginadoSchema)).data,
      (productos) => set({ productos }),
    ),

  // /products/featured responde un array plano, sin paginador. Otra forma, otro schema.
  fetchDestacados: () =>
    cargarRecurso(
      get().destacados,
      () => tiendaApi('products/featured', ProductoListaSchema),
      (destacados) => set({ destacados }),
    ),
})

/** Las dos categorías de la antesala: las raíces publicadas, ordenadas por `orden`. */
export const raices = (categorias: Categoria[]): Categoria[] =>
  categorias.filter((c) => c.parent_id === null && c.publicado).sort((a, b) => a.orden - b.orden)

/** Cuenta los productos de una categoría sumando los de sus hijas. */
export const totalProductos = (c: Categoria): number =>
  c.products_count + c.children.reduce((suma, hija) => suma + totalProductos(hija), 0)

/** Busca una categoría por slug en todo el árbol. */
export const buscarCategoria = (categorias: Categoria[], slug: string): Categoria | null => {
  for (const c of categorias) {
    if (c.slug === slug) return c
    const enHijas = buscarCategoria(c.children, slug)
    if (enHijas) return enHijas
  }
  return null
}

/** Todos los ids de una categoría y su descendencia, para filtrar productos. */
export const idsConDescendencia = (c: Categoria): number[] => [
  c.id,
  ...c.children.flatMap(idsConDescendencia),
]
