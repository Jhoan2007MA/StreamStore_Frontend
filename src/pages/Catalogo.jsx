import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { mensajeError } from "../api/client"
import { catalogoApi } from "../api/servicios"
import Aviso from "../components/Aviso"
import Cargando from "../components/Cargando"
import ProductoCard from "../components/ProductoCard"

const MODALIDADES = [
  { valor: "", texto: "Todas" },
  { valor: "cuenta", texto: "Cuenta completa" },
  { valor: "pantalla", texto: "Pantalla" }
]

export default function Catalogo() {
  // Guardamos los filtros en la URL (?plataforma=1&tipo=pantalla) para poder compartir el enlace
  const [params, setParams] = useSearchParams()
  const plataforma = params.get("plataforma") ?? ""
  const tipo = params.get("tipo") ?? ""

  const [plataformas, setPlataformas] = useState([])
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    catalogoApi.plataformas().then(setPlataformas).catch(() => {})
  }, [])

  // Cada vez que cambia un filtro, volvemos a pedir los productos al backend
  useEffect(() => {
    setCargando(true)
    setError("")
    const filtros = {}
    if (plataforma) filtros.plataforma = plataforma
    if (tipo) filtros.tipo = tipo
    catalogoApi.productos(filtros)
      .then(({ data }) => setProductos(data))
      .catch((e) => setError(mensajeError(e)))
      .finally(() => setCargando(false))
  }, [plataforma, tipo])

  const cambiarFiltro = (nombre, valor) => {
    const nuevos = new URLSearchParams(params)
    if (valor) nuevos.set(nombre, valor)
    else nuevos.delete(nombre)
    setParams(nuevos)
  }

  const chip = (activo) =>
    `whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition ${activo ? "border-brand bg-brand text-white" : "border-borde text-zinc-300 hover:border-zinc-500"}`

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">Catálogo</h1>
      <p className="mt-2 text-zinc-400">Elige plataforma y modalidad. El stock se actualiza en tiempo real.</p>

      {/* FILTROS */}
      <div className="mt-6 space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button className={chip(!plataforma)} onClick={() => cambiarFiltro("plataforma", "")}>Todas las plataformas</button>
          {plataformas.map((p) => (
            <button key={p.id} className={chip(plataforma === String(p.id))} onClick={() => cambiarFiltro("plataforma", String(p.id))}>
              {p.nombre}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {MODALIDADES.map((m) => (
            <button key={m.valor} className={chip(tipo === m.valor)} onClick={() => cambiarFiltro("tipo", m.valor)}>
              {m.texto}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTADOS */}
      <div className="mt-8">
        {cargando ? (
          <Cargando texto="Cargando productos..." />
        ) : error ? (
          <Aviso tipo="error">{error}</Aviso>
        ) : productos.length === 0 ? (
          <p className="py-16 text-center text-zinc-400">No hay productos con esos filtros.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {productos.map((producto) => <ProductoCard key={producto.id} producto={producto} />)}
          </div>
        )}
      </div>
    </div>
  )
}
