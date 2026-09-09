// Nav inferior de mobile. Es la navegación real del móvil, no un menú colapsado:
// destinos fijos, siempre visibles, con la forma de una tab bar nativa.
import { NavLink } from 'react-router-dom'
import { House, Package, Wrench, ChatCircleText, UserCircle, Storefront } from '@phosphor-icons/react'
import { PORTAL_CLIENTES, hayPortal } from '@/lib/config'

/**
 * Solo lo esencial: los destinos que empujan la venta, incluidos los Puntos de venta
 * (dónde encontrar el producto). Nosotros, FAQ y Postular quedan fuera a propósito,
 * accesibles desde el footer. En mobile se recorta lo accesorio en vez de encogerlo.
 */
const DESTINOS = [
  { to: '/', label: 'Inicio', Icono: House, exact: true },
  { to: '/catalogo', label: 'Catálogo', Icono: Package, exact: false },
  { to: '/puntos-venta', label: 'Locales', Icono: Storefront, exact: false },
  { to: '/servicios', label: 'Servicios', Icono: Wrench, exact: false },
  { to: '/contactos', label: 'Contacto', Icono: ChatCircleText, exact: false },
] as const

export default function BottomNav() {
  return (
    <nav
      aria-label="Navegación principal"
      // pb con safe-area: en iPhone la barra de gestos se come el borde inferior.
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden"
    >
      <ul className="mx-auto flex max-w-lg items-stretch">
        {DESTINOS.map(({ to, label, Icono, exact }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={exact}
              // min-h-14 mantiene el área táctil por encima del mínimo de 44px.
              className={({ isActive }) =>
                `flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icono size={22} weight={isActive ? 'fill' : 'regular'} />
                  <span className="leading-none">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}

        {hayPortal() && (
          <li className="flex-1">
            <a
              href={PORTAL_CLIENTES}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-14 flex-col items-center justify-center gap-1 px-1 py-2 text-[11px] text-muted-foreground transition-colors"
            >
              <UserCircle size={22} />
              <span className="leading-none">Clientes</span>
            </a>
          </li>
        )}
      </ul>
    </nav>
  )
}
