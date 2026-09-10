import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// jsdom no implementa matchMedia, y useReducedMotion de framer-motion lo consulta
// en cuanto se monta cualquier componente animado.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
})

// Las secciones entran con whileInView; sin este observador nunca se marcan
// como visibles y el contenido se queda en opacity 0.
class ObservadorFalso {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return [] }
  root = null
  rootMargin = ''
  thresholds = []
}
vi.stubGlobal('IntersectionObserver', ObservadorFalso)
vi.stubGlobal('ResizeObserver', ObservadorFalso)

// scrollTo lo usa TransicionPagina al cambiar de ruta.
vi.stubGlobal('scrollTo', vi.fn())
