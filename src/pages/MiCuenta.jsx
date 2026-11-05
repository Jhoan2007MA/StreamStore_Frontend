import { Receipt, Tv } from "lucide-react"
import { useSearchParams } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import MisCompras from "./mi-cuenta/MisCompras"
import MisServicios from "./mi-cuenta/MisServicios"

const PESTANAS = [
  { id: "servicios", texto: "Mis servicios", icono: Tv },
  { id: "compras", texto: "Mis compras", icono: Receipt }
]

// Página con pestañas. La pestaña activa va en la URL (?tab=compras) para poder enlazarla.
export default function MiCuenta() {
  const { usuario } = useAuth()
  const [params, setParams] = useSearchParams()
  const tab = params.get("tab") === "compras" ? "compras" : "servicios"

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold">Hola, {usuario.nombre.split(" ")[0]}</h1>
      <p className="mt-1 text-zinc-400">{usuario.correo}</p>

      <div className="mt-6 flex gap-2 border-b border-borde">
        {PESTANAS.map(({ id, texto, icono: Icono }) => (
          <button
            key={id}
            onClick={() => setParams({ tab: id })}
            className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${tab === id ? "border-brand text-white" : "border-transparent text-zinc-400 hover:text-white"}`}
          >
            <Icono size={16} /> {texto}
          </button>
        ))}
      </div>

      <div className="mt-6">{tab === "servicios" ? <MisServicios /> : <MisCompras />}</div>
    </div>
  )
}
