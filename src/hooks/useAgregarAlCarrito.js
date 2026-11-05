import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { mensajeError } from "../api/client"
import { useAuth } from "../context/AuthContext"
import { useCarrito } from "../context/CarritoContext"

// Lógica del botón "Agregar al carrito", compartida por el catálogo y el detalle.
// - Si no hay sesión: lleva al login y luego vuelve a esta misma página.
// - Si es admin: no puede comprar.
// - Si es cliente: agrega y muestra el mensaje del backend (o el error, ej. sin stock).
export function useAgregarAlCarrito() {
  const { usuario, esCliente } = useAuth()
  const { agregar } = useCarrito()
  const navigate = useNavigate()
  const location = useLocation()
  const [agregando, setAgregando] = useState(false)
  const [mensaje, setMensaje] = useState(null)

  const agregarAlCarrito = async (productoId, cantidad) => {
    if (!usuario) {
      navigate("/login", { state: { desde: location.pathname } })
      return
    }
    if (!esCliente) {
      setMensaje({ tipo: "error", texto: "Las cuentas de administrador no pueden comprar" })
      return
    }
    setAgregando(true)
    setMensaje(null)
    try {
      await agregar(productoId, cantidad)
      setMensaje({ tipo: "exito", texto: "¡Agregado al carrito!" })
    } catch (error) {
      setMensaje({ tipo: "error", texto: mensajeError(error) })
    } finally {
      setAgregando(false)
    }
  }

  return { agregarAlCarrito, agregando, mensaje }
}
