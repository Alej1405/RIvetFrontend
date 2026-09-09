import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { X } from '@phosphor-icons/react'
import { useAppStore } from '@/stores/useAppStore'

const fecha = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

/**
 * Modal de detalle de un post.
 *
 * Existe porque la lista de /posts no trae `contenido`: el cuerpo solo llega pidiendo
 * /posts/{slug}. El modal pide al abrir y muestra su propio estado de carga.
 */
export default function PostModal() {
  const { datos: post, cargando, error } = useAppStore((s) => s.postAbierto)
  const cerrarPost = useAppStore((s) => s.cerrarPost)
  const reduce = useReducedMotion()
  const cajaRef = useRef<HTMLDivElement>(null)
  const abierto = cargando || !!post || !!error

  useEffect(() => {
    if (!abierto) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrarPost()
      if (e.key !== 'Tab') return
      // Foco atrapado: sin esto el tabulador se escapa a la página de atrás.
      const focosables = cajaRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focosables?.length) return
      const primero = focosables[0]
      const ultimo = focosables[focosables.length - 1]
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault()
        ultimo.focus()
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault()
        primero.focus()
      }
    }

    document.addEventListener('keydown', onKey)
    // Bloquear el scroll de atrás: si no, el fondo se mueve al hacer scroll en el modal.
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [abierto, cerrarPost])

  if (!abierto) return null

  /**
   * Portal a document.body, obligatorio.
   *
   * El modal se monta dentro de TransicionPagina, que lleva un `transform` para animar
   * la entrada de la página. Un ancestro con `transform` pasa a ser el bloque contenedor
   * de sus descendientes `position: fixed`, así que `inset-0` se resolvía contra la
   * página en vez del viewport y el modal aparecía desplazado según el scroll.
   * Sacándolo del árbol se posiciona contra el viewport de verdad.
   */
  return createPortal(
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-0 backdrop-blur-sm md:items-center md:p-6"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
      onClick={cerrarPost}
      role="presentation"
    >
      <motion.div
        ref={cajaRef}
        role="dialog"
        aria-modal="true"
        aria-label={post?.titulo ?? 'Publicación'}
        // Entra desde abajo en mobile (como una hoja) y con un escalado leve en desktop.
        initial={reduce ? false : { opacity: 0, transform: 'translateY(24px) scale(0.98)' }}
        animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
        transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-border bg-card md:max-h-[85dvh] md:rounded-2xl"
      >
        <button
          onClick={cerrarPost}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur transition-transform duration-150 ease-out active:scale-95"
        >
          <X size={18} weight="bold" />
        </button>

        {cargando ? (
          <div className="space-y-4 p-6 md:p-8">
            <div className="h-48 animate-pulse rounded-xl bg-secondary" />
            <div className="h-7 w-3/4 animate-pulse rounded bg-secondary" />
            <div className="h-4 w-full animate-pulse rounded bg-secondary" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-secondary" />
          </div>
        ) : error ? (
          <div className="p-8">
            <p className="text-sm text-muted-foreground">
              No pudimos cargar esta publicación. Inténtalo de nuevo.
            </p>
          </div>
        ) : post ? (
          <article>
            {post.imagen && (
              <img
                src={post.imagen}
                alt=""
                className="aspect-[16/9] w-full object-cover md:rounded-t-2xl"
              />
            )}
            <div className="p-6 md:p-8">
              {post.publicado_en && (
                <p className="text-xs text-muted-foreground">{fecha(post.publicado_en)}</p>
              )}
              <h2 className="mt-2 font-heveltica text-2xl font-bold leading-tight text-foreground md:text-3xl text-balance">
                {post.titulo}
              </h2>
              {/* El contenido es HTML del editor del ERP; se sanitiza en Prosa. */}
              <Prosa html={post.contenido} />
            </div>
          </article>
        ) : null}
      </motion.div>
    </motion.div>,
    document.body,
  )
}

/**
 * Renderiza el HTML del ERP dejando solo etiquetas de texto.
 *
 * Se hace con el parser del navegador en vez de una regex: una regex sobre HTML se
 * puede evadir, y este contenido termina en dangerouslySetInnerHTML.
 */
function Prosa({ html }: { html: string | null }) {
  if (!html) return null

  const PERMITIDAS = new Set(['P', 'BR', 'STRONG', 'B', 'EM', 'I', 'UL', 'OL', 'LI', 'H2', 'H3', 'BLOCKQUOTE'])
  const doc = new DOMParser().parseFromString(html, 'text/html')

  doc.body.querySelectorAll('*').forEach((el) => {
    if (!PERMITIDAS.has(el.tagName)) {
      el.replaceWith(...Array.from(el.childNodes))
      return
    }
    // Fuera todo atributo: no hay ninguno que necesitemos y ahí viven los vectores.
    Array.from(el.attributes).forEach((a) => el.removeAttribute(a.name))
  })

  return (
    <div
      className="mt-5 max-w-[68ch] space-y-4 text-base leading-relaxed text-muted-foreground [&_h2]:font-heveltica [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-foreground"
      dangerouslySetInnerHTML={{ __html: doc.body.innerHTML }}
    />
  )
}
