interface HeroSectionProps {
    titulo: string | null,
    seo_titulo: string | null,
    subtitulo: string | null,
    seo_subtitulo: string | null,
    industria: string | null,
    cta: string | null,
    imagen: string | null
}

import { NavLink } from "react-router-dom"

export default function HeroSection({titulo, seo_titulo, subtitulo, seo_subtitulo, industria, cta, imagen}: HeroSectionProps) {
    
    
    return (
    <>
        <div className="bg-cover bg-no-repeat md:h-lvh" 
        style={{ backgroundImage: `url(${imagen})`}}>
            <div className="flex flex-col justify-center  h-full md:items-end items-center text-white md:mr-40">
                <h3 className="font-noto-light font-light md:text-[38px] text-[1.7em] mt-12">
                    {titulo}
                    <span className="font-noto-bold font-bold">{' '}{seo_titulo}</span>
                </h3>
                <p className="font-noto-light font-light md:text-[25px]">
                    {subtitulo}
                    <span className="font-noto-bold font-bold">{' '}{seo_subtitulo}</span>
                </p>
                <small className="font-noto-light font-light md:text-[20px]">
                    {industria}
                </small>
                <div className="mt-20 mb-10 p-3 md:py-3 py-2 md:w-1/5 w-[70%] text-center rounded-full bg-white/30 hover:bg-white/40 transition-all cursor-pointer text-sm font-noto-light font-light m-auto md:m-0">
                    <NavLink to="/nosotros">     
                        {cta}
                    </NavLink>
                </div>
            </div>
        </div>
    </>
    )
}
