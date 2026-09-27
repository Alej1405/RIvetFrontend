import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from '@phosphor-icons/react'
import { motion, useReducedMotion } from 'framer-motion'
import { useAppStore } from '@/stores/useAppStore'
import { entra } from '@/lib/movimiento'
import TransicionPagina from '@/components/TransicionPagina'
import Seo from '@/components/Seo'
import Compartir from '@/components/Compartir'
import { AvisoError } from '@/components/Aviso'

/**
 * Una noticia, con su propia URL.
 *
 * Antes las noticias solo existían dentro de un modal en /blog: no tenían
 * dirección, así que no había nada que compartir ni que indexar. Con ruta
 * propia, cada publicación se puede mandar por WhatsApp y Google la ve como
 * una página, no como un pedazo del listado.
 *
 * Los meta tags de esta URL los sirve public/seo.php, que los pide al ERP en
 * el momento. Aquí solo se repiten para el navegador y para Google.
 */

const fecha = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

/** El contenido llega como HTML del editor del ERP: se limpia antes de pintarlo. */
function sanear(html: string): string {
  if (typeof window === 'undefined') return html

  const doc = new DOMParser().parseFromString(html, 'text/html')

  doc.querySelectorAll('script, style, iframe, object, embed, form').forEach((n) => n.remove())
  doc.querySelectorAll('*').forEach((n) => {
    for (const attr of [...n.attributes]) {
      if (/^on/i.test(attr.name) || (attr.name === 'href' && /^javascript:/i.test(attr.value))) {
        n.removeAttribute(attr.name)
      }
    }
  })

  return doc.body.innerHTML
}

export default function Noticia() {
  const { slug = '' } = useParams()
  const { datos: post, cargando, error } = useAppStore((s) => s.postAbierto)
  const abrirPost = useAppStore((s) => s.abrirPost)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (slug) void abrirPost(slug)
  }, [slug, abrirPost])

  const volver = (
    <Link
      to="/blog"
      className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft size={16} /> Blog
    </Link>
  )

  if (error) {
    return (
      <TransicionPagina>
        <section className="mx-auto max-w-3xl px-4 py-24 md:px-6">
          {volver}
          <AvisoError mensaje={error} onReintentar={() => void abrirPost(slug)} />
        </section>
      </TransicionPagina>
    )
  }

  if (cargando && !post) {
    return (
      <TransicionPagina>
        <section className="mx-auto max-w-3xl px-4 py-24 md:px-6">
          {volver}
          <div className="mt-8 h-10 w-3/4 animate-pulse rounded bg-card" />
          <div className="mt-4 h-64 animate-pulse rounded-xl bg-card" />
        </section>
      </TransicionPagina>
    )
  }

  if (!post) {
    return (
      <TransicionPagina>
        <section className="mx-auto max-w-3xl px-4 py-24 md:px-6">
          <h1 className="font-heveltica text-3xl font-bold text-foreground">Publicación no encontrada</h1>
          <div className="mt-4">{volver}</div>
        </section>
      </TransicionPagina>
    )
  }

  const texto = (post.contenido ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()

  return (
    <TransicionPagina>
      <Seo
        title={post.titulo}
        description={texto.slice(0, 155)}
        url={`/blog/${post.slug}`}
        image={post.imagen}
        type="article"
      />

      <article className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
        <div className="flex items-center justify-between gap-4">
          {volver}
          <Compartir titulo={post.titulo} texto={texto.slice(0, 120)} url={`/blog/${post.slug}`} />
        </div>

        <motion.header {...entra(0, reduce)} className="mt-6">
          {post.publicado_en && (
            <p className="text-sm text-muted-foreground">{fecha(post.publicado_en)}</p>
          )}
          <h1 className="mt-2 font-heveltica text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            {post.titulo}
          </h1>
        </motion.header>

        {post.imagen && (
          <motion.div {...entra(1, reduce)} className="mt-8 overflow-hidden rounded-xl bg-secondary">
            <img src={post.imagen} alt={post.titulo} className="w-full object-cover" />
          </motion.div>
        )}

        {post.contenido && (
          <motion.div
            {...entra(2, reduce)}
            className="prose prose-neutral mt-8 max-w-none text-base leading-relaxed text-muted-foreground [&_a]:text-primary [&_h2]:mt-8 [&_h2]:font-heveltica [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_img]:rounded-lg [&_p]:mt-4"
            dangerouslySetInnerHTML={{ __html: sanear(post.contenido) }}
          />
        )}
      </article>
    </TransicionPagina>
  )
}
