import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Cargando from "./Cargando"

// Envuelve las páginas que necesitan sesión.
// rol = "cliente" o "admin". Si no hay sesión, manda al login y recuerda a dónde quería ir.
export default function RutaProtegida({ rol }) {
  const { usuario, cargando, esAdmin, esCliente } = useAuth()
  const location = useLocation()

  if (cargando) return <Cargando />
  if (!usuario) return <Navigate to="/login" replace state={{ desde: location.pathname }} />
  if (rol === "admin" && !esAdmin) return <Navigate to="/" replace />
  if (rol === "cliente" && !esCliente) return <Navigate to="/" replace />

  return <Outlet />
}
