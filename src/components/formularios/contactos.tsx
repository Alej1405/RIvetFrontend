import { useRef } from "react";
import emailjs from "@emailjs/browser";

export default function Contactos() {

    const form = useRef<HTMLFormElement>(null)

    const sendEmail = (e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()

        if (!form.current) return

        emailjs

        .sendForm(
            "service_65h0pbw",
            "template_a382npg",
            form.current,
            "dvShG8wQh7bG8wOCr",
        )

        .then(
            (result) => {
                console.log(result)
                alert("Mensaje enviado")
                form.current?.reset()
            },
            (error)=>{
                console.log(error.text)
                alert("Error al enviar el mensaje")
            }
        )
    }

    return (
        <div className="bg-white/15 md:w-[70%] md:m-auto md:p-12 md:mt-20 md:mb-40 p-6 mb-25 mt-5">
            <div className="my-10 flex flex-col md:justify-end items-end">
                <sup className="left">
                    <img src="Iconos/contactos.svg" alt="" />
                </sup>
                <h2 className="left-0 font-heveltica-light text-xl tracking-[.10rem] mx-12">
                    Queremos saber de ti
                </h2>
            </div>
            <form ref={form} onSubmit={sendEmail} className="flex flex-col md:mx-35 mx-10">
                <label
                    htmlFor="name"
                    className="my-2 font-medium tracking-[.15rem]">
                        Con quien tenemos el gusto...?
                </label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    className="bg-white/20 p-3 text-sm tracking-[.12rem] font-medium focus:bg-slate-400/15"
                    placeholder="Queremos conocerte, dinos tú nombre."
                    autoComplete="false"
                    required
                />
                <label
                    htmlFor="email"
                    className="my-2 font-medium tracking-[.15rem]">
                        A que correo respondemos...?
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-white/20 p-3 text-sm tracking-[.12rem] font-medium focus:bg-slate-400/15"
                    placeholder="ejemplo@correo.com"
                    autoComplete="false"
                    required
                />
                <label
                    htmlFor="message"
                    className="my-2 font-medium tracking-[.15rem]">
                        En que podemos ayudarte...?
                </label>
                <textarea
                    name="message"
                    id="message"
                    className="bg-white/20 p-3 text-sm tracking-[.12rem] font-medium focus:bg-slate-400/15"
                    placeholder="Quiero cotizar un servicio o comprar un producto."
                    autoComplete="false"
                    required
                />
                <div className=" mt-12 w-full flex flex-row space-x-12 justify-center">
                    <button
                        type="submit"
                        className="bg-[url('/bg_fotter.svg')] px-12 bg-cover  rounded-full py-2 text-white text-sm text-center font-noto font-semibold tracking-wide cursor-pointer"
                    >
                        Enviar
                    </button>
                    <div className="bg-white/15 px-12 bg-cover  rounded-full py-2 text-white text-sm text-center font-noto font-semibold tracking-wide cursor-pointer flex flex-row space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                            <path id="Trazado_65" data-name="Trazado 65" d="M7.254,18.494l.725.423a8,8,0,1,0-2.894-2.893l.422.724-.653,2.4ZM2.005,22l1.352-4.969a10,10,0,1,1,3.614,3.613ZM8.392,7.308a3.385,3.385,0,0,1,.4,0c.054,0,.108.01.162.016a.506.506,0,0,1,.393.249q.447,1.015.868,2.041a.606.606,0,0,1-.093.536,4.353,4.353,0,0,1-.263.373c-.113.145-.356.411-.356.411a.324.324,0,0,0-.061.265.923.923,0,0,0,.1.2l.059.095a6.3,6.3,0,0,0,1.02,1.268c.12.117.237.236.363.346a6.014,6.014,0,0,0,1.57,1l.005,0,.252.109a1.429,1.429,0,0,0,.192.066.394.394,0,0,0,.072.011.35.35,0,0,0,.3-.142,12.131,12.131,0,0,1,.795-.933v0a.483.483,0,0,1,.378-.127.5.5,0,0,1,.177.041c.532.243,1.4.621,1.4.621l.582.261a.341.341,0,0,1,.191.265,2,2,0,0,1-.014.372,2.758,2.758,0,0,1-.188.733,1.158,1.158,0,0,1-.209.3,2.381,2.381,0,0,1-.331.288c-.082.061-.125.09-.125.09-.139.088-.217.131-.383.219a1.99,1.99,0,0,1-.833.231,5.3,5.3,0,0,1-.556.013l-.568-.087A9.448,9.448,0,0,1,9.85,14.4c-.226-.2-.435-.414-.648-.626a9.523,9.523,0,0,1-1.97-2.742A3.472,3.472,0,0,1,6.9,9.621a2.729,2.729,0,0,1,.565-1.679,2.261,2.261,0,0,1,.261-.306,1.293,1.293,0,0,1,.293-.228A.961.961,0,0,1,8.392,7.308Z" transform="translate(-2.001 -2)" fill="#0ac62e"/>
                        </svg>
                        <a
                            href="https://wa.me/593998993908?text=hola%20necesito%20informaci%C3%B3n%2C%20he%20visto%20su%20contacto%20en%20la%20web" target="_blank">
                                Mensaje
                        </a>
                    </div>
                </div>
            </form>
        </div>
    );
}
