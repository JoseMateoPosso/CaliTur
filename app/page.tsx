import Link from "next/link";
import SearchBar from "./components/SearchBar";

interface TouristSpot {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;

  let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/tourist-spots`;
  if (search) {
    apiUrl += `?search=${search}`;
  }

  const res = await fetch(apiUrl, { cache: "no-store" });
  const paginatedResponse = await res.json();
  const spots: TouristSpot[] = paginatedResponse.data;

  return (
    <div className="min-h-screen bg-[#fff5f5]" style={{ fontFamily: "sans-serif" }}>

      {/* ── HERO ── */}
      <section className="relative bg-[#1c1917] overflow-hidden">
        {/* Patrón decorativo de fondo */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #c0392b 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f59e0b 0%, transparent 40%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-20 sm:py-28 text-center">
          {/* Etiqueta superior */}
          <span className="inline-block bg-[#f59e0b]/15 text-[#f59e0b] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-[#f59e0b]/30">
            Santiago de Cali, Colombia
          </span>

          <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight mb-6">
            Descubre la magia de{" "}
            <span className="text-[#c0392b]">Cali</span>
          </h1>

          <p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Explora los sitios turísticos más emblemáticos de la Sucursal del
            Cielo. Cultura, naturaleza, historia y sabor en un solo lugar.
          </p>

          {/* Barra de búsqueda */}
          <div className="max-w-xl mx-auto">
            <SearchBar />
          </div>

          {/* Estadísticas rápidas */}
          <div className="flex items-center justify-center gap-8 mt-12 flex-wrap">
            {[
              { valor: spots.length.toString(), label: "Sitios turísticos" },
              { valor: "1 ciudad", label: "Santiago de Cali" },
              { valor: "100%", label: "Gratis para explorar" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-[#f59e0b] text-2xl font-bold">{stat.valor}</p>
                <p className="text-white/50 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESULTADOS DE BÚSQUEDA ── */}
      {search && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
          <div className="flex items-center gap-3">
            <span className="text-[#1c1917] text-sm font-medium">
              Resultados para{" "}
              <span className="text-[#c0392b] font-bold">"{search}"</span>
              {" "}—{" "}
              <span className="text-[#7c3a2e]">{spots.length} sitio{spots.length !== 1 ? "s" : ""} encontrado{spots.length !== 1 ? "s" : ""}</span>
            </span>
            <Link
              href="/"
              className="text-xs text-[#c0392b] hover:underline ml-auto"
            >
              Limpiar búsqueda ×
            </Link>
          </div>
        </div>
      )}

      {/* ── GRILLA DE SITIOS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">

        {/* Encabezado de sección */}
        {!search && (
          <div className="flex items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#1c1917]">
                Todos los sitios
              </h2>
              <p className="text-[#7c3a2e] text-sm mt-0.5">
                Haz clic en cualquier lugar para ver más detalles
              </p>
            </div>
            <div className="ml-auto h-px flex-1 bg-[#fde8e8]" />
            <span className="text-[#c0392b] text-sm font-semibold bg-[#fde8e8] px-3 py-1 rounded-full">
              {spots.length} sitios
            </span>
          </div>
        )}

        {/* Sin resultados */}
        {spots.length === 0 && (
          <div className="text-center py-24">
            <span className="text-6xl block mb-4">🔍</span>
            <h3 className="text-xl font-bold text-[#1c1917] mb-2">
              No encontramos resultados
            </h3>
            <p className="text-[#7c3a2e] text-sm mb-6">
              Intenta con otro término de búsqueda.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#c0392b] hover:bg-[#a93226] text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-colors"
            >
              Ver todos los sitios
            </Link>
          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spots.map((spot) => (
            <Link
              key={spot.id}
              href={`/spots/${spot.id}`}
              className="group bg-white rounded-2xl overflow-hidden border border-[#fde8e8] hover:border-[#c0392b]/40 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Imagen */}
              <div className="relative overflow-hidden h-52 bg-[#fde8e8]">
                {spot.imageUrl ? (
                  <img
                    src={spot.imageUrl}
                    alt={spot.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#c4908a]">
                    <span className="text-4xl">📷</span>
                    <span className="text-xs">Sin imagen disponible</span>
                  </div>
                )}

                {/* Overlay sutil al hover */}
                <div className="absolute inset-0 bg-[#c0392b]/0 group-hover:bg-[#c0392b]/10 transition-colors duration-300" />
              </div>

              {/* Contenido */}
              <div className="p-5 flex flex-col flex-1">
                <h2 className="text-lg font-bold text-[#1c1917] mb-2 group-hover:text-[#c0392b] transition-colors leading-snug">
                  {spot.name}
                </h2>
                <p className="text-[#5a3e3b] text-sm leading-relaxed line-clamp-3 flex-1">
                  {spot.description}
                </p>

                {/* CTA */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[#c0392b] text-sm font-semibold group-hover:underline">
                    Ver detalles →
                  </span>
                  <span className="text-[#f59e0b] text-base">★★★★★</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── BANNER CTA ── */}
      <section className="bg-[#1c1917] mt-8 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            ¿Conoces un sitio que no está aquí?
          </h3>
          <p className="text-white/50 mb-8 text-sm">
            Ayúdanos a crecer el directorio turístico de Cali registrándote y
            añadiendo nuevos lugares.
          </p>
          <Link
            href="/register"
            className="inline-block bg-[#c0392b] hover:bg-[#a93226] text-white font-semibold px-8 py-3 rounded-full transition-colors mr-3"
          >
            Registrarse
          </Link>
          <Link
            href="/login"
            className="inline-block border border-white/20 hover:border-white/60 text-white/70 hover:text-white font-semibold px-8 py-3 rounded-full transition-all"
          >
            Ingresar
          </Link>
        </div>
      </section>
    </div>
  );
}