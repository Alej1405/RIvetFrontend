// Store único de la app: acopla los slices de los dos carriles (CMS y ecommerce).
// Cada slice se carga por separado, así que ninguna sección espera a otra.
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import {
  aboutSlice, clientsSlice, contactSlice, faqSlice, heroSlice, postsSlice,
  puntosVentaSlice, servicesSlice, teamSlice,
  type AboutSlice, type ClientsSlice, type ContactSlice, type FaqSlice, type HeroSlice,
  type PostsSlice, type PuntosVentaSlice, type ServicesSlice, type TeamSlice,
} from './cmsSlices'
import {
  categoriasSlice, productosSlice,
  type CategoriasSlice, type ProductosSlice,
} from './tiendaSlices'

export type AppStore =
  // Carril CMS
  & HeroSlice
  & AboutSlice
  & ServicesSlice
  & TeamSlice
  & ClientsSlice
  & FaqSlice
  & ContactSlice
  & PostsSlice
  & PuntosVentaSlice
  // Carril ecommerce
  & CategoriasSlice
  & ProductosSlice

export const useAppStore = create<AppStore>()(
  devtools(
    (...a) => ({
      ...heroSlice(...(a as Parameters<typeof heroSlice>)),
      ...aboutSlice(...(a as Parameters<typeof aboutSlice>)),
      ...servicesSlice(...(a as Parameters<typeof servicesSlice>)),
      ...teamSlice(...(a as Parameters<typeof teamSlice>)),
      ...clientsSlice(...(a as Parameters<typeof clientsSlice>)),
      ...faqSlice(...(a as Parameters<typeof faqSlice>)),
      ...contactSlice(...(a as Parameters<typeof contactSlice>)),
      ...postsSlice(...(a as Parameters<typeof postsSlice>)),
      ...puntosVentaSlice(...(a as Parameters<typeof puntosVentaSlice>)),
      ...categoriasSlice(...(a as Parameters<typeof categoriasSlice>)),
      ...productosSlice(...(a as Parameters<typeof productosSlice>)),
    }),
    { name: 'rivet' },
  ),
)
