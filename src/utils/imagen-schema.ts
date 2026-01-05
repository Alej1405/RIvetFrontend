import { z } from 'zod'

export const ImagenAPIResponseSchema = z.object({
    data: z.array(
        z.object({
            status: z.number(),
            message: z.string(),
            data: z.object({
                id: z.number(),
                seccion: z.string(),
                url_image: z.string(),
                alt_img: z.string()
            })
        })
    )
})