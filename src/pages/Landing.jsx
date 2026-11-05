import { BellRing, CreditCard, KeyRound, ShieldCheck, ShoppingCart, Zap } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { catalogoApi } from "../api/servicios"
import PlataformaLogo from "../components/PlataformaLogo"
import { formatoPrecio } from "../utils/formato"

const PASOS = [
  { icono: ShoppingCart, titulo: "Elige y agrega", texto: "Escoge cuenta completa o una pantalla y agrégala al carrito. Puedes llevar varias." },
  { icono: CreditCard, titulo: "Paga en segundos", texto: "Confirma tu pedido y paga. Asignamos tus accesos al instante." },
  { icono: KeyRound, titulo: "Disfruta", texto: "En Mis servicios ves tu correo, contraseña, perfil y PIN, y cuándo vence." }
]

const PREGUNTAS = [
  { p: "¿Qué diferencia hay entre cuenta completa y pantalla?", r: "La cuenta completa es toda para ti, con todos sus perfiles. La pantalla es un perfil individual dentro de una cuenta compartida, con su propio PIN." },
  { p: "¿Cuándo recibo mis accesos?", r: "Apenas se confirma el pago. Los encuentras en Mi cuenta → Mis servicios, con un botón para copiarlos." },
  { p: "¿Cómo sé cuándo se me vence?", r: "En tu panel ves los días restantes de cada servicio. Además te enviamos un correo 3 días antes, 1 día antes y el día que vence." },
  { p: "¿Puedo renovar?", r: "Sí. Desde Mis servicios agregas la renovación al carrito y conservas la misma cuenta o pantalla." },
  { p: "¿Qué pasa si un producto está agotado?", r: "Se muestra la etiqueta Agotado y no se puede comprar hasta que carguemos más inventario." }
]

export default function Landing() {
  const [plataformas, setPlataformas] = useState([])
  const [preciosDesde, setPreciosDesde] = useState({})

  // Al cargar la página traemos las plataformas y los productos para mostrar el precio "desde"
  useEffect(() => {
    catalogoApi.plataformas().then(setPlataformas).catch(() => {})
    catalogoApi.productos().then(({ data }) => {
      const minimos = {}
      for (const producto of data) {
        const id = producto.plataforma.id
        minimos[id] = Math.min(minimos[id] ?? Infinity, producto.precio)
      }
      setPreciosDesde(minimos)
    }).catch(() => {})
  }, [])

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_rgba(124,92,255,0.35),_transparent_60%)]" />
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-borde bg-panel px-3 py-1 text-xs text-zinc-300">
            <Zap size={14} className="text-brand" /> Entrega inmediata
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
            Tus plataformas favoritas, <span className="text-brand">sin pagar de más</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-zinc-400 sm:text-lg">
            Compra una cuenta completa o solo la pantalla que necesitas. Recibe tus accesos al instante y te avisamos antes de que se venza.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/catalogo" className="rounded-xl bg-brand px-6 py-3 font-semibold hover:bg-brand-dark">Ver catálogo</Link>
            <a href="#como-funciona" className="rounded-xl border border-borde px-6 py-3 font-semibold hover:bg-panel">¿Cómo funciona?</a>
          </div>
        </div>
      </section>

      {/* PLATAFORMAS DESTACADAS */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-bold sm:text-3xl">Plataformas</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {plataformas.map((plataforma) => (
            <Link
              key={plataforma.id}
              to={`/catalogo?plataforma=${plataforma.id}`}
              className="group rounded-2xl border border-borde bg-panel p-5 transition hover:-translate-y-1 hover:border-brand"
            >
              <PlataformaLogo nombre={plataforma.nombre} logoUrl={plataforma.logoUrl} />
              <h3 className="mt-4 font-semibold">{plataforma.nombre}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{plataforma.descripcion}</p>
              {preciosDesde[plataforma.id] !== undefined && (
                <p className="mt-3 text-sm">Desde <span className="font-bold text-brand">{formatoPrecio(preciosDesde[plataforma.id])}</span></p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12">
        <h2 className="text-2xl font-bold sm:text-3xl">Cómo funciona</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {PASOS.map(({ icono: Icono, titulo, texto }, i) => (
            <div key={titulo} className="rounded-2xl border border-borde bg-panel p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-brand/20 text-brand"><Icono size={20} /></span>
                <span className="text-sm text-zinc-500">Paso {i + 1}</span>
              </div>
              <h3 className="mt-4 font-semibold">{titulo}</h3>
              <p className="mt-2 text-sm text-zinc-400">{texto}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 rounded-2xl border border-borde p-5 text-sm text-zinc-300">
            <ShieldCheck className="shrink-0 text-emerald-400" /> Tus contraseñas se guardan cifradas y solo tú puedes verlas.
          </div>
          <div className="flex items-start gap-3 rounded-2xl border border-borde p-5 text-sm text-zinc-300">
            <BellRing className="shrink-0 text-amber-400" /> Te avisamos por correo 3 días antes, 1 día antes y el día que vence.
          </div>
        </div>
      </section>

      {/* PREGUNTAS FRECUENTES: <details> abre y cierra solo, sin JavaScript */}
      <section className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Preguntas frecuentes</h2>
        <div className="mt-6 space-y-3">
          {PREGUNTAS.map(({ p, r }) => (
            <details key={p} className="group rounded-xl border border-borde bg-panel px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                {p}
                <span className="ml-4 text-brand transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-zinc-400">{r}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
