//propiedad desl producto 
interface Producto {
    // propiedades de la etiqueta principal listado principal de la Api de productos, LISTADO DE TODOS LOS PRODUCTOS
        //imagen de lista
        //titulo del producto e insignia
            nombre: string,
            id: number,
}

interface ProductoFooterProps {
    producto: Producto []
}

export default function ProductoFooter({ producto }:ProductoFooterProps) {
    //consultando solamente 4 productos
    const productosLimit = producto.slice(0, 4)
    return (
        <>
            {productosLimit.map((producto)=>(
                <li
                    key={producto.id}
                    className="my-4">
                    <a href="#productos">
                        {producto.nombre}
                    </a>
                </li >
            ))}
        </>
    )
}
