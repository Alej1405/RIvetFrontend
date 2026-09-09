import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Header from '@/components/Header'
import BottomNav from '@/components/BottomNav'
import Footer from '@/components/Footer'
import LoadingScreen from '@/components/LoadingScreen'
import { useAppStore } from '@/stores/useAppStore'

export default function Layout() {
  const { pathname } = useLocation()
  const fetchContact = useAppStore((s) => s.fetchContact)

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
      {/* Splash de marca, solo mobile y con tope de tiempo: no tapa la web. */}
      <AnimatePresence>
        <LoadingScreen />
      </AnimatePresence>
      <Header />
      {/* pt-16 compensa el header fijo; pb-16 deja sitio al nav inferior de mobile. */}
      <main className="flex-1 pt-16 pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}
