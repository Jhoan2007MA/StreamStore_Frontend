import { CalendarClock, Eye, EyeOff, RefreshCw, Tv } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { mensajeError } from "../../api/client"
import { serviciosApi } from "../../api/servicios"
import Aviso from "../../components/Aviso"
import BotonCopiar from "../../components/BotonCopiar"
import Cargando from "../../components/Cargando"
import EstadoBadge from "../../components/EstadoBadge"
import PlataformaLogo from "../../components/PlataformaLogo"
import { useCarrito } from "../../context/CarritoContext"
import { formatoFecha, nombreModalidad } from "../../utils/formato"

const FILTROS = [
  { valor: "", texto: "Todos" },
  { valor: "activo", texto: "Activos" },
  { valor: "por_vencer", texto: "Por vencer" },
  { valor: "vencido", texto: "Vencidos" }
]

export default function MisServicios() {
  const [servicios, setServicios] = useState(null) // null = todavía cargando
  const [error, setError] = useState("")
  const [filtro, setFiltro] = useState("")

  useEffect(() => {
    serviciosApi.mios()
      .then(setServicios)
      .catch((e) => setError(mensajeError(e)))
  }, [])

  if (error) return <Aviso tipo="error">{error}</Aviso>
  if (!servicios) return <Cargando texto="Cargando tus servicios..." />

  if (servicios.length === 0) {
    return (
      <div className="py-16 text-center">
        <Tv size={44} className="mx-auto text-zinc-600" />
        <p className="mt-4 text-zinc-400">Todavía no tienes servicios.</p>
        <Link to="/catalogo" className="mt-6 inline-block rounded-xl bg-brand px-6 py-3 font-semibold hover:bg-brand-dark">Ir al catálogo</Link>
      </div>
    )
  }

  // Filtramos aquí mismo (ya tenemos todos los servicios en memoria)
  const visibles = filtro ? servicios.filter((s) => s.estado === filtro) : servicios
  const contar = (estado) => (estado ? servicios.filter((s) => s.estado === estado).length : servicios.length)

  return (
    <>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {FILTROS.map((f) => (
          <button
            key={f.valor}
            onClick={() => setFiltro(f.valor)}
            className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm ${filtro === f.valor ? "border-brand bg-brand" : "border-borde text-zinc-300"}`}
          >
            {f.texto} ({contar(f.valor)})
          </button>
        ))}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {visibles.map((servicio) => <TarjetaServicio key={servicio.id} servicio={servicio} />)}
      </div>
      {visibles.length === 0 && <p className="py-10 text-center text-zinc-400">No hay servicios en este estado.</p>}
    </>
  )
}

// Color de la barra de días restantes según el estado
const COLOR_BARRA = { activo: "bg-emerald-500", por_vencer: "bg-amber-500", vencido: "bg-red-500" }

function TarjetaServicio({ servicio }) {
  const { plataforma, producto, credenciales, estado, diasRestantes } = servicio
  const [verContrasena, setVerContrasena] = useState(false)
  const [renovando, setRenovando] = useState(false)
  const [error, setError] = useState("")
  const { renovar } = useCarrito()
  const navigate = useNavigate()

  const esPantalla = producto.tipo === "pantalla"
  // Porcentaje de tiempo que le queda (para la barrita)
  const porcentaje = Math.max(0, Math.min(100, (diasRestantes / producto.duracionDias) * 100))

  // Texto que se copia con el botón "Copiar todo"
  const todo = [
    `${plataforma.nombre} (${nombreModalidad(producto.tipo)})`,
    `Correo: ${credenciales.correo}`,
    `Contraseña: ${credenciales.contrasena ?? ""}`,
    esPantalla && `Perfil: ${credenciales.perfil}`,
    esPantalla && `PIN: ${credenciales.pin}`
  ].filter(Boolean).join("\n")

  const renovarServicio = async () => {
    setRenovando(true)
    setError("")
    try {
      await renovar(servicio.id)
      navigate("/carrito")
    } catch (e) {
      setError(mensajeError(e))
      setRenovando(false)
    }
  }

  const textoDias =
    estado === "vencido" ? "Vencido" :
    diasRestantes === 0 ? "Vence hoy" :
    `${diasRestantes} día${diasRestantes === 1 ? "" : "s"} restante${diasRestantes === 1 ? "" : "s"}`

  return (
    <article className={`flex flex-col gap-4 rounded-2xl border bg-panel p-5 ${estado === "por_vencer" ? "border-amber-500/50" : "border-borde"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <PlataformaLogo nombre={plataforma.nombre} logoUrl={plataforma.logoUrl} />
          <div>
            <h3 className="font-semibold">{plataforma.nombre}</h3>
            <p className="text-sm text-violet-300">{nombreModalidad(producto.tipo)}</p>
          </div>
        </div>
        <EstadoBadge estado={estado} />
      </div>

      {/* Días restantes */}
      <div>
        <div className="flex justify-between text-sm">
          <span className="font-semibold">{textoDias}</span>
          <span className="text-zinc-400">{producto.duracionDias} días</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-borde">
          <div className={`h-full ${COLOR_BARRA[estado]}`} style={{ width: `${porcentaje}%` }} />
        </div>
      </div>

      {/* Credenciales */}
      <dl className="space-y-2 rounded-xl border border-borde bg-fondo p-4 text-sm">
        <Fila etiqueta="Correo" valor={credenciales.correo} />
        <div className="flex items-center justify-between gap-2">
          <dt className="text-zinc-400">Contraseña</dt>
          <dd className="flex items-center gap-3 font-mono">
            {verContrasena ? credenciales.contrasena : "••••••••"}
            <button onClick={() => setVerContrasena(!verContrasena)} className="text-zinc-400 hover:text-white" aria-label="Mostrar contraseña">
              {verContrasena ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <BotonCopiar texto={credenciales.contrasena ?? ""} />
          </dd>
        </div>
        {esPantalla && <Fila etiqueta="Perfil" valor={credenciales.perfil} />}
        {esPantalla && <Fila etiqueta="PIN" valor={credenciales.pin} />}
      </dl>

      <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
        <p className="flex items-center gap-1"><CalendarClock size={14} /> Compra: {formatoFecha(servicio.fechaCompra)}</p>
        <p className="text-right">Vence: <span className="text-zinc-200">{formatoFecha(servicio.fechaVencimiento)}</span></p>
      </div>

      <Aviso tipo="error">{error}</Aviso>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-borde pt-4 text-sm">
        <BotonCopiar texto={todo} etiqueta="Copiar credenciales" />
        {servicio.renovable && (
          <button onClick={renovarServicio} disabled={renovando} className="flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 font-semibold hover:bg-brand-dark disabled:opacity-60">
            <RefreshCw size={14} /> {renovando ? "..." : "Renovar"}
          </button>
        )}
      </div>
    </article>
  )
}

function Fila({ etiqueta, valor }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-zinc-400">{etiqueta}</dt>
      <dd className="flex min-w-0 items-center gap-3 font-mono">
        <span className="truncate">{valor}</span>
        <BotonCopiar texto={valor ?? ""} />
      </dd>
    </div>
  )
}
