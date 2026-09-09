// Schemas de ecommerce (erp.mashaec.net/api/ecommerce/{slug}).
// Cada campo está verificado contra la respuesta real de la API. Carril separado
// del CMS: no se mezclan.
import { z } from 'zod'

const texto = z.string().nullable()

/**
 * El ERP serializa los decimales de Laravel como string ("20.0000"), no como número.
 * Coercionar es obligatorio: tratarlos como number los deja en NaN.
 */
const precio = z.coerce.number()

export const ImagenProductoSchema = z.object({
  id: z.number(),
  /** Ruta relativa. Resolver siempre con storageUrl(); sin /storage da 404. */
  path: z.string(),
  es_principal: z.boolean(),
  orden: z.number(),
})

/** Bullet de producto: la API los envía como objetos { texto }, no como strings. */
export const CaracteristicaProductoSchema = z.object({
  texto: z.string(),
})

/** Categoría anidada dentro de un producto: no trae children ni products_count. */
export const CategoriaAnidadaSchema = z.object({
  id: z.number(),
  parent_id: z.number().nullable(),
  nombre: z.string(),
  slug: z.string(),
  descripcion: texto,
  imagen: texto,
  contenido: texto,
})

export const ProductoSchema = z.object({
  id: z.number(),
  store_category_id: z.number(),
  nombre: z.string(),
  slug: z.string(),
  /** HTML. Sanitizar antes de renderizar. */
  descripcion: texto,
  precio_venta: precio,
  precio_distribuidor: precio,
  cantidad_minima_distribuidor: z.number(),
  publicado: z.boolean(),
  destacado: z.boolean(),
  orden: z.number(),
  sku: texto,
  unidad_precio: texto,
  caracteristicas: z.array(CaracteristicaProductoSchema).default([]),
  meta_titulo: texto,
  meta_descripcion: texto,
  store_category: CategoriaAnidadaSchema.nullable().optional(),
  imagenes: z.array(ImagenProductoSchema).default([]),
})

/** Categoría raíz de /categories: sí trae children y products_count. */
export const CategoriaSchema: z.ZodType<Categoria> = z.lazy(() =>
  z.object({
    id: z.number(),
    parent_id: z.number().nullable(),
    nombre: z.string(),
    slug: z.string(),
    descripcion: texto,
    imagen: texto,
    banner: texto,
    /** HTML. Sanitizar antes de renderizar. */
    contenido: texto,
    publicado: z.boolean(),
    orden: z.number(),
    destacada: z.boolean(),
    products_count: z.number(),
    meta_titulo: texto,
    meta_descripcion: texto,
    children: z.array(CategoriaSchema).default([]),
  }),
)

export interface Categoria {
  id: number
  parent_id: number | null
  nombre: string
  slug: string
  descripcion: string | null
  imagen: string | null
  banner: string | null
  contenido: string | null
  publicado: boolean
  orden: number
  destacada: boolean
  products_count: number
  meta_titulo: string | null
  meta_descripcion: string | null
  children: Categoria[]
}

/**
 * /products responde con el paginador de Laravel; /products/featured y /categories
 * responden un array plano. Son formas distintas y necesitan schemas distintos.
 */
export const ProductoPaginadoSchema = z.object({
  current_page: z.number(),
  data: z.array(ProductoSchema),
  last_page: z.number(),
  per_page: z.number(),
  total: z.number(),
})

export const ProductoListaSchema = z.array(ProductoSchema)
export const CategoriaListaSchema = z.array(CategoriaSchema)

export type ImagenProducto = z.infer<typeof ImagenProductoSchema>
export type Producto = z.infer<typeof ProductoSchema>
export type ProductoPaginado = z.infer<typeof ProductoPaginadoSchema>
