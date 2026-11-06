import { ChevronDown, Receipt, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { mensajeError } from "../../api/client"
import { comprasApi } from "../../api/servicios"
import Aviso from "../../components/Aviso"
import Cargando from "../../components/Cargando"
import EstadoBadge from "../../components/EstadoBadge"
import PlataformaLogo from "../../components/PlataformaLogo"
import { formatoFecha, formatoFechaHora, formatoPrecio, nombreModalidad } from "../../utils/formato"

const METODOS = { tarjeta: "Tarjeta", pse: "PSE", nequi: "Nequi" }

export default function MisCompras() {
  const [pagina, setPagina] = useState(1)
  const [resultado, setResultado] = useState(null) // { data, currentPage, totalPages, ... }
  const [error, setError] = useState("")
  const [abierta, setAbierta] = useState(null) // id de la compra desplegada

  // El historial viene paginado: pedimos la página actual cada vez que cambia
  useEffect(() => {
    setResultado(null)
    comprasApi.mias(pagina)
      .then(setResultado)
      .catch((e) => setError(mensajeError(e)))
  }, [pagina])

  if (error) return <Aviso tipo="error">{error}</Aviso>
  if (!resultado) return <Cargando texto="Cargando tus compras..." />

  if (resultado.total === 0) {
    return (
      <div className="py-16 text-center">
        <Receipt size={44} className="mx-auto text-zinc-600" />
        <p className="mt-4 text-zinc-400">Todavía no has hecho compras.</p>
        <Link to="/catalogo" className="mt-8 boton-primario">Descubra la colección</Link>
      </div>
    )
  }

  return (
    <>
      <ul className="space-y-3">
        {resultado.data.map((compra) => (
          <li key={compra.id} className="overflow-hidden superficie">
            <button
              onClick={() => setAbierta(abierta === compra.id ? null : compra.id)}
              className="flex w-full items-center gap-4 p-4 text-left hover:bg-white/5"
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold">Compra #{compra.id}</p>
                <p className="text-sm text-zinc-400">
                  {formatoFechaHora(compra.createdAt)} · {compra.cantidadItems} producto{compra.cantidadItems === 1 ? "" : "s"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-light">{formatoPrecio(compra.total)}</p>
                <EstadoBadge estado={compra.estado} />
              </div>
              <ChevronDown size={18} className={`shrink-0 text-zinc-400 transition ${abierta === compra.id ? "rotate-180" : ""}`} />
            </button>
            {abierta === compra.id && <DetalleCompra id={compra.id} />}
          </li>
        ))}
      </ul>

      {/* Paginación */}
      {resultado.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4 text-sm">
          <button onClick={() => setPagina(pagina - 1)} disabled={!resultado.previousPage} className="boton-secundario px-5 py-2 text-xs">Anterior</button>
          <span className="text-zinc-400">Página {resultado.currentPage} de {resultado.totalPages}</span>
          <button onClick={() => setPagina(pagina + 1)} disabled={!resultado.nextPage} className="boton-secundario px-5 py-2 text-xs">Siguiente</button>
        </div>
      )}
    </>
  )
}

// Se carga solo cuando el usuario despliega la compra
function DetalleCompra({ id }) {
  const [compra, setCompra] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    comprasApi.detalle(id).then(setCompra).catch((e) => setError(mensajeError(e)))
  }, [id])

  if (error) return <div className="p-4"><Aviso tipo="error">{error}</Aviso></div>
  if (!compra) return <Cargando texto="Cargando detalle..." />

  return (
    <div className="border-t border-borde bg-fondo/50 p-4">
      <ul className="divide-y divide-borde">
        {compra.items.map((item) => (
          <li key={item.id} className="flex items-start gap-3 py-3">
            <PlataformaLogo nombre={item.producto.plataforma.nombre} logoUrl={item.producto.plataforma.logoUrl} tamano="sm" />
            <div className="min-w-0 flex-1 text-sm">
              <p className="font-medium">
                {item.producto.plataforma.nombre} · {nombreModalidad(item.producto.tipo)}
                {item.renovacionDe && (
                  <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-brand/15 px-2 py-0.5 text-xs text-brand">
                    <RefreshCw size={10} /> Renovación
                  </span>
                )}
              </p>
              <p className="text-zinc-400">
                {item.cantidad} x {formatoPrecio(item.precioUnitario)} · {item.producto.duracionDias} días
              </p>
              {item.servicios.length > 0 && (
                <p className="mt-1 text-xs text-zinc-500">
                  Vence: {item.servicios.map((s) => formatoFecha(s.fechaVencimiento)).join(", ")}
                </p>
              )}
            </div>
            <span className="font-semibold">{formatoPrecio(item.subtotal)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex flex-wrap justify-between gap-2 border-t border-borde pt-3 text-sm">
        <span className="text-zinc-400">
          {compra.pagadaAt ? `Pagada el ${formatoFechaHora(compra.pagadaAt)}` : "Sin pagar"}
          {compra.metodoPago && ` · ${METODOS[compra.metodoPago] ?? compra.metodoPago}`}
        </span>
        <span className="font-light text-lg">Total {formatoPrecio(compra.total)}</span>
      </div>
    </div>
  )
}
