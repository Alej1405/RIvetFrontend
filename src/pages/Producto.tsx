import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, WhatsappLogo } from '@phosphor-icons/react'
import { useAppStore } from '@/stores/useAppStore'
import { storageUrl } from '@/lib/api'
import Precio from '@/components/Precio'
import TransicionPagina from '@/components/TransicionPagina'
import Seo from '@/components/Seo'

/** El HTML del ERP se limpia de etiquetas: aquí solo se necesita el texto. */
const soloTexto = (html: string | null): string =>
  html ? html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim() : ''

export default function Producto() {
  const { slug = '' } = useParams()
  const { datos: productos } = useAppStore((s) => s.productos)
  const fetchProductos = useAppStore((s) => s.fetchProductos)
  const contacto = useAppStore((s) => s.contact.datos)
  const [activa, setActiva] = useState(0)

  useEffect(() => {
    void fetchProductos()
  }, [fetchProductos])

  const producto = productos.find((p) => p.slug === slug)

  if (!producto) {
    return (
      <TransicionPagina>
        <section className="mx-auto max-w-6xl px-4 py-24 md:px-6">
          {productos.length > 0 ? (
            <>
              <h1 className="font-heveltica text-3xl font-bold text-foreground">Producto no encontrado</h1>
              <Link to="/catalogo" className="mt-4 inline-flex items-center gap-2 text-sm text-primary">
                <ArrowLeft size={16} /> Volver al catálogo
              </Link>
            </>
          ) : (
            <div className="h-96 animate-pulse rounded-xl border border-border bg-card" />
          )}
        </section>
      </TransicionPagina>
    )
  }

  const imagenes = [...producto.imagenes].sort(
    (a, b) => Number(b.es_principal) - Number(a.es_principal) || a.orden - b.orden,
  )
  const descripcion = soloTexto(producto.descripcion)
  const wa = contacto?.whatsapp
  const mensaje = encodeURIComponent(
    `Hola, quiero pedir ${producto.nombre} (SKU ${producto.sku ?? producto.id}).`,
  )

  return (
    <TransicionPagina>
      <Seo
        title={producto.nombre}
        description={producto.meta_descripcion ?? descripcion.slice(0, 155)}
      />

      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-16">
        <Link
          to={`/catalogo/${producto.store_category?.slug ?? ''}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} /> {producto.store_category?.nombre ?? 'Catálogo'}
        </Link>

        <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
          {/* Galería */}
          <div>
            <div className="aspect-square overflow-hidden rounded-xl border border-border bg-secondary">
              {imagenes[activa] ? (
                <img
                  src={storageUrl(imagenes[activa].path) ?? ''}
                  alt={producto.nombre}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center font-heveltica text-7xl font-bold text-primary/15">
                  {producto.nombre.charAt(0)}
                </div>
              )}
            </div>

            {imagenes.length > 1 && (
              <div className="mt-3 flex gap-3">
                {imagenes.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiva(i)}
                    aria-label={`Ver imagen ${i + 1}`}
                    aria-current={i === activa}
                    className={`h-16 w-16 overflow-hidden rounded-lg border transition-colors ${
                      i === activa ? 'border-primary' : 'border-border hover:border-primary/40'
                    }`}
                  >
                    <img src={storageUrl(img.path) ?? ''} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ficha */}
          <div className="flex flex-col">
            <h1 className="font-heveltica text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
              {producto.nombre}
            </h1>
            {producto.sku && <p className="mt-2 text-sm text-muted-foreground">SKU {producto.sku}</p>}

            {descripcion && (
              <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-muted-foreground">
                {descripcion}
              </p>
            )}

            <div className="mt-7">
              <Precio producto={producto} tamano="grande" />
            </div>

            {producto.caracteristicas.length > 0 && (
              <ul className="mt-7 space-y-2.5">
                {producto.caracteristicas.map((c, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check size={16} weight="bold" className="mt-0.5 shrink-0 text-primary" />
                    {c.texto}
                  </li>
                ))}
              </ul>
            )}

            <a
              href={wa ? `https://wa.me/${wa}?text=${mensaje}` : '/contactos'}
              target={wa ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-transform duration-150 ease-out active:scale-[0.98]"
            >
              <WhatsappLogo size={18} weight="fill" /> Pedir por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </TransicionPagina>
  )
}
