import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/react';
import { Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Package } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';
import ImageCarousel  from '../components/modal/imagenes';

export default function Modal() {
    //controlando el modal apertura
    const modal = useAppStore((state) => state.modal)
    //controlando el model cerrando el modal
    const closeModal = useAppStore((state) => state.closeModal)
    //mostrar la informacion de cada producto
    const productoDetalle = useAppStore((state) => state.selectProducto)

    //variables del sistema que controlan la opacidad del modal
    const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring" as const, stiffness: 300, damping: 24 },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, x: -30, scale: 0.95 },
        visible: (i: number) => ({
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            delay: i * 0.15,
            type: "spring" as const,
            stiffness: 260,
            damping: 20,
        },
        }),
        hover: {
        scale: 1.02,
        y: -5,
        transition: { type: "spring" as const, stiffness: 400, damping: 25 },
        },
    };

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
                                    {/* orbes decorados con gradientes */}
                                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
                                    {/* boton que cierra el modal */}
                                    <motion.button
                                        onClick={closeModal}
                                        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-card/60 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        aria-label="Cerrar modal"
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.button>

                                    <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    >
                                    {/* Title */}
                                        <motion.div variants={itemVariants}>
                                            <DialogTitle className="text-foreground text-3xl md:text-4xl font-bold mb-6 text-center">
                                            <motion.span
                                                initial={{ opacity: 0, y: -20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1, type: "spring" }}
                                                className="inline-block"
                                            >
                                                {productoDetalle.data.nombre ?? ""}
                                            </motion.span>
                                            </DialogTitle>
                                        </motion.div>

                                    {/* Carousel de imagenes */}
                                        <motion.div variants={itemVariants} className="mb-8">
                                            <ImageCarousel imagenes={productoDetalle.imagenes} />
                                        </motion.div>

                                    {/* Presentaciones section */}
                                        <motion.div variants={itemVariants}>
                                            <DialogTitle className="text-foreground text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">
                                            <Package className="w-6 h-6 text-primary" />
                                            Presentaciones de {productoDetalle.data.nombre ?? ""}
                                            </DialogTitle>
                                        </motion.div>
                                    {/* presentaciones de tarjetas */}
                                        <div className="flex flex-col gap-6">
                                            <AnimatePresence>
                                            {productoDetalle.presentacion.map((present, index) => (
                                                <motion.div
                                                key={present.id}
                                                custom={index}
                                                variants={cardVariants}
                                                initial="hidden"
                                                animate="visible"
                                                whileHover="hover"
                                                className="rounded-xl p-5 bg-card/30 backdrop-blur-md border border-border/40 shadow-lg"
                                                >
                                                <div className="flex flex-col md:flex-row gap-4">
                                                    {/* Image */}
                                                    {present.imagen_presentacion && (
                                                        <motion.div
                                                            className="shrink-0"
                                                            whileHover={{ scale: 1.05 }}
                                                            transition={{ type: "spring", stiffness: 300 }}
                                                        >
                                                            <img
                                                            src={present.imagen_presentacion}
                                                            alt={present.nombre}
                                                            className="w-24 h-24 object-cover rounded-lg shadow-md"
                                                            />
                                                        </motion.div>
                                                    )}

                                                    {/* Contentenido */}
                                                        <div className="flex-1 space-y-2">
                                                        <motion.h2
                                                            className="text-lg font-semibold text-foreground"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: 0.2 + index * 0.1 }}
                                                        >
                                                            {present.nombre}
                                                        </motion.h2>

                                                        <div className="space-y-1">
                                                            <h3 className="text-xs uppercase font-bold tracking-widest text-muted-foreground">
                                                            Tipo de Envase o Botella:
                                                            </h3>
                                                            <p className="text-sm text-foreground/80 pl-2">
                                                            {present.producto_envases_id ?? "Sin envase"}
                                                            </p>
                                                        </div>
                                                        </div>

                                                    {/* Formulario de cada presentacion */}
                                                        <form className="flex flex-col items-center gap-3 mt-4 md:mt-0">
                                                            <div className="flex flex-col items-center">
                                                                <label
                                                                htmlFor={`cantidad-${present.id}`}
                                                                className="text-xs uppercase font-bold tracking-widest text-muted-foreground mb-1"
                                                                >
                                                                    Cantidad
                                                                </label>
                                                                <motion.input
                                                                whileFocus={{ scale: 1.05 }}
                                                                type="number"
                                                                id={`cantidad-${present.id}`}
                                                                name={`cantidad-${present.id}`}
                                                                min="1"
                                                                defaultValue="1"
                                                                className="w-20 px-3 py-2 text-center border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background/80 backdrop-blur-sm text-foreground"
                                                                required
                                                                />
                                                            </div>
                                                            <motion.button
                                                                type="submit"
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
                                                            >
                                                                <ShoppingCart className="w-4 h-4" />
                                                                    Agregar
                                                            </motion.button>
                                                        </form>
                                                </div>
                                                </motion.div>
                                            ))}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
    }
