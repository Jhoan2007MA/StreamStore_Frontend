# StreamStore · Frontend

Tienda web de cuentas y pantallas de streaming. Frontend en **React + Vite + Tailwind CSS**.
El backend (Node + Express + MySQL) está en otro repositorio y debe estar corriendo en `http://localhost:3000`.

## Instalación

```bash
npm install
cp .env.example .env
npm run dev
```

Abre **http://localhost:5173**.

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve la versión de producción para probarla |

## Variables de entorno

| Variable | Descripción |
| --- | --- |
| `VITE_WHATSAPP` | Número del botón flotante de WhatsApp (con indicativo, sin `+`) |

## Usuarios de prueba (vienen de la semilla del backend)

| Usuario | Contraseña | Rol |
| --- | --- | --- |
| `admin@streamstore.com` | `Admin123*` | Administrador |
| `cliente1@streamstore.com` | `Cliente123*` | Cliente |
| `cliente2@streamstore.com` | `Cliente123*` | Cliente |

## Cómo se conecta con el backend

`vite.config.js` tiene un **proxy**: toda petición a `/api/...` se reenvía a `http://localhost:3000/api/...`.
La sesión viaja en cookies httpOnly que pone el backend; el frontend no guarda el token.

## Estructura

```
src/
  main.jsx            punto de entrada: monta la app con el router y los contextos
  App.jsx             mapa de rutas (qué página va en cada URL)
  index.css           Tailwind y colores de la marca
  api/
    client.js         cliente HTTP (axios), renovación de sesión y mensajes de error
    servicios.js      una función por endpoint del backend
  context/
    AuthContext.jsx   usuario logueado, login, registro, logout
    CarritoContext.jsx carrito del cliente y contador del encabezado
  hooks/
    useAgregarAlCarrito.js  lógica del botón Agregar (login, errores de stock)
  components/         piezas reutilizables (tarjetas, formularios, avisos...)
    layout/           encabezado, footer, botón de WhatsApp
  pages/              una página por pantalla
  utils/formato.js    formato de precios y fechas
```
