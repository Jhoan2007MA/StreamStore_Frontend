import { useEffect, useRef, useState } from "react"

// Envuelve un bloque para que aparezca (sube 24px y se aclara) cuando entra en pantalla.
// IntersectionObserver es una herramienta del navegador que avisa cuando un elemento se vuelve visible.
export default function Revelar({ children, retraso = 0, className = "", como: Etiqueta = "div" }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true)
          observador.disconnect() // solo animamos la primera vez
        }
      },
      { threshold: 0.15 }
    )
    observador.observe(el)
    return () => observador.disconnect()
  }, [])

  return (
    <Etiqueta
      ref={ref}
      style={{ transitionDelay: `${retraso}ms` }}
      className={`transition-all duration-[1200ms] ease-lujo ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"} ${className}`}
    >
      {children}
    </Etiqueta>
  )
}
