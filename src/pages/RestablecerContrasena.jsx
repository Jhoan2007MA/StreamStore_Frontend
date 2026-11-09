import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { mensajeError } from "../api/client"
import { authApi } from "../api/servicios"
import Aviso from "../components/Aviso"
import { CampoTexto, TarjetaFormulario } from "../components/Formulario"

// Las mismas reglas de contraseña que valida el backend
const validar = (form) => {
  const errores = {}
  if (form.contrasena.length < 8) errores.contrasena = "Mínimo 8 caracteres"
  else if (!/[A-Za-z]/.test(form.contrasena) || !/[0-9]/.test(form.contrasena)) errores.contrasena = "Debe tener al menos una letra y un número"
  if (form.confirmar !== form.contrasena) errores.confirmar = "Las contraseñas no coinciden"
  return errores
}

// Paso 2 de la recuperación: el usuario llega aquí desde el enlace del correo
// (/restablecer-contrasena?token=...) y escribe su contraseña nueva.
export default function RestablecerContrasena() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get("token") ?? ""

  const [form, setForm] = useState({ contrasena: "", confirmar: "" })
  const [errores, setErrores] = useState({})
  const [error, setError] = useState("")
  const [enviando, setEnviando] = useState(false)

  // Sin token en la URL no hay nada que hacer: le ofrecemos pedir un enlace nuevo
  if (!token) {
    return (
      <TarjetaFormulario titulo="Enlace inválido" subtitulo="Este enlace no es válido o está incompleto.">
        <Link to="/recuperar-contrasena" className="boton-primario block w-full text-center">Pedir un enlace nuevo</Link>
      </TarjetaFormulario>
    )
  }

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const enviar = async (e) => {
    e.preventDefault()
    setError("")
    const encontrados = validar(form)
    setErrores(encontrados)
    if (Object.keys(encontrados).length > 0) return

    setEnviando(true)
    try {
      const mensaje = await authApi.restablecer(token, form.contrasena)
      // Al cambiar la contraseña el backend cierra las sesiones abiertas: toca entrar de nuevo
      navigate("/login", { replace: true, state: { aviso: mensaje } })
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <TarjetaFormulario titulo="Nueva contraseña" subtitulo="Escribe la contraseña que quieres usar a partir de ahora.">
      <form onSubmit={enviar} className="space-y-4" noValidate>
        <Aviso tipo="error">{error}</Aviso>
        <CampoTexto etiqueta="Nueva contraseña" name="contrasena" type="password" autoComplete="new-password" value={form.contrasena} onChange={cambiar} error={errores.contrasena} />
        <CampoTexto etiqueta="Confirmar contraseña" name="confirmar" type="password" autoComplete="new-password" value={form.confirmar} onChange={cambiar} error={errores.confirmar} />
        <button disabled={enviando} className="boton-primario w-full">
          {enviando ? "Guardando..." : "Guardar contraseña"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-400">
        ¿El enlace venció?{" "}
        <Link to="/recuperar-contrasena" className="enlace-linea text-brand">Pide uno nuevo</Link>
      </p>
    </TarjetaFormulario>
  )
}
