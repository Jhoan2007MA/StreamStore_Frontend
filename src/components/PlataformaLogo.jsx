// Monograma de la plataforma: cuadro oscuro con borde fino y la inicial en dorado.
// Antes eran cuadros de colores; en una estética sobria es mejor que todos se vean iguales.
export default function PlataformaLogo({ nombre, logoUrl, tamano = "md" }) {
  const medidas = { sm: "size-10 text-base", md: "size-12 text-lg", lg: "size-16 text-2xl" }[tamano]
  if (logoUrl) {
    return <img src={logoUrl} alt={nombre} className={`${medidas} rounded-xl object-cover`} />
  }
  return (
    <div className={`${medidas} grid shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] font-light text-brand`}>
      {nombre?.charAt(0)}
    </div>
  )
}
