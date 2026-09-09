import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { ArrowLeft, Check, ShareNetwork, Storefront, Tag, WhatsappLogo } from '@phosphor-icons/react'
import { useAppStore } from '@/stores/useAppStore'
import { rutaNegocio, urlMenu, urlWhatsapp } from '@/lib/config'
import { textoLegible } from '@/lib/color'
import MarcaCliente from '@/components/MarcaCliente'
import Seo from '@/components/Seo'
import type { MenuItem } from '@/schemas/cms'

const dinero = (n: number) =>
  new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(n)

export default function Menu() {
  const { slug = '' } = useParams()
  const { datos: punto, cargando, error } = useAppStore((s) => s.puntoAbierto)
  const abrirPuntoVenta = useAppStore((s) => s.abrirPuntoVenta)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
    void abrirPuntoVenta(slug)
  }, [slug, abrirPuntoVenta])

  if (cargando || (!punto && !error)) {
    return (
      <MarcaCliente colores={null}>
        <div className="mx-auto max-w-2xl px-5 py-16">
          <div className="h-8 w-1/2 animate-pulse rounded bg-[var(--c-surface)]" />
          <div className="mt-8 space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-[var(--c-surface)]" />
            ))}
          </div>
        </div>
      </MarcaCliente>
    )
  }

  if (!punto) {
    return (
      <MarcaCliente colores={null} className="grid place-items-center px-6 text-center">
        <div>
          <Storefront size={40} weight="duotone" className="mx-auto text-[var(--c-acento)]" />
          <h1 className="mt-4 font-mundial text-2xl font-bold">Menú no disponible</h1>
          <p className="mt-2 text-sm text-[var(--c-text-muted)]">Este enlace no corresponde a ningún local.</p>
        </div>
      </MarcaCliente>
    )
  }

  const menu = punto.menu
  const menuVisible = punto.menu_activo && menu.length > 0
  const ogImage = punto.logo ?? punto.banner ?? menu[0]?.imagen ?? null

  return (
    <MarcaCliente colores={punto.colores} className="pb-16">
      <Seo
        title="Menú"
        description={`Carta y precios de ${punto.nombre}.`}
        image={ogImage}
        url={urlMenu(punto.slug)}
        siteName={punto.nombre}
      />

      {/* Cabecera de marca */}
      <header className="mx-auto max-w-2xl px-5 pt-10">
        <div className="flex items-center justify-between gap-3">
          <Link
            to={rutaNegocio(punto.slug)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[var(--c-text-muted)] transition-colors hover:text-[var(--c-text)]"
          >
            <ArrowLeft size={16} /> {punto.nombre}
          </Link>
          <BotonCompartir nombre={punto.nombre} enlace={urlMenu(punto.slug)} />
        </div>

        <div className="mt-6 flex items-center gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[var(--c-surface)]">
            {punto.logo ? (
              <img src={punto.logo} alt={punto.nombre} className="h-full w-full object-cover" />
            ) : (
              <Storefront size={30} weight="duotone" className="text-[var(--c-on-surface)]" />
            )}
          </div>
          <div>
            <h1 className="font-mundial text-3xl font-extrabold tracking-tight md:text-4xl">Menú</h1>
            <p className="text-sm text-[var(--c-text-muted)]">{punto.nombre}</p>
          </div>
        </div>
      </header>

      <section className="mx-auto mt-10 max-w-2xl px-5">
        {menuVisible ? (
          <ul className="space-y-3">
            {menu.map((item, i) => (
              <MenuFila
                key={item.id}
                item={item}
                indice={i}
                telefono={punto.telefono}
                nombreLocal={punto.nombre}
              />
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl bg-[var(--c-surface)] p-8 text-center text-[var(--c-on-surface)]">
            <p className="text-sm opacity-75">
              {punto.menu_activo
                ? 'Este local todavía no cargó platos en su carta.'
                : 'Este local no tiene la carta activa por ahora.'}
            </p>
            <Link
              to={rutaNegocio(punto.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[var(--c-acento)] px-5 py-2.5 text-sm font-bold text-[var(--c-on-acento)]"
            >
              <ArrowLeft size={15} /> Volver al negocio
            </Link>
          </div>
        )}
      </section>

      {menuVisible && <CompartirQR nombre={punto.nombre} enlace={urlMenu(punto.slug)} />}

      <footer className="mx-auto mt-10 max-w-2xl px-5">
        <p className="border-t border-[var(--c-border)] pt-8 text-center text-xs text-[var(--c-text-muted)]">
          {punto.nombre} · Carta hecha con{' '}
          <a href="https://rivet-ec.com" className="font-semibold text-[var(--c-acento)] hover:underline">Rivet Ecuador</a>
        </p>
      </footer>
    </MarcaCliente>
  )
}

function MenuFila({
  item,
  indice,
  telefono,
  nombreLocal,
}: {
  item: MenuItem
  indice: number
  telefono: string | null
  nombreLocal: string
}) {
  const reduce = useReducedMotion()
  const hayPromo = item.es_promocion && item.precio_promo != null && item.precio_promo < item.precio
  const precioFinal = hayPromo ? (item.precio_promo as number) : item.precio

  // Enlace de compra directo al WhatsApp del local, con el plato ya en el mensaje.
  const compra = urlWhatsapp(
    telefono,
    `Hola 👋 Vengo del menú de ${nombreLocal}. Quiero comprar: ${item.nombre} (${dinero(precioFinal)}).`,
  )

  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, transform: 'translateY(16px)' }}
      whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: Math.min(indice, 6) * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-stretch gap-4 overflow-hidden rounded-2xl bg-[var(--c-surface)] text-[var(--c-on-surface)]"
    >
      {item.imagen && (
        <img
          src={item.imagen}
          alt=""
          loading="lazy"
          className="h-auto w-24 shrink-0 self-stretch object-cover md:w-28"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col py-4 pr-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-mundial text-base font-bold leading-tight">{item.nombre}</h3>
          <div className="shrink-0 text-right">
            <span className="font-mundial text-base font-bold text-[var(--c-acento)]">{dinero(precioFinal)}</span>
            {hayPromo && (
              <span className="ml-2 text-xs text-[var(--c-surface-muted)] line-through">{dinero(item.precio)}</span>
            )}
          </div>
        </div>
        {item.descripcion && (
          <p className="mt-1 text-sm leading-relaxed text-[var(--c-surface-muted)]">{item.descripcion}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-3">
          {hayPromo && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--c-acento)] px-2 py-0.5 text-xs font-semibold text-[var(--c-on-acento)]">
              <Tag size={12} weight="fill" /> Promoción
            </span>
          )}
          {compra && (
            <a
              href={compra}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Comprar ${item.nombre} por WhatsApp`}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-[var(--c-acento)] px-3.5 py-2 text-sm font-bold text-[var(--c-on-acento)] transition-transform duration-150 ease-out active:scale-[0.97]"
            >
              <WhatsappLogo size={16} weight="fill" /> Comprar
            </a>
          )}
        </div>
      </div>
    </motion.li>
  )
}

/** Botón "Compartir": usa el share nativo del móvil; si no hay, copia el enlace. */
function BotonCompartir({ nombre, enlace }: { nombre: string; enlace: string }) {
  const [copiado, setCopiado] = useState(false)
  const compartir = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `Menú de ${nombre}`, url: enlace })
        return
      } catch {
        /* cancelado */
      }
    }
    try {
      await navigator.clipboard.writeText(enlace)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      /* sin portapapeles */
    }
  }
  return (
    <button
      onClick={() => void compartir()}
      className="inline-flex items-center gap-2 rounded-lg bg-[var(--c-acento)] px-4 py-2 text-sm font-semibold text-[var(--c-on-acento)] transition-transform duration-150 ease-out active:scale-[0.97]"
    >
      {copiado ? <Check size={15} weight="bold" /> : <ShareNetwork size={15} />}
      {copiado ? 'Copiado' : 'Compartir'}
    </button>
  )
}

/**
 * Bloque QR: el enlace de la carta hecho código, para imprimir o poner en mesa.
 * El QR va sobre blanco con módulos oscuros — así escanea siempre, sin depender de
 * los colores del cliente (que podrían no contrastar).
 */
function CompartirQR({ nombre, enlace }: { nombre: string; enlace: string }) {
  return (
    <section className="mx-auto mt-12 max-w-2xl px-5">
      <div className="flex flex-col items-center gap-5 rounded-2xl bg-[var(--c-surface)] p-6 text-center text-[var(--c-on-surface)] sm:flex-row sm:items-center sm:gap-6 sm:text-left">
        <div className="shrink-0 rounded-xl bg-white p-3">
          <QRCodeSVG value={enlace} size={116} level="M" marginSize={0} fgColor="#0b0f14" bgColor="#ffffff" />
        </div>
        <div className="min-w-0">
          <h2 className="font-mundial text-lg font-bold">Llévate la carta</h2>
          <p className="mt-1 text-sm opacity-75">Escanea el código o comparte el enlace de {nombre}.</p>
          <p className="mt-2 break-all text-xs opacity-60">{enlace}</p>
        </div>
      </div>
    </section>
  )
}

// textoLegible se importa por si se necesita afinar contraste; MarcaCliente ya lo aplica.
void textoLegible
