import type { StateCreator } from "zustand";
import { getPerfil } from "../services/PerfilService";
import type { perfil } from "../types";

export type PerfilSliceType = {
    perfil: perfil
    fetchPerfil: () => Promise<void>
}

export const createPerfilSlice : StateCreator<PerfilSliceType> = (set) =>({
    perfil: {
        data: []
    },
    fetchPerfil: async() => {
        const perfil = await getPerfil()
        set({
            perfil
        })
    }
})