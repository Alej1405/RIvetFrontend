interface BannerMisionProps {
    imagen: string | null
    alt: string | null
    mision: string | null
}
export default function Mision( {imagen, alt, mision}:BannerMisionProps) {
    return (
        <>
        <div className=" flex md:flex-row flex-col gap-12 items-center md:mt-60 md:mb-70 md:m-20 mb-20 mt-10">
            <div className="md:w-1/2">
                <img src={imagen ?? "sin imagen"} alt={alt ?? "Mision Rivet"} />
            </div>
            <div className="text-white md:w-1/2 w-[90%]">
                <h4 className="md:text-6xl text-2xl">
                    Nuestra Mision.
                </h4>
                <p className="wrap-break-word md:text-[20px] font-extralight text-pretty tracking-[.20em] leading-relaxed md:line-clamp-4">
                    {mision}
                </p>
                <div className="bg-[url('/bg_fotter.svg')] bg-cover  rounded-full p-4 mt-10 text-white text-sm text-center font-noto font-semibold tracking-wide w-1/2 m-auto">
                    Trabaja con Nosotros
                </div>
            </div>
        </div>
        </>
    )
}
