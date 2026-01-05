interface InfoProps {
        name: string
        url: string | null
        telefono: string | null
        correo: string | null
        contacto: string | null
        icono: string
}
export default function Contactos( { name, url, telefono, correo, contacto, icono}:InfoProps) {
    return (
<>
    <a href={url ?? telefono ?? correo ?? contacto ?? '#'} target="_blank">
        <img src={icono} alt={name} />
    </a>
</>
    )
}