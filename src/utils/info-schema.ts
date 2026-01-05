import { z } from 'zod'

export const InfoAPIResponseSchema = z.object({
    status: z.number(),
    message: z.string(),
    data: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
            url: z.nullable(z.string()),
            telefono: z.nullable(z.string()),
            correo: z.nullable(z.string()),
            contacto: z.nullable(z.string()),
            icono: z.string()
        })
    )
})