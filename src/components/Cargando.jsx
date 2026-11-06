// Indicador de carga discreto: una línea fina dorada que recorre una pista gris
export default function Cargando({ texto = "Cargando" }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-5 py-24">
      <div className="relative h-px w-32 overflow-hidden bg-white/10">
        <div className="absolute inset-y-0 w-1/3 animate-[deslizar_1.4s_ease-in-out_infinite] bg-brand" />
      </div>
      <p className="text-[0.6875rem] uppercase tracking-[0.3em] text-zinc-500">{texto}</p>
      <style>{"@keyframes deslizar { from { left: -33% } to { left: 100% } }"}</style>
    </div>
  )
}
