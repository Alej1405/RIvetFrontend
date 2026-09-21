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
 * Local (para Rivet, un cliente) de la lista de /puntos-venta. Trae todo lo que
 * el modal muestra: no hay endpoint de detalle.
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
  direccion: texto,
  telefono: texto,
  latitud: z.union([z.string(), z.number()]).nullable(),
  longitud: z.union([z.string(), z.number()]).nullable(),
  google_maps_url: texto,
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
export type PuntoVenta = z.infer<typeof PuntoVentaSchema>
