import type { StateCreator } from "zustand";
import type { imagen  } from "../types";
import { getImagen } from "../services/ImagenService";


export type ImagenSliceType = {
    imagen: imagen
    fetchImagen: () => Promise<void>
}

export const createImagenSlice : StateCreator<ImagenSliceType> = (set) => ({
    imagen: {
        data: [],
        status: 0,
        message: "",
    },
    fetchImagen: async() => {
        const imagen = await getImagen()
        set({
            imagen
        })
    }
})