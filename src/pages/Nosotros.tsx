import { useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useAppStore } from '@/stores/useAppStore'
import { ABOUT_RESPALDO } from '@/lib/respaldos'
import { aparece } from '@/lib/movimiento'
import Seo from '@/components/Seo'
import PageHeader from '@/components/PageHeader'
import TransicionPagina from '@/components/TransicionPagina'

export default function Nosotros() {
  const about = useAppStore((s) => s.about.datos)
  const fetchAbout = useAppStore((s) => s.fetchAbout)

  useEffect(() => {
    void fetchAbout()
  }, [fetchAbout])
  const misionVision = about?.caracteristicas ?? []
  const valores = about?.por_que_nosotros ?? []
  const numeros = about?.numeros ?? []
  const reduce = useReducedMotion()

  return (
    <TransicionPagina>
      <Seo title="Nosotros" description="Rivet Ecuador: empresa de ingeniería alimentaria que impulsa el talento de mujeres emprendedoras. Misión, visión y valores." />
      <PageHeader eyebrow="Nuestra identidad" title={about?.titulo?.trim() || ABOUT_RESPALDO.titulo}>
        {about?.descripcion}
      </PageHeader>

      {/* Números */}
      {numeros.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {numeros.map((n, i) => (
              <motion.div key={n.etiqueta} {...aparece(i, reduce)}
                          className="rounded-2xl border border-border bg-card p-6">
                <div className="font-mundial text-4xl font-extrabold text-primary md:text-5xl">{n.valor}</div>
                <div className="mt-2 text-sm text-muted-foreground">{n.etiqueta}</div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Misión / Visión */}
      {misionVision.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-5 md:grid-cols-2">
            {misionVision.map((mv, i) => (
              <motion.div key={mv.titulo} {...aparece(i, reduce)}
                          className="rounded-[2rem] border border-border bg-card p-8 transition-colors duration-200 hover:border-primary/50 md:p-10">
                <h2 className="text-2xl font-bold text-primary">{mv.titulo}</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{mv.descripcion}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Valores */}
      {valores.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-light md:text-4xl">Lo que nos <span className="font-bold text-primary">define</span></h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {valores.map((v, i) => (
              <motion.div key={v.titulo} {...aparece(i, reduce)}
                          className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-bold">{v.titulo}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.descripcion}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </TransicionPagina>
  )
}
