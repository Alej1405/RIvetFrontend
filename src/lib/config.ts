// Constantes del sitio que no viven en el ERP.

/**
 * URL del portal de clientes (login de la tienda B2B en el ERP). El botón
 * "Acceso clientes" aparece en el header, el nav inferior de mobile y el footer.
 * Es el único sitio donde hay que tocarlo. Si se vacía, el botón deja de
 * renderizarse en todos lados.
 */
export const PORTAL_CLIENTES = 'https://erp.mashaec.net/tienda/rivet-ecuador-sas/login'

export const hayPortal = (): boolean => PORTAL_CLIENTES.trim().length > 0

/**
 * Dominio público donde se despliega este sitio. Es la base del enlace que se genera
 * para cada punto de venta (el que el cliente comparte / imprime como QR). Si cambia
 * el dominio, se toca solo aquí.
 */
export const SITIO_URL = 'https://rivet-ec.com'


/**
 * Normaliza el teléfono de un punto de venta (texto libre del ERP) al formato que
 * pide `wa.me`: solo dígitos con código de país. Ecuador = 593. Devuelve `null` si
 * no hay un número usable, para no pintar un botón que lleve a la nada.
 *
 *   "099 899 3908"  → "593998993908"   (móvil local con 0)
 *   "+593 99 899…"  → "593998993908"   (ya internacional)
 *   "998993908"     → "593998993908"   (móvil sin 0)
 */
export function numeroWhatsapp(telefono: string | null | undefined): string | null {
  if (!telefono) return null
  let d = telefono.replace(/\D/g, '')
  if (!d) return null
  if (d.startsWith('593')) {
    // ya viene con código de país
  } else if (d.startsWith('0')) {
    d = '593' + d.slice(1)
  } else if (d.length === 9 && d.startsWith('9')) {
    d = '593' + d
  }
  return d.length >= 11 ? d : null
}

/** Enlace `wa.me` con mensaje pre-cargado, o `null` si el teléfono no sirve. */
export function urlWhatsapp(telefono: string | null | undefined, mensaje: string): string | null {
  const n = numeroWhatsapp(telefono)
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(mensaje)}` : null
}
