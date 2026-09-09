import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowRight, Clock, ForkKnife, MapPin, NavigationArrow, Phone, ShareNetwork, Storefront,
} from '@phosphor-icons/react'
import { useAppStore } from '@/stores/useAppStore'
import { rutaMenu, urlNegocio } from '@/lib/config'
import MarcaCliente from '@/components/MarcaCliente'
import Seo from '@/components/Seo'
import type { GaleriaItem, PuntoVentaDetalle } from '@/schemas/cms'

interface Coord { lat: number; lon: number }

/** Arma el enlace de mapa: usa el del ERP si existe, si no lo genera de lat/long. */
function mapsHref(p: PuntoVentaDetalle): string | null {
  if (p.google_maps_url) return p.google_maps_url
  const c = coords(p)
  return c ? `https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lon}` : null
}

function coords(p: PuntoVentaDetalle): Coord | null {
  // Ojo: Number(null) y Number('') son 0, no NaN — hay que descartar el vacío antes.
  if (p.latitud == null || p.longitud == null || p.latitud === '' || p.longitud === '') return null
  const lat = Number(p.latitud)
  const lon = Number(p.longitud)
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null
  if (lat === 0 && lon === 0) return null // (0,0) es dato faltante, no el Golfo de Guinea
  return { lat, lon }
}

export default function Negocio() {
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
        <div className="h-[60vh] animate-pulse bg-[var(--c-surface)]" />
        <div className="mx-auto max-w-5xl px-5 py-10">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-square animate-pulse rounded-2xl bg-[var(--c-surface)]" />
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
          <h1 className="mt-4 font-mundial text-2xl font-bold">Negocio no encontrado</h1>
          <p className="mt-2 text-sm text-[var(--c-text-muted)]">Este enlace no corresponde a ningún punto de venta.</p>
        </div>
      </MarcaCliente>
    )
  }

  const maps = mapsHref(punto)
  const coord = coords(punto)
  const galeria = [...punto.galeria].sort((a, b) => a.orden - b.orden)
  const ogImage = punto.banner ?? punto.logo ?? galeria[0]?.imagen ?? null

  return (
    <MarcaCliente colores={punto.colores}>
      <Seo
        title={punto.nombre}
        description={punto.descripcion ?? `${punto.nombre}, punto de venta en Ecuador.`}
        image={ogImage}
        url={urlNegocio(punto.slug)}
        siteName={punto.nombre}
        type="business.business"
      />

      <Hero punto={punto} maps={maps} />
      {galeria.length > 0 && <Galeria fotos={galeria} nombre={punto.nombre} />}
      <Ubicacion punto={punto} maps={maps} coord={coord} />
      {punto.menu_activo && <CtaMenu slug={punto.slug} />}
      <Pie nombre={punto.nombre} enlace={urlNegocio(punto.slug)} />
    </MarcaCliente>
  )
}

