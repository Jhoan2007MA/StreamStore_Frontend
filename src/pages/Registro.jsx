import { useState } from "react"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { mensajeError } from "../api/client"
import Aviso from "../components/Aviso"
import { CampoTexto, TarjetaFormulario } from "../components/Formulario"
import { useAuth } from "../context/AuthContext"

// Las mismas reglas que valida el backend, para avisar antes de enviar
const validar = (form) => {
  const errores = {}
  if (form.nombre.trim().length < 2) errores.nombre = "Escribe tu nombre (mínimo 2 letras)"
  if (!/^\S+@\S+\.\S+$/.test(form.correo)) errores.correo = "Correo inválido"
  if (form.telefono && !/^\+?[0-9 ]{7,20}$/.test(form.telefono)) errores.telefono = "Teléfono inválido (solo números, 7 a 20)"
  if (form.contrasena.length < 8) errores.contrasena = "Mínimo 8 caracteres"
  else if (!/[A-Za-z]/.test(form.contrasena) || !/[0-9]/.test(form.contrasena)) errores.contrasena = "Debe tener al menos una letra y un número"
  if (form.confirmar !== form.contrasena) errores.confirmar = "Las contraseñas no coinciden"
  return errores
}

export default function Registro() {
  const { usuario, registro } = useAuth()
  const navigate = useNavigate()
  const desde = useLocation().state?.desde

  const [form, setForm] = useState({ nombre: "", correo: "", telefono: "", contrasena: "", confirmar: "" })
  const [errores, setErrores] = useState({})
  const [error, setError] = useState("")
  const [enviando, setEnviando] = useState(false)

  if (usuario) return <Navigate to={desde ?? "/"} replace />

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const enviar = async (e) => {
    e.preventDefault()
    setError("")
    const encontrados = validar(form)
    setErrores(encontrados)
    if (Object.keys(encontrados).length > 0) return

    setEnviando(true)
    try {
      // El teléfono es opcional: si está vacío no lo mandamos
      const { confirmar, telefono, ...datos } = form
      await registro(telefono ? { ...datos, telefono } : datos)
      navigate(desde ?? "/catalogo", { replace: true })
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <TarjetaFormulario titulo="Crear cuenta" subtitulo="Regístrate para comprar y recibir tus accesos">
      <form onSubmit={enviar} className="space-y-4" noValidate>
        <Aviso tipo="error">{error}</Aviso>
        <CampoTexto etiqueta="Nombre completo" name="nombre" autoComplete="name" value={form.nombre} onChange={cambiar} error={errores.nombre} />
        <CampoTexto etiqueta="Correo" name="correo" type="email" autoComplete="email" value={form.correo} onChange={cambiar} error={errores.correo} />
        <CampoTexto etiqueta="Teléfono (opcional)" name="telefono" type="tel" autoComplete="tel" value={form.telefono} onChange={cambiar} error={errores.telefono} />
        <CampoTexto etiqueta="Contraseña" name="contrasena" type="password" autoComplete="new-password" value={form.contrasena} onChange={cambiar} error={errores.contrasena} />
        <CampoTexto etiqueta="Confirmar contraseña" name="confirmar" type="password" autoComplete="new-password" value={form.confirmar} onChange={cambiar} error={errores.confirmar} />
        <button disabled={enviando} className="w-full rounded-xl bg-brand py-3 font-semibold hover:bg-brand-dark disabled:opacity-60">
          {enviando ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-400">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" state={{ desde }} className="font-semibold text-brand hover:underline">Inicia sesión</Link>
      </p>
    </TarjetaFormulario>
  )
}
