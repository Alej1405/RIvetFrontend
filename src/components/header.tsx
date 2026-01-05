import { useState, useEffect, useRef } from "react"
import { NavLink} from "react-router-dom"

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    //menu hamburguesa
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    //cierra el menu dando click fuera del modal
    const menuRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
        }, [isMenuOpen]);

    //controla el scroll para mostrar o no el boton
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
    const handleScroll = () => {
        setShowScrollTop(window.scrollY > 100); // muestra el botón si se ha hecho scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="p-8 flex justify-center items-center gap-8 fixed w-full bottom-0 md:bottom-auto md:top-0">
            <div>
                <NavLink
                to='/'>
                    <img src="logo_blanco.svg" alt="Logo Rivet" className="p-2"/>
                </NavLink>
            </div>                       
                <nav
                className={`${
                    isMenuOpen ? "hidden" : "hidden md:flex"
                } gap-10 text-white font-noto font-semibold text-xs p-2`}
                >
                <NavLink
                to='/'
                className={({ isActive })=>
                    isActive
                        ? 'pb-1 border-b-2 bg-white/5 px-2'
                        : 'pb-1 hover:border-b-2 hover:transition-all'}
                >
                    Inicio
                </NavLink>
                <NavLink
                to='/nosotros'
                className={({ isActive })=>
                    isActive
                        ? 'pb-1 border-b-2 bg-white/5 px-2'
                        : 'pb-1 hover:border-b-2 hover:transition-all'}
                >
                    Nosotros
                </NavLink>
                <NavLink
                to='Servicios'
                className={({ isActive })=>
                    isActive
                        ? 'pb-1 border-b-2 bg-white/5 px-2'
                        : 'pb-1 hover:border-b-2 hover:transition-all'}
                >
                    Servicios
                </NavLink>
                <NavLink
                to='/contactos'
                className={({ isActive })=>
                    isActive
                        ? 'pb-1 border-b-2 bg-white/5 px-2'
                        : 'pb-1 hover:border-b-2 hover:transition-all'}
                >
                    Contactos
                </NavLink>
                <NavLink
                to='postular'
                className={({ isActive })=>
                    isActive
                        ? 'pb-1 border-b-2 bg-white/5 px-2'
                        : 'pb-1 hover:border-b-2 hover:transition-all'}
                >
                    Trabaja con nosotros
                </NavLink>
            </nav>
            <div className="flex gap-8 font-noto text-xs">
                <NavLink
                    to="/catalogo"
                    className={({ isActive })=>
                    isActive
                        ? 'p-2 px-6 rounded-full text-[#FC0441] font-noto bg-white'
                        : 'p-2 px-6 rounded-full bg-[#FC0441] font-noto text-white'}
                    >
                    Cátalogo
                </NavLink>
                <a href="https://app.rivet-ec.com/cliente/login" className="p-2 px-6 rounded-full bg-[#ffffffa9] font-noto" >
                    Clientes
                </a>
            </div>
            <div className="md:hidden">
                <button
                onClick={toggleMenu}
                className="p-2 rounded-md"
                aria-label="Toggle menu"
                >
                <svg
                    className="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="white"
                    viewBox="0 0 24 24"
                    stroke="white"
                    aria-hidden="true"
                    
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                        isMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16m-7 6h7"
                    }
                    />
                </svg>
                </button>
            </div>
            {isMenuOpen && (
            <div
                ref={menuRef}
                className={`md:hidden fixed bottom-0 left-0 w-full bg-white/15 backdrop-blur-md px-4 py-6 z-40 transition-transform duration-300 transform ${
                    isMenuOpen ? "translate-y-0" : "translate-y-full"
                }`}
                >
                <button
                    onClick={() => setIsMenuOpen(false)}
                    className="self-end p-2 text-white"
                    aria-label="Cerrar menú"
                    >
                    <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="white"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                <nav className="flex flex-col gap-4 text-white font-noto font-semibold text-sm w-1/2">
                    <NavLink
                        to="/" 
                        className={({ isActive })=>
                        isActive
                            ? 'pb-1 border-b-2 bg-white/5 px-2'
                            : 'pb-1 hover:border-b-2 hover:transition-all'}
                        onClick={() => setIsMenuOpen(false)}>
                            Inicio
                    </NavLink>
                    <NavLink
                        to="/nosotros" 
                        className={({ isActive })=>
                        isActive
                            ? 'pb-1 border-b-2 bg-white/5 px-2'
                            : 'pb-1 hover:border-b-2 hover:transition-all'}
                        onClick={() => setIsMenuOpen(false)}>
                            Nosotros
                    </NavLink>
                    <NavLink
                        to="/Servicios" 
                        className={({ isActive })=>
                        isActive
                            ? 'pb-1 border-b-2 bg-white/5 px-2'
                            : 'pb-1 hover:border-b-2 hover:transition-all'}
                        onClick={() => setIsMenuOpen(false)}>
                            Servicios
                    </NavLink>
                    <NavLink
                        to="/contactos" 
                        className={({ isActive })=>
                        isActive
                            ? 'pb-1 border-b-2 bg-white/5 px-2'
                            : 'pb-1 hover:border-b-2 hover:transition-all'}
                        onClick={() => setIsMenuOpen(false)}>
                            Contactos
                    </NavLink>
                    <NavLink
                        to="/postular" 
                        className={({ isActive })=>
                        isActive
                            ? 'pb-1 border-b-2 bg-white/5 px-2'
                            : 'pb-1 hover:border-b-2 hover:transition-all'}
                        onClick={() => setIsMenuOpen(false)}>
                            Trabaja con nosotros
                    </NavLink>
                </nav>
            </div>
            )}

            <div
            className={`fixed right-6 top-6 md:top-auto md:bottom-6 z-50 transition-opacity duration-500 ${
                showScrollTop ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            >
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="p-3 rounded-full bg-[#FC0441] text-white shadow-lg"
                aria-label="Volver al inicio"
            >
                ↑
            </button>
            </div>

        </div>
    )
}

