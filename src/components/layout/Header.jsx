import { LayoutDashboard, LogOut, Menu, ShoppingCart, User, X } from "lucide-react"
import { useState } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useCarrito } from "../../context/CarritoContext"
import Logo from "./Logo"

// Encabezado que aparece en todas las páginas: logo, menú, carrito con contador y acceso a la cuenta.
export default function Header() {
  const { usuario, esAdmin, logout } = useAuth()
  const { carrito } = useCarrito()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const navigate = useNavigate()

  const cerrarMenu = () => setMenuAbierto(false)

  const cerrarSesion = async () => {
    await logout()
    cerrarMenu()
    navigate("/")
  }

  // NavLink sabe si su ruta está activa y nos deja cambiar el estilo
  const enlace = ({ isActive }) => `block py-2 ${isActive ? "text-white" : "text-zinc-400 hover:text-white"}`

  const enlaces = (
    <>
      <NavLink to="/" end className={enlace} onClick={cerrarMenu}>Inicio</NavLink>
      <NavLink to="/catalogo" className={enlace} onClick={cerrarMenu}>Catálogo</NavLink>
      {usuario && !esAdmin && <NavLink to="/mi-cuenta" className={enlace} onClick={cerrarMenu}>Mi cuenta</NavLink>}
      {esAdmin && <NavLink to="/admin" className={enlace} onClick={cerrarMenu}>Admin</NavLink>}
    </>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-borde bg-fondo/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Logo />

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">{enlaces}</nav>

        <div className="flex items-center gap-2">
          {/* El admin no compra, así que no le mostramos el carrito */}
          {!esAdmin && (
            <Link to="/carrito" className="relative grid size-10 place-items-center rounded-lg hover:bg-panel" aria-label="Carrito">
              <ShoppingCart size={20} />
              {carrito.cantidadTotal > 0 && (
                <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-brand px-1 text-xs font-bold">
                  {carrito.cantidadTotal}
                </span>
              )}
            </Link>
          )}

          {usuario ? (
            <div className="hidden items-center gap-2 md:flex">
              <span className="flex items-center gap-1 text-sm text-zinc-300">
                {esAdmin ? <LayoutDashboard size={16} /> : <User size={16} />} {usuario.nombre.split(" ")[0]}
              </span>
              <button onClick={cerrarSesion} className="grid size-10 place-items-center rounded-lg text-zinc-400 hover:bg-panel hover:text-white" aria-label="Cerrar sesión">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden rounded-lg bg-brand px-4 py-2 text-sm font-semibold hover:bg-brand-dark md:block">
              Iniciar sesión
            </Link>
          )}

          <button className="grid size-10 place-items-center rounded-lg hover:bg-panel md:hidden" onClick={() => setMenuAbierto(!menuAbierto)} aria-label="Menú">
            {menuAbierto ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Menú desplegable para celular */}
      {menuAbierto && (
        <nav className="border-t border-borde px-4 py-3 text-sm font-medium md:hidden">
          {enlaces}
          {usuario ? (
            <button onClick={cerrarSesion} className="flex items-center gap-2 py-2 text-zinc-400"><LogOut size={16} /> Cerrar sesión</button>
          ) : (
            <Link to="/login" onClick={cerrarMenu} className="mt-2 block rounded-lg bg-brand px-4 py-2 text-center font-semibold">Iniciar sesión</Link>
          )}
        </nav>
      )}
    </header>
  )
}
