
//importando componentes
    import Titulo from "../components/generals/titulo"
    import HeroSection from "../components/hero"
    import Productos from "../components/productos/productos"
//importando banners
    import Intermedio from "../components/banners/bannerIntermedio"
    import Mision from "../components/banners/bannerMision"
    import Contacto from "../components/banners/bannerContacto"
import Servicios from "../components/servicios/servicios"
import { useRef } from "react"

//importando el STORE GENERAL
import { useAppStore } from "../stores/useAppStore"
import {  useEffect, useState } from "react"

export default function Index() {
    const fetchProductos = useAppStore((state) => state.fetchProductos) //iterando los productos desde la API
    const fetchPerfil = useAppStore((state) => state.fetchPerfil) //consultando la informacion de la empresa.
    const fetchImagen = useAppStore((state) => state.fetchImagen)
    const Products = useAppStore((state) => state.productos)
    const perfil = useAppStore((state) => state.perfil)
    const Imagen = useAppStore((state) => state.imagen)

    
    useEffect( () => {
        fetchProductos() // itera los productos desde la API
        fetchPerfil()//consulta la informacion de la empresa desde la API
        fetchImagen()
    }, [fetchProductos, fetchPerfil, fetchImagen])

    //---------------------- Perfil sin map ---------------------
        //variables hero
    const titulo = useRef<string | null>(null);
    const seoTitulo = useRef<string | null>(null);
    const subtitulo = useRef<string | null>(null);
    const seoSubtitulo = useRef<string | null>(null);
    const industria = useRef<string | null>(null);
    const cta = useRef<string | null>(null);
    const mision = useRef<string | null>(null);
    const contacto = useRef<string | null>(null);

    useEffect( () => {
        if (perfil.data?.length>0){
            perfil.data.forEach((info) =>{
                titulo.current = info.data.titulo
                seoTitulo.current = info.data.seo_titulo
                subtitulo.current = info.data.subtitulo
                seoSubtitulo.current = info.data.seo_subtitulo
                industria.current = info.data.industria
                cta.current = info.data.cta
                mision.current = info.data.mision_empresarial
                contacto.current = info.data.parrafo_contacto
            })
        }
    })


    //---------------------- imagenes sin map ---------------------
        //variables de imagen 
    const [ImagenHeroRef, setImagenHeroRef] = useState<string | null>(null);
    const ImagenBannerIntermedioRef = useRef<string | null>(null);
    const ImagenBannerMisionRef = useRef<string | null>(null);
    const AltMisionRef = useRef<string | null>(null);
    const ServiciosImageRef = useRef<string |null>(null);
    
    useEffect( () => {
          //consultar la informacion de la APIs de imagenes para asignar en cada componente.
        if (Imagen?.data?.length>0){
            Imagen.data.forEach((item) => {
                const { seccion, url_image, alt_img } = item.data
                
                switch (seccion) {
                    case "Hero":
                        setImagenHeroRef(url_image);
                        break;
                    case "Banner intermedio":
                        ImagenBannerIntermedioRef.current = url_image;
                        break;
                    case "Mision banner":
                        ImagenBannerMisionRef.current = url_image;
                        AltMisionRef.current = alt_img
                        break;
                    case "Servicios":
                        ServiciosImageRef.current = url_image;
                        AltMisionRef.current = alt_img
                        break;
                }
            })
        }
    }, [Imagen])

    
    return (
        <div className=" font-noto font-bold">
                <HeroSection
                    titulo = {titulo.current}
                    seo_titulo = {seoTitulo.current}
                    subtitulo = {subtitulo.current}
                    seo_subtitulo = {seoSubtitulo.current}
                    industria = {industria.current}
                    cta = {cta.current}
                    imagen = {ImagenHeroRef}
                    />
            {/* titulo de la pagina de producto */}
            <Titulo 
                titulo = "Portafilio de productos"
                seo_1 = {["Hechos a mano", " respetan la tradicion, "]}
                general = {[" con procesos que respetan", " obteniendo un sabor unico en cada producto"]}
            />
            { Products.data.map( (products, index) =>(
                <Productos
                        key= {index}
                        id = {products.data.id}
                        nombre = {products.data.nombre}
                        insing = {products.data.insing}
                        color_insig = {products.data.color_insig}
                        seo = {products.data.seo_insing}
                        detalle = {products.data.detalle}
                        prod_img= {products.data.imagen}
                        alt_prof= {products.data.nombre}
                        espacio = " "
                        //controla la orientacion de los div
                        invertir={index % 2 !== 0}
                    />
            )) }
            <Intermedio 
                imagen = {ImagenBannerIntermedioRef.current}
                />
            <Mision 
                imagen = {ImagenBannerMisionRef.current}
                alt = { AltMisionRef.current}
                mision = {mision.current}
            />
            <Servicios
                imagen = {ServiciosImageRef.current}
            />
            <Contacto 
                parrafo={contacto.current}
                />

        </div>
    )
}
