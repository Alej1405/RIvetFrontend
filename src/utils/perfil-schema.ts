import { z } from 'zod'

export const PerfilAPIResponseSchema = z.object({
    data: z.array(
        z.object({
            status: z.string(),
            message: z.string(),
            data: z.object({
                titulo: z.string(),
                seo_titulo: z.string(),
                subtitulo: z.string(),
                seo_subtitulo: z.string(),
                industria: z.string(),
                cta: z.string(),
                mision_empresarial: z.string(),
                vision_empresarial: z.string(),
                parrafo_contacto: z.nullable(z.string()),
            })
        })
    )
})