interface BannerContactoProps {
    parrafo: string | null
}

import Contactos from "../formularios/contactos"
export default function Contacto( { parrafo }:BannerContactoProps) {
    return (
        <div className="text-white font-heveltica-light tracking-wide md:mx-6 md:space-y-6 flex flex-col md:mt-40">
            <h2 className="md:text-[3.5rem] text-3xl md:my-12 mx-3 md:mx-0">
                Estamos Cerca de ti
            </h2>
            <p className="w-[70%]  m-auto font-light md:text-[2rem] hidden md:block tracking-wide">
                {parrafo}
            </p>
            <Contactos/>
        </div>
    )
}
