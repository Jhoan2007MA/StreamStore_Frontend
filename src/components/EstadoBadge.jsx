// Etiqueta de color para estados de servicios y compras
const ESTADOS = {
  // Servicios (regla del documento: verde / amarillo / rojo)
  activo: { texto: "Activo", clase: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40" },
  por_vencer: { texto: "Por vencer", clase: "bg-amber-500/15 text-amber-300 border-amber-500/40" },
  vencido: { texto: "Vencido", clase: "bg-red-500/15 text-red-300 border-red-500/40" },
  // Compras
  pagada: { texto: "Pagada", clase: "bg-emerald-500/15 text-emerald-300 border-emerald-500/40" },
  pendiente: { texto: "Pendiente", clase: "bg-amber-500/15 text-amber-300 border-amber-500/40" },
  cancelada: { texto: "Cancelada", clase: "bg-zinc-500/15 text-zinc-400 border-zinc-500/40" }
}

export default function EstadoBadge({ estado }) {
  const { texto, clase } = ESTADOS[estado] ?? { texto: estado, clase: "border-borde text-zinc-300" }
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${clase}`}>{texto}</span>
}
