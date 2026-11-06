// Caja de mensaje sobria: fondo casi transparente y una línea de color a la izquierda.
// tipo: "error" | "exito" | "info"
const ESTILOS = {
  error: "border-l-red-400 text-red-200",
  exito: "border-l-emerald-400 text-emerald-200",
  info: "border-l-brand text-tinta/90"
}

export default function Aviso({ tipo = "info", children }) {
  if (!children) return null
  return (
    <div role={tipo === "error" ? "alert" : "status"} className={`rounded-r-lg border-l-2 bg-white/[0.03] px-4 py-3 text-sm ${ESTILOS[tipo]}`}>
      {children}
    </div>
  )
}
