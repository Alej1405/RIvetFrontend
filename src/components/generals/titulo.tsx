interface TituloProps {
    titulo: string,
    seo_1 : string[],
    general: string[]
}

export default function Titulo( {titulo, seo_1, general}: TituloProps) {
    return (
        <div className="m-12 md:mt-42 mt-10 flex flex-col justify-center md:items-center text-white" id="productos">
            <h2 className="md:text-3xl text-2xl uppercase tracking-[3px]">
                {titulo}
            </h2>
            <p className=" md:w-4/6 w-[80%]  md:tracking-[5px] text-justify my-2 font-heveltica-light font-light">
                <span className="font-heveltica-bold font-bold">
                    {seo_1[0]}
                </span> 
                {general[0]}
                <span className="font-heveltica-bold font-bold">
                    {seo_1[1]}
                </span>
                {general[1]}
            </p>
        </div>
    )
}
