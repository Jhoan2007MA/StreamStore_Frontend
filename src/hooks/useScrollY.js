import { useEffect, useState } from "react"

// Devuelve cuántos píxeles ha bajado el usuario en la página.
// Lo usamos para: (1) que el encabezado cambie al hacer scroll y (2) el parallax del hero.
// requestAnimationFrame evita recalcular más veces de las que la pantalla puede dibujar.
export function useScrollY() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let pendiente = false
    const alMover = () => {
      if (pendiente) return
      pendiente = true
      requestAnimationFrame(() => {
        setScrollY(window.scrollY)
        pendiente = false
      })
    }
    alMover()
    window.addEventListener("scroll", alMover, { passive: true })
    return () => window.removeEventListener("scroll", alMover)
  }, [])

  return scrollY
}
