import { Helmet } from 'react-helmet-async'

/** Imagen OG por defecto (páginas de Rivet que no traen una propia). */
const OG_DEFECTO = 'https://rivet-ec.com/rivet_logo_editable.png'

/** El dominio, para construir las URL absolutas que exigen canonical y og:url. */
export const SITIO = 'https://rivet-ec.com'

/**
 * SEO por página. Usa react-helmet-async para que las etiquetas se inyecten y
 * **reemplacen** (deduplicando por name/property) las que trae el index.html — si no,
 * quedarían duplicadas y ganarían las estáticas de Rivet.
 *
 * Esto cubre al visitante y a Google, que ejecuta JavaScript. **No cubre a
 * WhatsApp, Facebook, Instagram ni LinkedIn**: esos leen el HTML crudo y se
 * van sin ejecutar nada. Para ellos existe `scripts/prerender.mjs`, que
 * escribe un archivo por categoría y por producto con estas mismas etiquetas
 * ya resueltas. Los dos caminos tienen que decir lo mismo, así que si cambias
 * un título aquí, cámbialo también allá.
 */
export default function Seo({
  title,
  description,
  image,
  url,
  siteName = 'RIVET Ecuador',
  type = 'website',
  noindex = false,
}: {
  title: string
  description?: string
  image?: string | null
  /** Ruta ('/catalogo') o URL completa. Sin esto no hay canonical ni og:url. */
  url?: string
  siteName?: string
  type?: 'website' | 'article' | 'business.business'
  /** Para formularios y páginas sin valor de búsqueda: se ven, no se indexan. */
  noindex?: boolean
}) {
  const fullTitle = title === siteName ? title : `${title} · ${siteName}`
  const ogImage = image ?? OG_DEFECTO
  const fullUrl = url ? (url.startsWith('http') ? url : `${SITIO}${url}`) : undefined

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {fullUrl && <link rel="canonical" href={fullUrl} />}
      <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow'} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {fullUrl && <meta property="og:url" content={fullUrl} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={title} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {fullUrl && <meta name="twitter:url" content={fullUrl} />}
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}
