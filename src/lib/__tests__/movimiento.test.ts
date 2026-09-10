import { describe, expect, it } from 'vitest'
import { aparece, entra, SALIDA, MORFO } from '@/lib/movimiento'

describe('sistema de movimiento', () => {
  it('con reduced-motion devuelve initial:false y nada más', () => {
    // Esto es lo que impide que una animación de Framer Motion se cuele: el override
    // de index.css solo detiene las de CSS, así que aquí es donde se corta de verdad.
    for (const props of [aparece(3, true), entra(3, true)]) {
      expect(props).toEqual({ initial: false })
      expect(props).not.toHaveProperty('whileInView')
      expect(props).not.toHaveProperty('animate')
      expect(props).not.toHaveProperty('transition')
    }
  })

  it('usa transform completo, no el atajo `y` de Framer Motion', () => {
    // El atajo corre en el hilo principal y dropea frames mientras la página pide
    // datos al ERP. El string va a GPU.
    const props = aparece(0) as Record<string, Record<string, unknown>>
    expect(props.initial).not.toHaveProperty('y')
    expect(props.initial.transform).toMatch(/^translateY\(\d+px\)$/)
    expect(props.whileInView.transform).toBe('translateY(0px)')
  })

  it('escalona pero con tope: el producto 30 no entra a los 1,5 s', () => {
    const retardo = (i: number) => (aparece(i) as { transition: { delay: number } }).transition.delay
    expect(retardo(0)).toBe(0)
    expect(retardo(3)).toBeCloseTo(0.15)
    // A partir del sexto todos entran juntos.
    expect(retardo(6)).toBeCloseTo(0.3)
    expect(retardo(30)).toBeCloseTo(0.3)
    // 0,35 y no 0,3 exacto: 6 * 0.05 en coma flotante da 0,30000000000000004.
    expect(retardo(30)).toBeLessThan(0.35)
  })

  it('entra() anima al montar y aparece() espera al scroll', () => {
    expect(entra(0)).toHaveProperty('animate')
    expect(entra(0)).not.toHaveProperty('whileInView')

    const props = aparece(0) as { viewport: { once: boolean } }
    expect(props).toHaveProperty('whileInView')
    // once: una sección que vuelve a animarse cada vez que subes cansa.
    expect(props.viewport.once).toBe(true)
  })

  it('las curvas son propias, no las flojas de CSS', () => {
    expect(SALIDA).toEqual([0.23, 1, 0.32, 1])
    expect(MORFO).toEqual([0.77, 0, 0.175, 1])
    // Un ease-out de verdad arranca rápido: el primer punto de control va alto.
    expect(SALIDA[1]).toBeGreaterThan(0.9)
  })
})
