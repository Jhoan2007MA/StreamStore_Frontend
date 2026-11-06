// Imagen de fondo para tarjetas y fichas.
// No tenemos fotos por plataforma, así que usamos la misma imagen (public/fondo.jpg)
// ampliada 2.6 veces y mostrando una ZONA distinta para cada plataforma: parece un
// "zoom macro" diferente en cada tarjeta. Encima va un tinte muy suave del color de la plataforma.

const ESTILOS = {
  netflix: { posicion: "16% 22%", tinte: "rgba(185, 28, 28, 0.28)" },
  "disney+": { posicion: "47% 58%", tinte: "rgba(30, 64, 175, 0.30)" },
  "prime video": { posicion: "63% 28%", tinte: "rgba(14, 116, 144, 0.28)" },
  max: { posicion: "84% 66%", tinte: "rgba(76, 29, 149, 0.30)" }
}
const POSICIONES_EXTRA = ["30% 85%", "95% 18%", "4% 70%", "72% 92%"]

export const estiloPlataforma = (nombre = "", id = 0) =>
  ESTILOS[nombre.toLowerCase()] ?? { posicion: POSICIONES_EXTRA[id % POSICIONES_EXTRA.length], tinte: "rgba(201, 169, 110, 0.18)" }

// variante = "pantalla" mueve el recorte a otra zona, para que la cuenta completa y la
// pantalla de una misma plataforma no se vean idénticas.
const desplazar = (posicion) => posicion.split(" ").map((v) => `${(parseFloat(v) + 37) % 100}%`).join(" ")

export default function VisualPlataforma({ nombre, id, variante, zoom = "260%", className = "", children }) {
  const estilo = estiloPlataforma(nombre, id)
  const tinte = estilo.tinte
  const posicion = variante === "pantalla" ? desplazar(estilo.posicion) : estilo.posicion

  return (
    <div className={`relative isolate overflow-hidden bg-black ${className}`}>
      {/* La imagen: crece 2% muy lento cuando el mouse pasa por la tarjeta (group-hover) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 transition-transform duration-[1400ms] ease-lujo group-hover:scale-[1.02]"
        style={{ backgroundImage: "url(/fondo.jpg)", backgroundSize: zoom, backgroundPosition: posicion }}
      />
      {/* Tinte de la plataforma + degradado inferior para leer el texto */}
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: `linear-gradient(to top, ${tinte}, transparent 60%)` }} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/25 to-black/10" />
      {children}
    </div>
  )
}
