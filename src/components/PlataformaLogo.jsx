import { marcaDe, filtroLogo } from "../utils/marcas"

// Logo pequeño de la plataforma (carrito, checkout, mi cuenta).
// Orden: logo que venga del backend → logo oficial de utils/marcas.js → inicial en dorado.
export default function PlataformaLogo({ nombre, logoUrl, tamano = "md" }) {
  const medidas = { sm: "size-10 text-base", md: "size-12 text-lg", lg: "size-16 text-2xl" }[tamano]
  if (logoUrl) {
    return <img src={logoUrl} alt={nombre} className={`${medidas} rounded-xl object-cover`} />
  }
  const marca = marcaDe(nombre)
  if (marca) {
    return (
      <div className={`${medidas} grid shrink-0 place-items-center rounded-xl border border-white/10 p-1.5`} style={{ background: marca.color }}>
        <img src={marca.logo} alt={nombre} className="max-h-full w-full object-contain" style={{ filter: filtroLogo(marca, false) }} />
      </div>
    )
  }
  return (
    <div className={`${medidas} grid shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] font-light text-brand`}>
      {nombre?.charAt(0)}
    </div>
  )
}
