"use client";

import dynamic from "next/dynamic";

// Como este es un Client Component, Next.js sí nos permite apagar el SSR aquí
const MapComponent = dynamic(() => import("./MapComponent"), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#fff9f9] animate-pulse flex items-center justify-center text-[#c4908a] text-sm">
      🗺️ Cargando mapa interactivo...
    </div>
  )
});

export default function MapWrapper({ lat, lng, name }: { lat: number; lng: number; name: string }) {
  return <MapComponent lat={lat} lng={lng} name={name} />;
}