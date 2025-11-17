import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface LatLng {
  lat: number;
  lng: number;
}

interface RouteSearchFormProps {
  onSearch: (start: string, end: string) => void;
}

export default function RouteSearchForm({ onSearch }: RouteSearchFormProps) {
  const [startAddress, setStartAddress] = useState("");
  const [endAddress, setEndAddress] = useState("");

  // Função para buscar coordenadas no Nominatim
  async function fetchCoords(address: string): Promise<LatLng | null> {
    try {
      const query = encodeURIComponent(`${address}, Campinas, Brazil`);
      const isLocal = window.location.hostname === "localhost";

        const API_URL = isLocal
        ? "http://localhost:8080"
        : "https://projetozanza-production.up.railway.app";

        const res = await fetch(`${API_URL}/api/geocode?q=${query}`);
            const data = await res.json();

      if (!data.length) return null;

      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    } catch {
      return null;
    }
  }

  async function handleSearch() {
    if (!startAddress || !endAddress) {
      alert("Preencha os dois endereços.");
      return;
    }

    const start = await fetchCoords(startAddress);
    const end = await fetchCoords(endAddress);

    if (!start) {
      alert("Ponto de partida não encontrado!");
      return;
    }
    if (!end) {
      alert("Ponto de chegada não encontrado!");
      return;
    }

    onSearch(startAddress, endAddress);
  }

  return (
    <div className="p-3 bg-gray-100 rounded-xl space-y-2">
      <Input
        placeholder="Ponto de partida"
        value={startAddress}
        onChange={(e) => setStartAddress(e.target.value)}
      />

      <Input
        placeholder="Ponto de chegada"
        value={endAddress}
        onChange={(e) => setEndAddress(e.target.value)}
      />

      <Button className="w-full" onClick={handleSearch}>
        Buscar rotas
      </Button>
    </div>
  );
}
