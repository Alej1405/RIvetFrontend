import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { WhatsappLogo } from '@phosphor-icons/react'
import { useAppStore } from '@/stores/useAppStore'
import Seo from '@/components/Seo'
import PageHeader from '@/components/PageHeader'
import TransicionPagina from '@/components/TransicionPagina'

export default function Servicios() {
  const services = useAppStore((s) => s.services.datos)
  const contact = useAppStore((s) => s.contact.datos)
  const fetchServices = useAppStore((s) => s.fetchServices)
  const fetchContact = useAppStore((s) => s.fetchContact)

  useEffect(() => {
    void fetchServices()
    void fetchContact()
  }, [fetchServices, fetchContact])
  const wa = contact?.whatsapp

  return (
    <TransicionPagina>
      <Seo title="Servicios" description="Maquilación de licores, formulación de productos, salsas, bebidas, complementos y permisos ARCSA. Asesoramiento técnico integral." />
      <PageHeader eyebrow="Qué hacemos" title={<>Industrializamos tu <span className="font-bold text-primary">producto alimentario</span>.</>}>
        Nuestra oferta se complementa con asesoramiento técnico integral para garantizar productos competitivos y listos para el mercado.
      </PageHeader>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-4">
          {services.map((s, i) => {
            const msg = encodeURIComponent(`Hola, quiero más información sobre el servicio de: ${s.titulo}`)
            const href = wa ? `https://wa.me/${wa}?text=${msg}` : '/contactos'
            return (
              <motion.article
                key={s.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-7 transition-colors duration-200 hover:border-primary/50 md:flex-row md:items-center md:justify-between md:p-9"
              >
                <div className="flex items-start gap-5">
                  <span className="font-mundial text-3xl font-extrabold text-primary/40">{String(i + 1).padStart(2, '0')}</span>
                  <div className="max-w-2xl">
                    <h2 className="text-xl font-bold md:text-2xl">{s.titulo}</h2>
                    <p className="mt-1.5 leading-relaxed text-muted-foreground">{s.descripcion}</p>
                  </div>
                </div>
                <a href={href} target="_blank" rel="noopener noreferrer"
                   className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary/10 px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
                  <WhatsappLogo size={16} weight="fill" /> Pedir información
                </a>
              </motion.article>
            )
          })}
        </div>
      </section>
    </TransicionPagina>
  )
}
