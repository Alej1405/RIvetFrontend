import { ArrowClockwise } from '@phosphor-icons/react'
import { ERRORES } from '@/lib/respaldos'

/**
 * Los dos avisos que sustituyen a las secciones en blanco.
 *
 * Estaban escritos a mano en cada página, con un texto distinto cada vez y siempre
 * el mismo remedio inútil: "recarga la página". Recargar vuelve a pedirlo todo; lo
 * que falló fue una petición. Aquí hay un botón que reintenta esa.
 */

export function AvisoError({ mensaje, onReintentar }: { mensaje?: string | null; onReintentar?: () => void }) {
  return (
    <div className="mt-12 rounded-xl border border-border bg-card p-6">
      <p className="text-sm leading-relaxed text-muted-foreground">{mensaje?.trim() || ERRORES.red}</p>
      {onReintentar && (
        <button
          type="button"
          onClick={onReintentar}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-foreground transition-[border-color,transform] duration-150 ease-out hover:border-primary/50 active:scale-[0.97]"
        >
          <ArrowClockwise size={15} weight="bold" /> Reintentar
        </button>
      )}
    </div>
  )
}

/** Vacío no es error: el ERP todavía no tiene ese contenido y se dice sin alarmar. */
export function AvisoVacio({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-12 rounded-xl border border-border bg-card p-6 text-sm leading-relaxed text-muted-foreground">
      {children}
    </p>
  )
}
