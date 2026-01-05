import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/react';
import { Fragment } from 'react';
import { useAppStore } from '../stores/useAppStore';

export default function Modal() {
    //controlando el modal apertura
    const modal = useAppStore((state) => state.modal)
    //controlando el model cerrando el modal
    const closeModal = useAppStore((state) => state.closeModal)
    //mostrar la informacion de cada producto
    const productoDetalle = useAppStore((state) => state.selectProducto)



    return (
        <>
            <Transition appear show={modal} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    {/* Fondo oscuro con transición */}
                    <TransitionChild
                    as={Fragment}
                    enter="transition-opacity duration-500 ease-out"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-400 ease-in"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    >
                    <div className="fixed inset-0 backdrop-blur-md bg-opacity-70 overflow-y-scroll" />
                    </TransitionChild>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            {/* Panel con animación de escala y opacidad */}
                            <TransitionChild
                                as={Fragment}
                                enter="transition duration-500 ease-out transform"
                                enterFrom="opacity-0 scale-90 translate-y-4"
                                enterTo="opacity-100 scale-100 translate-y-0"
                                leave="transition duration-400 ease-in transform"
                                leaveFrom="opacity-100 scale-100 translate-y-0"
                                leaveTo="opacity-0 scale-90 translate-y-4"
                            >
                                <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white/40 backdrop-blur-md  px-6 py-8 text-left shadow-xl transition-all sm:max-w-2xl w-full">

                                    <button
                                        onClick={closeModal}
                                        className="absolute top-4 right-4 text-gray-700 hover:text-red-600 text-2xl font-bold transition"
                                        aria-label="Cerrar modal"
                                    >
                                        &times;
                                    </button>

                                    <DialogTitle className="text-gray-900 text-4xl font-extrabold mb-6 text-center">
                                        {productoDetalle.data.nombre ?? ""}
                                    </DialogTitle>

                                    <div className="rounded-lg flex flex-row overflow-x-auto gap-4 justify-center">
                                        {productoDetalle.imagenes.length > 0 && (
                                            <div
                                            className="shrink-0 w-[70vw] sm:w-[40vw] md:w-[30vw] lg:w-[20vw] h-auto flex justify-center items-center overflow-hidden"
                                            >
                                            <img
                                                src={productoDetalle.imagenes[productoDetalle.imagenes.length - 1].nombre}
                                                alt="Última imagen del producto"
                                                className="w-full h-auto object-contain rounded-md hover:scale-120 hover:transition-all"
                                            />
                                            </div>
                                        )}
                                    </div>

                                    <DialogTitle className="text-gray-900 text-2xl font-extrabold mb-4 mt-6">
                                        Presentaciones de {productoDetalle.data.nombre ?? ""}
                                    </DialogTitle>

                                    <div className="flex flex-col gap-6">
                                        {productoDetalle.presentacion.map((present) => (
                                            <div
                                                key={present.id}
                                                className="rounded-lg shadow-md p-6 bg-white/15 backdrop-blur-md flex flex-col  items-start"
                                            >
                                                <div className="flex flex-col gap-2">
                                                    <h2 className="text-xl font-semibold text-gray-800">
                                                        {present.nombre}
                                                    </h2>
                                                    <div className=" flex flex-direction-row">
                                                        <div>
                                                            <img src={present.imagen_presentacion ?? "Sin imagen"} alt={present.nombre} />
                                                        </div>
                                                    </div>
                                                    <h3 className="uppercase font-extrabold font-heveltica-light tracking-[.3em]">
                                                        Tipo de Envase o Botella:
                                                    </h3>
                                                    <p className="text-gray-600 ml-6 my-5">
                                                        Envase: {present.producto_envases_id ?? "Sin envase"}
                                                    </p>
                                                </div>

                                                <form
                                                    className="mt-4 w-full flex flex-col md:flex-row items-center gap-4"
                                                >
                                                    <div className="space-y-3">
                                                        <div className="flex flex-col md:w-24 items-center justify-center">
                                                            <label htmlFor="cantidad" className="uppercase font-bold font-heveltica-bold tracking-[3px]">
                                                                Cantidad
                                                            </label>
                                                            <input
                                                                type="number"
                                                                id="cantidad"
                                                                name={`cantidad-${present.id}`}
                                                                min="1"
                                                                defaultValue="1"
                                                                placeholder="Cantidad"
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                                                                required
                                                            />
                                                        </div>
                                                        <button
                                                            type="submit"
                                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition bottom-0"
                                                        >
                                                        Agregar al carrito
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        ))}
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
    }