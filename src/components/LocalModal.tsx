import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Clock, MapPin, NavigationArrow, Phone, Storefront, X } from '@phosphor-icons/react'
import { urlWhatsapp } from '@/lib/config'
import type { PuntoVenta } from '@/schemas/cms'

/**
 * Ficha de un local.
 *
 * No pide nada al abrir: la lista de /puntos-venta ya trae todo lo que se muestra,
 * así que abre instantáneo. Antes esto era una página propia por local.
 *
 * En móvil entra como hoja desde abajo y en escritorio como diálogo centrado,
 * igual que el resto de modales del sitio.
 */
export default function LocalModal({ punto, onCerrar }: { punto: PuntoVenta | null; onCerrar: () => void }) {
  const reduce = useReducedMotion()
  const cajaRef = useRef<HTMLDivElement>(null)
  const abierto = !!punto

  useEffect(() => {
    if (!abierto) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar()
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
  }, [abierto, onCerrar])

  if (!punto) return null

  const maps =
    punto.google_maps_url ??
    (punto.latitud && punto.longitud ? `https://www.google.com/maps?q=${punto.latitud},${punto.longitud}` : null)
  const whatsapp = urlWhatsapp(punto.telefono, `Hola ${punto.nombre}, los encontré en la web de Rivet.`)

  // El portal es obligatorio: TransicionPagina lleva un transform, y un ancestro
  // transformado se vuelve el bloque contenedor de sus hijos fixed — el modal
  // aparecería desplazado según el scroll en vez de anclado al viewport.
  return createPortal(
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-0 backdrop-blur-sm md:items-center md:p-6"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
      onClick={onCerrar}
      role="presentation"
    >
      <motion.div
        ref={cajaRef}
        role="dialog"
        aria-modal="true"
        aria-label={punto.nombre}
        initial={reduce ? false : { opacity: 0, transform: 'translateY(24px) scale(0.98)' }}
        animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
        transition={{ duration: 0.26, ease: [0.23, 1, 0.32, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-border bg-card pb-[env(safe-area-inset-bottom)] md:max-h-[85dvh] md:rounded-2xl md:pb-0"
      >
        <button
          onClick={onCerrar}
          aria-label="Cerrar"
          className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur transition-transform duration-150 ease-out active:scale-95"
        >
          <X size={18} weight="bold" />
        </button>

        {/* Asa: en móvil la hoja se lee como arrastrable aunque se cierre tocando fuera. */}
        <div aria-hidden className="mx-auto mt-2.5 h-1 w-9 rounded-full bg-border md:hidden" />

        <div className="p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-secondary">
              {punto.logo ? (
                <img src={punto.logo} alt="" className="h-full w-full object-cover" />
              ) : (
                <Storefront size={24} className="text-primary/60" weight="duotone" />
              )}
            </div>
            <div className="min-w-0 pr-10">
              <h2 className="font-heveltica text-2xl font-bold leading-tight text-foreground text-balance">
                {punto.nombre}
              </h2>
              {punto.horario && (
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock size={14} className="shrink-0 text-primary" /> {punto.horario}
                </p>
              )}
            </div>
          </div>

          {punto.descripcion && (
            <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-muted-foreground">{punto.descripcion}</p>
          )}

          {punto.direccion && (
            <p className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
              <MapPin size={16} className="mt-0.5 shrink-0 text-primary" /> {punto.direccion}
            </p>
          )}

          {(maps || whatsapp) && (
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              {maps && (
                <a
                  href={maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-150 ease-out active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <NavigationArrow size={16} weight="fill" /> Cómo llegar
                </a>
              )}
              {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-foreground transition-[border-color,transform] duration-150 ease-out hover:border-primary/60 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <Phone size={16} weight="fill" /> Escribir
                </a>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}
