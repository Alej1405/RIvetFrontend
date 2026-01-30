interface BannerIntermedioProps {
    imagen: string | null
}

export default function Intermedio({imagen}: BannerIntermedioProps) {
    return (
        <div className="relative w-full mt-25 md:mt-60 mb-40 p-[20%] md:p-0 md:py-30">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ 
                    backgroundImage: `url(${imagen})`, 
                    opacity: 0.7 }}>
            </div>

            <div className="relative z-10 md:h-full flex flex-col md:items-strat md:justify-start md:mx-20">
                <div className="w-full">
                    <img className="w-1/2" src="logo_blanco.svg" alt="Logo de rivet" />
                </div>
                <div className="mt-6">
                    <h4 className="uppercase font-extrabold text-[#E8E756] md:text-3xl text-2xl font-heveltica-bold tracking-widest">
                        una empresa con mision social
                    </h4>
                </div>
            </div>
        </div>
    )
}
