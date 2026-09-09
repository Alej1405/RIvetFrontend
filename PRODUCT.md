# Product

## Register

brand

## Users

Profesionales del negocio de alimentos y bebidas: distribuidores, compradores de canal,
dueños de marca que buscan quién les formule o maquile un producto. Gente que ya entiende
el rubro — no hay que explicarles qué es una maquila ni qué significa ARCSA.

Llegan a evaluar si Rivet es un proveedor serio y, en el caso de los distribuidores, a
ver si el margen les cierra. El trabajo que vienen a hacer: decidir si contactan.

## Product Purpose

Carta de presentación de **Rivet Ecuador, empresa de ingeniería en alimentos**, cuyo fin
es vender producto. No es una licorera: el licor es su producto de rotación urgente, no
su identidad.

Dos frentes:
1. **Capacidad** — formulación, producción y certificación. Vende a quien busca fabricante.
2. **Catálogo** — corto por naturaleza (2 productos hoy), organizado en dos categorías
   raíz: Alimentos y Bebidas. Se accede por una antesala de dos cards, para que la
   brevedad sea una decisión editorial y no una carencia.

**Éxito:** que un profesional entienda la capacidad de Rivet en segundos y que un
distribuidor vea el precio mayorista sin fricción. El precio de distribuidor se muestra
en público, con su cantidad mínima, porque el objetivo declarado es **empujar la compra
masiva**.

## Brand Personality

**Ingeniería primero.** Rigor técnico, precisión, sobriedad. El producto aparece como
**evidencia de capacidad**, no como protagonista de una campaña de trago.

Tono: directo, técnico, sin didactismo. Le habla a un par, no a un consumidor final.
Tres palabras: **preciso, sobrio, capaz.**

La atmósfera de "páramo místico" del sitio actual pertenece a la personalidad artesanal,
que quedó descartada como la que lidera.

## Anti-references

Las cuatro confirmadas por el cliente:

- **Una licorera.** Nada de estética de marca de trago, botellas por todos lados, tono
  de fiesta.
- **Un ecommerce genérico.** Nada de grillas de cards iguales, filtros, badges de
  descuento, estética de supermercado.
- **Un SaaS/startup.** Nada de gradientes, métricas gigantes, ilustraciones planas,
  glassmorphism decorativo.
- **El rivet-front actual.** Es referencia de contenido y de paleta, nunca de ejecución.

**Importante:** la anti-referencia a rivet-front aplica a su *ejecución* (layout,
atmósfera, movimiento). **No a su paleta ni a su fondo**, que son invariantes de marca.

## Design Principles

1. **El producto es evidencia, no campaña.** Cada pieza demuestra capacidad técnica.
   Si un elemento solo adorna, se corta.
2. **Hablarle a un par.** La audiencia entiende el negocio. Nada de explicar lo obvio ni
   de vender emoción donde corresponde un dato.
3. **La brevedad del catálogo es una decisión, no una carencia.** La antesala de dos
   categorías existe para que 2 productos no se lean como un catálogo vacío.
4. **El margen es el argumento.** El precio de distribuidor y su cantidad mínima se leen
   de un vistazo: es lo que empuja la compra masiva.
5. **Nada se inventa.** Todo dato viene de la API. Si el diseño necesita un campo que el
   ERP no devuelve, el diseño se cambia — no se inventa el dato.

## Accessibility & Inclusion

**WCAG AA**, confirmado por el cliente:

- Contraste ≥4.5:1 en texto normal, ≥3:1 en texto grande. Cuidado especial con
  `--color-muted-foreground` (#6a9aaa) sobre el fondo #07100f.
- Foco visible y navegación completa por teclado.
- `prefers-reduced-motion` respetado en toda animación, sin excepción.
- El nav inferior de mobile debe cumplir área táctil mínima (44×44).

## Invariantes técnicos

- **Fondo y paleta jamás cambian**: `#07100f` de fondo, teal `#00b6c9`, amarillo
  `#e8e857`. Nunca `bg-blue-*`.
- **Mobile: nav abajo**, con apariencia de app. Dos versiones responsive buenas; mobile
  recorta lo accesorio en lugar de encogerlo.
- **Animaciones sujetas al presupuesto de render.** Si tarda, el usuario abandona.
- **Datos**: múltiples slices acoplados en un store único, todo validado con Zod. El
  carril del CMS y el de ecommerce no se mezclan.
