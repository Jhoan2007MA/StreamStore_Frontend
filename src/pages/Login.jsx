import { useState } from "react"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { mensajeError } from "../api/client"
import Aviso from "../components/Aviso"
import { CampoTexto, TarjetaFormulario } from "../components/Formulario"
import { useAuth } from "../context/AuthContext"

export default function Login() {
  const { usuario, esAdmin, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const desde = location.state?.desde // página a la que quería ir antes de pedirle login

  // "Estado" del formulario: lo que el usuario va escribiendo
  const [form, setForm] = useState({ correo: "", contrasena: "" })
  const [error, setError] = useState("")
  const [enviando, setEnviando] = useState(false)

  // Si ya tiene sesión, no tiene sentido mostrar el login
  if (usuario) return <Navigate to={desde ?? (esAdmin ? "/admin" : "/catalogo")} replace />

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const enviar = async (e) => {
    e.preventDefault() // evita que el navegador recargue la página al enviar el formulario
    setError("")
    if (!form.correo || !form.contrasena) {
      setError("Escribe tu correo y tu contraseña")
      return
    }
    setEnviando(true)
    try {
      const user = await login(form.correo, form.contrasena)
      const entroComoAdmin = [1, 2].includes(user.rolId)
      navigate(desde ?? (entroComoAdmin ? "/admin" : "/catalogo"), { replace: true })
    } catch (err) {
      // Contraseña correcta pero el correo aún no está verificado: lo llevamos a escribir el código
      const pendiente = err?.response?.data?.data
      if (err?.response?.status === 403 && pendiente?.verificado === false) {
        navigate(`/verificar-correo?correo=${encodeURIComponent(pendiente.correo)}`, {
          state: { desde, aviso: "Debes verificar tu correo antes de iniciar sesión. Si no tienes el código, pide uno nuevo." }
        })
        return
      }
      setError(mensajeError(err))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <TarjetaFormulario titulo="Iniciar sesión" subtitulo="Entra para comprar y ver tus servicios">
      <form onSubmit={enviar} className="space-y-4" noValidate>
        {/* Mensaje que llega de otra página, ej. "Tu contraseña fue actualizada" */}
        {!error && <Aviso tipo="exito">{location.state?.aviso}</Aviso>}
        <Aviso tipo="error">{error}</Aviso>
        <CampoTexto etiqueta="Correo" name="correo" type="email" autoComplete="email" value={form.correo} onChange={cambiar} />
        <CampoTexto etiqueta="Contraseña" name="contrasena" type="password" autoComplete="current-password" value={form.contrasena} onChange={cambiar} />
        <div className="text-right">
          <Link to="/recuperar-contrasena" className="enlace-linea text-xs text-suave hover:text-tinta">¿Olvidaste tu contraseña?</Link>
        </div>
        <button disabled={enviando} className="boton-primario w-full">
          {enviando ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-400">
        ¿No tienes cuenta?{" "}
        <Link to="/registro" state={{ desde }} className="enlace-linea text-brand">Regístrate</Link>
      </p>
    </TarjetaFormulario>
  )
}