/* ── Hero ──────────────────────────────────────────────────────────────────── */
function Hero({ punto, maps }: { punto: PuntoVentaDetalle; maps: string | null }) {
  const reduce = useReducedMotion()
  const fondo = punto.banner
    ? { backgroundImage: `url(${punto.banner})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { backgroundImage: 'linear-gradient(135deg, var(--c-primario), var(--c-secundario))' }

  return (
    <section className="relative flex min-h-[100dvh] flex-col justify-end overflow-hidden">
      <div aria-hidden className="absolute inset-0" style={fondo} />
      {/* Scrim para que el texto siempre contraste, con o sin banner. */}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[var(--c-bg)] via-[var(--c-bg)]/70 to-[var(--c-bg)]/10" />

      <motion.div
        initial={reduce ? false : { opacity: 0, transform: 'translateY(24px)' }}
        animate={{ opacity: 1, transform: 'translateY(0px)' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto w-full max-w-5xl px-5 pb-14 md:pb-20"
      >
        <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)] shadow-2xl shadow-black/50 md:h-24 md:w-24">
          {punto.logo ? (
            <img src={punto.logo} alt={punto.nombre} className="h-full w-full object-cover" />
          ) : (
            <Storefront size={38} weight="duotone" className="text-[var(--c-acento)]" />
          )}
        </div>

        <h1 className="mt-6 max-w-[16ch] font-mundial text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl text-balance">
          {punto.nombre}
        </h1>
        {punto.descripcion && (
          <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-[var(--c-text-muted)]">
            {punto.descripcion}
          </p>
        )}

        {punto.horario && (
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--c-surface)] px-4 py-1.5 text-sm text-[var(--c-on-surface)]">
            <Clock size={15} /> {punto.horario}
          </span>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {punto.menu_activo && (
            <Link
              to={rutaMenu(punto.slug)}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--c-acento)] px-6 py-3.5 font-bold text-[var(--c-on-acento)] transition-transform duration-150 ease-out hover:brightness-110 active:scale-[0.98]"
            >
              <ForkKnife size={18} weight="fill" /> Ver menú
            </Link>
          )}
          {maps && (
            <a
              href={maps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)]/50 px-6 py-3.5 font-semibold backdrop-blur-sm transition-colors hover:border-[var(--c-acento)]/60"
            >
              <NavigationArrow size={18} weight="fill" className="text-[var(--c-acento)]" /> Cómo llegar
            </a>
          )}
        </div>
      </motion.div>
    </section>
  )
}

/* ── Galería ───────────────────────────────────────────────────────────────── */
function Galeria({ fotos, nombre }: { fotos: GaleriaItem[]; nombre: string }) {
  const reduce = useReducedMotion()
  return (
    <section className="mx-auto max-w-5xl px-5 py-16 md:py-24">
      <h2 className="font-mundial text-3xl font-bold tracking-tight md:text-4xl">El lugar</h2>
      {/* Masonry por columnas CSS: se adapta a cualquier cantidad de fotos y respeta el
          aspecto real de cada una, sin dejar celdas vacías. */}
      <div className="mt-8 columns-2 gap-3 md:columns-3 md:gap-4 [&>*]:mb-3 md:[&>*]:mb-4">
        {fotos.map((foto, i) => (
          <motion.figure
            key={foto.id}
            initial={reduce ? false : { opacity: 0, transform: 'translateY(20px)' }}
            whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden rounded-2xl bg-[var(--c-surface)] break-inside-avoid"
          >
            <img
              src={foto.imagen}
              alt={foto.alt ?? `${nombre}, foto ${i + 1}`}
              loading={i < 2 ? 'eager' : 'lazy'}
              className="w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
            />
          </motion.figure>
        ))}
      </div>
    </section>
  )
}

/* ── Mapa estático de tiles OSM ──────────────────────────────────────────────
   Mosaico 3×3 de tiles de tile.openstreetmap.org (imágenes puras, sin iframe ni JS,
   así siempre renderiza). El pin se ubica con la fracción exacta dentro del tile
   central, y todo el bloque enlaza a Google Maps. */
function MapaEstatico({ coord, maps, nombre }: { coord: Coord; maps: string | null; nombre: string }) {
  const z = 16
  const n = 2 ** z
  const x = ((coord.lon + 180) / 360) * n
  const latRad = (coord.lat * Math.PI) / 180
  const y = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  const xc = Math.floor(x)
  const yc = Math.floor(y)
  const pinLeft = ((1 + (x - xc)) / 3) * 100
  const pinTop = ((1 + (y - yc)) / 3) * 100

  const filas = [-1, 0, 1]
  const contenido = (
    <div className="relative">
      <div className="grid grid-cols-3">
        {filas.map((dy) =>
          filas.map((dx) => (
            <img
              key={`${dx}_${dy}`}
              src={`https://tile.openstreetmap.org/${z}/${xc + dx}/${yc + dy}.png`}
              alt=""
              loading="lazy"
              width={256}
              height={256}
              className="h-full w-full"
            />
          )),
        )}
      </div>
      <span
        aria-hidden
        className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full"
        style={{ left: `${pinLeft}%`, top: `${pinTop}%` }}
      >
        <MapPin size={34} weight="fill" className="text-[var(--c-acento)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
      </span>
      <span className="absolute bottom-1 right-1.5 z-10 rounded bg-black/55 px-1.5 py-0.5 text-[10px] text-white/85">
        © OpenStreetMap
      </span>
    </div>
  )

  const clase = 'block overflow-hidden rounded-2xl border border-[var(--c-border)] bg-[var(--c-surface)]'
  return maps ? (
    <a href={maps} target="_blank" rel="noopener noreferrer" className={clase} aria-label={`Ver ${nombre} en el mapa`}>
      {contenido}
    </a>
  ) : (
    <div className={clase}>{contenido}</div>
  )
}

