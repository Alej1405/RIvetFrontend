import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ProductoImagen } from '../../utils/productos-schema'; // <-- importa SOLO el tipo

interface ImageCarouselProps {
    imagenes: ProductoImagen[];
}

export default function ImageCarousel({ imagenes }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [direction, setDirection] = useState<-1 | 0 | 1>(0);

    const total = imagenes.length;
    if (total === 0) return null;

    // En caso de que la lista cambie dinámicamente:
    const safeIndex = Math.min(currentIndex, total - 1);
    const current = imagenes[safeIndex];

        const slideVariants = {
        enter: (dir: number) => ({
        x: dir > 0 ? 300 : -300,
        opacity: 0,
        scale: 0.8,
        rotateY: dir > 0 ? 15 : -15,
        }),
        center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1,
        rotateY: 0,
        },
        exit: (dir: number) => ({
        zIndex: 0,
        x: dir < 0 ? 300 : -300,
        opacity: 0,
        scale: 0.8,
        rotateY: dir < 0 ? 15 : -15,
        }),
    } as const;

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) =>
        Math.abs(offset) * velocity;

    const paginate = (newDirection: -1 | 1) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => {
        let newIndex = prevIndex + newDirection;
        if (newIndex < 0) newIndex = total - 1;
        if (newIndex >= total) newIndex = 0;
        return newIndex;
        });
    };

return (
    <div className="relative w-full overflow-hidden">
        {/* Main carousel */}
        <div className="relative h-64 sm:h-80 md:h-96 flex items-center justify-center perspective-1000">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                key={current.id ?? safeIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                    x: { type: 'spring', stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.4 },
                    rotateY: { duration: 0.4 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(_, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);
                    if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                    } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                    }
                }}
                className="absolute w-full max-w-sm mx-auto cursor-grab active:cursor-grabbing"
                >
                <motion.img
                    src={current.nombre}
                    alt={current.alt || `Imagen ${safeIndex + 1}`}
                    className="w-full h-64 sm:h-80 md:h-96 object-contain rounded-xl shadow-2xl"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                />
                </motion.div>
            </AnimatePresence>
        </div>

        {/* Navigation arrows */}
        {total > 1 && (
        <>
            <motion.button
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-card/80 backdrop-blur-sm shadow-lg border border-border/50 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label="Imagen anterior"
            >
                <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <motion.button
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-card/80 backdrop-blur-sm shadow-lg border border-border/50 text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            aria-label="Siguiente imagen"
            >
                <ChevronRight className="w-5 h-5" />
            </motion.button>
        </>
        )}

        {/* Dots */}
        {total > 1 && (
        <div className="flex justify-center gap-2 mt-4">
            {imagenes.map((img, index) => (
            <motion.button
                key={img.id ?? index}
                onClick={() => {
                setDirection(index > safeIndex ? 1 : -1);
                setCurrentIndex(index);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === safeIndex
                    ? 'bg-primary'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.8 }}
                animate={{ scale: index === safeIndex ? 1.2 : 1 }}
                aria-label={`Ir a imagen ${index + 1}`}
            />
            ))}
        </div>
        )}

        {/* Thumbnails */}
        {total > 1 && (
            <motion.div
                className="flex justify-center gap-3 mt-4 px-4 overflow-x-auto pb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                role="list"
                aria-label="Miniaturas de imágenes"
            >
                {imagenes.map((img, index) => {
                    const isActive = index === safeIndex;
                    return (
                    <motion.button
                        key={img.id ?? `${img.nombre}-${index}`}
                        onClick={() => {
                        setDirection(index > safeIndex ? 1 : -1);
                        setCurrentIndex(index);
                        }}
                        className={`relative shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        isActive
                            ? 'border-primary shadow-lg shadow-primary/20'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                        whileHover={{ scale: 1.08, y: -3 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ y: isActive ? -4 : 0 }}
                        role="listitem"
                        aria-current={isActive ? 'true' : 'false'}
                        aria-label={`Miniatura ${index + 1}`}
                    >
                        <img
                            src={img.nombre}
                            alt={img.alt || `Miniatura ${index + 1}`}
                            className="w-14 h-14 sm:w-16 sm:h-16 object-cover"
                        />
                            {isActive && (
                        <motion.div
                            layoutId="thumbnail-indicator"
                            className="absolute inset-0 bg-primary/10"
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                        )}
                    </motion.button>
                    );
                })}
            </motion.div>
        )}
    </div>
    );
}