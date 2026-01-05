import type { StateCreator } from "zustand"
import { getProductById, getProducto } from "../services/ProductoService"
import type { producto, productos } from "../types"

export type ProducSliceType = {
    productos: productos
    selectProducto: producto
    modal: boolean
    fetchProductos: () => Promise<void>
    selectProduct: (id: number) => Promise<void>
    closeModal: () => void
}

export const createProducSlice : StateCreator<ProducSliceType> = (set) => ({
        productos: {
            data: []
        },
        selectProducto: {} as producto,
        modal: false,
        fetchProductos: async () => {
            const productos = await getProducto()
            set({
                productos
            })
        },
        selectProduct: async (id) => {
            const selectProducto = await getProductById(id)
            set({
                selectProducto,
                modal: true
            })
        },
        closeModal: () => {
            set({
                modal: false,
                selectProducto: {} as producto
            })
        }
})