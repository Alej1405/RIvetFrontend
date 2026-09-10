import { test, expect } from '@playwright/test'

/**
 * Integración: la app contra el ERP de verdad.
 *
 * No se mockea nada a propósito. Estas pruebas responden a una pregunta que las
 * unitarias no pueden: ¿lo que el ERP devuelve hoy sigue encajando con lo que el
 * código espera? Si alguien cambia un campo en el panel o el contrato de la API,
 * aquí se ve — y es justo el fallo que en producción se nota semanas después.
 */

test.describe('datos del ERP en pantalla', () => {
  test('la portada muestra el hero que devuelve /cms/hero', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
    // El h1 se compone de titulo + subtitulo, en dos spans.
    await expect(h1).toContainText('Sabor que transforma')
    await expect(h1).toContainText('VIDAS')
  })

  test('los servicios salen del CMS, cortados en cinco', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Home hace services.slice(0, 5) aunque el ERP devuelva seis.
    await expect(page.getByRole('heading', { name: 'Maquilación de licores' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Complementos de licor' })).toBeVisible()
    // El sexto, Permisos ARCSA, no debe aparecer en la portada.
    await expect(page.getByRole('heading', { name: 'Permisos ARCSA' })).toHaveCount(0)
  })

  test('la página de servicios sí muestra los seis', async ({ page }) => {
    await page.goto('/servicios')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { name: 'Permisos ARCSA' })).toBeVisible()
  })

  test('el catálogo pinta las categorías raíz del ERP', async ({ page }) => {
    await page.goto('/catalogo')
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { name: 'Alimentos' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Bebidas' })).toBeVisible()
  })

  test('los datos de contacto vienen del CMS, no escritos a mano', async ({ page }) => {
    await page.goto('/contactos')
    await page.waitForLoadState('networkidle')
    await expect(page.getByText('ventas@rivet-ec.com').first()).toBeVisible()
    await expect(page.getByText(/Píntag vía Tolontag/).first()).toBeVisible()
  })
})

test.describe('el contrato de la API se cumple', () => {
  test('ningún recurso del CMS falla ni rompe su schema', async ({ page }) => {
    // 7 cargas completas contra el ERP real, y las dos primeras se llevan ~19 s
    // porque Vite compila los chunks bajo demanda. Medido: 38,8 s. Los 30 s por
    // defecto de Playwright no dan, y bajar la cobertura para caber sería cambiar
    // la prueba por una peor.
    test.setTimeout(90_000)

    const fallos: string[] = []
    page.on('response', (r) => {
      if (r.url().includes('/api/') && !r.ok()) fallos.push(`${r.status()} ${r.url()}`)
    })
    // Un ApiError de validación llega a la consola: es la señal de que el ERP
    // cambió un contrato y el front dejó de entenderlo.
    const errores: string[] = []
    page.on('pageerror', (e) => errores.push(String(e)))

    for (const ruta of ['/', '/servicios', '/nosotros', '/contactos', '/faq', '/blog', '/catalogo']) {
      await page.goto(ruta)
      await page.waitForLoadState('networkidle')
    }

    expect(fallos, `peticiones fallidas: ${fallos.join(', ')}`).toHaveLength(0)
    expect(errores, `errores en página: ${errores.join(' | ')}`).toHaveLength(0)
  })
})

test.describe('recorrido de compra', () => {
  test('del catálogo al producto, con su precio mayorista', async ({ page }) => {
    await page.goto('/catalogo')
    await page.waitForLoadState('networkidle')

    await page.getByRole('heading', { name: 'Bebidas' }).click()
    await expect(page).toHaveURL(/\/catalogo\/bebidas/)
    await page.waitForLoadState('networkidle')

    await page.getByText('Pinteno espiritu del paramos').first().click()
    await expect(page).toHaveURL(/\/producto\//)
    await page.waitForLoadState('networkidle')

    // El argumento de venta del sitio: precio público, mayorista y su mínimo.
    await expect(page.getByText('$20,00').first()).toBeVisible()
    await expect(page.getByText('$12,00').first()).toBeVisible()
    await expect(page.getByText(/desde 12 unidades/i)).toBeVisible()
  })

  test('el botón de pedido lleva al WhatsApp del ERP', async ({ page }) => {
    await page.goto('/producto/pinteno-espiritu-del-paramos')
    await page.waitForLoadState('networkidle')

    const boton = page.getByRole('link', { name: /WhatsApp/i }).first()
    await expect(boton).toBeVisible()
    // 593998993908 sale de contact.whatsapp, normalizado por numeroWhatsapp().
    await expect(boton).toHaveAttribute('href', /wa\.me\/593998993908/)
  })
})

test.describe('rutas', () => {
  /**
   * BUG CONOCIDO, sin corregir todavía.
   *
   * App.tsx no declara <Route path="*">, así que cualquier URL que no coincida
   * deja #root sin un solo hijo: pantalla en blanco, ni header ni pie. Comprobado
   * en /no-existe-esta-ruta, /producto/slug-inventado y
   * /puntos-venta/local-que-no-existe.
   *
   * El tercero es el que preocupa: los QR impresos de los puntos de venta apuntan
   * a /puntos-venta/{slug}. Si un local se borra del ERP o el slug cambia, quien
   * escanee ese código ve una página vacía.
   *
   * Va con test.fail() a propósito: deja el bug documentado y ejecutándose sin
   * bloquear el despliegue. El día que se añada la ruta comodín, Playwright avisa
   * de que esta prueba pasó cuando se esperaba que fallara — y entonces se quita
   * el test.fail() y queda como prueba normal.
   */
  test('una ruta inventada no deja la pantalla en blanco', async ({ page }) => {
    test.fail(true, 'falta <Route path="*"> en App.tsx')

    const respuesta = await page.goto('/no-existe-esta-ruta')
    // El .htaccess sirve index.html, así que el servidor responde 200: el 404
    // tendría que resolverlo el enrutador, y hoy no lo hace.
    expect(respuesta?.status()).toBe(200)
    await expect(page.locator('body')).not.toBeEmpty()
  })
})
