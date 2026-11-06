import { useRef, useState } from "react"
import { marcaDe, filtroLogo } from "../utils/marcas"

// Imagen de fondo para tarjetas y fichas.
// Si la plataforma tiene marca registrada en utils/marcas.js, se muestra su logo oficial
// sobre los colores de la marca. Si no (o con conLogo={false}), se usa la imagen genérica (public/fondo.jpg)
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

export default function VisualPlataforma({ nombre, id, variante, zoom = "260%", conLogo = true, logoCentrado = false, className = "", children }) {
  const marca = conLogo ? marcaDe(nombre) : undefined
  if (marca) {
    return <PortadaMarca marca={marca} centrado={logoCentrado} className={className}>{children}</PortadaMarca>
  }

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

// Portada con el logo de la plataforma. Con texto encima, el logo se ubica arriba;
// sin texto (la ficha de producto), queda centrado.
// Al pasar el cursor se reproduce (sin sonido y en bucle) el video de la plataforma, si existe.
// El video solo se descarga la primera vez que se pasa el cursor; si el archivo no existe, se queda el logo.
const prefiereMenosMovimiento = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

function PortadaMarca({ marca, centrado, className, children }) {
  const videoRef = useRef(null)
  const encima = useRef(false)                   // el cursor sigue sobre la tarjeta
  const [cargar, setCargar] = useState(false)    // se monta el <video> al primer hover
  const [visible, setVisible] = useState(false)  // el video está sonando y se muestra
  const [sinVideo, setSinVideo] = useState(!marca.video)
  const youtube = sinVideo ? marca.youtube : undefined
  const iframeRef = useRef(null)
  const temporizador = useRef(null)

  const entrar = () => {
    encima.current = true
    if ((sinVideo && !youtube) || prefiereMenosMovimiento()) return
    setCargar(true)
    if (youtube) {
      ordenYoutube("playVideo")
      // YouTube no avisa cuándo empieza a sonar: se muestra tras un momento para no ver la carga
      temporizador.current = setTimeout(() => encima.current && setVisible(true), 900)
    }
    videoRef.current?.play().catch(() => {})
  }
  const salir = () => {
    encima.current = false
    setVisible(false)
    clearTimeout(temporizador.current)
    if (youtube) ordenYoutube("pauseVideo")
    const video = videoRef.current
    if (video) {
      video.pause()
      video.currentTime = marca.videoDesde ?? 0
    }
  }

  // Controla el reproductor de YouTube ya cargado (requiere enablejsapi=1)
  function ordenYoutube(func) {
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*")
  }

  return (
    <div onMouseEnter={entrar} onMouseLeave={salir} className={`relative isolate overflow-hidden bg-black ${className}`}>
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 transition-[transform,opacity] duration-[1400ms] ease-lujo group-hover:scale-[1.04] ${visible ? "opacity-0" : ""}`}
        style={{ background: marca.fondo }}
      />
      <div aria-hidden="true" className={`absolute inset-x-0 top-0 -z-10 flex items-center justify-center px-10 transition-opacity duration-700 ${centrado ? "h-full" : "h-[58%]"} ${visible ? "opacity-0" : ""}`}>
        <img
          src={marca.logo}
          alt=""
          className="max-h-24 w-[72%] max-w-xs object-contain transition-transform duration-[1400ms] ease-lujo group-hover:scale-105"
          style={{ filter: filtroLogo(marca) }}
        />
      </div>
      {cargar && !sinVideo && (
        // El video se sube un poco para que su centro (donde suele ir el logo) quede arriba, lejos del texto
        <video
          ref={videoRef}
          src={marca.video}
          aria-hidden="true"
          muted
          loop
          playsInline
          autoPlay
          preload="none"
          onPlaying={(e) => (encima.current ? setVisible(true) : e.currentTarget.pause())}
          onError={() => setSinVideo(true)}
          onLoadedMetadata={(e) => { if (marca.videoDesde) e.currentTarget.currentTime = marca.videoDesde }}
          style={marca.videoEstilo}
          onTimeUpdate={(e) => {
            // Recorta el bucle al tramo [videoDesde, videoHasta] para saltar partes vacías del clip
            const v = e.currentTarget
            const desde = marca.videoDesde ?? 0
            if (v.currentTime < desde || (marca.videoHasta && v.currentTime >= marca.videoHasta)) v.currentTime = desde
          }}
          className={`absolute inset-x-0 -top-[35%] -z-10 h-[135%] w-full object-cover transition-opacity duration-700 ease-lujo ${visible ? "opacity-100" : "opacity-0"}`}
        />
      )}
      {cargar && youtube && (
        // El video es 16:9 y la tarjeta vertical: se agranda para cubrirla (como object-cover).
        // pointer-events-none para que el clic siga yendo al enlace de la tarjeta.
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden transition-opacity duration-700 ease-lujo ${visible ? "opacity-100" : "opacity-0"}`}>
          <iframe
            ref={iframeRef}
            title=""
            tabIndex={-1}
            src={`https://www.youtube-nocookie.com/embed/${youtube}?autoplay=1&mute=1&loop=1&playlist=${youtube}&controls=0&disablekb=1&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&enablejsapi=1`}
            allow="autoplay; encrypted-media"
            className="absolute left-1/2 top-1/2 aspect-video h-full min-w-full -translate-x-1/2 -translate-y-1/2 scale-[1.35] border-0"
          />
        </div>
      )}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      {children}
    </div>
  )
}
