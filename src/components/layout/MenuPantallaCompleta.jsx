import { ArrowUpRight, X } from "lucide-react"
import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

// Menú que cubre toda la pantalla, con enlaces grandes que aparecen uno tras otro.
export default function MenuPantallaCompleta({ abierto, onCerrar }) {
  const { usuario, esAdmin, logout } = useAuth()
  const navigate = useNavigate()

  // Mientras está abierto: bloqueamos el scroll de la página y cerramos con la tecla Escape
  useEffect(() => {
    if (!abierto) return
    const cerrarConEscape = (e) => e.key === "Escape" && onCerrar()
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", cerrarConEscape)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", cerrarConEscape)
    }
  }, [abierto, onCerrar])

  const enlaces = [
    { a: "/", texto: "Inicio" },
    { a: "/catalogo", texto: "Colección" },
    { a: "/catalogo?tipo=cuenta", texto: "Cuentas completas" },
    { a: "/catalogo?tipo=pantalla", texto: "Pantallas" },
    usuario && !esAdmin && { a: "/mi-cuenta", texto: "Mis servicios" },
    usuario && !esAdmin && { a: "/mi-cuenta?tab=compras", texto: "Mis compras" },
    esAdmin && { a: "/admin", texto: "Administración" }
  ].filter(Boolean)

  const cerrarSesion = async () => {
    await logout()
    onCerrar()
    navigate("/")
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Menú principal"
      className={`fixed inset-0 z-50 bg-fondo/95 backdrop-blur-2xl transition-opacity duration-700 ease-lujo ${
        abierto ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="contenedor flex h-full flex-col">
        <div className="flex h-20 items-center">
          <button onClick={onCerrar} className="flex items-center gap-3 text-sm tracking-wide text-tinta/80 hover:text-tinta" aria-label="Cerrar menú">
            <X size={22} strokeWidth={1.25} /> <span className="hidden sm:inline">Cerrar</span>
          </button>
        </div>

        <div className="grid flex-1 content-center gap-12 pb-16 lg:grid-cols-[2fr_1fr]">
          {/* Solo dibujamos los enlaces cuando está abierto, así la animación se repite cada vez */}
          {abierto && (
            <nav aria-label="Secciones">
              <p className="etiqueta mb-8">SH Vision</p>
              <ul className="space-y-3 sm:space-y-4">
                {enlaces.map(({ a, texto }, i) => (
                  <li key={a} className="animate-aparecer" style={{ animationDelay: `${80 + i * 60}ms` }}>
                    <Link to={a} onClick={onCerrar} className="titulo-display group inline-flex items-baseline gap-4 text-4xl text-tinta/70 transition-colors duration-500 hover:text-tinta sm:text-5xl">
                      <span className="text-xs tabular-nums text-brand/70">{String(i + 1).padStart(2, "0")}</span>
                      {texto}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {abierto && (
            <aside className="animate-aparecer space-y-6 border-t border-borde pt-8 text-sm lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0" style={{ animationDelay: "450ms" }}>
              {usuario ? (
                <>
                  <div>
                    <p className="etiqueta mb-2">Su cuenta</p>
                    <p className="text-tinta">{usuario.nombre}</p>
                    <p className="text-suave">{usuario.correo}</p>
                  </div>
                  <button onClick={cerrarSesion} className="enlace-linea text-suave hover:text-tinta">Cerrar sesión</button>
                </>
              ) : (
                <div className="flex flex-col items-start gap-4">
                  <p className="etiqueta">Su cuenta</p>
                  <Link to="/login" onClick={onCerrar} className="enlace-linea text-tinta">Iniciar sesión</Link>
                  <Link to="/registro" onClick={onCerrar} className="enlace-linea text-suave hover:text-tinta">Crear una cuenta</Link>
                </div>
              )}
              <div>
                <p className="etiqueta mb-2">Asistencia</p>
                <a href={`https://wa.me/${import.meta.env.VITE_WHATSAPP ?? "573001234567"}`} target="_blank" rel="noreferrer" className="enlace-linea text-suave hover:text-tinta">
                  Hablar con un asesor <ArrowUpRight size={14} />
                </a>
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
