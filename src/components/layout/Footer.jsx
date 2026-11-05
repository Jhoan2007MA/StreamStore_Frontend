import { Link } from "react-router-dom"
import Logo from "./Logo"

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-borde">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-3">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-zinc-400">Cuentas y pantallas de streaming al instante, con aviso antes de que se venzan.</p>
        </div>
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold">Tienda</h4>
          <Link to="/catalogo" className="block text-zinc-400 hover:text-white">Catálogo</Link>
          <Link to="/mi-cuenta" className="block text-zinc-400 hover:text-white">Mis servicios</Link>
          <Link to="/carrito" className="block text-zinc-400 hover:text-white">Carrito</Link>
        </div>
        <div className="space-y-2 text-sm">
          <h4 className="font-semibold">Aviso</h4>
          <p className="text-zinc-400">Proyecto formativo de Campuslands. Todos los datos son ficticios. Las marcas mencionadas pertenecen a sus dueños.</p>
        </div>
      </div>
      <p className="border-t border-borde py-4 text-center text-xs text-zinc-500">© {new Date().getFullYear()} StreamStore</p>
    </footer>
  )
}
