import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { mensajeError } from "../api/client"
import { catalogoApi } from "../api/servicios"
import Aviso from "../components/Aviso"
import Cargando from "../components/Cargando"
import ProductoCard from "../components/ProductoCard"
import Revelar from "../components/Revelar"

const MODALIDADES = [
  { valor: "", texto: "Todas" },
  { valor: "cuenta", texto: "Cuenta completa" },
  { valor: "pantalla", texto: "Pantalla" }
]

// Pestaña de filtro: texto con línea inferior (en vez de botones de colores)
function Pestana({ activa, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={activa}
      className={`relative whitespace-nowrap pb-3 text-sm tracking-wide transition-colors duration-300 ${activa ? "text-tinta" : "text-zinc-500 hover:text-tinta/80"}`}
    >
      {children}
      <span className={`absolute inset-x-0 -bottom-px h-px origin-left bg-brand transition-transform duration-500 ease-lujo ${activa ? "scale-x-100" : "scale-x-0"}`} />
    </button>
  )
}

export default function Catalogo() {
  // Los filtros viven en la URL (?plataforma=1&tipo=pantalla) para poder compartir el enlace
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

  return (
    <div className="contenedor py-16 sm:py-24">
      <Revelar className="max-w-3xl">
        <p className="etiqueta">La colección</p>
        <h1 className="titulo-display mt-5 text-5xl sm:text-6xl">Plataformas y modalidades</h1>
        <p className="mt-6 text-lg leading-relaxed text-suave">Elija la plataforma y la forma de disfrutarla. La disponibilidad se actualiza en tiempo real.</p>
      </Revelar>

      {/* FILTROS */}
      <div className="mt-14 flex flex-col gap-6 border-b border-white/10 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex gap-7 overflow-x-auto [scrollbar-width:none]" role="group" aria-label="Filtrar por plataforma">
          <Pestana activa={!plataforma} onClick={() => cambiarFiltro("plataforma", "")}>Todas</Pestana>
          {plataformas.map((p) => (
            <Pestana key={p.id} activa={plataforma === String(p.id)} onClick={() => cambiarFiltro("plataforma", String(p.id))}>
              {p.nombre}
            </Pestana>
          ))}
        </div>
        <div className="flex gap-7 overflow-x-auto [scrollbar-width:none]" role="group" aria-label="Filtrar por modalidad">
          {MODALIDADES.map((m) => (
            <Pestana key={m.valor} activa={tipo === m.valor} onClick={() => cambiarFiltro("tipo", m.valor)}>{m.texto}</Pestana>
          ))}
        </div>
      </div>

      {/* RESULTADOS */}
      <div className="mt-12">
        {cargando ? (
          <Cargando texto="Preparando la colección" />
        ) : error ? (
          <Aviso tipo="error">{error}</Aviso>
        ) : productos.length === 0 ? (
          <p className="py-24 text-center text-suave">No hay productos con esta selección de filtros.</p>
        ) : (
          <>
            <p className="mb-8 text-sm text-zinc-500">{productos.length} {productos.length === 1 ? "resultado" : "resultados"}</p>
            <div className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {/* Los productos aparecen de inmediato con una entrada escalonada (no esperan al scroll) */}
              {productos.map((producto, i) => (
                <div key={producto.id} className="animate-aparecer" style={{ animationDelay: `${Math.min(i, 8) * 70}ms` }}>
                  <ProductoCard producto={producto} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
