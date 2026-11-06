import { ChevronDown, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { mensajeError } from "../../api/client"
import { adminApi } from "../../api/servicios"
import Aviso from "../../components/Aviso"
import Cargando from "../../components/Cargando"
import EstadoBadge from "../../components/EstadoBadge"
import PlataformaLogo from "../../components/PlataformaLogo"
import CampoSelect from "../../components/admin/CampoSelect"
import Paginacion from "../../components/admin/Paginacion"
import { formatoFecha, formatoFechaHora, formatoPrecio, nombreModalidad } from "../../utils/formato"
import { EncabezadoSeccion } from "./AdminLayout"

const METODOS = { tarjeta: "Tarjeta", pse: "PSE", nequi: "Nequi" }

const ESTADOS = [
  { valor: "", texto: "Todos los estados" },
  { valor: "pagada", texto: "Pagadas" },
  { valor: "pendiente", texto: "Pendientes" },
  { valor: "cancelada", texto: "Canceladas" }
]

export default function Ventas() {
  const [filtros, setFiltros] = useState({ estado: "", cliente: "", desde: "", hasta: "", page: 1 })
  const [cliente, setCliente] = useState("")
  const [resultado, setResultado] = useState(null)
  const [totales, setTotales] = useState(null)
  const [error, setError] = useState("")
  const [abierta, setAbierta] = useState(null)

  useEffect(() => {
    adminApi.resumen().then((r) => setTotales(r.ventas)).catch(() => setTotales(null))
  }, [])

  useEffect(() => {
    setError("")
    adminApi.compras({ ...filtros, limit: 10 })
      .then(setResultado)
      .catch((e) => setError(mensajeError(e)))
  }, [filtros])

  // Espera a que el admin deje de escribir antes de buscar el cliente
  useEffect(() => {
    const espera = setTimeout(() => setFiltros((f) => (f.cliente === cliente.trim() ? f : { ...f, cliente: cliente.trim(), page: 1 })), 400)
    return () => clearTimeout(espera)
  }, [cliente])

  const filtrar = (campo) => (e) => setFiltros({ ...filtros, [campo]: e.target.value, page: 1 })

  return (
    <>
      <EncabezadoSeccion titulo="Ventas" descripcion="Todas las compras de los clientes. Despliega una para ver sus productos." />

      {totales && (
        <div className="mb-6 grid gap-3 sm:grid-cols-2">
          <Total titulo="Pagado hoy" periodo={totales.hoy} />
          <Total titulo="Pagado este mes" periodo={totales.mes} />
        </div>
      )}

      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <input aria-label="Buscar cliente" placeholder="Cliente: nombre o correo" value={cliente} onChange={(e) => setCliente(e.target.value)} className="campo" />
        <CampoSelect aria-label="Filtrar por estado" value={filtros.estado} onChange={filtrar("estado")} opciones={ESTADOS} />
        <label className="flex items-center gap-2 text-sm text-zinc-500">
          Desde <input type="date" value={filtros.desde} max={filtros.hasta || undefined} onChange={filtrar("desde")} className="campo [color-scheme:dark]" />
        </label>
        <label className="flex items-center gap-2 text-sm text-zinc-500">
          Hasta <input type="date" value={filtros.hasta} min={filtros.desde || undefined} onChange={filtrar("hasta")} className="campo [color-scheme:dark]" />
        </label>
      </div>

      {error && <Aviso tipo="error">{error}</Aviso>}
      {!resultado && !error && <Cargando texto="Cargando ventas..." />}

      {resultado && !error && resultado.total === 0 && <p className="py-16 text-center text-zinc-400">No hay compras con estos filtros.</p>}

      {resultado && !error && resultado.total > 0 && (
        <>
          <p className="mb-3 text-sm text-zinc-500">{resultado.total} compra{resultado.total === 1 ? "" : "s"}</p>
          <ul className="space-y-3">
            {resultado.data.map((compra) => (
              <li key={compra.id} className="superficie overflow-hidden">
                <button
                  onClick={() => setAbierta(abierta === compra.id ? null : compra.id)}
                  aria-expanded={abierta === compra.id}
                  className="flex w-full items-center gap-4 p-4 text-left hover:bg-white/5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">Compra #{compra.id} · {compra.cliente.nombre}</p>
                    <p className="truncate text-sm text-zinc-400">
                      {compra.cliente.correo} · {formatoFechaHora(compra.createdAt)} · {compra.cantidadItems} producto{compra.cantidadItems === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-light">{formatoPrecio(compra.total)}</p>
                    <EstadoBadge estado={compra.estado} />
                  </div>
                  <ChevronDown size={18} className={`shrink-0 text-zinc-400 transition ${abierta === compra.id ? "rotate-180" : ""}`} />
                </button>
                {abierta === compra.id && <DetalleVenta id={compra.id} />}
              </li>
            ))}
          </ul>
          <Paginacion resultado={resultado} onCambiar={(page) => setFiltros({ ...filtros, page })} />
        </>
      )}
    </>
  )
}

function Total({ titulo, periodo }) {
  return (
    <div className="superficie flex items-end justify-between gap-4 p-5">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{titulo}</p>
        <p className="mt-2 text-3xl font-light">{formatoPrecio(periodo.total)}</p>
      </div>
      <p className="text-sm text-zinc-400">{periodo.compras} compra{periodo.compras === 1 ? "" : "s"}</p>
    </div>
  )
}

function DetalleVenta({ id }) {
  const [compra, setCompra] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    adminApi.compra(id).then(setCompra).catch((e) => setError(mensajeError(e)))
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
              <p className="text-zinc-400">{item.cantidad} x {formatoPrecio(item.precioUnitario)} · {item.producto.duracionDias} días</p>
              {item.servicios.length > 0 && (
                <p className="mt-1 text-xs text-zinc-500">
                  Servicios: {item.servicios.map((s) => `#${s.id} vence ${formatoFecha(s.fechaVencimiento)}`).join(", ")}
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
        <span className="text-lg font-light">Total {formatoPrecio(compra.total)}</span>
      </div>
    </div>
  )
}
