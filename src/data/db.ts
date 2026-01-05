export interface Servicio {
    id: number,
    servicio: string,
    descripcion: string,
    footer: boolean
}
export const db:Servicio[] = [
    {
        id: 1,
        servicio: 'Maquilacion de licores',
        descripcion: 'Industrializamos tu producto y lo hacemos en grandes cantidades.',
        footer: true
    },
    {
        id: 2,
        servicio: 'Formulacion de Productos',
        descripcion: 'Desde la creacion de cerveza o cosmeticos, creamos la formula y desarrollamos tu producto.',
        footer: false
    },
    {
        id: 3,
        servicio: 'Salsas y aderezos',
        descripcion: 'Creamos el complemento perfecto para tus preparaciones.',
        footer: true
    },
    {
        id: 4,
        servicio: 'Bebidas y complementos',
        descripcion: 'Desarrollamos una serie de bebidas o sus complementos como pulpas naturales.',
        footer: false
    },
    {
        id: 5,
        servicio: 'Complementos de licor',
        descripcion: 'Mezclas listas para micheladas o el coctel de tu preferencias.',
        footer: false
    },
    {
        id: 6,
        servicio: 'Permisos ARCSA',
        descripcion: 'Legalizamos y asesoramos para tener todo en regla.',
        footer: true
    },
]