import { Boxes, LayoutDashboard, MonitorPlay, Receipt, Tags } from "lucide-react"
import { NavLink, Outlet } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

const SECCIONES = [
  { a: "/admin", texto: "Resumen", icono: LayoutDashboard, exacto: true },
  { a: "/admin/inventario", texto: "Inventario", icono: Boxes },
  { a: "/admin/plataformas", texto: "Plataformas", icono: MonitorPlay },
  { a: "/admin/productos", texto: "Productos", icono: Tags },
  { a: "/admin/ventas", texto: "Ventas", icono: Receipt }
]

// Marco del panel: menú lateral en computador y pestañas deslizables en celular.
// Cada sección es una ruta hija que se pinta en <Outlet />.
export default function AdminLayout() {
  const { usuario } = useAuth()

  return (
    <div className="contenedor max-w-7xl py-12 sm:py-16">
      <p className="etiqueta">Administración</p>
      <h1 className="titulo-display mt-4 text-4xl sm:text-5xl">Panel de control</h1>
      <p className="mt-1 text-zinc-400">{usuario.nombre} · {usuario.correo}</p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <nav aria-label="Secciones del panel" className="-mx-5 overflow-x-auto px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:w-56 lg:shrink-0 lg:overflow-visible lg:px-0">
          <ul className="flex gap-2 border-b border-borde lg:sticky lg:top-28 lg:flex-col lg:gap-1 lg:border-b-0">
            {SECCIONES.map(({ a, texto, icono: Icono, exacto }) => (
              <li key={a}>
                <NavLink
                  to={a}
                  end={exacto}
                  className={({ isActive }) =>
                    `-mb-px flex items-center gap-3 whitespace-nowrap border-b-2 px-4 py-3 text-sm transition lg:mb-0 lg:rounded-lg lg:border-b-0 ${
                      isActive
                        ? "border-brand text-white lg:bg-white/[0.06]"
                        : "border-transparent text-zinc-400 hover:text-white lg:hover:bg-white/[0.03]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icono size={16} className={isActive ? "text-brand" : ""} />
                      {texto}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <section className="min-w-0 flex-1">
          <Outlet />
        </section>
      </div>
    </div>
  )
}

// Título de cada sección con un botón opcional a la derecha
export function EncabezadoSeccion({ titulo, descripcion, accion }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="titulo-display text-3xl">{titulo}</h2>
        {descripcion && <p className="mt-1 text-sm text-zinc-400">{descripcion}</p>}
      </div>
      {accion}
    </div>
  )
}
