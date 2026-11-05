import { api } from "./client"

// Cada función llama a un endpoint del backend y devuelve solo "data".
// El backend responde siempre { message, data }, por eso hacemos r.data.data.

const datos = (promesa) => promesa.then((r) => r.data.data)

export const authApi = {
  login: (correo, contrasena) => datos(api.post("/auth/login", { correo, contrasena })),
  registro: (form) => datos(api.post("/auth/register", form)),
  yo: () => datos(api.get("/auth/me")),
  logout: () => api.post("/auth/logout"),
  recuperar: (correo) => api.post("/auth/recuperar", { correo }).then((r) => r.data.message),
  restablecer: (token, contrasena) => api.post("/auth/restablecer", { token, contrasena }).then((r) => r.data.message)
}

export const catalogoApi = {
  plataformas: () => datos(api.get("/plataformas")),
  // filtros = { plataforma, tipo }. Pedimos limit 100 para traer todo el catálogo de una vez.
  productos: (filtros = {}) => datos(api.get("/productos", { params: { limit: 100, ...filtros } })),
  producto: (id) => datos(api.get(`/productos/${id}`))
}

export const carritoApi = {
  obtener: () => datos(api.get("/carrito")),
  agregar: (productoId, cantidad) => datos(api.post("/carrito", { productoId, cantidad })),
  cambiarCantidad: (itemId, cantidad) => datos(api.patch(`/carrito/${itemId}`, { cantidad })),
  quitar: (itemId) => datos(api.delete(`/carrito/${itemId}`)),
  vaciar: () => datos(api.delete("/carrito")),
  renovar: (servicioId) => datos(api.post("/carrito/renovaciones", { servicioId }))
}

export const comprasApi = {
  // Paso 1: crea la compra "pendiente" con lo que hay en el carrito
  checkout: () => datos(api.post("/compras")),
  // Paso 2: pago simulado. metodoPago = "tarjeta" | "pse" | "nequi"
  pagar: (compraId, metodoPago) => datos(api.post(`/compras/${compraId}/pagar`, { metodoPago })),
  // Historial paginado: devuelve { data: [...], currentPage, totalPages, ... }
  mias: (page = 1) => datos(api.get("/compras/mias", { params: { page, limit: 10 } })),
  detalle: (id) => datos(api.get(`/compras/${id}`))
}

export const serviciosApi = {
  mios: () => datos(api.get("/servicios/mios"))
}
