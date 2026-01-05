import type { StateCreator } from "zustand";
import { getInfo } from "../services/InfoService";
import type { info } from "../types";


export type InfoSliceType = {
    info: info
    fetchInfo: () => Promise<void>
}

export const createInfoSlice : StateCreator<InfoSliceType> = (set) => ({
    info: {
        status: 0,
        message: '',
        data:[]
    },
    fetchInfo: async() => {
        const info = await getInfo()
        set({
            info
        })
    }
})