import { describe, it, expect } from 'vitest'
import { luminancia, esOscuro, textoLegible, ajustar, COLORES_FALLBACK } from '@/lib/color'

/**
 * color.ts decide el tema de cada microsite a partir de los colores que el cliente
 * cargó en el ERP. Si textoLegible se equivoca, el texto queda ilegible sobre el
 * fondo de un local y nadie se entera hasta que alguien abre ese enlace.
 */

describe('luminancia', () => {
  it('sitúa blanco y negro en los extremos', () => {
    expect(luminancia('#ffffff')).toBeCloseTo(1, 5)
    expect(luminancia('#000000')).toBeCloseTo(0, 5)
  })

  it('acepta la forma corta de tres dígitos', () => {
    expect(luminancia('#fff')).toBeCloseTo(luminancia('#ffffff'), 5)
  })

  it('devuelve 0 ante un valor que no parsea, en vez de lanzar', () => {
    // El ERP guarda texto libre: un color mal escrito no puede tumbar la página.
    expect(luminancia('rojo')).toBe(0)
    expect(luminancia('#12345')).toBe(0)
    expect(luminancia('')).toBe(0)
  })
})

describe('esOscuro', () => {
  it('reconoce el fondo de marca como oscuro', () => {
    expect(esOscuro('#07100f')).toBe(true)
  })

  it('reconoce el amarillo de marca como claro', () => {
    expect(esOscuro('#e8e857')).toBe(false)
  })

  it('clasifica los colores reales de Alejandro', () => {
    // Único punto de venta con colores propios en el ERP.
    expect(esOscuro('#0a073b')).toBe(true)   // primario, azul muy oscuro
    expect(esOscuro('#cdd025')).toBe(false)  // secundario, lima
    expect(esOscuro('#6d3fd9')).toBe(true)   // acento, violeta
  })
})

describe('textoLegible', () => {
  it('da texto claro sobre fondo oscuro y al revés', () => {
    expect(textoLegible('#07100f')).toBe('#f7fafc')
    expect(textoLegible('#e8e857')).toBe('#0b0f14')
  })

  it('no usa blanco ni negro puros', () => {
    // Decisión de diseño: conservar profundidad en la microsite.
    expect(textoLegible('#000000')).not.toBe('#ffffff')
    expect(textoLegible('#ffffff')).not.toBe('#000000')
  })

  it('cumple AA sobre los tres colores de Alejandro', () => {
    const contraste = (a: string, b: string) => {
      const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p)
      return (x + 0.05) / (y + 0.05)
    }
    for (const fondo of ['#0a073b', '#cdd025', '#6d3fd9']) {
      expect(contraste(textoLegible(fondo), fondo)).toBeGreaterThanOrEqual(4.5)
    }
  })
})

describe('ajustar', () => {
  it('aclara hacia blanco y oscurece hacia negro', () => {
    expect(luminancia(ajustar('#808080', 0.5))).toBeGreaterThan(luminancia('#808080'))
    expect(luminancia(ajustar('#808080', -0.5))).toBeLessThan(luminancia('#808080'))
  })

  it('no se pasa de los extremos', () => {
    expect(ajustar('#ffffff', 1)).toBe('#ffffff')
    expect(ajustar('#000000', -1)).toBe('#000000')
  })

  it('devuelve el original si el hex no sirve', () => {
    expect(ajustar('nada', 0.5)).toBe('nada')
  })
})

describe('COLORES_FALLBACK', () => {
  it('es legible: es lo que ven los cinco locales sin colores propios', () => {
    expect(esOscuro(COLORES_FALLBACK.primario)).toBe(true)
    expect(textoLegible(COLORES_FALLBACK.primario)).toBe('#f7fafc')
  })
})
