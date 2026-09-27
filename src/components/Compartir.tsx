import { useState } from 'react'
import { ShareNetwork, Check, Copy, WhatsappLogo } from '@phosphor-icons/react'

/**
 * Compartir una página.
 *
 * En celular abre el menú del sistema —WhatsApp, Instagram, Telegram, lo que
 * la persona tenga instalado— con la Web Share API. En escritorio esa API casi
 * no existe, así que se despliegan las dos salidas que de verdad se usan:
 * copiar el enlace y abrir WhatsApp Web.
 *
 * El enlace que se comparte trae los meta tags correctos porque el prerender
 * escribió un HTML propio para esa ruta (ver scripts/prerender.mjs). Sin eso,
 * este botón repartiría tarjetas genéricas.
 */
export default function Compartir({
  titulo,
  texto,
  url,
  className = '',
}: {
  titulo: string
  texto?: string
  /** Ruta ('/producto/x') o URL completa. */
  url: string
  className?: string
}) {
  const [copiado, setCopiado] = useState(false)
  const [abierto, setAbierto] = useState(false)

  const enlace = url.startsWith('http')
    ? url
    : `${typeof window !== 'undefined' ? window.location.origin : 'https://rivet-ec.com'}${url}`

  const mensaje = `${titulo}${texto ? ` — ${texto}` : ''}`

  async function copiar() {
    try {
      await navigator.clipboard.writeText(enlace)
    } catch {
      // Sin permiso de portapapeles (http, o el navegador lo bloqueó): se deja
      // seleccionado para que la persona copie a mano en vez de no hacer nada.
      const campo = document.createElement('input')
      campo.value = enlace
      document.body.appendChild(campo)
      campo.select()
      document.execCommand?.('copy')
      campo.remove()
    }

    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  async function compartir() {
    // La API nativa es lo mejor donde existe: sale el menú del sistema con las
    // apps reales de la persona, no una lista de iconos que adivinamos.
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: titulo, text: mensaje, url: enlace })
        return
      } catch {
        // Canceló el menú: no es un error, no hay nada que avisar.
        return
      }
    }

    setAbierto((v) => !v)
  }

  return (
    <div className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={compartir}
        aria-expanded={abierto}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium transition-[colors,transform] duration-150 hover:bg-secondary active:scale-[0.97]"
      >
        <ShareNetwork size={18} weight="regular" />
        Compartir
      </button>

      {abierto && (
        <div
          className="absolute top-full right-0 z-20 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-background shadow-lg"
          role="menu"
        >
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${mensaje} ${enlace}`)}`}
            target="_blank"
            rel="noreferrer"
            role="menuitem"
            onClick={() => setAbierto(false)}
            className="flex w-full items-center gap-2.5 px-4 py-3 text-sm transition-colors hover:bg-secondary"
          >
            <WhatsappLogo size={18} />
            Enviar por WhatsApp
          </a>

          <button
            type="button"
            role="menuitem"
            onClick={copiar}
            className="flex w-full items-center gap-2.5 border-t border-border px-4 py-3 text-left text-sm transition-colors hover:bg-secondary"
          >
            {copiado ? <Check size={18} weight="bold" /> : <Copy size={18} />}
            {copiado ? 'Enlace copiado' : 'Copiar enlace'}
          </button>
        </div>
      )}
    </div>
  )
}
