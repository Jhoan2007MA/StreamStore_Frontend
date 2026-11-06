import { ChevronDown, Plus } from "lucide-react"
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
import { formatoFecha } from "../../utils/formato"
import { EncabezadoSeccion } from "./AdminLayout"

const ESTADOS_CUENTA = [
  { valor: "", texto: "Todos los estados" },
  { valor: "disponible", texto: "Disponibles" },
  { valor: "parcial", texto: "Parciales" },
  { valor: "vendida", texto: "Vendidas" },
  { valor: "inactiva", texto: "Inactivas" }
]

export default function Inventario() {
  const plataformas = usePlataformasAdmin()
  const [filtros, setFiltros] = useState({ plataforma: "", estado: "", page: 1 })
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState("")
  const [abierta, setAbierta] = useState(null)
  const [creando, setCreando] = useState(false)
  const [exito, setExito] = useState("")
  const [recargar, setRecargar] = useState(0)

  useEffect(() => {
    setResultado(null)
    setError("")
    adminApi.cuentas({ ...filtros, limit: 10 })
      .then(setResultado)
      .catch((e) => setError(mensajeError(e)))
  }, [filtros, recargar])

  const filtrar = (campo) => (e) => setFiltros({ ...filtros, [campo]: e.target.value, page: 1 })

  const alCrear = (cuenta) => {
    setCreando(false)
    setExito(`Cuenta ${cuenta.correoAcceso} cargada con ${cuenta.pantallasTotal} pantallas.`)
    setRecargar((n) => n + 1)
  }

  return (
    <>
      <EncabezadoSeccion
        titulo="Inventario"
        descripcion="Cuentas cargadas y sus pantallas. Al cargar una cuenta se crean sus pantallas automáticamente."
        accion={<button onClick={() => { setExito(""); setCreando(true) }} className="boton-primario"><Plus size={16} /> Cargar cuenta</button>}
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <CampoSelect
          aria-label="Filtrar por plataforma"
          value={filtros.plataforma}
          onChange={filtrar("plataforma")}
          opciones={[{ valor: "", texto: "Todas las plataformas" }, ...plataformas.map((p) => ({ valor: p.id, texto: p.nombre }))]}
        />
        <CampoSelect aria-label="Filtrar por estado" value={filtros.estado} onChange={filtrar("estado")} opciones={ESTADOS_CUENTA} />
      </div>

      {exito && <div className="mb-4"><Aviso tipo="exito">{exito}</Aviso></div>}
      {error && <Aviso tipo="error">{error}</Aviso>}
      {!error && !resultado && <Cargando texto="Cargando inventario..." />}

      {resultado && resultado.total === 0 && (
        <p className="py-16 text-center text-zinc-400">No hay cuentas con estos filtros.</p>
      )}

      {resultado && resultado.total > 0 && (
        <>
          <p className="mb-3 text-sm text-zinc-500">{resultado.total} cuenta{resultado.total === 1 ? "" : "s"}</p>
          <ul className="space-y-3">
            {resultado.data.map((cuenta) => (
              <li key={cuenta.id} className="superficie overflow-hidden">
                <button
                  onClick={() => setAbierta(abierta === cuenta.id ? null : cuenta.id)}
                  aria-expanded={abierta === cuenta.id}
                  className="flex w-full items-center gap-4 p-4 text-left hover:bg-white/5"
                >
                  <PlataformaLogo nombre={cuenta.plataforma.nombre} tamano="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{cuenta.correoAcceso}</p>
                    <p className="text-sm text-zinc-400">
                      {cuenta.plataforma.nombre} · {cuenta.pantallasVendidas} de {cuenta.pantallasTotal} pantallas vendidas · cargada el {formatoFecha(cuenta.createdAt)}
                    </p>
                  </div>
                  <EstadoBadge estado={cuenta.estado} />
                  <ChevronDown size={18} className={`shrink-0 text-zinc-400 transition ${abierta === cuenta.id ? "rotate-180" : ""}`} />
                </button>

                {abierta === cuenta.id && (
                  <div className="grid gap-2 border-t border-borde bg-fondo/50 p-4 sm:grid-cols-2 lg:grid-cols-3">
                    {cuenta.pantallas.map((pantalla) => (
                      <div key={pantalla.id} className="flex items-center justify-between gap-3 rounded-lg border border-borde px-4 py-3 text-sm">
                        <div>
                          <p className="font-medium">{pantalla.nombrePerfil}</p>
                          <p className="text-zinc-500">PIN {pantalla.pin}</p>
                        </div>
                        <EstadoBadge estado={pantalla.estado} />
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
          <Paginacion resultado={resultado} onCambiar={(page) => setFiltros({ ...filtros, page })} />
        </>
      )}

      {creando && <FormularioCuenta plataformas={plataformas} onCerrar={() => setCreando(false)} onCreada={alCrear} />}
    </>
  )
}

function FormularioCuenta({ plataformas, onCerrar, onCreada }) {
  const activas = plataformas.filter((p) => p.estado === 1)
  const [form, setForm] = useState({ plataformaId: activas[0]?.id ?? "", correoAcceso: "", contrasenaAcceso: "" })
  const [errores, setErrores] = useState({})
  const [error, setError] = useState("")
  const [guardando, setGuardando] = useState(false)

  const plataforma = activas.find((p) => p.id === Number(form.plataformaId))
  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  const guardar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setErrores({})
    setError("")
    try {
      onCreada(await adminApi.crearCuenta({ ...form, plataformaId: Number(form.plataformaId) }))
    } catch (err) {
      const campos = erroresPorCampo(err)
      if (Object.keys(campos).length) setErrores(campos)
      else setError(mensajeError(err))
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Modal titulo="Cargar cuenta" onCerrar={onCerrar}>
      <form onSubmit={guardar} className="space-y-5">
        <CampoSelect
          etiqueta="Plataforma"
          value={form.plataformaId}
          onChange={cambiar("plataformaId")}
          error={errores.plataformaId}
          opciones={activas.map((p) => ({ valor: p.id, texto: p.nombre }))}
        />
        <CampoTexto etiqueta="Correo de acceso" type="email" required value={form.correoAcceso} onChange={cambiar("correoAcceso")} error={errores.correoAcceso} placeholder="cuenta@demo.streamstore.test" />
        <CampoTexto etiqueta="Contraseña de acceso" required minLength={4} value={form.contrasenaAcceso} onChange={cambiar("contrasenaAcceso")} error={errores.contrasenaAcceso} />
        {plataforma && (
          <p className="text-sm text-zinc-400">
            Se crearán {plataforma.maxPantallas} pantallas con su perfil y un PIN aleatorio. La contraseña se guarda cifrada.
          </p>
        )}
        <Aviso tipo="error">{error}</Aviso>
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onCerrar} className="boton-secundario">Cancelar</button>
          <button type="submit" disabled={guardando || !form.plataformaId} className="boton-primario">{guardando ? "Guardando..." : "Cargar cuenta"}</button>
        </div>
      </form>
    </Modal>
  )
}
