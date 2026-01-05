import axios from "axios"
import { ProductosAPIResponseSchema } from "../utils/productos-schema"
import { ProductoDetalleAPIResponseSchema } from "../utils/productos-schema"

export async function getProducto() {
    const url = 'https://app.rivet-ec.com/api/productos'

    const config = {
        headers: {
        'Authorization': 'Bearer 140500', // Reemplaza con tu API Key real
        'Content-Type': 'application/json' // Opcional, pero recomendable
        }
    }

    const { data } = await axios.get(url, config)

    const result = ProductosAPIResponseSchema.safeParse(data)
    if(result.success){
        return result.data
    }
}

export async function getProductById(id: number){
    const url = `https://app.rivet-ec.com/api/producto/${id}`

    const config = {
        headers: {
        'Authorization': 'Bearer 140500', // Reemplaza con tu API Key real
        'Content-Type': 'application/json' // Opcional, pero recomendable
        }
    }

    const { data } = await axios(url, config)

    const result = ProductoDetalleAPIResponseSchema.safeParse(data)
    if (result.success){
        return result.data
    }
}