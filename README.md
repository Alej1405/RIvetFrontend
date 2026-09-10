<div align="center">

<img src=".github/rivet-logo.png" alt="Rivet Ecuador" width="300">

# Rivet Ecuador

**Ingeniería alimentaria. Formulamos, producimos y certificamos.**

[![Sitio en vivo](https://img.shields.io/badge/rivet--ec.com-00b6c9?style=for-the-badge&logoColor=white)](https://rivet-ec.com)

![React](https://img.shields.io/badge/React-19-00b6c9?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-00b6c9?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-00b6c9?style=flat-square&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-00b6c9?style=flat-square&logo=tailwindcss&logoColor=white)

</div>

---

## Qué es

Sitio web de **Rivet Ecuador**, empresa de ingeniería en alimentos con planta en
Píntag, Quito. Presenta sus servicios de maquilación, formulación y gestión de
permisos sanitarios, y su catálogo de productos con precios para distribuidores.

Incluye una sección para los puntos de venta: cada local que comercializa los
productos tiene su propia página y su carta digital, con la identidad visual del
propio local y un código QR para compartirlas o imprimirlas.

Todo el contenido —textos, servicios, catálogo, precios y locales— lo administra
el cliente desde su panel. Este repositorio contiene únicamente la interfaz.

---

## Desarrollo

```sh
npm install
cp .env.example .env.local     # completa los valores
npm run dev
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compila para producción |
| `npm run preview` | Sirve la versión compilada |
| `npm run lint` | Revisa el código |
| `npm test` | Pruebas unitarias |
| `npm run e2e` | Pruebas de integración y adaptabilidad |

Las variables de entorno están documentadas en `.env.example`. Los valores reales
no se versionan; pídelos a quien mantiene el proyecto.

---

## Pruebas

Tres capas, todas ejecutándose en cada despliegue:

- **Unitarias** — lógica de precios, normalización de contacto y utilidades de color
- **Integración** — la interfaz contra la API real, sin datos simulados
- **Adaptabilidad** — móvil, tablet y escritorio: desbordes, áreas táctiles y legibilidad

---

## Despliegue

Cada cambio publicado en `main` se compila y se publica de forma automática, solo
si pasa las revisiones y las tres capas de pruebas.

---

<div align="center">

Desarrollado y mantenido por **Mashacorp**

</div>
