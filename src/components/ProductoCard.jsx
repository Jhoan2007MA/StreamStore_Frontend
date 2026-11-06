import { Link } from "react-router-dom"
import { useAgregarAlCarrito } from "../hooks/useAgregarAlCarrito"
import { formatoPrecio, nombreModalidad } from "../utils/formato"
import VisualPlataforma from "./VisualPlataforma"

// Tarjeta vertical del catálogo: la imagen ocupa casi todo, el texto se integra abajo.
// La compra rápida añade 1 unidad; para elegir cantidad está la ficha ("Descubra más").
export default function ProductoCard({ producto }) {
  const { agregarAlCarrito, agregando, mensaje } = useAgregarAlCarrito()
  const { plataforma, tipo, duracionDias, precio, stock, agotado } = producto
  const ultimas = !agotado && stock <= 2

  return (
    <article className="group flex flex-col">
      <Link to={`/productos/${producto.id}`} aria-label={`${plataforma.nombre}, ${nombreModalidad(tipo)}`}>
        <VisualPlataforma nombre={plataforma.nombre} id={plataforma.id} variante={tipo} className="flex aspect-[4/5] flex-col justify-end rounded-2xl p-6">
          {agotado && (
            <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[0.6875rem] uppercase tracking-[0.2em] text-tinta backdrop-blur">
              Agotado
            </span>
          )}
          <p className="etiqueta">{nombreModalidad(tipo)}</p>
          <h3 className="titulo-display mt-2 text-3xl">{plataforma.nombre}</h3>
        </VisualPlataforma>
      </Link>

      <div className="flex flex-1 flex-col px-1 pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-xl font-light">{formatoPrecio(precio)}</p>
          <p className="text-sm text-suave">{duracionDias} días</p>
        </div>
        {/* Stock: discreto. Solo resaltamos (en dorado) cuando quedan pocas unidades */}
        <p className={`mt-1 text-xs ${ultimas ? "text-brand" : "text-zinc-500"}`}>
          {agotado ? "Sin disponibilidad por ahora" : ultimas ? (stock === 1 ? "Última unidad" : `Últimas ${stock} unidades`) : `${stock} disponibles`}
        </p>

        <div className="mt-5 flex items-center justify-between gap-4">
          <button
            onClick={() => agregarAlCarrito(producto.id, 1)}
            disabled={agotado || agregando}
            className="boton-secundario px-5 py-2.5 text-[0.8125rem]"
          >
            {agregando ? "Añadiendo..." : "Añadir a la selección"}
          </button>
          <Link to={`/productos/${producto.id}`} className="enlace-linea text-[0.8125rem] text-suave hover:text-tinta">Descubra más</Link>
        </div>

        {mensaje && (
          <p role="status" className={`mt-3 text-xs ${mensaje.tipo === "error" ? "text-red-300" : "text-brand"}`}>
            {mensaje.tipo === "exito" ? "Añadido a su selección" : mensaje.texto}
          </p>
        )}
      </div>
    </article>
  )
}
