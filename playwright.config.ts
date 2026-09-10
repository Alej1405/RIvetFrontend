import { defineConfig, devices } from '@playwright/test'

/**
 * Pruebas de extremo a extremo y de adaptabilidad.
 *
 * Los proyectos son los tamaños reales que el sitio tiene que sostener, no una
 * lista genérica: móvil (donde el nav va abajo con apariencia de app), tablet
 * (el punto donde `md:` entra) y escritorio.
 *
 * `reducedMotion: 'reduce'` está puesto a propósito en todos: el código respeta
 * useReducedMotion(), y sin esto las secciones con whileInView se quedan en
 * opacity 0 y las pruebas fallan por un motivo que no es el que se busca.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],

  /**
   * 10 s en vez de los 5 s por defecto. En local las pruebas corren contra el
   * servidor de desarrollo, que compila los chunks lazy la primera vez que alguien
   * pide esa ruta: un `toHaveURL` justo después de un clic que dispara una ruta
   * partida se comía el plazo y fallaba de forma intermitente. No es la web siendo
   * lenta, es Vite compilando — en CI, contra el dist/ servido, no ocurre.
   */
  expect: { timeout: 10_000 },

  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:5174',
    reducedMotion: 'reduce',
    trace: 'on-first-retry',
  },

  // En local levanta el dev server si no hay uno ya escuchando. En CI no: allí el
  // workflow sirve el dist/ compilado con `vite preview` y pasa BASE_URL, para que
  // las pruebas corran contra exactamente lo que se va a publicar.
  ...(process.env.CI
    ? {}
    : {
        webServer: {
          command: 'npm run dev -- --port 5174',
          url: 'http://localhost:5174',
          reuseExistingServer: true,
          timeout: 60_000,
        },
      }),

  // Todos sobre Chromium a propósito. Los perfiles de iPhone y iPad de Playwright
  // usan WebKit, que habría que instalar aparte y pesa; lo que estas pruebas miden
  // —tamaños, desbordes, área táctil, qué navegación aparece— depende del viewport
  // y del modo táctil, no del motor. Si algún día hace falta comprobar un fallo
  // propio de Safari, se añade con: npx playwright install webkit
  projects: [
    {
      name: 'movil',
      use: { ...devices['iPhone 13'], browserName: 'chromium', defaultBrowserType: 'chromium' },
    },
    {
      name: 'tablet',
      use: { ...devices['iPad Mini'], browserName: 'chromium', defaultBrowserType: 'chromium' },
    },
    {
      name: 'escritorio',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
  ],
})
