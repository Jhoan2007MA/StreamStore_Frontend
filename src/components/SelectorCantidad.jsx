import { Minus, Plus } from "lucide-react"

// Botones - y + para elegir cantidad, sin pasar de 1 ni del máximo (el stock).
export default function SelectorCantidad({ valor, onChange, max, deshabilitado }) {
  const boton = "grid size-9 place-items-center rounded-lg bg-borde hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-borde"
  return (
    <div className="flex items-center gap-2">
      <button type="button" className={boton} onClick={() => onChange(valor - 1)} disabled={deshabilitado || valor <= 1} aria-label="Restar">
        <Minus size={16} />
      </button>
      <span className="w-8 text-center font-semibold">{valor}</span>
      <button type="button" className={boton} onClick={() => onChange(valor + 1)} disabled={deshabilitado || valor >= max} aria-label="Sumar">
        <Plus size={16} />
      </button>
    </div>
  )
}
