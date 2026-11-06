import { AlertTriangle, RefreshCw, ShoppingCart, Trash2 } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { mensajeError } from "../api/client"
import Aviso from "../components/Aviso"
import Cargando from "../components/Cargando"
import PlataformaLogo from "../components/PlataformaLogo"
import SelectorCantidad from "../components/SelectorCantidad"
import { useCarrito } from "../context/CarritoContext"
import { formatoFecha, formatoPrecio, nombreModalidad } from "../utils/formato"

export default function Carrito() {
  const { carrito, cargando, cambiarCantidad, quitar, vaciar } = useCarrito()
  const [error, setError] = useState("")
  const [ocupado, setOcupado] = useState(false) // evita doble clic mientras el backend responde
  const navigate = useNavigate()

  // Envuelve cualquier acción: bloquea botones, limpia/guarda el error
  const ejecutar = async (accion) => {
    setOcupado(true)
    setError("")
    try {
      await accion()
    } catch (e) {
      setError(mensajeError(e))
    } finally {
      setOcupado(false)
    }
  }

  if (cargando && carrito.items.length === 0) return <Cargando texto="Cargando tu carrito..." />

  if (carrito.items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <ShoppingCart size={48} className="mx-auto text-zinc-600" />
        <h1 className="mt-6 titulo-display text-4xl">Su selección está vacía</h1>
        <p className="mt-2 text-zinc-400">Agrega cuentas o pantallas desde el catálogo.</p>
        <Link to="/catalogo" className="mt-10 boton-primario">Descubra la colección</Link>
      </div>
    )
  }

  return (
    <div className="contenedor max-w-6xl py-16 sm:py-20">
      <p className="etiqueta">Su selección</p>
      <h1 className="titulo-display mt-4 text-4xl sm:text-5xl">Mi selección</h1>
      <div className="mt-4"><Aviso tipo="error">{error}</Aviso></div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* LISTA DE ÍTEMS */}
        <ul className="space-y-3">
          {carrito.items.map((item) => {
            const { producto } = item
            const esRenovacion = item.renovacion !== null
            return (
              <li key={item.id} className="superficie p-4">
                <div className="flex items-start gap-3">
                  <PlataformaLogo nombre={producto.plataforma.nombre} logoUrl={producto.plataforma.logoUrl} tamano="sm" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{producto.plataforma.nombre}</h3>
                        <p className="text-sm text-zinc-400">
                          {nombreModalidad(producto.tipo)} · {producto.duracionDias} días · {formatoPrecio(producto.precio)} c/u
                        </p>
                      </div>
                      <button onClick={() => ejecutar(() => quitar(item.id))} disabled={ocupado} className="text-zinc-500 hover:text-red-400" aria-label="Quitar">
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {esRenovacion && (
                      <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-brand/15 px-2 py-0.5 text-xs text-brand">
                        <RefreshCw size={12} /> Renovación · vence {formatoFecha(item.renovacion.fechaVencimiento)}
                      </p>
                    )}

                    {/* Avisos de stock: el carrito no aparta unidades, así que pueden agotarse */}
                    {!producto.disponible && (
                      <p className="mt-2 flex items-center gap-1 text-sm text-red-300"><AlertTriangle size={14} /> Este producto ya no está disponible. Quítalo para continuar.</p>
                    )}
                    {producto.disponible && !item.stockSuficiente && (
                      <p className="mt-2 flex items-center gap-1 text-sm text-amber-300">
                        <AlertTriangle size={14} /> Stock insuficiente: {item.stock === 0 ? "está agotado" : `solo quedan ${item.stock}`}. Ajusta la cantidad.
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between">
                      {esRenovacion ? (
                        <span className="text-sm text-zinc-400">1 unidad</span>
                      ) : (
                        <SelectorCantidad
                          valor={item.cantidad}
                          // Permitimos bajar aunque se pase del stock, para que pueda corregirlo
                          max={Math.max(item.stock, 1)}
                          deshabilitado={ocupado}
                          onChange={(nueva) => ejecutar(() => cambiarCantidad(item.id, nueva))}
                        />
                      )}
                      <span className="font-semibold">{formatoPrecio(item.subtotal)}</span>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
          <li>
            <button onClick={() => ejecutar(vaciar)} disabled={ocupado} className="text-sm text-zinc-500 hover:text-red-400">Vaciar selección</button>
          </li>
        </ul>

        {/* RESUMEN */}
        <aside className="h-fit superficie p-5 lg:sticky lg:top-24">
          <h2 className="etiqueta">Resumen</h2>
          <div className="mt-4 flex justify-between text-sm text-zinc-400">
            <span>Productos</span><span>{carrito.cantidadTotal}</span>
          </div>
          <div className="mt-3 flex justify-between border-t border-borde pt-3 text-xl font-light">
            <span>Total</span><span>{formatoPrecio(carrito.total)}</span>
          </div>
          {!carrito.puedePagar && (
            <p className="mt-3 text-sm text-amber-300">Corrige los avisos de stock para poder pagar.</p>
          )}
          <button
            onClick={() => navigate("/checkout")}
            disabled={!carrito.puedePagar || ocupado}
            className="boton-primario mt-5 w-full"
          >
            Continuar al pago
          </button>
          <Link to="/catalogo" className="mt-5 block text-center text-sm text-suave hover:text-tinta">Seguir explorando</Link>
        </aside>
      </div>
    </div>
  )
}
