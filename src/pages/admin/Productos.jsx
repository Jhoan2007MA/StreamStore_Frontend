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
import { erroresPorCampo, usePlataformasAdmin } from "../../hooks/usePlataformasAdmin"
import { formatoPrecio, nombreModalidad } from "../../utils/formato"
import { EncabezadoSeccion } from "./AdminLayout"
import { BotonIcono } from "./Plataformas"

const TIPOS = [
  { valor: "cuenta", texto: "Cuenta completa" },
  { valor: "pantalla", texto: "Pantalla" }
]

export default function Productos() {
  const plataformas = usePlataformasAdmin()
  const [filtros, setFiltros] = useState({ plataforma: "", tipo: "", estado: "", page: 1 })
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState("")
  const [aviso, setAviso] = useState("")
  const [editando, setEditando] = useState(null) // null = cerrado, {} = nuevo, producto = editar
  const [recargar, setRecargar] = useState(0)

  useEffect(() => {
    setError("")
    adminApi.productos({ ...filtros, limit: 10 })
      .then(setResultado)
      .catch((e) => setError(mensajeError(e)))
  }, [filtros, recargar])

  const filtrar = (campo) => (e) => setFiltros({ ...filtros, [campo]: e.target.value, page: 1 })

  const alGuardar = (producto, esNuevo) => {
    setEditando(null)
    setAviso(`Producto ${producto.plataforma.nombre} · ${nombreModalidad(producto.tipo)} ${esNuevo ? "creado" : "actualizado"}.`)
    setRecargar((n) => n + 1)
  }

  const cambiarEstado = async (producto) => {
    const nuevo = producto.estado === 1 ? 0 : 1
    setAviso("")
    try {
      await adminApi.estadoProducto(producto.id, nuevo)
      setAviso(`${producto.plataforma.nombre} · ${nombreModalidad(producto.tipo)} ${nuevo === 1 ? "activado" : "inactivado"}.`)
      setRecargar((n) => n + 1)
    } catch (e) {
      setError(mensajeError(e))
    }
  }

  return (
    <>
      <EncabezadoSeccion
        titulo="Productos"
        descripcion="Precios y duraciones del catálogo. El stock se comparte entre productos de la misma plataforma y modalidad."
        accion={<button onClick={() => setEditando({})} className="boton-primario"><Plus size={16} /> Nuevo producto</button>}
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <CampoSelect
          aria-label="Filtrar por plataforma"
          value={filtros.plataforma}
          onChange={filtrar("plataforma")}
          opciones={[{ valor: "", texto: "Todas las plataformas" }, ...plataformas.map((p) => ({ valor: p.id, texto: p.nombre }))]}
        />
        <CampoSelect aria-label="Filtrar por modalidad" value={filtros.tipo} onChange={filtrar("tipo")} opciones={[{ valor: "", texto: "Todas las modalidades" }, ...TIPOS]} />
        <CampoSelect
          aria-label="Filtrar por estado"
          value={filtros.estado}
          onChange={filtrar("estado")}
          opciones={[{ valor: "", texto: "Activos e inactivos" }, { valor: "1", texto: "Solo activos" }, { valor: "0", texto: "Solo inactivos" }]}
        />
      </div>

      {aviso && <div className="mb-4"><Aviso tipo="exito">{aviso}</Aviso></div>}
      {error && <div className="mb-4"><Aviso tipo="error">{error}</Aviso></div>}
      {!resultado && !error && <Cargando texto="Cargando productos..." />}

      {resultado && resultado.total === 0 && <p className="py-16 text-center text-zinc-400">No hay productos con estos filtros.</p>}

      {resultado && resultado.total > 0 && (
        <>
          <div className="superficie overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="text-left text-xs uppercase tracking-[0.12em] text-zinc-500">
                <tr className="border-b border-borde">
                  <th className="p-4 font-medium">Producto</th>
                  <th className="p-4 font-medium">Duración</th>
                  <th className="p-4 font-medium">Precio</th>
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
                        <PlataformaLogo nombre={p.plataforma.nombre} tamano="sm" />
                        <div>
                          <p className="font-medium">{p.plataforma.nombre}</p>
                          <p className="text-xs text-zinc-500">
                            {nombreModalidad(p.tipo)}
                            {p.plataforma.estado === 0 && " · plataforma inactiva"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{p.duracionDias} días</td>
                    <td className="p-4">{formatoPrecio(p.precio)}</td>
                    <td className="p-4">
                      {p.stock === 0 ? <span className="text-red-300">Agotado</span> : <span className={p.stock <= 2 ? "text-amber-300" : ""}>{p.stock}</span>}
                    </td>
                    <td className="p-4"><EstadoBadge estado={p.estado === 1 ? "habilitado" : "deshabilitado"} /></td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <BotonIcono texto="Editar producto" onClick={() => setEditando(p)}><Pencil size={15} /></BotonIcono>
                        <BotonIcono texto={p.estado === 1 ? "Inactivar producto" : "Activar producto"} onClick={() => cambiarEstado(p)}>
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

      {editando && <FormularioProducto producto={editando} plataformas={plataformas} onCerrar={() => setEditando(null)} onGuardado={alGuardar} />}
    </>
  )
}

function FormularioProducto({ producto, plataformas, onCerrar, onGuardado }) {
  const esNuevo = !producto.id
  const [form, setForm] = useState({
    plataformaId: producto.plataforma?.id ?? plataformas.find((p) => p.estado === 1)?.id ?? "",
    tipo: producto.tipo ?? "pantalla",
    duracionDias: producto.duracionDias ?? 30,
    precio: producto.precio ?? ""
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
      plataformaId: Number(form.plataformaId),
      tipo: form.tipo,
      duracionDias: Number(form.duracionDias),
      precio: Number(form.precio)
    }
    // Al editar solo mandamos lo que cambió: si el producto ya tiene ventas, el backend no deja cambiar plataforma ni modalidad
    const cambios = esNuevo
      ? datos
      : Object.fromEntries(Object.entries(datos).filter(([campo, valor]) =>
        campo === "plataformaId" ? valor !== producto.plataforma.id : valor !== producto[campo]))
    if (!esNuevo && Object.keys(cambios).length === 0) {
      onCerrar()
      return
    }
    try {
      const guardado = esNuevo ? await adminApi.crearProducto(cambios) : await adminApi.editarProducto(producto.id, cambios)
      onGuardado(guardado, esNuevo)
    } catch (err) {
      const campos = erroresPorCampo(err)
      if (Object.keys(campos).length) setErrores(campos)
      else setError(mensajeError(err))
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Modal titulo={esNuevo ? "Nuevo producto" : "Editar producto"} onCerrar={onCerrar}>
      <form onSubmit={guardar} className="space-y-5">
        <CampoSelect
          etiqueta="Plataforma"
          value={form.plataformaId}
          onChange={cambiar("plataformaId")}
          error={errores.plataformaId}
          opciones={plataformas.map((p) => ({ valor: p.id, texto: p.estado === 1 ? p.nombre : `${p.nombre} (inactiva)` }))}
        />
        <CampoSelect etiqueta="Modalidad" value={form.tipo} onChange={cambiar("tipo")} error={errores.tipo} opciones={TIPOS} />
        <CampoTexto etiqueta="Duración (días)" type="number" required min={1} max={365} value={form.duracionDias} onChange={cambiar("duracionDias")} error={errores.duracionDias} />
        <CampoTexto etiqueta="Precio (COP)" type="number" required min={1} step="0.01" value={form.precio} onChange={cambiar("precio")} error={errores.precio} />
        {!esNuevo && <p className="text-sm text-zinc-400">Si el producto ya tiene ventas solo se pueden cambiar el precio y la duración.</p>}
        <Aviso tipo="error">{error}</Aviso>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCerrar} className="boton-secundario">Cancelar</button>
          <button type="submit" disabled={guardando || !form.plataformaId} className="boton-primario">{guardando ? "Guardando..." : "Guardar"}</button>
        </div>
      </form>
    </Modal>
  )
}
