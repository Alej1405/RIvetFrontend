import { Helmet } from 'react-helmet-async'

/** Imagen OG por defecto (páginas de Rivet que no traen una propia). */
const OG_DEFECTO = 'https://rivet-ec.com/rivet_logo_editable.png'

/**
 * SEO por página. Usa react-helmet-async para que las etiquetas se inyecten y
 * **reemplacen** (deduplicando por name/property) las que trae el index.html — si no,
 * quedarían duplicadas y ganarían las estáticas de Rivet.
 *
 * La inyección es dinámica y reutiliza los datos del endpoint: cada negocio y cada menú
 * tiene su propio title, description y tarjeta de OpenGraph al compartirse.
 */
export default function Seo({
  title,
  description,
  image,
  url,
  siteName = 'RIVET Ecuador',
  type = 'website',
}: {
  title: string
  description?: string
  image?: string | null
  url?: string
  siteName?: string
  type?: 'website' | 'article' | 'business.business'
}) {
  const fullTitle = title === siteName ? title : `${title} · ${siteName}`
  const ogImage = image ?? OG_DEFECTO
  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {url && <link rel="canonical" href={url} />}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  )
}
