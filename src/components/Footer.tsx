import { NavLink } from 'react-router-dom'
import { WhatsappLogo, InstagramLogo, FacebookLogo, MapPin, EnvelopeSimple, Phone } from '@phosphor-icons/react'
import { useAppStore } from '@/stores/useAppStore'

const logo = '/logo_blanco.svg'

export default function Footer() {
  const contact = useAppStore((s) => s.contact.datos)
  const redes = contact?.redes ?? {}

  return (
    <footer className="relative mt-24 border-t border-border/60 px-6 pt-16 pb-10">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <img src={logo} alt="Rivet Ecuador" className="h-7 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Ingeniería alimentaria. Innovación con responsabilidad, pensando en el desarrollo económico local.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {contact?.whatsapp && <Social href={`https://wa.me/${contact.whatsapp}`}><WhatsappLogo size={18} /></Social>}
            {redes.instagram && <Social href={redes.instagram}><InstagramLogo size={18} /></Social>}
            {redes.facebook && <Social href={redes.facebook}><FacebookLogo size={18} /></Social>}
          </div>
        </div>

        <nav className="flex flex-col gap-3 text-sm">
          <span className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">Navegación</span>
          {[['Nosotros', '/nosotros'], ['Servicios', '/servicios'], ['Contactos', '/contactos'], ['FAQ', '/faq'], ['Trabaja con nosotros', '/postular']].map(([l, t]) => (
            <NavLink key={t} to={t} className="text-muted-foreground transition-colors hover:text-foreground">{l}</NavLink>
          ))}
        </nav>

        <div className="flex flex-col gap-3 text-sm">
          <span className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-primary">Contacto</span>
          {contact?.direccion && <Line icon={<MapPin size={15} />}>{contact.direccion}</Line>}
          {contact?.telefono && <Line icon={<Phone size={15} />}>{contact.telefono}</Line>}
          {contact?.email && (
            <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <EnvelopeSimple size={15} className="text-primary" /> {contact.email}
            </a>
          )}
        </div>
      </div>
      <p className="mx-auto mt-14 max-w-6xl text-xs text-muted-foreground/70">
        © {new Date().getFullYear()} Rivet Ecuador S.A.S. · Ingeniería alimentaria · Quito, Ecuador.
      </p>
    </footer>
  )
}

function Social({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
       className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary">
      {children}
    </a>
  )
}

function Line({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2 text-muted-foreground">
      <span className="text-primary">{icon}</span> {children}
    </span>
  )
}
