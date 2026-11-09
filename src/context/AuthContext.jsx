import { createContext, useContext, useEffect, useState } from "react"
import { authApi } from "../api/servicios"

// Un "contexto" es una caja de datos que cualquier componente puede leer
// sin pasarla de padre a hijo. Aquí guardamos quién está logueado.
const AuthContext = createContext(null)

// En el backend: rolId 1 = superadmin, 2 = administrador, 3 = cliente
const ROLES_ADMIN = [1, 2]

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true) // true mientras preguntamos al backend si hay sesión

  // Al abrir la página preguntamos "¿quién soy?". Si la cookie de sesión sigue viva, el backend nos responde el usuario.
  useEffect(() => {
    authApi.yo()
      .then(setUsuario)
      .catch(() => setUsuario(null))
      .finally(() => setCargando(false))
  }, [])

  const login = async (correo, contrasena) => {
    const { user } = await authApi.login(correo, contrasena)
    setUsuario(user)
    return user
  }

  // Crea la cuenta pero NO inicia sesión: primero hay que verificar el correo con el código
  const registro = (form) => authApi.registro(form)

  // Valida el código del correo; si es correcto el backend inicia la sesión
  const verificar = async (correo, codigo) => {
    const { user } = await authApi.verificar(correo, codigo)
    setUsuario(user)
    return user
  }

  const reenviarCodigo = (correo) => authApi.reenviarCodigo(correo)

  const logout = async () => {
    await authApi.logout().catch(() => {})
    setUsuario(null)
  }

  const esAdmin = usuario ? ROLES_ADMIN.includes(usuario.rolId) : false
  const esCliente = usuario ? usuario.rolId === 3 : false

  return (
    <AuthContext.Provider value={{ usuario, cargando, esAdmin, esCliente, login, registro, verificar, reenviarCodigo, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// "Hook" para usar la sesión en cualquier componente: const { usuario } = useAuth()
export const useAuth = () => useContext(AuthContext)