/* ── Ubicación ─────────────────────────────────────────────────────────────── */
function Ubicacion({
  punto,
  maps,
  coord,
}: {
  punto: PuntoVentaDetalle
  maps: string | null
  coord: Coord | null
}) {
  if (!punto.direccion && !punto.telefono && !punto.horario && !coord) return null
  return (
    <section className="mx-auto max-w-5xl px-5 py-16 md:py-24">
      <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
        <div>
          <h2 className="font-mundial text-3xl font-bold tracking-tight md:text-4xl">Cómo visitarnos</h2>
          <dl className="mt-6 space-y-4 text-[var(--c-text-muted)]">
            {punto.direccion && (
              <Dato icono={<MapPin size={18} />}>{punto.direccion}</Dato>
            )}
            {punto.horario && <Dato icono={<Clock size={18} />}>{punto.horario}</Dato>}
            {punto.telefono && (
              <a href={`tel:${punto.telefono}`} className="flex items-start gap-3 transition-colors hover:text-[var(--c-text)]">
                <Phone size={18} className="mt-0.5 shrink-0 text-[var(--c-acento)]" /> {punto.telefono}
              </a>
            )}
          </dl>
          {maps && (
            <a
              href={maps}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[var(--c-acento)] px-5 py-3 font-bold text-[var(--c-on-acento)] transition-transform duration-150 ease-out hover:brightness-110 active:scale-[0.98]"
            >
              <NavigationArrow size={17} weight="fill" /> Abrir en el mapa
            </a>
          )}
        </div>

        {coord && <MapaEstatico coord={coord} maps={maps} nombre={punto.nombre} />}
      </div>
    </section>
  )
}

function Dato({ icono, children }: { icono: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-[var(--c-acento)]">{icono}</span>
      <span>{children}</span>
    </div>
  )
}

/* ── CTA al menú ───────────────────────────────────────────────────────────── */
function CtaMenu({ slug }: { slug: string }) {
  return (
    <section className="mx-auto max-w-5xl px-5 py-8">
      <Link
        to={rutaMenu(slug)}
        className="group flex items-center justify-between gap-4 rounded-3xl bg-[var(--c-surface)] p-7 text-[var(--c-on-surface)] transition-transform duration-150 ease-out hover:brightness-105 active:scale-[0.99] md:p-10"
      >
        <div>
          <p className="text-sm font-semibold opacity-70">Carta digital</p>
          <h2 className="mt-1 font-mundial text-2xl font-bold md:text-3xl">Mira nuestro menú</h2>
        </div>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--c-acento)] text-[var(--c-on-acento)] transition-transform duration-200 ease-out group-hover:translate-x-1">
          <ArrowRight size={20} weight="bold" />
        </span>
      </Link>
    </section>
  )
}

/* ── Pie ───────────────────────────────────────────────────────────────────── */
function Pie({ nombre, enlace }: { nombre: string; enlace: string }) {
  return (
    <footer className="mx-auto max-w-5xl px-5 pb-16 pt-8">
      <div className="flex flex-col items-start justify-between gap-4 border-t border-[var(--c-border)] pt-8 sm:flex-row sm:items-center">
        <p className="text-xs text-[var(--c-text-muted)]">
          {nombre} · Sitio hecho con{' '}
          <a href="https://rivet-ec.com" className="font-semibold text-[var(--c-acento)] hover:underline">Rivet Ecuador</a>
        </p>
        <Compartir nombre={nombre} enlace={enlace} />
      </div>
    </footer>
  )
}

function Compartir({ nombre, enlace }: { nombre: string; enlace: string }) {
  const compartir = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: nombre, url: enlace })
        return
      } catch {
        /* cancelado */
      }
    }
    try {
      await navigator.clipboard.writeText(enlace)
    } catch {
      /* sin portapapeles */
    }
  }
  return (
    <button
      onClick={() => void compartir()}
      className="inline-flex items-center gap-2 rounded-lg border border-[var(--c-border)] px-4 py-2 text-sm font-semibold transition-colors hover:border-[var(--c-acento)]/60"
    >
      <ShareNetwork size={15} /> Compartir
    </button>
  )
}
