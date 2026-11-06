// Estado con un punto de color + texto. Se mantienen verde/amarillo/rojo (lo pide el reto)
// pero en versión discreta: el color vive solo en el punto.
const ESTADOS = {
  // Servicios
  activo: { texto: "Activo", punto: "bg-emerald-400" },
  por_vencer: { texto: "Por vencer", punto: "bg-amber-400" },
  vencido: { texto: "Vencido", punto: "bg-red-400" },
  // Compras
  pagada: { texto: "Pagada", punto: "bg-emerald-400" },
  pendiente: { texto: "Pendiente", punto: "bg-amber-400" },
  cancelada: { texto: "Cancelada", punto: "bg-zinc-500" },
  // Inventario (cuentas y pantallas)
  disponible: { texto: "Disponible", punto: "bg-emerald-400" },
  parcial: { texto: "Parcial", punto: "bg-amber-400" },
  vendida: { texto: "Vendida", punto: "bg-red-400" },
  inactiva: { texto: "Inactiva", punto: "bg-zinc-500" },
  // Plataformas y productos (estado 1 / 0)
  habilitado: { texto: "Activo", punto: "bg-emerald-400" },
  deshabilitado: { texto: "Inactivo", punto: "bg-zinc-500" }
}

export default function EstadoBadge({ estado }) {
  const { texto, punto } = ESTADOS[estado] ?? { texto: estado, punto: "bg-zinc-500" }
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[0.6875rem] uppercase tracking-[0.15em] text-tinta/85">
      <span className={`size-1.5 rounded-full ${punto}`} />
      {texto}
    </span>
  )
}
