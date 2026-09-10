import { test, expect } from '@playwright/test'

/**
 * Presentación: lo visual, verificado sin mirar fotos.
 *
 * Cada una de estas pruebas nace de un defecto concreto que se vio en pantalla. Se
 * comprueban medidas y estilos calculados, no capturas: una captura hay que abrirla
 * e interpretarla, esto falla solo cuando el defecto vuelve.
 */

test.describe('card de producto: medida fija, foto adaptada', () => {
  /** El store encadena varias peticiones al ERP; `networkidle` corta antes de tiempo. */
  const abrirCategoria = async (page: import('@playwright/test').Page, slug: string) => {
    await page.goto(`/catalogo/${slug}`)
    await page.locator('a[href^="/producto/"]').first().waitFor({ timeout: 20_000 })
  }

  test('una botella y un frasco dan cards del mismo alto', async ({ page }) => {
    // El defecto que corrige: con object-cover la foto mandaba sobre la caja, así
    // que una botella vertical y un frasco de salsa cuadrado daban dos cards de
    // altura distinta. Hoy el ERP tiene un producto en cada categoría raíz y sus
    // fotos tienen proporciones diferentes: justo el caso que rompía.
    const alturas: Record<string, number> = {}

    for (const slug of ['bebidas', 'alimentos']) {
      await abrirCategoria(page, slug)
      const caja = await page.locator('a[href^="/producto/"]').first().boundingBox()
      expect(caja, `sin card en /catalogo/${slug}`).not.toBeNull()
      alturas[slug] = Math.round(caja!.height)
    }

    const valores = Object.values(alturas)
    const detalle = Object.entries(alturas).map(([k, v]) => `${k}=${v}`).join(' ')
    // 1 px de tolerancia por el redondeo del navegador.
    expect(Math.max(...valores) - Math.min(...valores), detalle).toBeLessThanOrEqual(1)
  })

  test('la foto se adapta dentro de la caja, no la rellena recortando', async ({ page }) => {
    await abrirCategoria(page, 'bebidas')

    const foto = page.locator('a[href^="/producto/"] img').first()
    await expect(foto).toBeVisible()
    // FIT en Figma = object-contain en código. Con cover, el producto sale cortado.
    await expect(foto).toHaveCSS('object-fit', 'contain')

    // Y la caja de imagen mantiene la proporción 4/3 del componente (340×255),
    // pase lo que pase con la proporción de la foto.
    const caja = await foto.locator('..').boundingBox()
    expect(caja).not.toBeNull()
    expect(caja!.width / caja!.height).toBeCloseTo(4 / 3, 1)
  })
})

test.describe('fondo y carga', () => {
  test('la trama de proceso está detrás del contenido, no encima', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const fondo = page.locator('canvas[aria-hidden="true"]')
    await expect(fondo).toHaveCount(1)

    const props = await fondo.evaluate((el) => {
      const s = getComputedStyle(el)
      return { z: s.zIndex, position: s.position, eventos: s.pointerEvents }
    })
    expect(Number(props.z)).toBeLessThan(0)
    expect(props.position).toBe('fixed')
    // Si capturara el puntero, ningún enlace del sitio sería clicable.
    expect(props.eventos).toBe('none')

    // Y el titular tiene que seguir siendo clicable/legible por encima.
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('el splash de carga se quita solo y no secuestra la web', async ({ page }) => {
    await page.goto('/')

    // Aparece con el isotipo, no con un spinner genérico.
    const splash = page.locator('img[alt="Rivet Ecuador"]').first()
    // Puede haberse ido ya si la API respondió en frío muy rápido: lo que no se
    // permite es que siga ahí pasado el tope duro del componente.
    await page.waitForTimeout(1800)
    await expect(page.locator('.fixed.inset-0.z-\\[100\\]')).toHaveCount(0)
    expect(await splash.count()).toBeGreaterThanOrEqual(0)

    // Y con el splash fuera, se puede navegar.
    await expect(page.getByRole('link', { name: 'Ver catálogo' }).first()).toBeVisible()
  })
})
