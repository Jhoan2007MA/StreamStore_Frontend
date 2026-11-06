import { ArrowLeft, CheckCircle2, CreditCard, Landmark, Lock, Smartphone } from "lucide-react"
import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { mensajeError } from "../api/client"
import { comprasApi } from "../api/servicios"
import Aviso from "../components/Aviso"
import Cargando from "../components/Cargando"
import PlataformaLogo from "../components/PlataformaLogo"
import { useCarrito } from "../context/CarritoContext"
import { formatoPrecio, nombreModalidad } from "../utils/formato"

const METODOS = [
  { valor: "tarjeta", texto: "Tarjeta", icono: CreditCard },
  { valor: "pse", texto: "PSE", icono: Landmark },
  { valor: "nequi", texto: "Nequi", icono: Smartphone }
]

// El checkout tiene 3 pasos, guardados en "paso":
//   "resumen"  → revisa el pedido y lo confirma (crea la compra PENDIENTE)
//   "pago"     → elige método y paga (el backend asigna cuentas/pantallas en una transacción)
//   "exito"    → compra pagada
export default function Checkout() {
  const { carrito, cargando, recargar } = useCarrito()
  const [paso, setPaso] = useState("resumen")
  const [compra, setCompra] = useState(null) // la compra que devuelve el backend
  const [metodo, setMetodo] = useState("tarjeta")
  const [error, setError] = useState("")
  const [enviando, setEnviando] = useState(false)

  const confirmarPedido = async () => {
    setEnviando(true)
    setError("")
    try {
      setCompra(await comprasApi.checkout())
      setPaso("pago")
    } catch (e) {
      setError(mensajeError(e))
    } finally {
      setEnviando(false)
    }
  }

  const pagar = async () => {
    setEnviando(true)
    setError("")
    try {
      setCompra(await comprasApi.pagar(compra.id, metodo))
      setPaso("exito")
      await recargar() // el backend vació el carrito; actualizamos el contador
    } catch (e) {
      // Ej: "Netflix pantalla se agotó..." → el backend deshizo TODO el pago (rollback)
      setError(mensajeError(e))
      await recargar().catch(() => {})
    } finally {
      setEnviando(false)
    }
  }

  // ---------- PASO 3: ÉXITO ----------
  if (paso === "exito") {
    return (
      <div className="contenedor max-w-xl py-24 text-center animate-aparecer">
        <CheckCircle2 size={64} className="mx-auto text-emerald-400" />
        <p className="etiqueta mt-6">Pedido confirmado</p>
        <h1 className="mt-4 titulo-display text-4xl sm:text-5xl">Gracias por su compra</h1>
        <p className="mt-2 text-zinc-400">
          Compra #{compra.id} por <span className="font-semibold text-white">{formatoPrecio(compra.total)}</span>.
          Tus accesos ya están listos y te enviamos la confirmación a tu correo.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/mi-cuenta" className="boton-primario">Ver mis servicios</Link>
          <Link to="/catalogo" className="boton-secundario">Seguir explorando</Link>
        </div>
      </div>
    )
  }

  if (cargando && carrito.items.length === 0) return <Cargando />
  // Si llega aquí con el carrito vacío (y no está pagando), lo devolvemos al carrito
  if (paso === "resumen" && carrito.items.length === 0) return <Navigate to="/carrito" replace />

  // En el paso "pago" mostramos los ítems de la compra creada; en "resumen", los del carrito
  const lineas = paso === "pago"
    ? compra.items.map((i) => ({ id: i.id, producto: i.producto, cantidad: i.cantidad, subtotal: i.subtotal, renovacion: i.renovacionDe }))
    : carrito.items.map((i) => ({ id: i.id, producto: i.producto, cantidad: i.cantidad, subtotal: i.subtotal, renovacion: i.renovacion }))
  const total = paso === "pago" ? compra.total : carrito.total

  return (
    <div className="contenedor max-w-3xl py-16 sm:py-20">
      <Link to="/carrito" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft size={16} /> Volver al carrito
      </Link>
      <p className="etiqueta mt-8">Finalizar compra</p>
      <h1 className="mt-4 titulo-display text-4xl sm:text-5xl">{paso === "resumen" ? "Confirme su pedido" : `Pedido n.º ${compra.id}`}</h1>

      {/* Indicador de pasos */}
      <ol className="mt-4 flex gap-2 text-sm">
        <li className={`rounded-full px-3 py-1 ${paso === "resumen" ? "bg-tinta text-black" : "border border-white/10 text-zinc-500"}`}>1. Pedido</li>
        <li className={`rounded-full px-3 py-1 ${paso === "pago" ? "bg-tinta text-black" : "border border-white/10 text-zinc-500"}`}>2. Pago</li>
      </ol>

      <div className="mt-6 space-y-4">
        <Aviso tipo="error">
          {error}
          {error && paso === "pago" && (
            <> <Link to="/carrito" className="font-semibold underline">Ajustar mi carrito</Link></>
          )}
        </Aviso>

        {/* RESUMEN DEL PEDIDO */}
        <section className="superficie p-5">
          <h2 className="etiqueta">Resumen</h2>
          <ul className="mt-4 divide-y divide-borde">
            {lineas.map((linea) => (
              <li key={linea.id} className="flex items-center gap-3 py-3">
                <PlataformaLogo nombre={linea.producto.plataforma.nombre} logoUrl={linea.producto.plataforma.logoUrl} tamano="sm" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{linea.producto.plataforma.nombre}</p>
                  <p className="text-sm text-zinc-400">
                    {nombreModalidad(linea.producto.tipo)} · {linea.producto.duracionDias} días · x{linea.cantidad}
                    {linea.renovacion && " · Renovación"}
                  </p>
                </div>
                <span className="font-semibold">{formatoPrecio(linea.subtotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex justify-between border-t border-borde pt-4 text-xl font-light">
            <span>Total</span><span>{formatoPrecio(total)}</span>
          </div>
        </section>

        {paso === "resumen" ? (
          <button
            onClick={confirmarPedido}
            disabled={enviando || !carrito.puedePagar}
            className="boton-primario w-full"
          >
            {enviando ? "Creando pedido..." : "Confirmar pedido"}
          </button>
        ) : (
          <section className="superficie p-5">
            <h2 className="font-semibold">Método de pago</h2>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {METODOS.map(({ valor, texto, icono: Icono }) => (
                <button
                  key={valor}
                  type="button"
                  onClick={() => setMetodo(valor)}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 text-sm transition ${metodo === valor ? "border-brand bg-brand/10" : "border-borde hover:border-zinc-500"}`}
                >
                  <Icono size={22} /> {texto}
                </button>
              ))}
            </div>
            <p className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
              <Lock size={14} /> Pago simulado: no se hace ningún cobro real.
            </p>
            <button
              onClick={pagar}
              disabled={enviando}
              className="boton-primario mt-5 w-full"
            >
              {enviando ? "Procesando pago..." : `Pagar ${formatoPrecio(total)}`}
            </button>
          </section>
        )}
      </div>
    </div>
  )
}
