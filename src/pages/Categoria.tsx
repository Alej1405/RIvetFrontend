import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from '@phosphor-icons/react'
import { useAppStore } from '@/stores/useAppStore'
import { buscarCategoria, idsConDescendencia } from '@/stores/tiendaSlices'
import ProductoCard from '@/components/ProductoCard'
import { motion, useReducedMotion } from 'framer-motion'
import { entra } from '@/lib/movimiento'
import { VACIOS } from '@/lib/respaldos'
import { AvisoVacio } from '@/components/Aviso'
import TransicionPagina from '@/components/TransicionPagina'
import Seo from '@/components/Seo'

/** Los productos de una categoría incluyen los de sus hijas. */
export default function Categoria() {
  const { slug = '' } = useParams()
  const { datos: categorias } = useAppStore((s) => s.categorias)
  const { datos: productos, cargando } = useAppStore((s) => s.productos)
  const fetchCategorias = useAppStore((s) => s.fetchCategorias)
  const fetchProductos = useAppStore((s) => s.fetchProductos)
  const reduce = useReducedMotion()

  useEffect(() => {
    void fetchCategorias()
    void fetchProductos()
  }, [fetchCategorias, fetchProductos])

  const categoria = buscarCategoria(categorias, slug)
  const ids = categoria ? idsConDescendencia(categoria) : []
  const suyos = productos.filter((p) => p.publicado && ids.includes(p.store_category_id))

  if (categorias.length > 0 && !categoria) {
    return (
      <TransicionPagina>
        <section className="mx-auto max-w-6xl px-4 py-24 md:px-6">
          <h1 className="font-heveltica text-3xl font-bold text-foreground">Categoría no encontrada</h1>
          <Link to="/catalogo" className="mt-4 inline-flex items-center gap-2 text-sm text-primary">
            <ArrowLeft size={16} /> Volver al catálogo
          </Link>
        </section>
      </TransicionPagina>
    )
  }

  return (
    <TransicionPagina>
      <Seo
        title={categoria?.meta_titulo ?? categoria?.nombre ?? 'Catálogo'}
        description={categoria?.meta_descripcion ?? categoria?.descripcion ?? undefined}
      />

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} /> Catálogo
        </Link>

        <motion.header {...entra(0, reduce)} className="mt-6 max-w-2xl">
          <h1 className="font-heveltica text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
            {categoria?.nombre ?? ''}
          </h1>
          {categoria?.descripcion && (
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{categoria.descripcion}</p>
          )}
        </motion.header>

        {cargando && suyos.length === 0 ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-xl border border-border bg-card" />
            ))}
          </div>
        ) : suyos.length === 0 ? (
          <AvisoVacio>{VACIOS.catalogo}</AvisoVacio>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {suyos.map((p, i) => (
              <ProductoCard key={p.id} producto={p} indice={i} />
            ))}
          </div>
        )}
      </section>
    </TransicionPagina>
  )
}
