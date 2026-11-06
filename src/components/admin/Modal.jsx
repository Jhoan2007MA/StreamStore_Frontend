import { X } from "lucide-react"
import { useEffect } from "react"

// Ventana encima de la página para los formularios de crear y editar.
// Se cierra con la X, con Escape o tocando el fondo oscuro.
export default function Modal({ titulo, onCerrar, children }) {
  useEffect(() => {
    const alPresionar = (e) => e.key === "Escape" && onCerrar()
    document.addEventListener("keydown", alPresionar)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", alPresionar)
      document.body.style.overflow = ""
    }
  }, [onCerrar])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={onCerrar}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onClick={(e) => e.stopPropagation()}
        className="superficie max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-b-none p-6 sm:rounded-2xl sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <h2 className="titulo-display text-2xl">{titulo}</h2>
          <button onClick={onCerrar} aria-label="Cerrar" className="text-zinc-400 transition hover:text-white">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
