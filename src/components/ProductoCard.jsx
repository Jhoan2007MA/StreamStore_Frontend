import { Clock, ShoppingCart } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useAgregarAlCarrito } from "../hooks/useAgregarAlCarrito"
import { formatoPrecio, nombreModalidad } from "../utils/formato"
import PlataformaLogo from "./PlataformaLogo"
import SelectorCantidad from "./SelectorCantidad"

// Tarjeta de un producto en el catálogo
export default function ProductoCard({ producto }) {
  const [cantidad, setCantidad] = useState(1)
  const { agregarAlCarrito, agregando, mensaje } = useAgregarAlCarrito()
  const { plataforma, tipo, duracionDias, precio, stock, agotado } = producto

  return (
    <article className="relative flex flex-col gap-4 rounded-2xl border border-borde bg-panel p-5">
      {agotado && (
        <span className="absolute right-4 top-4 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase">Agotado</span>
      )}

      <Link to={`/productos/${producto.id}`} className="flex items-center gap-3">
        <PlataformaLogo nombre={plataforma.nombre} logoUrl={plataforma.logoUrl} />
        <div>
          <h3 className="font-semibold">{plataforma.nombre}</h3>
          <p className="text-sm text-violet-300">{nombreModalidad(tipo)}</p>
        </div>
      </Link>

      <div className="flex items-center justify-between text-sm text-zinc-400">
        <span className="flex items-center gap-1"><Clock size={14} /> {duracionDias} días</span>
        <span className={stock > 0 && stock <= 2 ? "text-amber-400" : ""}>
          {agotado ? "Sin stock" : `${stock} disponible${stock === 1 ? "" : "s"}`}
        </span>
      </div>

      <p className="text-2xl font-bold">{formatoPrecio(precio)}</p>

      <div className="mt-auto flex items-center justify-between gap-3">
        <SelectorCantidad valor={cantidad} onChange={setCantidad} max={stock} deshabilitado={agotado} />
        <button
          onClick={() => agregarAlCarrito(producto.id, cantidad)}
          disabled={agotado || agregando}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-3 py-2 text-sm font-semibold hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
        >
          <ShoppingCart size={16} /> {agregando ? "..." : "Agregar"}
        </button>
      </div>

      {mensaje && <p className={`text-sm ${mensaje.tipo === "error" ? "text-red-300" : "text-emerald-300"}`}>{mensaje.texto}</p>}
    </article>
  )
}
