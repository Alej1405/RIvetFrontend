import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { MapPin, EnvelopeSimple, Phone, WhatsappLogo, PaperPlaneRight } from '@phosphor-icons/react'
import { useAppStore } from '@/stores/useAppStore'
import Seo from '@/components/Seo'
import PageHeader from '@/components/PageHeader'
import TransicionPagina from '@/components/TransicionPagina'
import { contactoSeguro } from '@/lib/respaldos'
import { entra } from '@/lib/movimiento'

export default function Contactos() {
  const contactoErp = useAppStore((s) => s.contact.datos)
  // Si la API no respondió, entra el respaldo; un campo vacío a propósito se respeta.
  const contact = contactoSeguro(contactoErp)
  const fetchContact = useAppStore((s) => s.fetchContact)

  useEffect(() => {
    void fetchContact()
  }, [fetchContact])
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' })
  const [estado, setEstado] = useState<'listo' | 'abierto' | 'sin-canal'>('listo')
  const reduce = useReducedMotion()

  /**
   * El caso que faltaba era el `else`: sin WhatsApp ni correo, esto hacía
   * preventDefault() y terminaba. El usuario escribía su mensaje, pulsaba enviar y
   * no pasaba absolutamente nada. Es el peor momento posible para quedarse mudo.
   *
   * Ahora los tres caminos acusan recibo, incluido el del navegador que bloquea la
   * ventana emergente: `window.open` devuelve null y ahí también hay que decirlo.
   */
  function enviar(e: React.FormEvent) {
    e.preventDefault()
    const texto = `Hola, soy ${form.nombre} (${form.email}). ${form.mensaje}`

    if (contact?.whatsapp) {
      const w = window.open(`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(texto)}`, '_blank')
      setEstado(w ? 'abierto' : 'sin-canal')
      return
    }
    if (contact?.email) {
      window.location.href = `mailto:${contact.email}?subject=Contacto web&body=${encodeURIComponent(texto)}`
      setEstado('abierto')
      return
    }
    setEstado('sin-canal')
  }

  const sinCanal = !contact?.whatsapp && !contact?.email

  const canales = [
    contact?.direccion && { icon: <MapPin size={18} />, label: 'Ubicación', value: contact.direccion, href: contact.mapa_embed ?? undefined },
    contact?.telefono && { icon: <Phone size={18} />, label: 'Teléfono', value: contact.telefono, href: `tel:${contact.telefono.replace(/\s/g, '')}` },
    contact?.email && { icon: <EnvelopeSimple size={18} />, label: 'Correo', value: contact.email, href: `mailto:${contact.email}` },
    contact?.whatsapp && { icon: <WhatsappLogo size={18} weight="fill" />, label: 'WhatsApp', value: '+' + contact.whatsapp, href: `https://wa.me/${contact.whatsapp}` },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string; href?: string }[]

  return (
    <TransicionPagina>
      <Seo
        title="Contactos"
        description="Escríbenos sobre maquila, formulación o permisos ARCSA. Píntag vía Tolontag, Quito, Ecuador."
        url="/contactos"
        noindex
      />
      <PageHeader eyebrow="Hablemos" title={<>Cuéntanos tu <span className="font-bold text-primary">idea.</span></>}>
        Te asesoramos en maquila, formulación y legalización de tu producto alimentario.
      </PageHeader>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-5 md:grid-cols-[1fr_1.1fr]">
          {/* Canales */}
          <div className="grid gap-4">
            {canales.map((c) => (
              <a key={c.label} href={c.href} target={c.href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                 className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition-colors duration-200 hover:border-primary/50">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">{c.icon}</span>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">{c.label}</div>
                  <div className="font-semibold">{c.value}</div>
                </div>
              </a>
            ))}
          </div>

          {/* Formulario */}
          <motion.form onSubmit={enviar} {...entra(0, reduce)}
                       className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-7 md:p-9">
            <Field label="Nombre">
              <input required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                     className="input" placeholder="Tu nombre" />
            </Field>
            <Field label="Correo">
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                     className="input" placeholder="tucorreo@ejemplo.com" />
            </Field>
            <Field label="Mensaje">
              <textarea required rows={4} value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                        className="input resize-none" placeholder="¿En qué te ayudamos?" />
            </Field>
            <button type="submit" disabled={sinCanal}
                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-transform duration-150 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50">
              Enviar por WhatsApp <PaperPlaneRight size={17} weight="fill" />
            </button>

            {/* aria-live: el lector de pantalla anuncia el resultado sin que el foco
                se mueva. Y quien tiene bloqueadas las ventanas emergentes se entera
                de por qué no pasó nada, en vez de pulsar tres veces. */}
            <p aria-live="polite" className="min-h-[1.25rem] text-sm text-muted-foreground">
              {estado === 'abierto' && (
                <span className="text-primary">
                  Listo, abrimos tu mensaje. Si no se abrió, escríbenos a {contact?.email ?? contact?.telefono}.
                </span>
              )}
              {estado === 'sin-canal' && (
                <span className="text-accent">
                  No pudimos abrir el chat. Escríbenos directamente a {contact?.email ?? contact?.telefono ?? 'nuestros canales de arriba'}.
                </span>
              )}
            </p>
          </motion.form>
        </div>
      </section>

    </TransicionPagina>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}
