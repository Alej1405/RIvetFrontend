
export default function Nosotros() {
    return (
        <>
            <div className="flex md:flex-row flex-col md:mt-25  mt-5 md:w-full  items-center md:gap-12">
                <div className=" md:w-1/2 w-[80%] md:p-12 md:space-y-6 space-y-2 flex flex-col justify-end place-items-end">
                    <h2 className="font-bold text-slate-200 md:text-3xl text-2xl md:right-0 text-center">
                        Inovamos con <span>PROPÓSITO </span>
                    </h2>
                    <p className="font-heveltica-light text-[1.1em] text-white md:text-right text-justify">
                        Somos una empresa de ingeniería alimenticia comprometida con el desarrollo económico local, impulsado el talento de mujeres emprendedoras en la elaboración de productos con identidad. 
                    </p>
                </div>
                <div className=" md:w-1/2 md:p-12 p-6">
                    <img src="nostros.svg" alt="" />
                </div>
            </div>
            <div className="flex md:flex-row flex-col gap-[,5rem] justify-center items-center w-full md:my-6 p-6">
                <div className="md:w-1/2 w-[85%] md:m-12 m-6  text-slate-200 bg-slate-200/30 p-12 rounded-xl backdrop-blur-xl hover:bg-slate-200/35 hover:cursor-pointer">
                    <h3 className="text-2xl font-heveltica-bold tracking-[.2em] font-bold">
                        Misión
                    </h3>
                    <p className="tracking-widest mt-1">
                        La mujer es parte esencial de cada producto y desarrollo. Buscamos ser una empresa que crea condiciones favorables para el desarrollo profesional y 
                    </p>
                </div>
                <div className="md:w-1/2 w-[85%] md:m-12 m-6  text-slate-200 bg-slate-200/30 p-12 rounded-xl backdrop-blur-xl hover:bg-slate-200/35 hover:cursor-pointer">
                    <h3 className="text-2xl font-heveltica-bold tracking-[.2em] font-bold">
                        Visión
                    </h3>
                    <p className="tracking-widest mt-1">
                        Innovación con responsabilidad, pensando en el desarrollo económico local.
                    </p>
                </div>
            </div>
        </>
    )
}
