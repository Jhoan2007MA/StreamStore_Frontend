import { useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { mensajeError } from "../api/client"
import { authApi } from "../api/servicios"
import Aviso from "../components/Aviso"
import { CampoTexto, TarjetaFormulario } from "../components/Formulario"
import { useAuth } from "../context/AuthContext"

// Paso 1 de la recuperación: el usuario escribe su correo y el backend le envía un enlace.
// El backend siempre responde lo mismo (exista o no el correo) para no revelar quién está registrado.
export default function RecuperarContrasena() {
  const { usuario } = useAuth()
  const [correo, setCorreo] = useState("")
  const [error, setError] = useState("")
  const [aviso, setAviso] = useState("")
  const [enviando, setEnviando] = useState(false)

  // Si ya tiene sesión, no necesita recuperar nada
  if (usuario) return <Navigate to="/" replace />

  const enviar = async (e) => {
    e.preventDefault()
    setError("")
    setAviso("")
    if (!/^\S+@\S+\.\S+$/.test(correo)) {
      setError("Escribe un correo válido")
      return
    }
    setEnviando(true)
    try {
      setAviso(await authApi.recuperar(correo))
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <TarjetaFormulario titulo="Recuperar contraseña" subtitulo="Escribe el correo de tu cuenta y te enviaremos un enlace para crear una contraseña nueva.">
      <form onSubmit={enviar} className="space-y-4" noValidate>
        <Aviso tipo="error">{error}</Aviso>
        <Aviso tipo="exito">{aviso && `${aviso}. Revisa también la carpeta de spam. El enlace vence en 30 minutos.`}</Aviso>
        <CampoTexto etiqueta="Correo" name="correo" type="email" autoComplete="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        <button disabled={enviando} className="boton-primario w-full">
          {enviando ? "Enviando..." : aviso ? "Enviar de nuevo" : "Enviar enlace"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-400">
        ¿La recordaste?{" "}
        <Link to="/login" className="enlace-linea text-brand">Inicia sesión</Link>
      </p>
    </TarjetaFormulario>
  )
}
