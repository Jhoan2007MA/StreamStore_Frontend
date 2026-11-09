import { useEffect, useState } from "react"
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { mensajeError } from "../api/client"
import Aviso from "../components/Aviso"
import { CampoTexto, TarjetaFormulario } from "../components/Formulario"
import { useAuth } from "../context/AuthContext"

// El backend solo deja pedir un código nuevo cada 60 segundos
const ESPERA_REENVIO = 60

export default function VerificarCorreo() {
  const { usuario, esAdmin, verificar, reenviarCodigo } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const desde = location.state?.desde
  // El correo viaja en la URL (?correo=...) para no perderlo si el usuario recarga la página
  const [params] = useSearchParams()

  const [correo, setCorreo] = useState(params.get("correo") ?? "")
  const [codigo, setCodigo] = useState("")
  const [error, setError] = useState("")
  const [aviso, setAviso] = useState(location.state?.aviso ?? "")
  const [enviando, setEnviando] = useState(false)
  // Si venimos del registro el código acaba de salir, así que arrancamos con la espera completa
  const [espera, setEspera] = useState(location.state?.codigoEnviado ? ESPERA_REENVIO : 0)

  // Cuenta regresiva del botón "Reenviar código"
  useEffect(() => {
    if (espera <= 0) return
    const id = setTimeout(() => setEspera(espera - 1), 1000)
    return () => clearTimeout(id)
  }, [espera])

  if (usuario) return <Navigate to={desde ?? (esAdmin ? "/admin" : "/catalogo")} replace />

  const enviar = async (e) => {
    e.preventDefault()
    setError("")
    setAviso("")
    if (!/^\S+@\S+\.\S+$/.test(correo)) {
      setError("Escribe el correo con el que te registraste")
      return
    }
    if (!/^[0-9]{6}$/.test(codigo)) {
      setError("El código tiene 6 dígitos")
      return
    }

    setEnviando(true)
    try {
      await verificar(correo, codigo)
      navigate(desde ?? "/catalogo", { replace: true })
    } catch (err) {
      setError(mensajeError(err))
    } finally {
      setEnviando(false)
    }
  }

  const reenviar = async () => {
    setError("")
    setAviso("")
    if (!/^\S+@\S+\.\S+$/.test(correo)) {
      setError("Escribe el correo con el que te registraste")
      return
    }
    try {
      setAviso(await reenviarCodigo(correo))
      setCodigo("")
      setEspera(ESPERA_REENVIO)
    } catch (err) {
      setError(mensajeError(err))
    }
  }

  // Solo dejamos escribir números, máximo 6
  const cambiarCodigo = (e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))

  return (
    <TarjetaFormulario titulo="Verifica tu correo" subtitulo="Te enviamos un código de 6 dígitos. Escríbelo aquí para activar tu cuenta.">
      <form onSubmit={enviar} className="space-y-4" noValidate>
        <Aviso tipo="error">{error}</Aviso>
        <Aviso tipo="exito">{aviso}</Aviso>
        <CampoTexto etiqueta="Correo" name="correo" type="email" autoComplete="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        <CampoTexto
          etiqueta="Código de verificación"
          name="codigo"
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="000000"
          maxLength={6}
          value={codigo}
          onChange={cambiarCodigo}
          className="text-center text-2xl tracking-[0.5em]"
        />
        <button disabled={enviando} className="boton-primario w-full">
          {enviando ? "Verificando..." : "Verificar cuenta"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-zinc-400">
        ¿No te llegó?{" "}
        {espera > 0 ? (
          <span>Puedes pedir otro en {espera} s</span>
        ) : (
          <button type="button" onClick={reenviar} className="enlace-linea text-brand">Reenviar código</button>
        )}
      </p>
      <p className="mt-3 text-center text-sm text-zinc-400">
        <Link to="/login" state={{ desde }} className="enlace-linea text-brand">Volver a iniciar sesión</Link>
      </p>
    </TarjetaFormulario>
  )
}
