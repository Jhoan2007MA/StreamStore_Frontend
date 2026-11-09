import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Cargando from "./Cargando"

// Envuelve las páginas de la tienda (inicio, catálogo, producto).
// El admin no compra nada: si entra a una de estas páginas lo mandamos a su panel.
export default function RutaTienda() {
  const { cargando, esAdmin } = useAuth()

  if (cargando) return <Cargando />
  if (esAdmin) return <Navigate to="/admin" replace />

  return <Outlet />
}
