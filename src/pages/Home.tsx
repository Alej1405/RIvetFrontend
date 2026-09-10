import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Storefront } from '@phosphor-icons/react'
import { useAppStore } from '@/stores/useAppStore'
import { HERO_RESPALDO, ABOUT_RESPALDO } from '@/lib/respaldos'
import { aparece, SALIDA } from '@/lib/movimiento'
import { rutaNegocio } from '@/lib/config'
import Seo from '@/components/Seo'
import TransicionPagina from '@/components/TransicionPagina'
import type { About, Hero, PuntoVenta, Service } from '@/schemas/cms'
import pinteno from '@/assets/pinteno.png'

export default function Home() {
  const hero = useAppStore((s) => s.hero.datos)
  const services = useAppStore((s) => s.services.datos)
  const about = useAppStore((s) => s.about.datos)
  const puntosVenta = useAppStore((s) => s.puntosVenta.datos)
  const fetchHero = useAppStore((s) => s.fetchHero)
  const fetchServices = useAppStore((s) => s.fetchServices)
  const fetchAbout = useAppStore((s) => s.fetchAbout)
  const fetchPuntosVenta = useAppStore((s) => s.fetchPuntosVenta)

  useEffect(() => {
    void fetchHero()
    void fetchServices()
    void fetchAbout()
    void fetchPuntosVenta()
  }, [fetchHero, fetchServices, fetchAbout, fetchPuntosVenta])

  return (
    <TransicionPagina>
      <Seo title="Inicio" description="Rivet Ecuador: ingeniería alimentaria. Formulamos, producimos y certificamos licores, salsas y productos alimentarios con estándar industrial. Maquila y permisos ARCSA." />
      <HeroProducto hero={hero} />
      <Servicios services={services} />
      <Locales puntos={puntosVenta} />
      <Nosotros about={about} />
      <Noticias />
    </TransicionPagina>
  )
}

/* ───────── Hero ─────────
   Recompuesto: antes era una escena de páramo con la botella a un lado y el texto al
   otro, o sea dos cosas juntas en vez de una composición. Ahora el producto atraviesa
   el titular: la palabra queda detrás y la botella delante, así se leen como una sola
   imagen. Fuera las montañas, que eran la identidad artesanal descartada.

   Coste de render: antes 7 useTransform + 2 SVG + 5 capas de degradado. Ahora una sola
   transformación de scroll, y con `transform` completo en vez del shorthand `y` de
   Framer Motion, que corre en el hilo principal. */
