import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import Footer from '@/components/Footer'
import FondoRivet from '@/components/FondoRivet'
import LoadingScreen from '@/components/LoadingScreen'
import { useSplash } from '@/lib/splash'
import { useAppStore } from '@/stores/useAppStore'

export default function Layout() {
  const { pathname } = useLocation()
  const fetchContact = useAppStore((s) => s.fetchContact)
  const splash = useSplash()

  // Contacto es lo único global: lo usan header, nav y footer. El resto de recursos
  // los pide cada página, así que ninguna sección espera por otra y la web pinta
  // sin quedar rehén de la petición más lenta.
  useEffect(() => {
    void fetchContact()
  }, [fetchContact])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-x-hidden">
      {/* Trama de proceso detrás de todo. Va aquí y no en los microsites de los
          puntos de venta: esos llevan la marca del cliente, no la de Rivet. */}
      <FondoRivet />
      {/* Splash de marca en todas las pantallas, con tope de tiempo: no tapa la web.
          El condicional va AQUÍ y no dentro del componente: AnimatePresence necesita
          que el hijo desaparezca del árbol para animar su salida. */}
      <AnimatePresence>{splash && <LoadingScreen key="splash" />}</AnimatePresence>
      {/* Salto al contenido: con el header fijo, el teclado tabulaba los 8 destinos
          en cada página antes de llegar a leer nada. */}
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:font-bold focus:text-accent-foreground"
      >
        Saltar al contenido
      </a>
      <Header />
      {/* pt-16 compensa el header fijo. El hueco de abajo no puede ser pb-16 fijo:
          el nav mide 56px MÁS la barra de gestos del iPhone, así que los últimos
          ~26px de cada página quedaban debajo de la barra. */}
      <main id="contenido" className="flex-1 pt-16 pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}
