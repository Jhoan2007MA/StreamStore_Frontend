import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { carritoApi } from "../api/servicios"
import { useAuth } from "./AuthContext"

const CarritoContext = createContext(null)

const CARRITO_VACIO = { items: [], cantidadTotal: 0, total: 0, puedePagar: false }

// Guarda el carrito del cliente. El carrito vive en la base de datos (backend);
// aquí solo tenemos una copia para mostrarla. Cada acción devuelve el carrito actualizado.
export function CarritoProvider({ children }) {
  const { esCliente } = useAuth()
  const [carrito, setCarrito] = useState(CARRITO_VACIO)
  const [cargando, setCargando] = useState(false)

  const recargar = useCallback(async () => {
    if (!esCliente) {
      setCarrito(CARRITO_VACIO)
      return
    }
    setCargando(true)
    try {
      setCarrito(await carritoApi.obtener())
    } finally {
      setCargando(false)
    }
  }, [esCliente])

  // Cuando cambia la sesión (login/logout) recargamos el carrito
  useEffect(() => {
    recargar().catch(() => {})
  }, [recargar])

  // Cada función llama al backend y reemplaza la copia local por la respuesta
  const agregar = async (productoId, cantidad = 1) => setCarrito(await carritoApi.agregar(productoId, cantidad))
  const cambiarCantidad = async (itemId, cantidad) => setCarrito(await carritoApi.cambiarCantidad(itemId, cantidad))
  const quitar = async (itemId) => setCarrito(await carritoApi.quitar(itemId))
  const vaciar = async () => setCarrito(await carritoApi.vaciar())
  const renovar = async (servicioId) => setCarrito(await carritoApi.renovar(servicioId))

  return (
    <CarritoContext.Provider value={{ carrito, cargando, recargar, agregar, cambiarCantidad, quitar, vaciar, renovar }}>
      {children}
    </CarritoContext.Provider>
  )
}

export const useCarrito = () => useContext(CarritoContext)
