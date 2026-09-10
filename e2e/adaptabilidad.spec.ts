import { test, expect } from '@playwright/test'

/**
 * Adaptabilidad.
 *
 * El PRODUCT.md fija dos invariantes que estas pruebas vigilan: en móvil la
 * navegación va abajo con apariencia de app (no un header encogido), y ningún
 * destino baja del área táctil mínima de 44×44.
 *
 * La tercera comprobación —que nada desborde a lo ancho— es la que más falla en
 * la práctica: un titular largo del ERP o una tabla y aparece scroll horizontal.
 */

const rutas = ['/', '/catalogo', '/servicios', '/nosotros', '/contactos', '/faq', '/blog', '/puntos-venta']

test.describe('adaptabilidad', () => {
  for (const ruta of rutas) {
    test(`sin desborde horizontal en ${ruta}`, async ({ page }) => {
      await page.goto(ruta)
      await page.waitForLoadState('networkidle')

      const { ancho, visible } = await page.evaluate(() => ({
        ancho: document.documentElement.scrollWidth,
        visible: document.documentElement.clientWidth,
      }))
      // 1px de margen: los redondeos de subpíxel no son un desborde real.
      expect(ancho, `${ruta} desborda ${ancho - visible}px`).toBeLessThanOrEqual(visible + 1)
    })
  }

  test('la navegación cambia de forma entre móvil y escritorio', async ({ page }, info) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const enPantalla = async (sel: string) =>
      await page.locator(sel).first().isVisible().catch(() => false)

    if (info.project.name === 'movil') {
      // En móvil el menú de escritorio no debe aparecer: se sustituye, no se encoge.
      const menuEscritorio = await page.locator('header nav a', { hasText: 'Puntos de venta' }).first().isVisible().catch(() => false)
      expect(menuEscritorio).toBe(false)
    } else if (info.project.name === 'escritorio') {
      expect(await enPantalla('header')).toBe(true)
    }
  })
})

test.describe('área táctil en móvil', () => {
  test('todo destino del nav mide al menos 44×44', async ({ page }, info) => {
    // El nav inferior solo existe en móvil: en los demás perfiles no hay nada que medir.
    test.skip(info.project.name !== 'movil', 'el nav inferior solo se pinta en móvil')
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Hay dos <nav> en la página: el inferior fijo y el del pie. Solo el primero
    // es táctil; los enlaces del pie son texto y no tienen por qué medir 44px.
    // Se distingue por su posición fija, no por una clase que puede cambiar.
    const navInferior = page.locator('nav').filter({
      has: page.locator('a'),
    }).filter({
      hasNot: page.locator('footer'),
    })

    const fijo = await navInferior.evaluateAll((navs) =>
      navs.findIndex((n) => getComputedStyle(n).position === 'fixed'),
    )
    expect(fijo, 'no se encontró el nav inferior fijo').toBeGreaterThanOrEqual(0)

    const enlaces = navInferior.nth(fijo).locator('a, button')
    const total = await enlaces.count()
    expect(total, 'el nav inferior no tiene destinos').toBeGreaterThan(0)

    for (let i = 0; i < total; i++) {
      const caja = await enlaces.nth(i).boundingBox()
      if (!caja) continue
      const nombre = (await enlaces.nth(i).innerText().catch(() => '')) || `destino ${i}`
      expect(caja.height, `"${nombre}" mide ${Math.round(caja.height)}px de alto`).toBeGreaterThanOrEqual(44)
      expect(caja.width, `"${nombre}" mide ${Math.round(caja.width)}px de ancho`).toBeGreaterThanOrEqual(44)
    }
  })
})

test.describe('legibilidad', () => {
  test('el titular del hero no se sale de su caja', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()

    const desbordado = await h1.evaluate((el) => el.scrollWidth > el.clientWidth + 1)
    expect(desbordado, 'el h1 se recorta').toBe(false)
  })
})
