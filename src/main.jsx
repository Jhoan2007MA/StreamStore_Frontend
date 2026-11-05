import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { CarritoProvider } from "./context/CarritoContext"
import App from "./App"
import "./index.css"

// Punto de entrada: React "monta" la app dentro del <div id="root"> de index.html.
// Los Providers envuelven la app para que cualquier página pueda leer la sesión y el carrito.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CarritoProvider>
          <App />
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
