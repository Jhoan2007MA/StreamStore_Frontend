import { ArrowRight, ChevronDown, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { catalogoApi } from "../api/servicios"
import Carrusel from "../components/Carrusel"
import Revelar from "../components/Revelar"
import VisualPlataforma from "../components/VisualPlataforma"
import { useScrollY } from "../hooks/useScrollY"
import { formatoPrecio } from "../utils/formato"

const MODALIDADES = [
  {
    etiqueta: "Exclusividad total",
    titulo: "Cuenta completa",
    texto: "Todos los perfiles, solo para usted y los suyos.",
    a: "/catalogo?tipo=cuenta",
    nombre: "Max"
  },
  {
    etiqueta: "A su medida",
    titulo: "Pantalla individual",
    texto: "Un perfil propio, con su PIN personal.",
    a: "/catalogo?tipo=pantalla",
    nombre: "Netflix"
  },
  {
    etiqueta: "Tranquilidad",
    titulo: "Siempre a tiempo",
    texto: "Le avisamos 3 días antes, 1 día antes y el día del vencimiento.",
    a: "/#como-funciona",
    nombre: "Disney+"
  }
]

const PASOS = [
  { titulo: "Elija", texto: "Seleccione la plataforma y la modalidad que mejor le acompañe. Puede reunir varias en una sola selección." },
  { titulo: "Confirme", texto: "Revise su pedido y confirme el pago. La asignación de su acceso es inmediata y exclusiva." },
  { titulo: "Disfrute", texto: "Encuentre su correo, contraseña, perfil y PIN en Mis servicios, junto a la fecha de vencimiento." }
]

const COMPROMISOS = [
  { valor: "Inmediata", texto: "Entrega de accesos tras el pago" },
  { valor: "AES-256", texto: "Cifrado de cada contraseña" },
  { valor: "3 avisos", texto: "Antes de cada vencimiento" }
]

const PREGUNTAS = [
  { p: "¿Qué diferencia hay entre cuenta completa y pantalla?", r: "La cuenta completa es exclusivamente suya, con todos sus perfiles. La pantalla es un perfil individual dentro de una cuenta, con su propio PIN." },
  { p: "¿Cuándo recibo mis accesos?", r: "En el instante en que se confirma el pago. Los encuentra en Mi cuenta → Mis servicios, con un botón para copiarlos." },
  { p: "¿Cómo sé cuándo vence mi servicio?", r: "Su panel muestra los días restantes de cada servicio. Además le escribimos 3 días antes, 1 día antes y el día del vencimiento." },
  { p: "¿Puedo renovar?", r: "Sí. Desde Mis servicios añade la renovación a su selección y conserva la misma cuenta o pantalla." },
  { p: "¿Qué ocurre si un producto está agotado?", r: "Se indica con la etiqueta Agotado y vuelve a estar disponible en cuanto incorporamos nuevo inventario." }
]

export default function Landing() {
  const [plataformas, setPlataformas] = useState([])
  const [preciosDesde, setPreciosDesde] = useState({})
  // Traemos plataformas y productos (para mostrar el precio "desde")
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
      <Hero />

      {/* ================= DECLARACIÓN DE MARCA ================= */}
      <section id="introduccion" className="contenedor scroll-mt-20 py-28 text-center sm:py-40">
        <Revelar>
          <p className="etiqueta">La experiencia SH Vision</p>
          <h2 className="titulo-display mx-auto mt-6 max-w-3xl text-4xl sm:text-6xl">Sin atajos. Sin esperas.</h2>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-suave">
            Cada acceso se asigna de forma exclusiva y se protege con cifrado. Usted solo elige qué ver esta noche;
            del resto nos ocupamos nosotros.
          </p>
        </Revelar>
      </section>

      {/* ================= CARRUSEL DE PLATAFORMAS ================= */}
      <Carrusel
        etiqueta="La colección"
        titulo="Plataformas"
        accion={<Link to="/catalogo" className="enlace-linea hidden text-tinta/80 hover:text-tinta sm:inline-flex">Ver todo <ArrowRight size={14} /></Link>}
      >
        {plataformas.map((plataforma) => (
          <Link
            key={plataforma.id}
            to={`/catalogo?plataforma=${plataforma.id}`}
            className="group w-[78%] shrink-0 snap-start sm:w-[44%] lg:w-[calc((100%-4.5rem)/4)] lg:min-w-[280px]"
          >
            <VisualPlataforma nombre={plataforma.nombre} id={plataforma.id} className="flex aspect-[3/4] flex-col justify-end rounded-2xl p-7">
              {preciosDesde[plataforma.id] !== undefined && (
                <p className="etiqueta">Desde {formatoPrecio(preciosDesde[plataforma.id])}</p>
              )}
              <h3 className="titulo-display mt-3 text-3xl">{plataforma.nombre}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-tinta/70">{plataforma.descripcion}</p>
              <span className="enlace-linea mt-6 w-fit text-tinta">Descubra más</span>
            </VisualPlataforma>
          </Link>
        ))}
      </Carrusel>

      {/* ================= HISTORIAS / MODALIDADES ================= */}
      <section className="contenedor py-24 sm:py-32">
        <Revelar className="mb-12 max-w-2xl">
          <p className="etiqueta mb-4">Su forma de ver</p>
          <h2 className="titulo-display text-4xl sm:text-5xl">Elija cómo vivir cada historia</h2>
        </Revelar>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          {MODALIDADES.map((m, i) => (
            <Revelar key={m.titulo} retraso={i * 120}>
              <Link to={m.a} className="group block">
                <VisualPlataforma nombre={m.nombre} conLogo={false} zoom="200%" className="flex aspect-[4/5] flex-col justify-end rounded-2xl p-7 md:aspect-[3/4.4]">
                  <p className="etiqueta">{m.etiqueta}</p>
                  <h3 className="titulo-display mt-3 text-3xl">{m.titulo}</h3>
                  <p className="mt-2 text-sm text-tinta/70">{m.texto}</p>
                  <span className="enlace-linea mt-6 w-fit text-tinta">Descubra más</span>
                </VisualPlataforma>
              </Link>
            </Revelar>
          ))}
        </div>
      </section>

      {/* ================= CÓMO FUNCIONA ================= */}
      <section id="como-funciona" className="contenedor scroll-mt-24 py-24 sm:py-32">
        <Revelar className="mb-16 text-center">
          <p className="etiqueta mb-4">Cómo funciona</p>
          <h2 className="titulo-display text-4xl sm:text-5xl">Tres pasos. Ni uno más.</h2>
        </Revelar>
        <ol className="grid gap-12 md:grid-cols-3 md:gap-8">
          {PASOS.map((paso, i) => (
            <Revelar como="li" key={paso.titulo} retraso={i * 150} className="border-t border-white/10 pt-8">
              <span className="text-sm tabular-nums text-brand">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="titulo-display mt-4 text-2xl">{paso.titulo}</h3>
              <p className="mt-3 leading-relaxed text-suave">{paso.texto}</p>
            </Revelar>
          ))}
        </ol>

        {/* Compromisos: cifras que dan confianza técnica */}
        <div className="mt-24 grid gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] sm:grid-cols-3">
          {COMPROMISOS.map((c) => (
            <div key={c.valor} className="bg-fondo px-8 py-10 text-center">
              <p className="titulo-display text-3xl text-brand">{c.valor}</p>
              <p className="mt-2 text-sm text-suave">{c.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PREGUNTAS FRECUENTES ================= */}
      <section id="preguntas" className="contenedor scroll-mt-24 py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-[1fr_2fr]">
          <Revelar>
            <p className="etiqueta mb-4">Asistencia</p>
            <h2 className="titulo-display text-4xl sm:text-5xl">Preguntas frecuentes</h2>
          </Revelar>
          {/* <details> abre y cierra sin JavaScript. Solo líneas finas como separación */}
          <div className="border-t border-white/10">
            {PREGUNTAS.map(({ p, r }) => (
              <details key={p} className="group border-b border-white/10">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-light text-tinta/90 transition hover:text-tinta [&::-webkit-details-marker]:hidden">
                  {p}
                  <Plus size={18} strokeWidth={1.25} className="shrink-0 text-brand transition-transform duration-500 ease-lujo group-open:rotate-45" />
                </summary>
                <p className="max-w-2xl pb-6 leading-relaxed text-suave">{r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CIERRE ================= */}
      <section className="contenedor pt-8">
        <VisualPlataforma nombre="Prime Video" conLogo={false} zoom="160%" className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl px-6 py-20 text-center">
          <p className="etiqueta">SH Vision</p>
          <h2 className="titulo-display mt-5 max-w-2xl text-4xl sm:text-6xl">Su próxima historia comienza aquí</h2>
          <Link to="/catalogo" className="boton-primario mt-10">Explorar la colección</Link>
        </VisualPlataforma>
      </section>
    </>
  )
}

// Hero en su propio componente: así, al hacer scroll, solo se redibuja esta parte (parallax)
function Hero() {
  const scrollY = useScrollY()
  return (
    <section className="relative isolate flex h-[100svh] min-h-[620px] items-end overflow-hidden">
      {/* Parallax: la imagen baja más despacio que la página (0.3 de la velocidad) */}
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ transform: `translate3d(0, ${scrollY * 0.3}px, 0)` }}>
        {/* Zoom lento de entrada: empieza en 112% y termina en 100% durante 20 s */}
        <div className="absolute inset-0 animate-zoom-lento bg-[url('/fondo.jpg')] bg-cover bg-center" />
      </div>
      {/* Degradados de lectura: oscurecen abajo (texto) y un poco arriba (encabezado).
          El radial es una "sombra" ovalada detrás del texto: la imagen es muy cargada y sin ella el título se pierde */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-fondo via-black/70 to-black/55" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_55%_at_50%_72%,rgba(0,0,0,0.7),transparent)]" />

      <div className="contenedor pb-20 text-center [text-shadow:0_2px_24px_rgba(0,0,0,0.6)] sm:pb-24">
        <p className="etiqueta animate-aparecer" style={{ animationDelay: "200ms" }}>Entretenimiento sin concesiones</p>
        <h1 className="titulo-display mx-auto mt-6 max-w-4xl animate-aparecer text-5xl sm:text-7xl lg:text-8xl" style={{ animationDelay: "350ms" }}>
          El cine, a su manera.
        </h1>
        <p className="mx-auto mt-6 max-w-xl animate-aparecer text-base leading-relaxed text-tinta/75 sm:text-lg" style={{ animationDelay: "500ms" }}>
          Cuentas completas y pantallas individuales de sus plataformas favoritas. Entregadas al instante, cuidadas hasta el último día.
        </p>
        <div className="mt-10 flex animate-aparecer flex-col items-center justify-center gap-6 sm:flex-row" style={{ animationDelay: "650ms" }}>
          <Link to="/catalogo" className="boton-primario">Descubra la colección</Link>
          <a href="#como-funciona" className="enlace-linea text-tinta/90">Cómo funciona</a>
        </div>
      </div>

      {/* Indicador de scroll */}
      <a href="#introduccion" aria-label="Bajar" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-tinta/50 transition hover:text-tinta sm:block">
        <ChevronDown size={22} strokeWidth={1} className="animate-bounce" />
      </a>
    </section>
  )
}
