import { BellRing } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { mensajeError } from "../../api/client"
import { adminApi } from "../../api/servicios"
import Aviso from "../../components/Aviso"
import Cargando from "../../components/Cargando"
import EstadoBadge from "../../components/EstadoBadge"
import PlataformaLogo from "../../components/PlataformaLogo"
import { formatoFechaHora, formatoPrecio } from "../../utils/formato"
import { EncabezadoSeccion } from "./AdminLayout"

const TIPOS_ALERTA = { "3_dias": "3 días", "1_dia": "1 día", vencido: "Vence hoy" }

export default function Resumen() {
  const [resumen, setResumen] = useState(null)
  const [error, setError] = useState("")

  const cargar = useCallback(() => {
    adminApi.resumen().then(setResumen).catch((e) => setError(mensajeError(e)))
  }, [])

  useEffect(cargar, [cargar])

  if (error) return <Aviso tipo="error">{error}</Aviso>
  if (!resumen) return <Cargando texto="Cargando resumen..." />

  const { ventas, servicios, plataformas, clientes } = resumen

  return (
    <>
      <EncabezadoSeccion titulo="Resumen" descripcion="Ventas pagadas, servicios y stock en tiempo real." />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Indicador titulo="Ventas de hoy" valor={formatoPrecio(ventas.hoy.total)} detalle={`${ventas.hoy.compras} compra${ventas.hoy.compras === 1 ? "" : "s"}`} />
        <Indicador titulo="Ventas del mes" valor={formatoPrecio(ventas.mes.total)} detalle={`${ventas.mes.compras} compra${ventas.mes.compras === 1 ? "" : "s"}`} />
        <Indicador titulo="Clientes" valor={clientes} detalle="registrados" />
        <Indicador titulo="Servicios activos" valor={servicios.activos} detalle={`${servicios.porVencer} por vencer · ${servicios.vencidos} vencidos`} />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <EstadoServicio estado="activo" cantidad={servicios.activos} />
        <EstadoServicio estado="por_vencer" cantidad={servicios.porVencer} />
        <EstadoServicio estado="vencido" cantidad={servicios.vencidos} />
      </div>

      <h3 className="mt-10 mb-4 text-xs uppercase tracking-[0.18em] text-zinc-500">Stock por plataforma</h3>
      <div className="superficie overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="text-left text-xs uppercase tracking-[0.12em] text-zinc-500">
            <tr className="border-b border-borde">
              <th className="p-4 font-medium">Plataforma</th>
              <th className="p-4 font-medium">Stock cuenta</th>
              <th className="p-4 font-medium">Stock pantalla</th>
              <th className="p-4 font-medium">Cuentas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borde">
            {plataformas.map((p) => (
              <tr key={p.id} className={p.estado === 0 ? "opacity-50" : ""}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <PlataformaLogo nombre={p.nombre} tamano="sm" />
                    <div>
                      <p className="font-medium">{p.nombre}</p>
                      {p.estado === 0 && <p className="text-xs text-zinc-500">Inactiva</p>}
                    </div>
                  </div>
                </td>
                <td className="p-4"><Stock valor={p.stock.cuenta} /></td>
                <td className="p-4"><Stock valor={p.stock.pantalla} /></td>
                <td className="p-4 text-zinc-400">
                  {p.cuentas.total} en total · {p.cuentas.disponibles} libres · {p.cuentas.parciales} parciales · {p.cuentas.vendidas} vendidas
                  {p.cuentas.inactivas > 0 && ` · ${p.cuentas.inactivas} inactivas`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EjecutarAlertas onTerminar={cargar} />
    </>
  )
}

function Indicador({ titulo, valor, detalle }) {
  return (
    <div className="superficie p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{titulo}</p>
      <p className="mt-3 text-3xl font-light">{valor}</p>
      <p className="mt-1 text-sm text-zinc-400">{detalle}</p>
    </div>
  )
}

function EstadoServicio({ estado, cantidad }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
      <EstadoBadge estado={estado} />
      <span className="text-xl font-light">{cantidad}</span>
    </div>
  )
}

function Stock({ valor }) {
  if (valor === 0) return <span className="text-red-300">Agotado</span>
  return <span className={valor <= 2 ? "text-amber-300" : ""}>{valor}</span>
}

// Botón para la demo: corre a mano la revisión diaria de vencimientos y muestra qué correos salieron
function EjecutarAlertas({ onTerminar }) {
  const [ejecutando, setEjecutando] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState("")

  const ejecutar = async () => {
    setEjecutando(true)
    setError("")
    try {
      setResultado(await adminApi.ejecutarAlertas())
      onTerminar()
    } catch (e) {
      setError(mensajeError(e))
    } finally {
      setEjecutando(false)
    }
  }

  return (
    <div className="superficie mt-10 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-medium">Alertas de vencimiento</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Se ejecutan solas todos los días a las 8:00. Con este botón las corres ahora mismo.
          </p>
        </div>
        <button onClick={ejecutar} disabled={ejecutando} className="boton-primario">
          <BellRing size={16} /> {ejecutando ? "Revisando..." : "Ejecutar ahora"}
        </button>
      </div>

      {error && <div className="mt-4"><Aviso tipo="error">{error}</Aviso></div>}

      {resultado && (
        <div className="mt-6 space-y-4 text-sm">
          <Aviso tipo="exito">
            Revisión del {formatoFechaHora(resultado.ejecutadaAt)}: {resultado.revisados} servicios revisados,{" "}
            {resultado.enviados.length} correos enviados, {resultado.omitidos} ya avisados antes
            y {resultado.vencidosMarcados} marcados como vencidos.
          </Aviso>
          {resultado.enviados.length > 0 && (
            <ListaCorreos titulo="Enviados" correos={resultado.enviados} />
          )}
          {resultado.fallidos.length > 0 && (
            <ListaCorreos titulo="Fallidos" correos={resultado.fallidos} error />
          )}
        </div>
      )}
    </div>
  )
}

function ListaCorreos({ titulo, correos, error }) {
  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-[0.18em] text-zinc-500">{titulo}</p>
      <ul className="divide-y divide-borde rounded-lg border border-borde">
        {correos.map((c) => (
          <li key={`${c.servicioId}-${c.tipo}`} className="flex flex-wrap justify-between gap-2 px-4 py-2">
            <span>{c.correo}</span>
            <span className={error ? "text-red-300" : "text-zinc-400"}>
              Servicio #{c.servicioId} · {TIPOS_ALERTA[c.tipo] ?? c.tipo}
              {c.motivo && ` · ${c.motivo}`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
