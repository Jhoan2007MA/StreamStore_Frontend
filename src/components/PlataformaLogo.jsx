// La base de datos no trae logos, así que dibujamos un cuadro de color con la inicial.
// No usamos logos oficiales: la marca debe ser propia.
const COLORES = {
  netflix: "from-red-600 to-red-800",
  "disney+": "from-blue-600 to-indigo-800",
  "prime video": "from-sky-500 to-sky-700",
  max: "from-violet-600 to-blue-800"
}

export default function PlataformaLogo({ nombre, logoUrl, tamano = "md" }) {
  const medidas = { sm: "size-9 text-sm", md: "size-12 text-lg", lg: "size-16 text-2xl" }[tamano]
  if (logoUrl) {
    return <img src={logoUrl} alt={nombre} className={`${medidas} rounded-xl object-cover`} />
  }
  const color = COLORES[nombre?.toLowerCase()] ?? "from-zinc-600 to-zinc-800"
  return (
    <div className={`${medidas} shrink-0 rounded-xl bg-gradient-to-br ${color} grid place-items-center font-bold text-white`}>
      {nombre?.charAt(0)}
    </div>
  )
}
