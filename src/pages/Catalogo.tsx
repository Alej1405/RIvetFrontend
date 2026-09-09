import { useEffect } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { raices } from '@/stores/tiendaSlices'
import CategoriaCard from '@/components/CategoriaCard'
import TransicionPagina from '@/components/TransicionPagina'
import Seo from '@/components/Seo'

/**
 * Antesala del catálogo: las dos categorías raíz antes de los productos.
 *
 * Rivet tiene pocos productos. Entrar directo a la grilla los expondría como un
 * catálogo pobre; entrar por Alimentos y Bebidas convierte la brevedad en una
 * decisión editorial. Las raíces salen del árbol del ERP, no de una lista escrita
 * a mano: si mañana se agrega una tercera, aparece sola.
 */
export default function Catalogo() {
  const { datos: categorias, cargando, error } = useAppStore((s) => s.categorias)
  const fetchCategorias = useAppStore((s) => s.fetchCategorias)

  useEffect(() => {
    void fetchCategorias()
  }, [fetchCategorias])

  const principales = raices(categorias)

  return (
    <TransicionPagina>
      <Seo title="Catálogo" description="Alimentos y bebidas de Rivet Ecuador: producto propio con precio de distribuidor." />

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-24">
        <header className="max-w-2xl">
          <h1 className="font-heveltica text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
            Lo que producimos
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Producto propio, formulado y elaborado por nosotros. Precio de distribuidor
            disponible en todo el catálogo.
          </p>
        </header>

        {error ? (
          <p className="mt-12 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            No pudimos cargar el catálogo. Recarga la página o escríbenos por WhatsApp.
          </p>
        ) : cargando && principales.length === 0 ? (
          <div className="mt-12 grid gap-5 md:gap-6 [grid-template-columns:repeat(auto-fit,minmax(20rem,1fr))]">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="min-h-[22rem] animate-pulse rounded-2xl border border-border bg-card md:min-h-[26rem]"
              />
            ))}
          </div>
        ) : principales.length === 0 ? (
          <p className="mt-12 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
            Estamos preparando el catálogo. Escríbenos y te contamos qué tenemos disponible.
          </p>
        ) : (
          /* auto-fit: se acomoda solo a 2, 3, 4 o las raíces que haya, sin huecos. */
          <div className="mt-12 grid gap-5 md:gap-6 [grid-template-columns:repeat(auto-fit,minmax(20rem,1fr))]">
            {principales.map((c, i) => (
              <CategoriaCard key={c.id} categoria={c} indice={i} />
            ))}
          </div>
        )}
      </section>
    </TransicionPagina>
  )
}
