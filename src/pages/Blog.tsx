import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/stores/useAppStore'
import PostModal from '@/components/PostModal'
import TransicionPagina from '@/components/TransicionPagina'
import Seo from '@/components/Seo'
import { VACIOS } from '@/lib/respaldos'
import { AvisoError, AvisoVacio } from '@/components/Aviso'

const fecha = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('es-EC', { day: 'numeric', month: 'short', year: 'numeric' }) : ''

export default function Blog() {
  const { datos: posts, cargando, error } = useAppStore((s) => s.posts)
  const fetchPosts = useAppStore((s) => s.fetchPosts)
  const abrirPost = useAppStore((s) => s.abrirPost)
  const hayModal = useAppStore((s) => s.postAbierto.cargando || !!s.postAbierto.datos)

  useEffect(() => {
    void fetchPosts()
  }, [fetchPosts])

  return (
    <TransicionPagina>
      <Seo title="Blog" description="Procesos, formulación y regulación alimentaria por Rivet Ecuador." />

      <section className="mx-auto max-w-5xl px-4 py-14 md:px-6 md:py-24">
        <header className="max-w-2xl">
          <h1 className="font-heveltica text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
            Blog
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Procesos, formulación y regulación alimentaria.
          </p>
        </header>

        {error ? (
          <AvisoError mensaje={error} onReintentar={() => void fetchPosts()} />
        ) : cargando && posts.length === 0 ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {[0, 1].map((i) => (
              <div key={i} className="h-72 animate-pulse rounded-xl border border-border/0 bg-card" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <AvisoVacio>{VACIOS.blog}</AvisoVacio>
        ) : (
          <ul className="mt-12 grid gap-5 sm:grid-cols-2">
            {posts.map((post) => (
              <li key={post.id}>
                {/* Botón y no enlace: abre un modal, no navega a otra URL. */}
                <button
                  onClick={() => void abrirPost(post.slug)}
                  className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition-colors duration-200 hover:border-primary/50 focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {post.imagen && (
                    <div className="aspect-[16/9] overflow-hidden bg-secondary">
                      <img
                        src={post.imagen}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    {post.publicado_en && (
                      <p className="text-xs text-muted-foreground">{fecha(post.publicado_en)}</p>
                    )}
                    <h2 className="mt-2 font-heveltica text-lg font-bold leading-tight text-foreground">
                      {post.titulo}
                    </h2>
                    {post.extracto && (
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                        {post.extracto}
                      </p>
                    )}
                    <span className="mt-4 text-sm font-semibold text-primary">Leer</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <AnimatePresence>{hayModal && <PostModal />}</AnimatePresence>
    </TransicionPagina>
  )
}
