import { Minus, Plus } from "lucide-react"

// Selector - cantidad + en una píldora con borde fino. No baja de 1 ni pasa del máximo (stock).
export default function SelectorCantidad({ valor, onChange, max, deshabilitado }) {
  const boton = "grid size-10 place-items-center rounded-full text-tinta/80 transition duration-300 hover:bg-white/5 hover:text-tinta disabled:opacity-30 disabled:hover:bg-transparent"
  return (
    <div className="inline-flex items-center rounded-full border border-white/15">
      <button type="button" className={boton} onClick={() => onChange(valor - 1)} disabled={deshabilitado || valor <= 1} aria-label="Restar uno">
        <Minus size={14} strokeWidth={1.5} />
      </button>
      <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">{valor}</span>
      <button type="button" className={boton} onClick={() => onChange(valor + 1)} disabled={deshabilitado || valor >= max} aria-label="Sumar uno">
        <Plus size={14} strokeWidth={1.5} />
      </button>
    </div>
  )
}
