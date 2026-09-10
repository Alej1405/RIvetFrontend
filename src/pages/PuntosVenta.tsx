import { useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, MapPin, Storefront } from '@phosphor-icons/react'
import { useAppStore } from '@/stores/useAppStore'
import { rutaNegocio } from '@/lib/config'
import TransicionPagina from '@/components/TransicionPagina'
import Seo from '@/components/Seo'
import { entra } from '@/lib/movimiento'
import { VACIOS } from '@/lib/respaldos'
import { AvisoError, AvisoVacio } from '@/components/Aviso'
import type { PuntoVenta } from '@/schemas/cms'

export default function PuntosVenta() {
  const { datos: puntos, cargando, error } = useAppStore((s) => s.puntosVenta)
  const fetchPuntosVenta = useAppStore((s) => s.fetchPuntosVenta)

  const reduce = useReducedMotion()

  useEffect(() => {
    void fetchPuntosVenta()
  }, [fetchPuntosVenta])

  return (
    <TransicionPagina>
      <Seo
        title="Puntos de venta"
        description="Bares, licorerías y locales que ofrecen los productos de Rivet Ecuador. Encuentra el más cercano y mira su carta."
      />

      <section className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-24">
        <motion.header {...entra(0, reduce)} className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Dónde encontrarnos</p>
          <h1 className="mt-4 font-heveltica text-4xl font-bold tracking-tight text-foreground md:text-5xl text-balance">
            Puntos de venta
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Locales que trabajan con Rivet. Entra a cada uno para ver su carta y cómo llegar.
          </p>
        </motion.header>

        {error ? (
          <AvisoError mensaje={error} onReintentar={() => void fetchPuntosVenta()} />
        ) : cargando && puntos.length === 0 ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-48 animate-pulse rounded-xl border border-border bg-card" />
            ))}
          </div>
        ) : puntos.length === 0 ? (
          <AvisoVacio>{VACIOS.puntosVenta}</AvisoVacio>
        ) : (
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {puntos.map((p, i) => (
              <li key={p.id}>
                <Card punto={p} indice={i} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </TransicionPagina>
  )
}

function Card({ punto, indice }: { punto: PuntoVenta; indice: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.div {...entra(indice, reduce)} className="h-full">
    <Link
      to={rutaNegocio(punto.slug)}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/0 bg-card/78 transition-[border-color,transform] duration-200 ease-out active:scale-[0.99] hover:border-primary/50 focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {/* Banner o, si no hay, una cabecera con degradado de marca: la card nunca queda coja. */}
      <div className="relative aspect-[16/9] overflow-hidden bg-secondary">
        {punto.banner ? (
          <img
            src={punto.banner}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div
            className="grid h-full place-items-center"
            style={{ background: 'radial-gradient(circle at 30% 20%, rgba(0,182,201,0.22), transparent 60%), #0e1d1f' }}
          >
            {punto.logo ? (
              <img src={punto.logo} alt="" className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <Storefront size={40} className="text-primary/50" weight="duotone" />
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-heveltica text-lg font-bold leading-tight text-foreground">{punto.nombre}</h2>
        {punto.direccion && (
          <p className="mt-2 flex items-start gap-1.5 text-sm leading-relaxed text-muted-foreground">
            <MapPin size={15} className="mt-0.5 shrink-0 text-primary" /> {punto.direccion}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-transform duration-200 ease-out group-hover:translate-x-1">
          Visitar <ArrowRight size={15} weight="bold" />
        </span>
      </div>
    </Link>
    </motion.div>
  )
}
