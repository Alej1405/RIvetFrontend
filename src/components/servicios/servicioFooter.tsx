//importar los servicios.
import { db } from "../../data/db"

export default function ServicioFooter() {

    //filtrar solamente por lo que tienen el footer true.
    const servicio = db.filter(db => db.footer)
    return (
        <>
            {servicio.map(serv=> (
            <li
                className="my-4"
                key={serv.id}>
                <a href="#servicios">
                    {serv.servicio}
                </a>
            </li > 
            ))}
        </>
    )
}
