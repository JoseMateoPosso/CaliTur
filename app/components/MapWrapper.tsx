"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Esto es vital para Leaflet porque usa 'window' y 'document'.
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  // Agregamos un loading más profesional (puedes ajustar los colores)
  loading: () => (
    <div className="w-full h-full bg-[#333] animate-pulse flex items-center justify-center text-[#ddd] text-sm rounded-lg border border-gray-700">
      <div className="text-center">
        🗺️<br />
        Cargando mapa interactivo de CaliTur...
      </div>
    </div>
  )
});

// Definimos la interfaz para TypeScript (Mantenibilidad ISO 25010)
interface MapWrapperProps {
  lat: number;
  lng: number;
  name: string;
}

export default function MapWrapper({ lat, lng, name }: MapWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Al ejecutarse useEffect, sabemos que estamos en el cliente (navegador).
    setMounted(true);
  }, []);

  // Si no está montado (estamos en el servidor), no renderizamos nada o mostramos el loading.
  if (!mounted) {
    return (
      <div className="w-full h-full bg-[#333] animate-pulse flex items-center justify-center text-[#ddd] text-sm rounded-lg border border-gray-700">
        <div className="text-center">
          🗺️<br />
          Preparando mapa...
        </div>
      </div>
    );
  }

  return <MapComponent lat={lat} lng={lng} name={name} />;
}