// Lista desplegable con el mismo estilo de los campos de texto.
// opciones = [{ valor, texto }]
export default function CampoSelect({ etiqueta, opciones, error, ...props }) {
  return (
    <label className="block">
      {etiqueta && <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-zinc-500">{etiqueta}</span>}
      <select {...props} aria-invalid={Boolean(error)} className={`campo ${error ? "border-red-500/60" : ""}`}>
        {opciones.map(({ valor, texto }) => (
          <option key={valor} value={valor} className="bg-panel">{texto}</option>
        ))}
      </select>
      {error && <span className="mt-1.5 block text-xs text-red-300">{error}</span>}
    </label>
  )
}
