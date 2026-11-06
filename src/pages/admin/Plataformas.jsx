import { Pencil, Plus, Power } from "lucide-react"
import { useEffect, useState } from "react"
import { mensajeError } from "../../api/client"
import { adminApi } from "../../api/servicios"
import Aviso from "../../components/Aviso"
import Cargando from "../../components/Cargando"
import EstadoBadge from "../../components/EstadoBadge"
import { CampoTexto } from "../../components/Formulario"
import PlataformaLogo from "../../components/PlataformaLogo"
import CampoSelect from "../../components/admin/CampoSelect"
import Modal from "../../components/admin/Modal"
import Paginacion from "../../components/admin/Paginacion"
import { erroresPorCampo } from "../../hooks/usePlataformasAdmin"
import { EncabezadoSeccion } from "./AdminLayout"

const ESTADOS = [
  { valor: "", texto: "Activas e inactivas" },
  { valor: "1", texto: "Solo activas" },
  { valor: "0", texto: "Solo inactivas" }
]

export default function Plataformas() {
  const [filtros, setFiltros] = useState({ buscar: "", estado: "", page: 1 })
  const [busqueda, setBusqueda] = useState("")
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState("")
  const [aviso, setAviso] = useState("")
  const [editando, setEditando] = useState(null) // null = cerrado, {} = nueva, plataforma = editar
  const [recargar, setRecargar] = useState(0)

  useEffect(() => {
    setError("")
    adminApi.plataformas({ ...filtros, limit: 10 })
      .then(setResultado)
      .catch((e) => setError(mensajeError(e)))
  }, [filtros, recargar])

  // Espera a que el admin deje de escribir antes de buscar
  useEffect(() => {
    const espera = setTimeout(() => setFiltros((f) => (f.buscar === busqueda.trim() ? f : { ...f, buscar: busqueda.trim(), page: 1 })), 400)
    return () => clearTimeout(espera)
  }, [busqueda])

  const alGuardar = (plataforma, esNueva) => {
    setEditando(null)
    setAviso(`Plataforma ${plataforma.nombre} ${esNueva ? "creada" : "actualizada"}.`)
    setRecargar((n) => n + 1)
  }

  const cambiarEstado = async (plataforma) => {
    const nuevo = plataforma.estado === 1 ? 0 : 1
    setAviso("")
    try {
      await adminApi.estadoPlataforma(plataforma.id, nuevo)
      setAviso(`${plataforma.nombre} ${nuevo === 1 ? "activada: vuelve a salir en el catálogo" : "inactivada: ya no sale en el catálogo"}.`)
      setRecargar((n) => n + 1)
    } catch (e) {
      setError(mensajeError(e))
    }
  }

  return (
    <>
      <EncabezadoSeccion
        titulo="Plataformas"
        descripcion="Las inactivas no aparecen en el catálogo. No se eliminan para conservar el historial."
        accion={<button onClick={() => setEditando({})} className="boton-primario"><Plus size={16} /> Nueva plataforma</button>}
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <input aria-label="Buscar plataforma" placeholder="Buscar por nombre" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} className="campo" />
        <CampoSelect aria-label="Filtrar por estado" value={filtros.estado} onChange={(e) => setFiltros({ ...filtros, estado: e.target.value, page: 1 })} opciones={ESTADOS} />
      </div>

      {aviso && <div className="mb-4"><Aviso tipo="exito">{aviso}</Aviso></div>}
      {error && <div className="mb-4"><Aviso tipo="error">{error}</Aviso></div>}
      {!resultado && !error && <Cargando texto="Cargando plataformas..." />}

      {resultado && resultado.total === 0 && <p className="py-16 text-center text-zinc-400">No hay plataformas con estos filtros.</p>}

      {resultado && resultado.total > 0 && (
        <>
          <div className="superficie overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead className="text-left text-xs uppercase tracking-[0.12em] text-zinc-500">
                <tr className="border-b border-borde">
                  <th className="p-4 font-medium">Plataforma</th>
                  <th className="p-4 font-medium">Pantallas por cuenta</th>
                  <th className="p-4 font-medium">Stock</th>
                  <th className="p-4 font-medium">Estado</th>
                  <th className="p-4 font-medium"><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borde">
                {resultado.data.map((p) => (
                  <tr key={p.id}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <PlataformaLogo nombre={p.nombre} logoUrl={p.logoUrl} tamano="sm" />
                        <div className="min-w-0">
                          <p className="font-medium">{p.nombre}</p>
                          {p.descripcion && <p className="max-w-xs truncate text-xs text-zinc-500">{p.descripcion}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{p.maxPantallas}</td>
                    <td className="p-4 text-zinc-400">{p.stock.cuenta} cuentas · {p.stock.pantalla} pantallas</td>
                    <td className="p-4"><EstadoBadge estado={p.estado === 1 ? "habilitado" : "deshabilitado"} /></td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <BotonIcono texto={`Editar ${p.nombre}`} onClick={() => setEditando(p)}><Pencil size={15} /></BotonIcono>
                        <BotonIcono texto={p.estado === 1 ? `Inactivar ${p.nombre}` : `Activar ${p.nombre}`} onClick={() => cambiarEstado(p)}>
                          <Power size={15} className={p.estado === 1 ? "text-emerald-400" : "text-zinc-500"} />
                        </BotonIcono>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Paginacion resultado={resultado} onCambiar={(page) => setFiltros({ ...filtros, page })} />
        </>
      )}

      {editando && <FormularioPlataforma plataforma={editando} onCerrar={() => setEditando(null)} onGuardada={alGuardar} />}
    </>
  )
}

export function BotonIcono({ texto, onClick, children }) {
  return (
    <button onClick={onClick} title={texto} aria-label={texto} className="grid size-9 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-white/40 hover:text-white">
      {children}
    </button>
  )
}

function FormularioPlataforma({ plataforma, onCerrar, onGuardada }) {
  const esNueva = !plataforma.id
  const [form, setForm] = useState({
    nombre: plataforma.nombre ?? "",
    descripcion: plataforma.descripcion ?? "",
    logoUrl: plataforma.logoUrl ?? "",
    maxPantallas: plataforma.maxPantallas ?? 5
  })
  const [errores, setErrores] = useState({})
  const [error, setError] = useState("")
  const [guardando, setGuardando] = useState(false)

  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  const guardar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setErrores({})
    setError("")
    const datos = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
      logoUrl: form.logoUrl.trim() || null,
      maxPantallas: Number(form.maxPantallas)
    }
    try {
      const guardada = esNueva ? await adminApi.crearPlataforma(datos) : await adminApi.editarPlataforma(plataforma.id, datos)
      onGuardada(guardada, esNueva)
    } catch (err) {
      const campos = erroresPorCampo(err)
      if (Object.keys(campos).length) setErrores(campos)
      else setError(mensajeError(err))
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Modal titulo={esNueva ? "Nueva plataforma" : `Editar ${plataforma.nombre}`} onCerrar={onCerrar}>
      <form onSubmit={guardar} className="space-y-5">
        <CampoTexto etiqueta="Nombre" required minLength={2} maxLength={80} value={form.nombre} onChange={cambiar("nombre")} error={errores.nombre} />
        <CampoTexto etiqueta="Descripción (opcional)" maxLength={255} value={form.descripcion} onChange={cambiar("descripcion")} error={errores.descripcion} />
        <CampoTexto etiqueta="URL del logo (opcional)" type="url" value={form.logoUrl} onChange={cambiar("logoUrl")} error={errores.logoUrl} placeholder="https://..." />
        <CampoTexto etiqueta="Pantallas por cuenta" type="number" required min={1} max={10} value={form.maxPantallas} onChange={cambiar("maxPantallas")} error={errores.maxPantallas} />
        {!esNueva && <p className="text-sm text-zinc-400">El cambio de pantallas por cuenta aplica a las cuentas que se carguen después.</p>}
        <Aviso tipo="error">{error}</Aviso>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCerrar} className="boton-secundario">Cancelar</button>
          <button type="submit" disabled={guardando} className="boton-primario">{guardando ? "Guardando..." : "Guardar"}</button>
        </div>
      </form>
    </Modal>
  )
}
