import { useEffect } from "react"
import { useLocation } from "react-router-dom"

// Sin componente visual. Se encarga del scroll al navegar:
// - Si la URL trae #seccion (ej. /#como-funciona), baja suavemente hasta esa sección.
// - Si no, al cambiar de página vuelve arriba (React no lo hace solo).
export default function ControlScroll() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // Esperamos un instante a que la página se dibuje antes de buscar la sección
      const t = setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" }), 80)
      return () => clearTimeout(t)
    }
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname, hash])

  return null
}
