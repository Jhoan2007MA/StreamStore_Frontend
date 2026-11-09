import { Search, ShoppingBag, User } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useCarrito } from "../../context/CarritoContext"
import { useScrollY } from "../../hooks/useScrollY"
import Logo from "./Logo"
import MenuPantallaCompleta from "./MenuPantallaCompleta"

// Encabezado fijo en 3 columnas: [Menú] [Logo centrado] [Buscar · Cuenta · Selección]
// - En la portada empieza transparente (se ve la imagen) y al bajar se vuelve
//   negro translúcido con desenfoque (backdrop-blur), como un vidrio esmerilado.
export default function Header() {
  const { usuario, esAdmin } = useAuth()
  const { carrito } = useCarrito()
  const { pathname } = useLocation()
  const scrollY = useScrollY()
  const [menuAbierto, setMenuAbierto] = useState(false)
  // useCallback: la función es siempre "la misma" entre renders (el menú la usa en un useEffect)
  const cerrarMenu = useCallback(() => setMenuAbierto(false), [])

  // Al cambiar de página, cerramos el menú
  useEffect(() => setMenuAbierto(false), [pathname])

  const transparente = pathname === "/" && scrollY < 40
  const enlaceCuenta = usuario ? "/mi-cuenta" : "/login"
  const icono = "relative grid size-10 place-items-center rounded-full text-tinta/80 transition duration-300 hover:bg-white/5 hover:text-tinta"

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 border-b transition-all duration-700 ease-lujo ${
          // Línea recta y semitransparente que separa el encabezado del fondo, también en la portada
          transparente ? "border-white/15 bg-transparent" : "border-white/[0.06] bg-fondo/70 backdrop-blur-xl"
        }`}
      >
        <div className="contenedor grid h-20 grid-cols-[1fr_auto_1fr] items-center">
          {/* Izquierda: botón de menú con dos líneas finas */}
          <button
            onClick={() => setMenuAbierto(true)}
            className="group flex w-fit items-center gap-3 text-sm tracking-wide text-tinta/90 hover:text-tinta"
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
          >
            <span className="flex w-6 flex-col gap-[7px]">
              <span className="h-px w-6 bg-current" />
              <span className="h-px w-4 bg-current transition-all duration-500 ease-lujo group-hover:w-6" />
            </span>
            <span className="hidden sm:inline">Menú</span>
          </button>

          {/* Centro: logo */}
          <Logo />

          {/* Derecha: accesos rápidos */}
          <nav aria-label="Accesos rápidos" className="flex items-center justify-end gap-1">
            {/* El admin no compra: no ve la búsqueda del catálogo */}
            {!esAdmin && (
              <Link to="/catalogo" className={`${icono} hidden sm:grid`} aria-label="Buscar en el catálogo">
                <Search size={18} strokeWidth={1.5} />
              </Link>
            )}
            {/* El admin ya está en su panel: no necesita el acceso rápido a él */}
            {!esAdmin && (
              <Link to={enlaceCuenta} className={icono} aria-label={usuario ? "Mi cuenta" : "Iniciar sesión"}>
                <User size={18} strokeWidth={1.5} />
              </Link>
            )}
            {/* El admin no compra: no ve la bolsa */}
            {!esAdmin && (
              <Link to="/carrito" className={icono} aria-label={`Mi selección, ${carrito.cantidadTotal} productos`}>
                <ShoppingBag size={18} strokeWidth={1.5} />
                {carrito.cantidadTotal > 0 && (
                  <span className="absolute right-0.5 top-0.5 grid min-w-[18px] place-items-center rounded-full bg-brand px-1 text-[10px] font-semibold leading-[18px] text-black">
                    {carrito.cantidadTotal}
                  </span>
                )}
              </Link>
            )}
          </nav>
        </div>
      </header>

      <MenuPantallaCompleta abierto={menuAbierto} onCerrar={cerrarMenu} />
    </>
  )
}
