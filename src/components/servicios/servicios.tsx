interface ServiciosProps {
    imagen : string | null
}

import { useState } from "react"
import { db } from "../../data/db"

export default function Servicios( {imagen}:ServiciosProps) {

    

    //exportar los servicios y las descripciones
    const [data] = useState(db)

    return (
        <div className="bg-cover bg-no-repeat md:h-lvh bg-i mb-30 pb-12" id="servicios"
            style={{ backgroundImage: `url(${imagen})`}}>
            <div className="pt-7 pb-6">
                <h3 className="font-bold text-4xl tracking-[.2rem] font-heveltica-bold text-center  text-white ">
                    Servicios
                </h3>
                <p className="font-semibold md:block hidden text-sm text-center my-6 text-white tracking-[.15rem]">
                    Nuestra oferta es garantizada, se complementa con el asesoramiento tecnico para obtener un producto legalizado y listo para comercializar.
                </p>
            </div>
            <div className="flex flex-col justify-center items-start m-6 space-y-5">
                {data.map((servicio)=>{
                    const numeroWhatsApp = "593998993908"
                    const mensaje = `hola necesito información sobre el servicio:  ${servicio.servicio}`
                    const mensajeCodificado = encodeURIComponent(mensaje)
                    const enlaceWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`
                    return (
                        <div
                            key={servicio.id}
                            className="grid grid-cols-2 items-end w-full text-white/65 pb-3 border-b-[0.1px] border-slate-50/20 tracking-[.12em] space-y-4"
                        >
                            <div className="space-y-3">
                                <h3 className="text-sm">{servicio.servicio}</h3>
                                <p className="font-heveltica-light md:block hidden font-light text-sm">
                                    {servicio.descripcion}
                                </p>
                            </div>
                            <div className="flex justify-end mx-12 my-6">
                                <a
                                    className="p-3 px-5 bg-white/20 rounded-4xl text-xs font-semibold hover:bg-white/35 hover:transition-all"
                                    href={enlaceWhatsApp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Proforma
                                </a>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
