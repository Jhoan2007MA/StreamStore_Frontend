import { BellRing, ShieldCheck, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { mensajeError } from "../api/client"
import { catalogoApi } from "../api/servicios"
import Aviso from "../components/Aviso"
import Cargando from "../components/Cargando"
import SelectorCantidad from "../components/SelectorCantidad"
import VisualPlataforma from "../components/VisualPlataforma"
import { useAgregarAlCarrito } from "../hooks/useAgregarAlCarrito"
import { formatoPrecio, nombreModalidad } from "../utils/formato"

const GARANTIAS = [
  { icono: Zap, texto: "Entrega inmediata tras el pago" },
  { icono: ShieldCheck, texto: "Contraseñas cifradas, visibles solo para usted" },
  { icono: BellRing, texto: "Avisos antes del vencimiento" }
]

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
    setCantidad(1)
    catalogoApi.producto(id)
      .then(async (p) => {
        setProducto(p)
        // La plataforma trae la descripción y el número de pantallas por cuenta
        const plataformas = await catalogoApi.plataformas()
        setPlataforma(plataformas.find((x) => x.id === p.plataforma.id) ?? null)
      })
      .catch((e) => setError(mensajeError(e)))
  }, [id])

  if (error) return <div className="contenedor py-24"><Aviso tipo="error">{error}</Aviso></div>
  if (!producto) return <Cargando />

  const esCuenta = producto.tipo === "cuenta"
  const ultimas = !producto.agotado && producto.stock <= 2

  // Ficha técnica: filas con línea fina, como una ficha de reloj
  const ficha = [
    ["Modalidad", nombreModalidad(producto.tipo)],
    ["Duración", `${producto.duracionDias} días`],
    ["Perfiles", esCuenta ? `${plataforma?.maxPantallas ?? "—"} perfiles exclusivos` : "1 perfil con PIN personal"],
    ["Entrega", "Inmediata"],
    ["Disponibilidad", producto.agotado ? "Agotado" : `${producto.stock} ${producto.stock === 1 ? "unidad" : "unidades"}`]
  ]

  return (
    <div className="contenedor py-10 sm:py-16">
      {/* Migas de pan: dónde estoy */}
      <nav aria-label="Ruta" className="mb-10 flex items-center gap-2 text-xs tracking-wide text-zinc-500">
        <Link to="/catalogo" className="hover:text-tinta">Colección</Link>
        <span>/</span>
        <Link to={`/catalogo?plataforma=${producto.plataforma.id}`} className="hover:text-tinta">{producto.plataforma.nombre}</Link>
        <span>/</span>
        <span className="text-tinta/80">{nombreModalidad(producto.tipo)}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
        {/* IMAGEN: se queda fija (sticky) mientras se lee la ficha en pantallas grandes */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <VisualPlataforma nombre={producto.plataforma.nombre} id={producto.plataforma.id} variante={producto.tipo} zoom="220%" className="aspect-[4/5] rounded-2xl">
            {producto.agotado && (
              <span className="absolute left-6 top-6 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-[0.6875rem] uppercase tracking-[0.2em] backdrop-blur">Agotado</span>
            )}
          </VisualPlataforma>
        </div>

        {/* INFORMACIÓN Y COMPRA */}
        <div className="animate-aparecer">
          <p className="etiqueta">{nombreModalidad(producto.tipo)} · {producto.duracionDias} días</p>
          <h1 className="titulo-display mt-5 text-5xl sm:text-6xl">{producto.plataforma.nombre}</h1>
          {plataforma?.descripcion && <p className="mt-6 text-lg leading-relaxed text-suave">{plataforma.descripcion}</p>}

          <p className="mt-10 text-3xl font-light">{formatoPrecio(producto.precio)}</p>
          {ultimas && <p className="mt-2 text-sm text-brand">{producto.stock === 1 ? "Última unidad disponible" : `Últimas ${producto.stock} unidades disponibles`}</p>}

          <dl className="mt-10 border-t border-white/10">
            {ficha.map(([nombre, valor]) => (
              <div key={nombre} className="flex justify-between gap-6 border-b border-white/10 py-4 text-sm">
                <dt className="text-zinc-500">{nombre}</dt>
                <dd className="text-right text-tinta/90">{valor}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <SelectorCantidad valor={cantidad} onChange={setCantidad} max={producto.stock} deshabilitado={producto.agotado} />
            <button
              onClick={() => agregarAlCarrito(producto.id, cantidad)}
              disabled={producto.agotado || agregando}
              className="boton-primario flex-1"
            >
              {producto.agotado ? "No disponible" : agregando ? "Añadiendo..." : `Añadir a la selección · ${formatoPrecio(producto.precio * cantidad)}`}
            </button>
          </div>

          {mensaje && (
            <div className="mt-5" role="status">
              {mensaje.tipo === "exito" ? (
                <p className="flex flex-wrap items-center gap-4 text-sm text-tinta/80">
                  Añadido a su selección.
                  <Link to="/carrito" className="enlace-linea text-brand">Ver su selección</Link>
                </p>
              ) : (
                <Aviso tipo="error">{mensaje.texto}</Aviso>
              )}
            </div>
          )}

          <ul className="mt-12 space-y-4 border-t border-white/10 pt-8">
            {GARANTIAS.map(({ icono: Icono, texto }) => (
              <li key={texto} className="flex items-center gap-4 text-sm text-suave">
                <Icono size={18} strokeWidth={1.25} className="text-brand" /> {texto}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
