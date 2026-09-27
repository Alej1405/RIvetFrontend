import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from '@/layout/Layout'
import Home from '@/pages/Home'

// Home entra en el bundle inicial; el resto se parte para que la primera carga
// solo pague lo que se ve.
const Catalogo = lazy(() => import('@/pages/Catalogo'))
const Categoria = lazy(() => import('@/pages/Categoria'))
const Producto = lazy(() => import('@/pages/Producto'))
const Blog = lazy(() => import('@/pages/Blog'))
const Noticia = lazy(() => import('@/pages/Noticia'))
const PuntosVenta = lazy(() => import('@/pages/PuntosVenta'))
const Nosotros = lazy(() => import('@/pages/Nosotros'))
const Servicios = lazy(() => import('@/pages/Servicios'))
const Contactos = lazy(() => import('@/pages/Contactos'))
const Faq = lazy(() => import('@/pages/Faq'))
const Postular = lazy(() => import('@/pages/Postular'))

function RutasAnimadas() {
  const location = useLocation()
  return (
    // mode="wait" evita que dos páginas se solapen a mitad de transición.
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/catalogo/:slug" element={<Categoria />} />
          <Route path="/producto/:slug" element={<Producto />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<Noticia />} />
          <Route path="/puntos-venta" element={<PuntosVenta />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/contactos" element={<Contactos />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/postular" element={<Postular />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <RutasAnimadas />
      </Suspense>
    </BrowserRouter>
  )
}
