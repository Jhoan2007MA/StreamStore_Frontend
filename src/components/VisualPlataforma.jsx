import { useRef, useState } from "react"
import { marcaDe, filtroLogo } from "../utils/marcas"

// Imagen de fondo para tarjetas y fichas.
// Si la plataforma tiene marca registrada en utils/marcas.js, se muestra su logo oficial
// sobre los colores de la marca. Si no (o con conLogo={false}), se usa la imagen genérica (public/fondo.jpg)
// ampliada 2.6 veces y mostrando una ZONA distinta para cada plataforma: parece un
// "zoom macro" diferente en cada tarjeta. Encima va un tinte muy suave del color de la plataforma.
//
// Ambas versiones pueden reproducir un video al pasar el cursor (sin sonido, en bucle, sin controles):
// en las de marca viene de utils/marcas.js; en la genérica se pasa con la prop "video" (p. ej. un tráiler).
// Con videoSiempre, el video de la genérica se reproduce solo desde que aparece, sin esperar el cursor.
// videoZoom amplía el video, p. ej. para quitar las franjas negras que traen algunos tráileres
// (1.35 ≈ quita las de un video en formato cine).

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

export default function VisualPlataforma({ nombre, id, variante, zoom = "260%", conLogo = true, logoCentrado = false, video, videoSiempre = false, videoZoom = 1, className = "", children }) {
  const marca = conLogo ? marcaDe(nombre) : undefined
  if (marca) {
    return <PortadaMarca marca={marca} centrado={logoCentrado} className={className}>{children}</PortadaMarca>
  }
  return (
    <PortadaGenerica nombre={nombre} id={id} variante={variante} zoom={zoom} video={video} videoSiempre={videoSiempre} videoZoom={videoZoom} className={className}>
      {children}
    </PortadaGenerica>
  )
}

function PortadaGenerica({ nombre, id, variante, zoom, video, videoSiempre, videoZoom, className, children }) {
  const clip = useVideoAlPasar(video, {
    siempre: videoSiempre,
    estilo: videoZoom !== 1 ? { transform: `scale(${videoZoom})` } : undefined
  })
  const estilo = estiloPlataforma(nombre, id)
  const tinte = estilo.tinte
  const posicion = variante === "pantalla" ? desplazar(estilo.posicion) : estilo.posicion

  return (
    <div onMouseEnter={clip.entrar} onMouseLeave={clip.salir} className={`relative isolate overflow-hidden bg-black ${className}`}>
      {/* La imagen: crece 2% muy lento cuando el mouse pasa por la tarjeta (group-hover) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 transition-transform duration-[1400ms] ease-lujo group-hover:scale-[1.02]"
        style={{ backgroundImage: "url(/fondo.jpg)", backgroundSize: zoom, backgroundPosition: posicion }}
      />
      {/* El video cubre toda la portada (si la portada no es 16:9, se recortan los bordes) */}
      {clip.video("absolute inset-0 -z-10 size-full object-cover")}
      {/* Tinte de la plataforma + degradado inferior para leer el texto */}
      <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ background: `linear-gradient(to top, ${tinte}, transparent 60%)` }} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/25 to-black/10" />
      {children}
    </div>
  )
}

// Portada con el logo de la plataforma. Con texto encima, el logo se ubica arriba;
// sin texto (la ficha de producto), queda centrado.
function PortadaMarca({ marca, centrado, className, children }) {
  const clip = useVideoAlPasar(marca.video, { desde: marca.videoDesde, hasta: marca.videoHasta, estilo: marca.videoEstilo })
  const oculto = clip.visible ? "opacity-0" : ""

  return (
    <div onMouseEnter={clip.entrar} onMouseLeave={clip.salir} className={`relative isolate overflow-hidden bg-black ${className}`}>
      {/* Mientras suena el video, el fondo de color y el logo fijo se desvanecen */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 transition-[transform,opacity] duration-[1400ms] ease-lujo group-hover:scale-[1.04] ${oculto}`}
        style={{ background: marca.fondo }}
      />
      <div aria-hidden="true" className={`absolute inset-x-0 top-0 -z-10 flex items-center justify-center px-10 transition-opacity duration-700 ${centrado ? "h-full" : "h-[58%]"} ${oculto}`}>
        <img
          src={marca.logo}
          alt=""
          className="max-h-24 w-[72%] max-w-xs object-contain transition-transform duration-[1400ms] ease-lujo group-hover:scale-105"
          style={{ filter: filtroLogo(marca) }}
        />
      </div>
      {/* El video se sube un poco para que su centro (donde suele ir el logo) quede arriba, lejos del texto */}
      {clip.video("absolute inset-x-0 -top-[35%] -z-10 h-[135%] w-full object-cover")}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      {children}
    </div>
  )
}

// Video que se reproduce al pasar el cursor (sin sonido, en bucle, sin controles).
// - Solo se descarga la primera vez que se pasa el cursor.
// - Si el archivo no existe o falla, no se muestra nada y queda la imagen de la tarjeta.
// - desde / hasta: tramo del clip que se repite (para saltar partes vacías). En segundos.
// - Respeta la opción del sistema "reducir movimiento".
const prefiereMenosMovimiento = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

// - siempre: se reproduce solo desde el principio y el cursor no lo detiene.
function useVideoAlPasar(src, { desde = 0, hasta, estilo, siempre = false } = {}) {
  const automatico = siempre && !prefiereMenosMovimiento()
  const ref = useRef(null)
  const encima = useRef(automatico)              // el cursor sigue sobre la tarjeta (o reproducción automática)
  const [cargar, setCargar] = useState(automatico) // se monta el <video> al primer hover
  const [visible, setVisible] = useState(false)  // el video está sonando y se muestra
  const [fallo, setFallo] = useState(false)
  const disponible = Boolean(src) && !fallo

  const entrar = () => {
    if (automatico) return
    encima.current = true
    if (!disponible || prefiereMenosMovimiento()) return
    setCargar(true)
    ref.current?.play().catch(() => {})
  }
  const salir = () => {
    if (automatico) return
    encima.current = false
    setVisible(false)
    if (ref.current) {
      ref.current.pause()
      ref.current.currentTime = desde
    }
  }

  const video = (className) =>
    cargar && disponible ? (
      <video
        ref={ref}
        src={src}
        aria-hidden="true"
        muted
        loop
        playsInline
        autoPlay
        preload={automatico ? "auto" : "none"}
        style={estilo}
        // Si el cursor salió antes de que cargara, no lo dejamos sonando de fondo
        onPlaying={(e) => (encima.current ? setVisible(true) : e.currentTarget.pause())}
        onError={() => setFallo(true)}
        onLoadedMetadata={(e) => { if (desde) e.currentTarget.currentTime = desde }}
        onTimeUpdate={(e) => {
          const v = e.currentTarget
          if (v.currentTime < desde || (hasta && v.currentTime >= hasta)) v.currentTime = desde
        }}
        className={`${className} transition-opacity duration-700 ease-lujo ${visible ? "opacity-100" : "opacity-0"}`}
      />
    ) : null

  return { entrar, salir, visible, video }
}
