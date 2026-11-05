import { ArrowLeft, Check, Clock, ShoppingCart } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { mensajeError } from "../api/client"
import { catalogoApi } from "../api/servicios"
import Aviso from "../components/Aviso"
import Cargando from "../components/Cargando"
import PlataformaLogo from "../components/PlataformaLogo"
import SelectorCantidad from "../components/SelectorCantidad"
import { useAgregarAlCarrito } from "../hooks/useAgregarAlCarrito"
import { formatoPrecio, nombreModalidad } from "../utils/formato"

export default function ProductoDetalle() {
  const { id } = useParams() // el :id de la URL /productos/:id
  const [producto, setProducto] = useState(null)
  const [plataforma, setPlataforma] = useState(null)
  const [error, setError] = useState("")
  const [cantidad, setCantidad] = useState(1)
  const { agregarAlCarrito, agregando, mensaje } = useAgregarAlCarrito()

  useEffect(() => {
    setProducto(null)
    setError("")
    catalogoApi.producto(id)
      .then(async (p) => {
        setProducto(p)
        // Buscamos la plataforma para mostrar su descripción y número de pantallas
        const plataformas = await catalogoApi.plataformas()
        setPlataforma(plataformas.find((x) => x.id === p.plataforma.id) ?? null)
      })
      .catch((e) => setError(mensajeError(e)))
  }, [id])

  if (error) return <div className="mx-auto max-w-3xl px-4 py-10"><Aviso tipo="error">{error}</Aviso></div>
  if (!producto) return <Cargando />

  const esCuenta = producto.tipo === "cuenta"
  const beneficios = esCuenta
    ? [`Todos los perfiles (${plataforma?.maxPantallas ?? "-"} pantallas) son tuyos`, "Puedes compartirla con tu familia", "Correo y contraseña de la cuenta"]
    : ["Un perfil propio dentro de una cuenta", "Perfil con PIN personal", "La opción más económica"]

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Link to="/catalogo" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white">
        <ArrowLeft size={16} /> Volver al catálogo
      </Link>

      <div className="mt-6 grid gap-8 rounded-2xl border border-borde bg-panel p-6 md:grid-cols-2 md:p-8">
        <div>
          <PlataformaLogo nombre={producto.plataforma.nombre} logoUrl={producto.plataforma.logoUrl} tamano="lg" />
          <h1 className="mt-4 text-3xl font-bold">{producto.plataforma.nombre}</h1>
          <p className="text-lg text-violet-300">{nombreModalidad(producto.tipo)}</p>
          {plataforma?.descripcion && <p className="mt-3 text-zinc-400">{plataforma.descripcion}</p>}
          <ul className="mt-6 space-y-2 text-sm">
            {beneficios.map((b) => (
              <li key={b} className="flex items-center gap-2"><Check size={16} className="text-emerald-400" /> {b}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-5 rounded-xl border border-borde bg-fondo p-6">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-sm text-zinc-400"><Clock size={16} /> {producto.duracionDias} días</span>
            {producto.agotado ? (
              <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase">Agotado</span>
            ) : (
              <span className={`text-sm ${producto.stock <= 2 ? "text-amber-400" : "text-emerald-400"}`}>
                {producto.stock} disponible{producto.stock === 1 ? "" : "s"}
              </span>
            )}
          </div>

          <p className="text-4xl font-extrabold">{formatoPrecio(producto.precio)}</p>

          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Cantidad</span>
            <SelectorCantidad valor={cantidad} onChange={setCantidad} max={producto.stock} deshabilitado={producto.agotado} />
          </div>

          <div className="flex justify-between border-t border-borde pt-4 text-sm">
            <span className="text-zinc-400">Subtotal</span>
            <span className="font-semibold">{formatoPrecio(producto.precio * cantidad)}</span>
          </div>

          <button
            onClick={() => agregarAlCarrito(producto.id, cantidad)}
            disabled={producto.agotado || agregando}
            className="flex items-center justify-center gap-2 rounded-xl bg-brand py-3 font-semibold hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            <ShoppingCart size={18} /> {producto.agotado ? "Agotado" : agregando ? "Agregando..." : "Agregar al carrito"}
          </button>

          {mensaje && (
            <Aviso tipo={mensaje.tipo}>
              {mensaje.texto} {mensaje.tipo === "exito" && <Link to="/carrito" className="font-semibold underline">Ver carrito</Link>}
            </Aviso>
          )}
        </div>
      </div>
    </div>
  )
}
