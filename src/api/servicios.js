import { api } from "./client"

// Cada función llama a un endpoint del backend y devuelve solo "data".
// El backend responde siempre { message, data }, por eso hacemos r.data.data.

const datos = (promesa) => promesa.then((r) => r.data.data)

export const authApi = {
  login: (correo, contrasena) => datos(api.post("/auth/login", { correo, contrasena })),
  // El registro ya no inicia sesión: devuelve { correo, verificado: false } y el backend envía un código al correo
  registro: (form) => datos(api.post("/auth/register", form)),
  // Si el código es correcto, el backend deja la sesión iniciada y devuelve { accessToken, user }
  verificar: (correo, codigo) => datos(api.post("/auth/verificar", { correo, codigo })),
  reenviarCodigo: (correo) => api.post("/auth/reenviar-codigo", { correo }).then((r) => r.data.message),
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

// Panel de administración. Los listados vienen paginados: { data: [...], currentPage, totalPages, total, ... }
// estado de plataformas y productos: 1 = activo, 0 = inactivo
export const adminApi = {
  resumen: () => datos(api.get("/admin/resumen")),
  ejecutarAlertas: () => datos(api.post("/admin/cron/ejecutar")),

  cuentas: (filtros = {}) => datos(api.get("/admin/cuentas", { params: sinVacios(filtros) })),
  crearCuenta: (cuenta) => datos(api.post("/admin/cuentas", cuenta)),

  plataformas: (filtros = {}) => datos(api.get("/admin/plataformas", { params: sinVacios(filtros) })),
  crearPlataforma: (plataforma) => datos(api.post("/admin/plataformas", plataforma)),
  editarPlataforma: (id, cambios) => datos(api.patch(`/admin/plataformas/${id}`, cambios)),
  estadoPlataforma: (id, estado) => datos(api.patch(`/admin/plataformas/${id}/estado`, { estado })),

  productos: (filtros = {}) => datos(api.get("/admin/productos", { params: sinVacios(filtros) })),
  crearProducto: (producto) => datos(api.post("/admin/productos", producto)),
  editarProducto: (id, cambios) => datos(api.patch(`/admin/productos/${id}`, cambios)),
  estadoProducto: (id, estado) => datos(api.patch(`/admin/productos/${id}/estado`, { estado })),

  compras: (filtros = {}) => datos(api.get("/admin/compras", { params: sinVacios(filtros) })),
  compra: (id) => datos(api.get(`/admin/compras/${id}`))
}

// Quita los filtros vacíos para no mandar ?estado=&plataforma= al backend
function sinVacios(filtros) {
  return Object.fromEntries(Object.entries(filtros).filter(([, valor]) => valor !== "" && valor !== null && valor !== undefined))
}
