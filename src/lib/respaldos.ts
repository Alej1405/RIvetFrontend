import type { Contact } from '@/schemas/cms'

/**
 * Valores por defecto del sitio.
 *
 * El ERP manda: si un campo llega con contenido, se muestra ese y nada más. Esto
 * solo entra en juego cuando la API devuelve null, cadena vacía o no responde,
 * para que la página nunca quede con un hueco, un titular en blanco o un botón
 * sin destino.
 *
 * De dónde salen estos textos
 * ---------------------------
 * No están inventados: son lo que /api/cms/rivet-ecuador-sas devuelve hoy,
 * limpiado de rarezas de captura —el hero llega como "Sabor que transforma "
 * con espacio final, y cta_texto como "NUESTRA " a medias—. Así, si la API cae,
 * el visitante ve el mismo sitio de siempre en vez de una página rota.
 *
 * Qué NO va aquí
 * --------------
 * El catálogo, el blog y los puntos de venta. Ahí un respaldo mentiría: mostrar
 * un producto que ya no existe o un local cerrado es peor que un estado vacío
 * honesto. Estos respaldos cubren la identidad de la empresa, que no cambia.
 */

/** /cms/hero — la portada nunca puede quedarse sin titular. */
export const HERO_RESPALDO = {
  titulo: 'Sabor que transforma',
  subtitulo: 'VIDAS',
  descripcion: 'Innovamos con PROPÓSITO\nINDUSTRIA DE ALIMENTOS.',
} as const

/** /cms/about — la sección Nosotros y su bloque en la portada. */
export const ABOUT_RESPALDO = {
  titulo: 'Innovamos con PROPÓSITO',
  descripcion:
    'Somos una empresa de ingeniería alimenticia comprometida con el desarrollo ' +
    'económico local, impulsando el talento de mujeres emprendedoras en la ' +
    'elaboración de productos con identidad.',
} as const

/**
 * /cms/contact — es el respaldo más importante: sin estos datos el visitante no
 * tiene por dónde escribir, y el formulario de contacto se queda sin destino
 * porque compone un enlace de WhatsApp con contact.whatsapp.
 */
export const CONTACTO_RESPALDO: Contact = {
  direccion: 'Píntag vía Tolontag, Quito, Ecuador',
  telefono: '+593 99 899 3908',
  email: 'ventas@rivet-ec.com',
  whatsapp: '593998993908',
  mapa_embed: 'https://maps.google.com/?q=Pintag+via+Tolontag+Quito',
  redes: {
    facebook: 'https://www.facebook.com/share/1UZxt3ofxG/?mibextid=wwXIfr',
    instagram: 'https://www.instagram.com/rivet_ecuador?igsh=Y2htbTExNDFqb3lt',
  },
}

/**
 * Rótulos de sección. No vienen del ERP y no deberían: son la estructura del
 * sitio, no su contenido. Viven aquí para no repetirlos por las páginas y para
 * que cambiar uno sea tocar un archivo, no buscar por todo src/.
 */
export const ROTULOS = {
  servicios: {
    eyebrow: 'Qué hacemos',
    titulo: 'De tu idea al mercado,\ncon respaldo técnico.',
    enlace: 'Todos los servicios',
  },
  locales: {
    eyebrow: 'Dónde encontrarnos',
    titulo: 'Puntos de venta',
    enlace: 'Ver todos',
  },
  blog: {
    titulo: 'Procesos, formulación\ny regulación.',
    bajada: 'Lo que hacemos y cómo lo hacemos, contado por quienes lo hacen.',
    enlace: 'Ir al blog',
  },
} as const

/**
 * Estados vacíos. Un catálogo sin productos o un local sin carta son situaciones
 * reales del ERP hoy, no errores: el texto lo dice sin alarmar.
 */
export const VACIOS = {
  catalogoRaiz: 'Estamos preparando el catálogo. Escríbenos y te contamos qué tenemos disponible.',
  catalogo: 'Todavía no hay productos publicados en esta categoría.',
  blog: 'Aún no hay entradas publicadas.',
  puntosVenta: 'Todavía no hay puntos de venta cargados.',
  menu: 'Este local aún no tiene su carta publicada.',
  galeria: 'Este local todavía no ha subido fotos.',
} as const

/** Mensajes de error, cuando el fallo sí es del sistema y no del contenido. */
export const ERRORES = {
  red: 'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.',
  contrato: 'La información llegó en un formato inesperado. Ya estamos revisándolo.',
  noEncontrado: 'No encontramos lo que buscabas.',
} as const

/**
 * Devuelve el contacto del ERP, o el de respaldo si la API no respondió.
 *
 * La distinción es deliberada y respeta que el ERP manda:
 *
 *   contact === null          la API falló     → se usa el respaldo entero
 *   contact.telefono === null el cliente lo     → se respeta: si lo quitó del
 *                             quitó del panel     panel, no se resucita aquí
 *
 * Sin esto, un campo borrado a propósito volvería a aparecer en la web y el
 * cliente no entendería por qué. El respaldo cubre la caída del servidor, no
 * las decisiones de quien administra el contenido.
 */
export const contactoSeguro = (contact: Contact | null): Contact => contact ?? CONTACTO_RESPALDO