function HeroProducto({ hero }: { hero: Hero | null }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const salida = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  // Manda el CMS: cambiar la botella es editar el ERP, no pedir un deploy.
  const img = hero?.imagen ?? pinteno
  const titulo = hero?.titulo?.trim() || HERO_RESPALDO.titulo
  const subtitulo = hero?.subtitulo?.trim() || HERO_RESPALDO.subtitulo
  // El CMS manda la bajada; antes estaba escrita a mano y hablaba de páramo y destilado.
  const bajada = hero?.descripcion?.trim() || HERO_RESPALDO.descripcion

  return (
    <section ref={ref} className="relative min-h-[calc(100dvh-8rem)] w-full overflow-hidden md:min-h-[calc(100dvh-4rem)]">
      {/* Foco tras el producto. Único elemento atmosférico que sobrevive: separa la
          botella del fondo sin contar una historia de montañas. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[72%] top-[18vh] h-[44vh] w-[44vh] -translate-x-1/2 -translate-y-1/2 rounded-full md:left-[74%] md:top-[52%] md:h-[70vh] md:w-[70vh]"
        style={{ background: 'radial-gradient(circle, rgba(0,182,201,0.26), transparent 98%)', filter: 'blur(60px)' }}
      />

      {/* Dos composiciones distintas, no una encogida — pero ahora ambas overlapan.

          Desktop: la botella se apoya en el borde inferior y cruza el FINAL del
          titular. Ocluye la cola de la línea, no el centro de una palabra: el titular
          se sigue leyendo y aun así producto y tipografía son una sola imagen.

          Mobile: la botella sangra por la esquina inferior derecha, alta y protagonista;
          el titular se apoya sobre ella por la izquierda. El velo de abajo (más abajo)
          la funde con el fondo para que el texto encima llegue al contraste. Ya no es
          "foto arriba, texto abajo": es una sola imagen, como en desktop. */}
      <motion.img
        src={img}
        alt={[titulo, subtitulo].filter(Boolean).join(' ')}
        initial={reduce ? false : { opacity: 0, transform: 'translateY(32px)' }}
        animate={{ opacity: 1, transform: 'translateY(0px)' }}
        transition={{ duration: 0.8, ease: SALIDA }}
        className="pointer-events-none absolute bottom-0 -right-[8%] z-0 h-[58vh] w-auto max-w-none drop-shadow-[0_40px_60px_rgba(0,0,0,0.8)] md:left-[70%] md:right-auto md:h-[86vh]"
      />

      {/* Velo mobile: funde la base de la botella con el fondo y sostiene el texto
          apoyado encima. Va sobre la botella (z-[1]) pero bajo el texto (z-10/20). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-background via-background/75 to-background/10 md:hidden"
      />

      <motion.div
        style={reduce ? undefined : { opacity: salida }}
        className="relative z-10 mx-auto flex min-h-[calc(100dvh-8rem)] max-w-6xl flex-col justify-end px-6 pb-8 pt-24 md:min-h-[calc(100dvh-4rem)] md:justify-center md:pb-16 md:pt-16"
      >
        <p className="relative z-20 font-mundial text-xs font-semibold uppercase tracking-[0.3em] text-primary md:text-sm">
          Ingeniería alimentaria
        </p>

        {/* z-10: el titular corre por DETRÁS de la botella. Ahí está la composición:
            se leen como una sola imagen, no como dos elementos juntos. */}
        <h1 className="relative z-10 mt-4 max-w-[15ch] font-mundial font-extrabold leading-[0.86] tracking-[-0.035em] text-foreground text-[clamp(2.5rem,9vw,5.75rem)] md:mt-6 md:max-w-none">
          <span className="block">{titulo}</span>
          <span className="mt-1 block text-primary">{subtitulo}</span>
        </h1>

        <p className="relative z-20 mt-7 max-w-[38ch] whitespace-pre-line text-base leading-relaxed text-foreground/70 md:text-lg">
          {bajada}
        </p>

        {/* Amarillo del logo: el mismo CTA que el header, un solo destino de venta. */}
        <div className="relative z-20 mt-9 flex flex-wrap items-center gap-6">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-3.5 font-bold text-accent-foreground transition-transform duration-150 ease-out hover:brightness-110 active:scale-[0.97]"
          >
            Ver catálogo <ArrowRight size={18} weight="bold" />
          </Link>
          <Link
            to="/servicios"
            className="font-semibold text-foreground/70 underline-offset-8 transition-colors hover:text-foreground hover:underline"
          >
            Qué hacemos
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

/* ───────── Servicios: lista editorial con imagen (sin cards glass) ───────── */
function Servicios({ services }: { services: Service[] }) {
  const reduce = useReducedMotion()
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <h2 className="font-mundial text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl" style={{ textWrap: 'balance' }}>
          De tu idea al mercado,<br />con respaldo técnico.
        </h2>
        <Link to="/servicios" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
          Todos los servicios <ArrowUpRight size={16} weight="bold" />
        </Link>
      </div>

      <div className="mt-10 divide-y divide-border/70">
        {services.slice(0, 5).map((s, i) => (
          <motion.div
            key={s.id}
            {...aparece(i, reduce)}
            className="group grid grid-cols-[auto_1fr] items-center gap-6 py-7 md:grid-cols-[5rem_1fr_auto] md:gap-10"
          >
            <span className="font-mundial text-2xl font-bold text-primary/40 transition-colors group-hover:text-primary md:text-3xl">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className="text-xl font-bold transition-colors group-hover:text-primary md:text-2xl">{s.titulo}</h3>
              <p className="mt-1 max-w-xl text-muted-foreground">{s.descripcion}</p>
            </div>
            {s.imagen && (
              <img src={s.imagen} alt={s.titulo} loading="lazy"
                   className="col-span-2 mt-2 h-40 w-full rounded-2xl object-cover md:col-span-1 md:mt-0 md:h-24 md:w-40" />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ───────── Locales / Puntos de venta ─────────
   Prueba social data-driven: dónde encontrar el producto. Si el CMS no devuelve
   ninguno, la sección no se pinta — nada de bloques vacíos en la home. */
function Locales({ puntos }: { puntos: PuntoVenta[] }) {
  const reduce = useReducedMotion()
  if (puntos.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
      <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Dónde encontrarnos</p>
          <h2 className="mt-3 font-mundial text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl" style={{ textWrap: 'balance' }}>
            Puntos de venta
          </h2>
        </div>
        <Link to="/puntos-venta" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
          Ver todos <ArrowUpRight size={16} weight="bold" />
        </Link>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {puntos.slice(0, 6).map((p, i) => (
          <motion.div
            key={p.id}
            {...aparece(i, reduce)}
          >
            <Link
              to={rutaNegocio(p.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-secondary">
                {p.logo ? (
                  <img src={p.logo} alt="" className="h-full w-full object-cover" />
                ) : (
                  <Storefront size={22} weight="duotone" className="text-primary/60" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="truncate font-bold text-foreground transition-colors group-hover:text-primary">{p.nombre}</h3>
                {p.direccion && <p className="truncate text-sm text-muted-foreground">{p.direccion}</p>}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ───────── Nosotros: números grandes, tipografía como protagonista ───────── */
function Nosotros({ about }: { about: About | null }) {
  const numeros = about?.numeros ?? []
  return (
    /* La banda ya no es opaca: es vidrio. Los mismos fondos de siempre —degradado,
       glow y cordillera— pero translúcidos, con `backdrop-blur` por encima. Lo que se
       difumina por detrás es la retícula de FondoRivet, así que la sección se apoya en
       el fondo del sitio en vez de taparlo, y sigue separada del resto. */
    <section className="relative overflow-hidden  py-24 md:py-28">
      {/* Capa de vidrio. `backdrop-blur` va aquí y no en la <section>: si estuviera en
          el padre, difuminaría también a sus propios hijos. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 backdrop-blur-2xl"
        style={{ background: 'linear-gradient(180deg, rgba(7,16,15,0.62), rgba(10,31,38,0.5) 98%, rgba(8,20,24,0.68))' }}
      />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-4 h-96 w-240 `-translate-x-1/2` rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,182,201,0.16), transparent 90%)', filter: 'blur(70px)' }} />
      {/* Cordillera de motivo, coherente con el hero y la etiqueta */}
      <svg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-56 w-full opacity-60" viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice">
        <path d="M0 220 L240 110 L400 190 L620 90 L820 200 L1040 110 L1260 210 L1440 130 L1440 300 L0 300 Z" fill="rgba(10,31,38,0.72)" />
        <path d="M620 90 L660 140 L580 140 Z" fill="#dff2f4" opacity="0.3" />
      </svg>

      <div className="relative mx-auto max-w-6xl px-6">
        <h2 className="max-w-3xl font-mundial text-5xl font-light leading-[1.02] md:text-7xl" style={{ textWrap: 'balance' }}>
          {about?.titulo?.trim() || ABOUT_RESPALDO.titulo}
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground/70">{about?.descripcion?.trim() || ABOUT_RESPALDO.descripcion}</p>

        {numeros.length > 0 && (
          <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
            {numeros.map((n) => (
              <div key={n.etiqueta}>
                <div className="font-mundial text-5xl font-bold leading-none text-primary md:text-6xl">{n.valor}</div>
                <div className="mt-3 text-xs uppercase tracking-[0.15em] text-muted-foreground">{n.etiqueta}</div>
              </div>
            ))}
          </div>
        )}

        <Link to="/nosotros" className="mt-14 inline-flex items-center gap-2 font-semibold text-primary hover:gap-3 transition-all">
          Conoce nuestra historia <ArrowRight size={17} weight="bold" />
        </Link>
      </div>
    </section>
  )
}

/* ───────── Noticias ─────────
   Enlazaba a rivet-ec.com/blog, el sitio viejo, y por eso daba 404. Ahora apunta al
   blog propio, que lee del CMS. */
function Noticias() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Link to="/blog"
         className="group flex flex-col items-start justify-between gap-6 border-t border-border pt-12 md:flex-row md:items-end">
        <div>
          <h2 className="font-mundial text-3xl font-bold md:text-5xl" style={{ textWrap: 'balance' }}>Procesos, formulación<br />y regulación.</h2>
          <p className="mt-4 max-w-md text-muted-foreground">Lo que hacemos y cómo lo hacemos, contado por quienes lo hacen.</p>
        </div>
        <span className="inline-flex items-center gap-2 text-lg font-semibold text-primary transition-transform duration-200 ease-out group-hover:translate-x-1">
          Ir al blog <ArrowUpRight size={20} weight="bold" />
        </span>
      </Link>
    </section>
  )
}
