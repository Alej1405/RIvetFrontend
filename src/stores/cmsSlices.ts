// Slices del carril CMS. Uno por recurso: cada página carga solo lo suyo y pinta en
// cuanto llega, sin esperar al resto del CMS.
import type { StateCreator } from 'zustand'
import { cmsApi } from '@/lib/api'
import {
  AboutSchema, ClientListSchema, ContactSchema, FaqListSchema, HeroSchema,
  PostDetalleSchema, PostListSchema, PuntoVentaDetalleSchema, PuntoVentaListSchema,
  ServiceListSchema, TeamListSchema,
} from '@/schemas/cms'
import type {
  About, Client, Contact, Faq, Hero, Post, PostDetalle, PuntoVenta, PuntoVentaDetalle,
  Service, TeamMember,
} from '@/schemas/cms'
import { cargarRecurso, recursoVacio, type Recurso } from './recurso'

export interface HeroSlice {
  hero: Recurso<Hero | null>
  fetchHero: () => Promise<void>
}
export const heroSlice: StateCreator<HeroSlice> = (set, get) => ({
  hero: recursoVacio<Hero | null>(null),
  fetchHero: () =>
    cargarRecurso(get().hero, () => cmsApi('hero', HeroSchema), (hero) => set({ hero })),
})

export interface AboutSlice {
  about: Recurso<About | null>
  fetchAbout: () => Promise<void>
}
export const aboutSlice: StateCreator<AboutSlice> = (set, get) => ({
  about: recursoVacio<About | null>(null),
  fetchAbout: () =>
    cargarRecurso(get().about, () => cmsApi('about', AboutSchema), (about) => set({ about })),
})

export interface ServicesSlice {
  services: Recurso<Service[]>
  fetchServices: () => Promise<void>
}
export const servicesSlice: StateCreator<ServicesSlice> = (set, get) => ({
  services: recursoVacio<Service[]>([]),
  fetchServices: () =>
    cargarRecurso(get().services, () => cmsApi('services', ServiceListSchema), (services) =>
      set({ services }),
    ),
})

export interface TeamSlice {
  team: Recurso<TeamMember[]>
  fetchTeam: () => Promise<void>
}
export const teamSlice: StateCreator<TeamSlice> = (set, get) => ({
  team: recursoVacio<TeamMember[]>([]),
  fetchTeam: () =>
    cargarRecurso(get().team, () => cmsApi('team', TeamListSchema), (team) => set({ team })),
})

export interface ClientsSlice {
  clients: Recurso<Client[]>
  fetchClients: () => Promise<void>
}
export const clientsSlice: StateCreator<ClientsSlice> = (set, get) => ({
  clients: recursoVacio<Client[]>([]),
  fetchClients: () =>
    cargarRecurso(get().clients, () => cmsApi('clients', ClientListSchema), (clients) =>
      set({ clients }),
    ),
})

export interface FaqSlice {
  faq: Recurso<Faq[]>
  fetchFaq: () => Promise<void>
}
export const faqSlice: StateCreator<FaqSlice> = (set, get) => ({
  faq: recursoVacio<Faq[]>([]),
  fetchFaq: () => cargarRecurso(get().faq, () => cmsApi('faq', FaqListSchema), (faq) => set({ faq })),
})

export interface ContactSlice {
  contact: Recurso<Contact | null>
  fetchContact: () => Promise<void>
}
export const contactSlice: StateCreator<ContactSlice> = (set, get) => ({
  contact: recursoVacio<Contact | null>(null),
  fetchContact: () =>
    cargarRecurso(get().contact, () => cmsApi('contact', ContactSchema), (contact) =>
      set({ contact }),
    ),
})

export interface PostsSlice {
  posts: Recurso<Post[]>
  /** Detalle del post abierto en el modal. La lista no trae `contenido`, hay que pedirlo. */
  postAbierto: Recurso<PostDetalle | null>
  fetchPosts: () => Promise<void>
  abrirPost: (slug: string) => Promise<void>
  cerrarPost: () => void
}
export const postsSlice: StateCreator<PostsSlice> = (set, get) => ({
  posts: recursoVacio<Post[]>([]),
  postAbierto: recursoVacio<PostDetalle | null>(null),

  fetchPosts: () =>
    cargarRecurso(get().posts, () => cmsApi('posts', PostListSchema), (posts) => set({ posts })),

  abrirPost: (slug) =>
    cargarRecurso(
      // Se reinicia en cada apertura: si no, el modal muestra el post anterior mientras carga.
      recursoVacio<PostDetalle | null>(null),
      () => cmsApi(`posts/${slug}`, PostDetalleSchema),
      (postAbierto) => set({ postAbierto }),
    ),

  cerrarPost: () => set({ postAbierto: recursoVacio<PostDetalle | null>(null) }),
})

export interface PuntosVentaSlice {
  puntosVenta: Recurso<PuntoVenta[]>
  /** Detalle del punto abierto en su ruta. La lista no trae `menu`, hay que pedirlo. */
  puntoAbierto: Recurso<PuntoVentaDetalle | null>
  fetchPuntosVenta: () => Promise<void>
  abrirPuntoVenta: (slug: string) => Promise<void>
}
export const puntosVentaSlice: StateCreator<PuntosVentaSlice> = (set, get) => ({
  puntosVenta: recursoVacio<PuntoVenta[]>([]),
  puntoAbierto: recursoVacio<PuntoVentaDetalle | null>(null),

  fetchPuntosVenta: () =>
    cargarRecurso(
      get().puntosVenta,
      () => cmsApi('puntos-venta', PuntoVentaListSchema),
      (puntosVenta) => set({ puntosVenta }),
    ),

  abrirPuntoVenta: (slug) =>
    cargarRecurso(
      // Se reinicia en cada apertura: si no, el detalle muestra el punto anterior mientras carga.
      recursoVacio<PuntoVentaDetalle | null>(null),
      () => cmsApi(`puntos-venta/${slug}`, PuntoVentaDetalleSchema),
      (puntoAbierto) => set({ puntoAbierto }),
    ),
})
