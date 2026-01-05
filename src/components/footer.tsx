import { NavLink } from "react-router-dom"

//importando el STORE GENERAL
import { useAppStore } from "../stores/useAppStore"
import {  useEffect } from "react"

//importacion de componentes
import Contactos from "./generals/contactos"
import ProductoFooter from "./productos/productoFooter"
import ServicioFooter from "./servicios/servicioFooter"

export default function Footer() {
    const fetchIfo = useAppStore((state) => state.fetchInfo)

    const productosRaw = useAppStore((state) => state.productos);

    // Si productosRaw tiene la forma { data: [...] }, extraemos solo el array
    const productos = productosRaw?.data?.map((item) => item.data) ?? [];



    const Info = useAppStore((state) => state.info)
    useEffect( () =>{
        fetchIfo()
    },[fetchIfo])
    return (
        //componente general del fotter
        <>
            <div className="bg-[url(../public/bg_fotter.svg)] bg-cover bg-center bg-no-repeat bg-scroll flex md:flex-row  md:justify-between text-white pt-6 font-noto flex-col md:items-center">
                {/* Componente de logo */}
                <div className="m-6 md:w-2/6 w-full">
                    <div className="w-2xl flex flex-row items-end">
                        <img src="Iso_tipo.svg" alt="Logo de rivet en color blanco" />
                        <p className="text-3xl font-bold">
                            ivet Ecuador
                        </p>
                    </div>
                    <div className="text-sm mt-5 font-light">
                        <h4>
                            Industria Alimentaria.
                        </h4>
                        <p className="text-[12px] mt-2">
                            Innovación con responsabilidad, pensando <br /> en el desarrollo ecónomico local.
                        </p>
                    </div>
                    {/* Botonoes de redes sociales NECESARIA LA CONSULTA DE API FOTTER */}
                    <div className="flex flex-row items-center gap-5 mt-6">
                        {Info.data.map((info, index)=>(
                        <Contactos
                            key = {index}
                            name = 'ejemplo'
                            url = {info.url}
                            telefono = {info.telefono}
                            correo = {info.correo}
                            contacto = {info.contacto}
                            icono = {info.icono}
                            />
                        ))}
                    </div>
                    <div className="md:p-3 p-1 w-[75%] m-auto md:mx-0 md:w-3/6 cursor-pointer hover:bg-white/50 transition-all rounded-full text-[#3F3F3F] text-sm/relaxed  bg-white/80 text-center mt-6 mb-6">
                        <NavLink 
                            to="/nosotros">
                            Conoce nuestra historia
                        </NavLink>
                    </div>
                </div>
                <div className="flex flex-row m-6 md:w-4/6 md:justify-end md:mr-24 gap-6">
                    <div className="md:mx-8">
                        <h3 className="md:text-center font-bold text-md">
                            Productos
                        </h3>
                        {/* API QUE MUESTRA SOLAMENTE LO PRODUCTOS PRINCIPALES O INSIGNIA */}
                        <ul className="gap-6 text-sm font-light">
                            <ProductoFooter
                                producto = {productos} 
                                />
                        </ul>
                    </div>
                    <div className="md:mx-8">
                        <h3 className="font-bold md:text-center text-md">
                            Servicios
                        </h3>
                        <ul className="gap-6 text-sm font-light">
                            <ServicioFooter/>
                        </ul>
                    </div>
                    <div className="md:mx-8 ">
                        <h3 className="font-bold md:text-center text-md">
                            Links de la Página.
                        </h3>
                        <ul className="gap-6 text-sm font-light">
                            <li className="my-4 hidden md:block">
                                <a href="">
                                    Noticias
                                </a>
                            </li > 
                            <li className="my-4 hidden md:block">
                                <a href="">
                                    Blog
                                </a>
                            </li>
                            <li className="my-4 hidden md:block">
                                <a href="">
                                    Preguntas Frecuentes
                                </a>
                            </li>
                            <li className="p-2 cursor-pointer hover:bg-white/50 transition-all rounded-full text-[#3F3F3F] text-[11.5px]/relaxed  bg-white/80 text-center mt-6 mb-6">
                                <a href="https://app.rivet-ec.com/cliente/login" target="blank">
                                    Clientes System.
                                </a>
                            </li>
                        </ul>
                    </div>
                    
                </div>
            </div>
            {/* Derechos de elaboracion */}
            <div className="bg-[#171B29] flex flex-row items-center justify-between p-2">
                <div className="flex flex-row  md:text-white text-white/20 font-bold md:text-[13px] text-[9px] items-center gap-3 ml-10">
                    <img src="masha/masha.svg" alt="logo mashacorp" />
                    <p>© 2025 MashaCorp.  All Rights Reserved.</p>
                </div>
                <div className="md:text-white text-white/20 font-bold md:text-[12px] text-[8px] mr-10">
                    <ul className="flex flex-row gap-12 ">
                        <li>
                            <a href="">Privacy Polici</a>
                        </li>
                        <li>
                            <a href="">Terms of service</a>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}
