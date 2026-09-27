import { useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { HeartHalf, Handshake, RocketLaunch, WhatsappLogo } from '@phosphor-icons/react'
import { useAppStore } from '@/stores/useAppStore'
import Seo from '@/components/Seo'
import PageHeader from '@/components/PageHeader'
import TransicionPagina from '@/components/TransicionPagina'
import { aparece } from '@/lib/movimiento'

const RAZONES = [
  { icon: HeartHalf, titulo: 'Con propósito', desc: 'Impulsamos el talento de mujeres emprendedoras y el desarrollo local.' },
  { icon: RocketLaunch, titulo: 'Aprendizaje real', desc: 'Formulación, producción e inocuidad con estándares del sector.' },
  { icon: Handshake, titulo: 'Equipo', desc: 'Los mejores resultados los logramos juntos.' },
]

export default function Postular() {
  const contact = useAppStore((s) => s.contact.datos)
  const fetchContact = useAppStore((s) => s.fetchContact)

  useEffect(() => {
    void fetchContact()
  }, [fetchContact])
  const wa = contact?.whatsapp
  const email = contact?.email
  const reduce = useReducedMotion()
  // Sin WhatsApp y sin correo no hay a dónde postular: mejor el enlace a Contactos
  // que un mailto: sin destinatario, que abre el cliente de correo en blanco.
  const destino = wa
    ? `https://wa.me/${wa}?text=${encodeURIComponent('Hola, quiero postular a Rivet Ecuador.')}`
    : email
      ? `mailto:${email}?subject=Postulación`
      : '/contactos'

  return (
    <TransicionPagina>
      <Seo
        title="Trabaja con nosotros"
        description="Únete a Rivet Ecuador. Buscamos personas que quieran transformar la industria alimentaria con propósito."
        url="/postular"
        noindex
      />
      <PageHeader eyebrow="Únete al equipo" title={<>Construyamos <span className="font-bold text-primary">identidad</span>, juntos.</>}>
        Si te mueve la ingeniería alimentaria y el desarrollo local, queremos conocerte.
      </PageHeader>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {RAZONES.map((r, i) => (
            <motion.div key={r.titulo} {...aparece(i, reduce)}
                        className="rounded-2xl border border-border bg-card p-7">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/12 text-primary">
                <r.icon size={24} weight="duotone" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{r.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex flex-col items-start gap-6 rounded-[2rem] border border-border bg-card p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">¿Listo para postular?</h2>
            <p className="mt-2 max-w-md text-muted-foreground">Envíanos tu hoja de vida y cuéntanos qué te gustaría aportar.</p>
          </div>
          <a
            href={destino}
            target={wa || email ? '_blank' : undefined}
            rel={wa || email ? 'noopener noreferrer' : undefined}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-transform active:scale-[0.97]"
          >
            <WhatsappLogo size={18} weight="fill" /> Postular ahora
          </a>
        </div>
      </section>
    </TransicionPagina>
  )
}
