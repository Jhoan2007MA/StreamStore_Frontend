import { Children } from "react"
import { usePistaHorizontal } from "../hooks/usePistaHorizontal"
import FlechasCarrusel from "./FlechasCarrusel"

// Fila horizontal que se desliza con el dedo (celular) o con flechas (computador).
// "snap" hace que al soltar, la tarjeta quede bien alineada y no a medias.
// pegado: las tarjetas quedan más cerca del título.
export default function Carrusel({ etiqueta, titulo, accion, pegado = false, children }) {
  const { pista, mover, alInicio, alFinal } = usePistaHorizontal([Children.count(children)])

  return (
    <section className="py-24 sm:py-32">
      <div className="contenedor flex items-end justify-between gap-6">
        <div>
          {etiqueta && <p className="etiqueta mb-4">{etiqueta}</p>}
          <h2 className="titulo-display text-4xl sm:text-5xl">{titulo}</h2>
        </div>
        <div className="flex items-center gap-6">
          {accion}
          <FlechasCarrusel mover={mover} alInicio={alInicio} alFinal={alFinal} className="hidden md:flex" />
        </div>
      </div>

      {/* La pista: los márgenes laterales coinciden con .contenedor para alinear la primera tarjeta */}
      <div
        ref={pista}
        className={`${pegado ? "mt-6 sm:mt-8" : "mt-12"} flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-4 [scrollbar-width:none] sm:gap-6 sm:px-8 lg:px-[max(3rem,calc((100vw-80rem)/2+3rem))] [&::-webkit-scrollbar]:hidden`}
      >
        {children}
      </div>
    </section>
  )
}
