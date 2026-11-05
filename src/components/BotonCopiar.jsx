import { Check, Copy } from "lucide-react"
import { useState } from "react"

// Copia un texto al portapapeles y muestra un ✓ durante 2 segundos
export default function BotonCopiar({ texto, etiqueta, className = "" }) {
  const [copiado, setCopiado] = useState(false)

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch {
      // Si el navegador no deja copiar, no hacemos nada
    }
  }

  return (
    <button type="button" onClick={copiar} aria-label={etiqueta ?? "Copiar"} className={`inline-flex items-center gap-1.5 text-zinc-400 hover:text-white ${className}`}>
      {copiado ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
      {etiqueta && <span>{copiado ? "¡Copiado!" : etiqueta}</span>}
    </button>
  )
}
