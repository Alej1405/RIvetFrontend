import axios from "axios";
import { InfoAPIResponseSchema } from "../utils/info-schema";

export async function getInfo() {
    const url = 'https://app.rivet-ec.com/api/empresa/redes'

    const config = {
        headers: {
            'Authorization': 'Bearer 140500',
            'Content-Type': 'application/json'
        }
    }

    const { data } = await axios.get(url, config)
    // console.log(data)

    const result = InfoAPIResponseSchema.safeParse(data)
    if(result.success){
        return result.data
    }
}