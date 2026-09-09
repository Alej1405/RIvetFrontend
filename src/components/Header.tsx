// Header de desktop. En mobile la navegación es BottomNav, así que aquí solo queda
// el logo: nada de menú hamburguesa ni de nav superior en móvil.
import { NavLink } from 'react-router-dom'
import { UserCircle } from '@phosphor-icons/react'
import { PORTAL_CLIENTES, hayPortal } from '@/lib/config'

const logo = '/logo_blanco.svg'

// Catálogo no está aquí: es el CTA en amarillo, no un enlace más del nav.
const LINKS = [
  ['Servicios', '/servicios'],
  ['Nosotros', '/nosotros'],
  ['Puntos de venta', '/puntos-venta'],
  ['Blog', '/blog'],
  ['Contactos', '/contactos'],
  ['Trabaja con nosotros', '/postular'],
] as const

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-sm">
      {/* h-16: dentro del tope de 80px para un nav de escritorio. */}
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-4 md:px-6">
        <NavLink to="/" className="shrink-0" aria-label="Rivet Ecuador, inicio">
          <img src={logo} alt="Rivet Ecuador" className="h-6 w-auto" />
        </NavLink>

        <nav aria-label="Navegación principal" className="hidden items-center gap-8 text-sm md:flex">
          {LINKS.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {hayPortal() && (
            <a
              href={PORTAL_CLIENTES}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              <UserCircle size={16} /> Acceso clientes
            </a>
          )}
          {/* Amarillo del logo sobre el fondo oscuro: el mayor contraste de la paleta. */}
          <NavLink
            to="/catalogo"
            className="inline-flex items-center rounded-lg bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground transition-transform duration-150 ease-out hover:brightness-110 active:scale-[0.97]"
          >
            Ver catálogo
          </NavLink>
        </div>
      </div>
    </header>
  )
}
