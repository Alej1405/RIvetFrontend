import { describe, it, expect } from 'vitest'
import { contactoSeguro, CONTACTO_RESPALDO, HERO_RESPALDO, ABOUT_RESPALDO } from '@/lib/respaldos'
import { numeroWhatsapp } from '@/lib/config'

/**
 * Los respaldos son la red de seguridad del sitio: lo que se ve si el ERP no
 * responde. Si alguno estuviera mal, el fallo aparecería justo el día que la API
 * cae, que es cuando menos margen hay para arreglarlo.
 */

describe('contactoSeguro', () => {
  it('usa el respaldo cuando la API no respondió', () => {
    expect(contactoSeguro(null)).toEqual(CONTACTO_RESPALDO)
  })

  it('respeta lo que el ERP devuelve, aunque venga incompleto', () => {
    // El cliente quitó el teléfono del panel: es una decisión suya, no un fallo.
    // El respaldo no puede resucitarlo.
    const delErp = {
      direccion: 'Otra dirección', telefono: null, email: 'otro@correo.com',
      whatsapp: null, mapa_embed: null, redes: {},
    }
    const resultado = contactoSeguro(delErp)
    expect(resultado.telefono).toBeNull()
    expect(resultado.direccion).toBe('Otra dirección')
  })

  it('no mezcla campos del ERP con los del respaldo', () => {
    const delErp = {
      direccion: null, telefono: null, email: null,
      whatsapp: null, mapa_embed: null, redes: {},
    }
    // Si mezclara, aquí saldría el WhatsApp del respaldo y el sitio ofrecería
    // un canal que el cliente decidió cerrar.
    expect(contactoSeguro(delErp).whatsapp).toBeNull()
  })
})

describe('los respaldos son usables de verdad', () => {
  it('el WhatsApp de respaldo normaliza a un número válido', () => {
    expect(numeroWhatsapp(CONTACTO_RESPALDO.whatsapp)).toBe('593998993908')
  })

  it('el correo de respaldo tiene forma de correo', () => {
    expect(CONTACTO_RESPALDO.email).toMatch(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i)
  })

  it('ningún texto de respaldo llega vacío ni con espacios de sobra', () => {
    const textos = [
      HERO_RESPALDO.titulo, HERO_RESPALDO.subtitulo, HERO_RESPALDO.descripcion,
      ABOUT_RESPALDO.titulo, ABOUT_RESPALDO.descripcion,
      CONTACTO_RESPALDO.direccion!, CONTACTO_RESPALDO.telefono!,
    ]
    for (const t of textos) {
      expect(t.length).toBeGreaterThan(0)
      // El ERP devuelve "Sabor que transforma " y "NUESTRA ": aquí van limpios.
      expect(t).toBe(t.trim())
    }
  })

  it('el hero de respaldo conserva el salto de línea de la bajada', () => {
    // whitespace-pre-line lo respeta en pantalla: sin el salto, se lee corrido.
    expect(HERO_RESPALDO.descripcion).toContain('\n')
  })
})
