import axios from "axios"
import { PerfilAPIResponseSchema } from "../utils/perfil-schema"

export async function getPerfil() {
    const url = 'https://app.rivet-ec.com/api/perfil'

    const config = {
        headers: {
            'Authorization': 'Bearer 140500',
            'Content-Type': 'application/json'
        }
    }

    const { data } = await axios.get(url, config)
    //console.log(data)

    const result = PerfilAPIResponseSchema.safeParse(data)
    if(result.success){
        return result.data
    }
    
}