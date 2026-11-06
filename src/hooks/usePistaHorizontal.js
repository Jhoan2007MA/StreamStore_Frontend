import { useCallback, useEffect, useRef, useState } from "react"

// Lógica compartida de los carruseles horizontales:
// - "pista" se conecta al div que se desliza (ref={pista})
// - "mover(1)" o "mover(-1)" avanza o retrocede casi una pantalla
// - "alInicio" / "alFinal" sirven para apagar la flecha que ya no tiene a dónde ir
export function usePistaHorizontal(dependencias = []) {
  const pista = useRef(null)
  const [alInicio, setAlInicio] = useState(true)
  const [alFinal, setAlFinal] = useState(true)

  const medir = useCallback(() => {
    const el = pista.current
    if (!el) return
    setAlInicio(el.scrollLeft <= 4)
    setAlFinal(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const el = pista.current
    if (!el) return
    medir()
    el.addEventListener("scroll", medir, { passive: true })
    window.addEventListener("resize", medir)
    return () => {
      el.removeEventListener("scroll", medir)
      window.removeEventListener("resize", medir)
    }
    // Volvemos a medir cuando cambian las tarjetas (ej. al filtrar)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medir, ...dependencias])

  const mover = (direccion) => {
    const el = pista.current
    el?.scrollBy({ left: direccion * el.clientWidth * 0.85, behavior: "smooth" })
  }

  return { pista, mover, alInicio, alFinal }
}
