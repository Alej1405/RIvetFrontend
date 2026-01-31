import { z } from 'zod'


export const ProductosAPIResponseSchema = z.object({
    data: z.array(
        z.object({
            status: z.number(),
            message: z.string(),
            data: z.object({
                id: z.number(),
                nombre: z.string(), 
                detalle: z.nullable(z.string()),
                insing: z.string(),
                color_insig: z.nullable(z.string()),
                seo_insing: z.string(),
                imagen: z.nullable(z.string()),
            }),
        })
    ),
})

//esquema de cada imagen de la presentacion
export const ProductoImagenDetalle = z.object({
    id:z.number(),
    nombre:z.string().url(),
    alt: z.string(),
    descripcion: z.string()
})

//esquema de la presentacion
export const ProductoPresentacionDetalle = z.object({
    id:z.number(),
    nombre:z.string(),
    etiqueta: z.string().url(),
    producto_envases_id: z.string(),
    imagen_presentacion: z.string().nullable(),
})

//esquema del data
export const ProductoDetalleData = z.object({
    id: z.number(),
    nombre: z.string(),
    descripcion: z.string(),
    insing: z.string()
})

export const ProductoDetalleAPIResponseSchema = z.object ({
    status:z.number(),
    message: z.string(),
    data: ProductoDetalleData,
    imagenes:z.preprocess( val => {
        if (typeof val==="string") return [];
        return val;
    },z.array(ProductoImagenDetalle)).optional().default([]),
    presentacion: z.preprocess( val => {
        if (typeof val==="string") return [];
        return val;
    }, z.array(ProductoPresentacionDetalle)).optional().default([])
})

//exportar los types para el ui 
export type ProductoImagen = z.infer<typeof ProductoImagenDetalle>;
export type ProductoPresentacion = z.infer<typeof ProductoPresentacionDetalle>;
export type ProductoDetalle = z.infer<typeof ProductoDetalleData>;
export type ProductoDetalleResponse = z.infer<typeof ProductoDetalleAPIResponseSchema>;