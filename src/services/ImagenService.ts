import axios from "axios"
import { ImagenAPIResponseSchema } from "../utils/imagen-schema"

export async function getImagen() {
    const url = 'https://app.rivet-ec.com/api/imagenes'

    const config = {
        headers: {
            'Authorization': 'Bearer 140500',
            'Content-Type': 'application/json'
        }
    }

    const { data } = await axios.get(url, config)

    const result = ImagenAPIResponseSchema.safeParse(data)
    if(result.data){
        return result.data
    }
}