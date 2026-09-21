import { describe, it, expect } from 'vitest'
import { numeroWhatsapp, urlWhatsapp, hayPortal } from '@/lib/config'

/**
 * numeroWhatsapp normaliza el teléfono que el cliente escribe a mano en el ERP.
 * Si devuelve algo inválido, el botón de pedido lleva a un chat que no existe.
 */

describe('numeroWhatsapp', () => {
  it('completa el código de país en un móvil local con 0', () => {
    expect(numeroWhatsapp('099 899 3908')).toBe('593998993908')
  })

  it('respeta el que ya viene internacional', () => {
    expect(numeroWhatsapp('+593 99 899 3908')).toBe('593998993908')
    expect(numeroWhatsapp('593998993908')).toBe('593998993908')
  })

  it('completa un móvil de nueve dígitos sin cero', () => {
    expect(numeroWhatsapp('998993908')).toBe('593998993908')
  })

  it('ignora guiones, paréntesis y espacios', () => {
    expect(numeroWhatsapp('(099) 899-3908')).toBe('593998993908')
  })

  it('devuelve null cuando no hay número usable', () => {
    // El ERP tiene cinco puntos de venta con telefono = null.
    expect(numeroWhatsapp(null)).toBeNull()
    expect(numeroWhatsapp(undefined)).toBeNull()
    expect(numeroWhatsapp('')).toBeNull()
    expect(numeroWhatsapp('sin teléfono')).toBeNull()
  })

  it('rechaza un número demasiado corto en vez de armar uno roto', () => {
    expect(numeroWhatsapp('12345')).toBeNull()
  })
})

describe('urlWhatsapp', () => {
  it('arma el enlace con el mensaje codificado', () => {
    const url = urlWhatsapp('+593 99 899 3908', 'Hola, ¿tienen stock?')
    expect(url).toContain('https://wa.me/593998993908')
    expect(url).toContain(encodeURIComponent('Hola, ¿tienen stock?'))
  })

  it('devuelve null si el teléfono no sirve, para no pintar un botón muerto', () => {
    expect(urlWhatsapp(null, 'hola')).toBeNull()
  })
})


describe('hayPortal', () => {
  it('está activo mientras PORTAL_CLIENTES tenga valor', () => {
    expect(hayPortal()).toBe(true)
  })
})
