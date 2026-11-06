import axios from "axios"

// Cliente HTTP único para toda la app. Todas las peticiones salen de aquí.
// baseURL "/api" + el proxy de vite.config.js = llegan a http://localhost:3000/api
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true // envía las cookies de sesión que pone el backend
})

// Si una petición responde 401 (sesión vencida), intentamos renovar la sesión
// una sola vez con /auth/refresh y repetimos la petición original.
let renovando = null

api.interceptors.response.use(
  (respuesta) => respuesta,
  async (error) => {
    const original = error.config
    const esRutaAuth = original?.url?.startsWith("/auth/")
    if (error.response?.status === 401 && !original._reintento && !esRutaAuth) {
      original._reintento = true
      try {
        renovando ??= api.post("/auth/refresh").finally(() => (renovando = null))
        await renovando
        return api(original)
      } catch {
        // No se pudo renovar: el usuario tendrá que iniciar sesión de nuevo
      }
    }
    return Promise.reject(error)
  }
)

// Saca un mensaje legible de cualquier error del backend.
// El backend responde los errores como { error: "mensaje", errors?: { campo: ["detalle"] } }
export const mensajeError = (error) => {
  const data = error?.response?.data
  if (data?.errors) {
    const detalles = Object.values(data.errors).flat().filter(Boolean)
    if (detalles.length) return detalles.join(". ")
  }
  if (data?.error) return data.error
  // Sin respuesta, o un 500/502 sin cuerpo (es lo que devuelve el proxy de Vite si el backend está apagado)
  if (!error?.response || (error.response.status >= 500 && !data)) {
    return "No hay conexión con el servidor. ¿Está encendido el backend?"
  }
  return "Ocurrió un error inesperado"
}
