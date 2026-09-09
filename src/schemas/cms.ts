// Schemas del CMS (erp.mashaec.net/api/cms/{slug}).
// Cada campo está verificado contra la respuesta real de la API. Carril separado
// del de ecommerce: no se mezclan.
import { z } from 'zod'

/** El CMS devuelve null en cualquier campo sin llenar. */
const texto = z.string().nullable()

/** Las imágenes del CMS llegan como URL absoluta (a diferencia de las de producto). */
const urlImagen = z.string().url().nullable()

export const HeroSchema = z.object({
  titulo: texto,
  subtitulo: texto,
  descripcion: texto,
  imagen: urlImagen,
  cta_texto: texto,
  cta_url: texto,
})

/** Valor de marca: el `icono` llega como nombre de Phosphor ("Shield", "Heart"...). */
export const ValorSchema = z.object({
  icono: texto,
  titulo: z.string(),
  descripcion: texto,
})

/** Métrica de "numeros": el valor es texto, no número ("10+", "99%"). */
export const NumeroSchema = z.object({
  valor: z.string(),
  etiqueta: z.string(),
})

/** Misión y Visión llegan aquí, como lista genérica. No son campos propios. */
export const CaracteristicaSchema = z.object({
  titulo: z.string(),
  descripcion: texto,
})

export const AboutSchema = z.object({
  titulo: texto,
  descripcion: texto,
  imagen: urlImagen,
  por_que_nosotros: z.array(ValorSchema).default([]),
  numeros: z.array(NumeroSchema).default([]),
  caracteristicas: z.array(CaracteristicaSchema).default([]),
})

export const ServiceSchema = z.object({
  id: z.number(),
  source: texto,
  titulo: z.string(),
  descripcion: texto,
  caracteristicas: z.array(z.string()).default([]),
  icono: texto,
  imagen: urlImagen,
})

export const TeamMemberSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  cargo: texto,
  bio: texto,
  foto: urlImagen,
})

export const ClientSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  logo: urlImagen,
  url: texto,
})

export const FaqSchema = z.object({
  id: z.number(),
  pregunta: z.string(),
  respuesta: z.string(),
})

export const RedesSchema = z.object({
  facebook: texto.optional(),
  instagram: texto.optional(),
})

export const ContactSchema = z.object({
  direccion: texto,
  telefono: texto,
  email: texto,
  whatsapp: texto,
  mapa_embed: texto,
  redes: RedesSchema.default({}),
})

/**
 * Post en la lista de /posts: trae `extracto` pero NO `contenido`.
 * Por eso el detalle hay que pedirlo aparte; la lista no puede pintar el cuerpo.
 */
export const PostSchema = z.object({
  id: z.number(),
  titulo: z.string(),
  slug: z.string(),
  imagen: urlImagen,
  publicado_en: texto,
  extracto: texto,
})

/** Post de /posts/{slug}: al revés que la lista, trae `contenido` pero NO `extracto`. */
export const PostDetalleSchema = z.object({
  id: z.number(),
  titulo: z.string(),
  slug: z.string(),
  /** HTML del editor del ERP. Sanitizar antes de renderizar. */
  contenido: texto,
  imagen: urlImagen,
  publicado_en: texto,
})

/**
 * Ítem de la carta de un punto de venta. Igual que en producto, el ERP serializa los
 * decimales como string ("12.00"); se coerciona a número. `precio_promo` puede ser null
 * y ahí `.nullable()` lo deja pasar sin convertirlo a 0.
 */
export const MenuItemSchema = z.object({
  id: z.number(),
  nombre: z.string(),
  descripcion: texto,
  precio: z.coerce.number(),
  es_promocion: z.boolean(),
  precio_promo: z.coerce.number().nullable(),
  imagen: urlImagen,
})

/**
 * Colores de branding del cliente. El ERP manda el objeto siempre, pero cada campo
 * puede venir null si el negocio no lo cargó. Se normaliza con fallback en MarcaCliente.
 */
export const ColoresSchema = z.object({
  primario: texto,
  secundario: texto,
  acento: texto,
})

/** Foto de la galería del negocio. `alt` puede venir null. */
export const GaleriaItemSchema = z.object({
  id: z.number(),
  imagen: z.string().url(),
  alt: texto,
  orden: z.number(),
})

/**
 * Punto de venta (para Rivet, un cliente) en la lista de /puntos-venta.
 * Construir defensivo: varios campos pueden llegar null.
 * `latitud`/`longitud` pueden venir como string o número según el ERP.
 */
export const PuntoVentaSchema = z.object({
  id: z.number(),
  slug: z.string(),
  nombre: z.string(),
  descripcion: texto,
  horario: texto,
  logo: urlImagen,
  banner: urlImagen,
  direccion: texto,
  telefono: texto,
  latitud: z.union([z.string(), z.number()]).nullable(),
  longitud: z.union([z.string(), z.number()]).nullable(),
  google_maps_url: texto,
  colores: ColoresSchema.nullable().default(null),
  menu_activo: z.boolean(),
})

/**
 * Detalle de /puntos-venta/{slug}: los mismos campos + la carta en `menu` y las fotos
 * en `galeria`. Son dos landings distintas alimentadas por esta misma respuesta.
 */
export const PuntoVentaDetalleSchema = PuntoVentaSchema.extend({
  menu: z.array(MenuItemSchema).default([]),
  galeria: z.array(GaleriaItemSchema).default([]),
})

export const PuntoVentaListSchema = z.array(PuntoVentaSchema)

export const ServiceListSchema = z.array(ServiceSchema)
export const TeamListSchema = z.array(TeamMemberSchema)
export const ClientListSchema = z.array(ClientSchema)
export const FaqListSchema = z.array(FaqSchema)
export const PostListSchema = z.array(PostSchema)

export type Hero = z.infer<typeof HeroSchema>
export type Valor = z.infer<typeof ValorSchema>
export type Numero = z.infer<typeof NumeroSchema>
export type Caracteristica = z.infer<typeof CaracteristicaSchema>
export type About = z.infer<typeof AboutSchema>
export type Service = z.infer<typeof ServiceSchema>
export type TeamMember = z.infer<typeof TeamMemberSchema>
export type Client = z.infer<typeof ClientSchema>
export type Faq = z.infer<typeof FaqSchema>
export type Contact = z.infer<typeof ContactSchema>
export type Post = z.infer<typeof PostSchema>
export type PostDetalle = z.infer<typeof PostDetalleSchema>
export type MenuItem = z.infer<typeof MenuItemSchema>
export type ColoresCms = z.infer<typeof ColoresSchema>
export type GaleriaItem = z.infer<typeof GaleriaItemSchema>
export type PuntoVenta = z.infer<typeof PuntoVentaSchema>
export type PuntoVentaDetalle = z.infer<typeof PuntoVentaDetalleSchema>
