import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { CaretDown } from '@phosphor-icons/react'
import { useAppStore } from '@/stores/useAppStore'
import Seo from '@/components/Seo'
import PageHeader from '@/components/PageHeader'
import TransicionPagina from '@/components/TransicionPagina'
import { MORFO } from '@/lib/movimiento'

export default function Faq() {
  const faq = useAppStore((s) => s.faq.datos)
  const fetchFaq = useAppStore((s) => s.fetchFaq)

  useEffect(() => {
    void fetchFaq()
  }, [fetchFaq])
  const [open, setOpen] = useState<number | null>(0)
  const reduce = useReducedMotion()

  return (
    <TransicionPagina>
      <Seo title="Preguntas frecuentes" description="Resolvemos las dudas más comunes sobre maquila, formulación, garantías y tiempos de respuesta." url="/faq" />
      <PageHeader eyebrow="Ayuda" title={<>Preguntas <span className="font-bold text-primary">frecuentes</span></>}>
        Respuestas rápidas a las inquietudes más comunes sobre nuestros servicios.
      </PageHeader>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex flex-col gap-3">
          {faq.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.id} className={`overflow-hidden rounded-2xl border bg-card transition-colors ${isOpen ? 'border-primary/40' : 'border-border'}`}>
                {/* aria-expanded/aria-controls: sin esto un lector de pantalla lee
                    la pregunta pero no dice si está abierta ni qué despliega. */}
                <button onClick={() => setOpen(isOpen ? null : i)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-respuesta-${f.id}`}
                        id={`faq-pregunta-${f.id}`}
                        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-opacity active:opacity-70">
                  <span className="flex items-center gap-4">
                    <span className="text-sm font-bold text-primary/50">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-medium md:text-lg">{f.pregunta}</span>
                  </span>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: reduce ? 0 : 0.2, ease: MORFO }} className="shrink-0 text-muted-foreground">
                    <CaretDown size={18} weight="bold" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div id={`faq-respuesta-${f.id}`} role="region" aria-labelledby={`faq-pregunta-${f.id}`}
                                initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: reduce ? 0 : 0.28, ease: MORFO }}>
                      <p className="px-6 pb-6 pl-16 leading-relaxed text-muted-foreground">{f.respuesta}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>
    </TransicionPagina>
  )
}
