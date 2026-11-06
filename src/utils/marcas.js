// Identidad visual de cada plataforma: logo oficial (public/plataformas) y colores de la marca.
// "video" = clip propio que se reproduce al pasar el cursor (public/plataformas/videos).
// "videoDesde" / "videoHasta" = opcionales: tramo del clip que se repite (para saltar partes vacías).
// "videoEstilo" = opcional: tamaño/posición del video en la tarjeta si el recorte por defecto corta el logo.
// "blanco" = el logo original es oscuro, así que se pinta en blanco para que se vea sobre el fondo.
const MARCAS = {
  netflix: {
    logo: "/plataformas/netflix.svg",
    video: "/plataformas/videos/netflix.mp4",
    fondo: "radial-gradient(120% 80% at 50% 30%, #3a0306 0%, #140102 55%, #000 100%)",
    color: "#141414",
    brillo: "rgba(229, 9, 20, 0.45)",
    blanco: false
  },
  "disney+": {
    logo: "/plataformas/disney.svg",
    video: "/plataformas/videos/disney.mp4",
    videoDesde: 2.6, // los primeros segundos del clip son casi negros
    // El logo del clip es ancho: se muestra el video más pequeño y con bordes difuminados para que quepa completo
    videoEstilo: {
      width: "180%", maxWidth: "none", height: "auto", top: "-9%", left: "50%", transform: "translateX(-50%)",
      maskImage: "radial-gradient(closest-side, black 65%, transparent)",
      WebkitMaskImage: "radial-gradient(closest-side, black 65%, transparent)"
    },
    fondo: "radial-gradient(120% 80% at 50% 25%, #1f4fd1 0%, #0b1f6b 45%, #040a26 100%)",
    color: "#0b1f6b",
    brillo: "rgba(0, 220, 255, 0.35)",
    blanco: true
  },
  max: {
    logo: "/plataformas/max.svg",
    video: "/plataformas/videos/hbomax.mp4",
    videoHasta: 2.3, // el clip termina en negro: se repite solo hasta aquí (segundos)
    fondo: "radial-gradient(120% 80% at 50% 30%, #1d3cff 0%, #0a1aa8 45%, #020630 100%)",
    color: "#0a1aa8",
    brillo: "rgba(120, 140, 255, 0.4)",
    blanco: true
  },
  "prime video": {
    logo: "/plataformas/prime.svg",
    video: "/plataformas/videos/AmazonPrime.mp4",
    // El logo del final es ancho: mismo ajuste que Disney+ para que quepa completo
    videoEstilo: {
      width: "200%", maxWidth: "none", height: "auto", top: "-2%", left: "50%", transform: "translateX(-50%)",
      maskImage: "radial-gradient(closest-side, black 65%, transparent)",
      WebkitMaskImage: "radial-gradient(closest-side, black 65%, transparent)"
    },
    fondo: "radial-gradient(120% 80% at 50% 30%, #0a6f9a 0%, #0f2a3d 50%, #070d14 100%)",
    color: "#0f2a3d",
    brillo: "rgba(0, 168, 225, 0.4)",
    blanco: true
  }
}

export const marcaDe = (nombre = "") => MARCAS[nombre.toLowerCase()]

// Filtro CSS del logo: blanco si hace falta + resplandor del color de la marca
export const filtroLogo = (marca, conBrillo = true) =>
  [marca.blanco && "brightness(0) invert(1)", conBrillo && `drop-shadow(0 0 28px ${marca.brillo})`].filter(Boolean).join(" ") || "none"
