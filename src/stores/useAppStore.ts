import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { createProducSlice, type ProducSliceType } from "./producSlice";
import { createPerfilSlice, type PerfilSliceType } from "./perfilSlice";
import { createInfoSlice, type InfoSliceType } from "./infoSlice";
import { createImagenSlice, type ImagenSliceType } from "./imagenSlice";

export const useAppStore = create<ProducSliceType & PerfilSliceType & InfoSliceType & ImagenSliceType>()(devtools ((...a) => ({
    ...createProducSlice(...a),
    ...createPerfilSlice(...a),
    ...createInfoSlice(...a),
    ...createImagenSlice(...a),
})))
