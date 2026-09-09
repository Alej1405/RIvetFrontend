import { motion, useReducedMotion } from 'framer-motion'

/**
 * Encabezado de página en el lenguaje del rediseño: sin el glow difuminado de antes,
 * tipografía heveltica y el mismo ritmo de espaciado que el catálogo. El offset del
 * header fijo lo pone el <main> (pt-16), así que aquí no se suma padding superior extra.
 */
export default function PageHeader({ eyebrow, title, children }: {
  eyebrow: string
  title: React.ReactNode
  children?: React.ReactNode
}) {
  const reduce = useReducedMotion()
  const sube = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, transform: 'translateY(12px)' },
          animate: { opacity: 1, transform: 'translateY(0px)' },
          transition: { duration: 0.45, delay, ease: [0.16, 1, 0.3, 1] as const },
        }

  return (
    <header className="mx-auto max-w-6xl px-4 pt-14 md:px-6 md:pt-24">
      <motion.p {...sube(0)} className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
        {eyebrow}
      </motion.p>
      <motion.h1
        {...sube(0.05)}
        className="mt-4 font-heveltica text-4xl font-bold leading-[1.05] tracking-tight text-balance text-foreground md:text-6xl"
      >
        {title}
      </motion.h1>
      {children && (
        <motion.div {...sube(0.1)} className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {children}
        </motion.div>
      )}
    </header>
  )
}
