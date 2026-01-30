interface ProductoProps {
// propiedades de la etiqueta principal listado principal de la Api de productos, LISTADO DE TODOS LOS PRODUCTOS
         //imagen de lista
         //titulo del producto e insignia
            id: number,
            nombre: string,
            insing: string,
            color_insig: string | null,
            seo: string,
         //detalle del producto
            detalle:string | null,
         //imagen del producto
            prod_img: string | null,
            alt_prof: string,
         //controla la orientaciond de los div
            invertir?:boolean,
            espacio: string,
}

import { motion } from "framer-motion";
import { useAppStore } from "../../stores/useAppStore";

export default function Productos({ id, nombre, insing, seo,  detalle, prod_img, color_insig, espacio,  invertir = false}: ProductoProps) {
        const flexDirectionClass = invertir ? 'md:flex-row-reverse right-0' : 'md:flex-row'
        const selectProduct = useAppStore( (state) => state.selectProduct)
        return (
    <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`md:w-1/2 flex md:flex-row flex-col mt-10 ${flexDirectionClass} justify-center items-center m-auto md:gap-30 md:my-10`}
    >
      {/* Contenedor del detalle del producto */}
        <div className="md:gap-4 md:my-5">
            <motion.div
            initial={{ opacity: 0, x: invertir ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-row font-mundial my-5 justify-end items-end"
            >
                <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="63.369"
                    height="59.325"
                    viewBox="0 0 63.369 59.325"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <path
                        id="shape_SHAPE:shapes_07._Organic_Organic_-_Shape_10_"
                        data-name="shape [SHAPE:shapes/07. Organic/Organic - Shape 10]"
                        d="M657.5,2115.369c11.348,1.4,19.257,12.82,8.6,21.663-4.9,4.064-9.361,7.5-12.32,13.335a32.254,32.254,0,0,0-2.928,8.786c-.612,3.337-.911,6.491-3.045,9.285-8.5,11.132-25.363,5.953-29.482-6.329-1.1-3.274-.874-6.526-.986-9.918-.129-3.9-1.542-7.036-3.428-10.4-3.061-5.457-8.405-11.659-5.121-18.9,3.126-6.894,10.721-6.737,14.284-5.865,5.252,1.286,5.961,4.745,10.143,4.062C641.042,2119.811,649.255,2114.351,657.5,2115.369Z"
                        transform="translate(-607.756 -2115.243)"
                        fill={color_insig ?? "#36ad18"}
                    />
                </motion.svg>
                <div className="md:mx-6">
                    <h3 className="font-bold text-white text-right">{nombre}</h3>
                    <p className="font-mundial text-[#AFAEAE] font-extralight">
                        {insing} {espacio}
                        <span className="font-bold">{seo}</span>
                    </p>
                </div>
            </motion.div>
            <div className="md:block hidden">
                <p className="font-light text-[#AFAEAE] text-[16px] wrap-break-words w-full">
                    {detalle ?? "Sin Detalle"}
                </p>
            </div>
            <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[url('/bg_botton.svg')] bg-cover md:block w-[80%] mx-auto hidden  rounded-full py-3 mt-10 text-white text-sm text-center font-noto font-semibold tracking-wide"
                onClick={() => selectProduct(id)}
            >
            Ver o Comprar
            </motion.button>
        </div>

        {/* Contenedor de la imagen del producto */}
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card/50 backdrop-blur-sm p-3 md:w-screen md:mx-5 w-[90%] rounded-lg bg-white/10"
        >
            <motion.div
                className="w-[90%] m-auto mt-5 overflow-hidden rounded-md"
                whileHover="hover"
            >
                <motion.img
                    src={prod_img ?? "productos/pinteno.png"}
                    alt="product"
                    className="w-full h-auto object-cover"
                    initial={{ scale: 1 }}
                    variants={{
                    hover: {
                        scale: 1.08,
                        rotate: 2,
                        transition: {
                        duration: 0.4,
                        ease: "easeOut",
                        },
                    },
                    }}
                    whileInView={{
                    y: [0, -10, 0],
                    transition: {
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    },
                    }}
                />
            </motion.div>
            <div className="block md:hidden mt-6">
                <p className="font-heveltica-light font-light text-[#AFAEAE] text-[16px] wrap-break-word w-full">
                    {detalle ?? "Sin Detalle"}
                </p>
            </div>
            <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[url('/bg_botton.svg')] bg-cover block w-[80%] mx-auto md:hidden rounded-full py-3 mt-10 text-white text-sm text-center font-noto font-semibold tracking-wide"
                onClick={() => selectProduct(id)}
            >
                Ver o Comprar
            </motion.button>
        </motion.div>
        </motion.div>
    );
}


// interface ProductoProps {
//     // propiedades de la etiqueta principal listado principal de la Api de productos, LISTADO DE TODOS LOS PRODUCTOS
//         //imagen de lista
//         //titulo del producto e insignia
//             id: number,
//             nombre: string,
//             insing: string,
//             color_insig: string | null,
//             seo: string,e
//         //detalle del producto
//             detalle:string | null,
//         //imagen del producto
//             prod_img: string | null,
//             alt_prof: string,
//         //controla la orientaciond de los div
//             invertir?:boolean,
//             espacio: string
//
// import { useAppStore } from "../../stores/useAppStore
// export default function Productos({ id, nombre, insing, seo,  detalle, prod_img, color_insig, espacio,  invertir = false}: ProductoProps) {
//     const flexDirectionClass = invertir ? 'md:flex-row-reverse right-0' : 'md:flex-row
//     const selectProduct = useAppStore( (state) => state.selectProduct
//     return (
//         // contenedor principal 
//             <div className={`md:w-1/2 flex md:flex-row flex-col mt-10  ${flexDirectionClass} justify-center items-center m-auto md:gap-30 md:my-10`}>
//                 {/* contenedor del detalle del producto. */}
//                     <div className="md:gap-4 md:my-5">
//                         {/* contenedor de nombre */}
//                             <div className="flex flex-row font-mundial my-5 justify-end items-end">
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="63.369" height="59.325" viewBox="0 0 63.369 59.325">
//                                     <path id="shape_SHAPE:shapes_07._Organic_Organic_-_Shape_10_" 
//                                     data-name="shape [SHAPE:shapes/07. Organic/Organic - Shape 10]" 
//                                     d="M657.5,2115.369c11.348,1.4,19.257,12.82,8.6,21.663-4.9,4.064-9.361,7.5-12.32,13.335a32.254,32.254,0,0,0-2.928,8.786c-.612,3.337-.911,6.491-3.045,9.285-8.5,11.132-25.363,5.953-29.482-6.329-1.1-3.274-.874-6.526-.986-9.918-.129-3.9-1.542-7.036-3.428-10.4-3.061-5.457-8.405-11.659-5.121-18.9,3.126-6.894,10.721-6.737,14.284-5.865,5.252,1.286,5.961,4.745,10.143,4.062C641.042,2119.811,649.255,2114.351,657.5,2115.369Z" transform="translate(-607.756 -2115.243)" 
//                                     fill={ color_insig ?? '#36ad18'}/>
//                                 </svg>
//                                 <div className="md:mx-6">
//                                     <h3 className="font-bold text-white text-right">
//                                         {nombre} 
//                                     </h3>
//                                     <p className="font-mundial font-extralight text-[#AFAEAE]">
//                                         {insing} {espacio}
//                                         <span className="font-bold">
//                                         {seo}
//                                         </span>
//                                     </p>
//                                 </div>
//                             </div>
//                         <div className="md:block hidden">
//                             <p className="font-heveltica-light font-light text-[#AFAEAE] text-[16px] wrap-break-word w-full">
//                                 {detalle ?? "Sin Detalle"}
//                             </p>
//                         </div>
//                         <button
//                             type="button"
//                             className="bg-[url('/bg_fotter.svg')] bg-cover hidden md:block rounded-full py-4 mt-10 text-white text-sm text-center font-noto font-semibold tracking-wide w-[90%] cursor-pointer"
//                             onClick={() => selectProduct(id)}
//                         >
//                             Ver o Comporar
//                         </button>
//                     </div>
//                 {/* contenedor de la imagen del del producto */}
//                     <div className="bg-white/10 p-3  md:w-screen md:mx-5 w-[90%]">
//                         <div className="w-[90%] m-auto mt-5">
//                             <img src={prod_img ?? "productos/pinteno.png"} alt="alp_prod" />
//                         </div>
//                         <div className="block md:hidden mt-6">
//                             <p className="font-heveltica-light font-light text-[#AFAEAE] text-[16px] wrap-break-word w-full">
//                                 {detalle ?? "Sin Detalle"}
//                             </p>
//                         </div>
//                         <button
//                             type="button"
//                             className="bg-[url('/bg_fotter.svg')] bg-cover block w-[80%] mx-auto md:hidden rounded-full py-3 mt-10 text-white text-sm text-center font-noto font-semibold tracking-wide"
//                             onClick={() => selectProduct(id)}
//                         >
//                             Ver o Comprar
//                         </button>
//                     </div>
//             </div>
//     )
//