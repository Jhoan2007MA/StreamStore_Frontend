import { useEffect, useState } from "react"
import { adminApi } from "../api/servicios"

// Todas las plataformas (activas e inactivas) para llenar filtros y formularios del panel
export function usePlataformasAdmin() {
  const [plataformas, setPlataformas] = useState([])

  useEffect(() => {
    adminApi.plataformas({ limit: 100 })
      .then((r) => setPlataformas(r.data))
      .catch(() => setPlataformas([]))
  }, [])

  return plataformas
}

// Errores por campo que devuelve el backend: { errors: { correoAcceso: ["..."] } } → { correoAcceso: "..." }
export const erroresPorCampo = (error) =>
  Object.fromEntries(Object.entries(error?.response?.data?.errors ?? {}).map(([campo, mensajes]) => [campo, [mensajes].flat()[0]]))
