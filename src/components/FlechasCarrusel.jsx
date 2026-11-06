import { ChevronLeft, ChevronRight } from "lucide-react"

// Par de flechas redondas con borde fino. Se apagan al llegar a un extremo.
export default function FlechasCarrusel({ mover, alInicio, alFinal, className = "" }) {
  const flecha = "grid size-11 place-items-center rounded-full border border-white/15 text-tinta/80 transition duration-500 ease-lujo hover:border-white/60 hover:text-tinta disabled:opacity-25 disabled:hover:border-white/15"
  return (
    <div className={`gap-2 ${className}`}>
      <button onClick={() => mover(-1)} disabled={alInicio} className={flecha} aria-label="Anterior">
        <ChevronLeft size={18} strokeWidth={1.5} />
      </button>
      <button onClick={() => mover(1)} disabled={alFinal} className={flecha} aria-label="Siguiente">
        <ChevronRight size={18} strokeWidth={1.5} />
      </button>
    </div>
  )
}
