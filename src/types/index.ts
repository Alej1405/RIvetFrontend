import { z } from 'zod'
//import { productos } from './index';
import { ProductosAPIResponseSchema, ProductoDetalleAPIResponseSchema } from '../utils/productos-schema'
import { PerfilAPIResponseSchema } from '../utils/perfil-schema'
import { InfoAPIResponseSchema } from '../utils/info-schema'
import { ImagenAPIResponseSchema } from '../utils/imagen-schema'

//consulta de productos
export type productos = z.infer< typeof ProductosAPIResponseSchema >
//consulta de informacion principal
export type perfil = z.infer< typeof PerfilAPIResponseSchema >
//informacion general de contactos
export type info = z.infer< typeof InfoAPIResponseSchema >
//imagenes de la web de toda la web
export type imagen = z.infer< typeof ImagenAPIResponseSchema>
//detalles del producto
export type producto = z.infer<typeof ProductoDetalleAPIResponseSchema>

