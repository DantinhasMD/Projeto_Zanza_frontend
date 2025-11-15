// Detect environment automatically
const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
   window.location.hostname === "127.0.0.1");

// Backend URL (local vs produção)
export const API_BASE_URL = isLocalhost
  ? "http://localhost:8080/"
  : "https://projetozanza-production.up.railway.app/api";

// Optional: websocket, se você realmente for usar
export const WS_BASE_URL = API_BASE_URL.replace("http", "ws").replace("/api", "");

// App global config (mínimo necessário)
export const APP = {
  NAME: "Zanza",
  VERSION: "1.0.0",
  BACKEND: API_BASE_URL,
  WS: WS_BASE_URL,
};
