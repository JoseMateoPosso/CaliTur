import Link from "next/link";
import SearchBar from "./components/SearchBar";

interface TouristSpot {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
}

interface Meta {
  total: number;
  currentPage: number;
  lastPage: number;
  limit: number;
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { search, page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  // Armamos la URL con todos los parámetros
  const params = new URLSearchParams();
  params.set("page", String(currentPage));
  params.set("limit", "9"); // 3 columnas × 3 filas
  if (search) params.set("search", search);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tourist-spots?${params.toString()}`,
    { cache: "no-store" }
  );

  const paginatedResponse = await res.json();
  const spots: TouristSpot[] = paginatedResponse.data;
  const meta: Meta | undefined = paginatedResponse.meta;

  // Construye la URL para los links de paginación conservando el search
  const buildPageUrl = (p: number) => {
    const q = new URLSearchParams();
    q.set("page", String(p));
    if (search) q.set("search", search);
    return `/?${q.toString()}`;
  };

  return (
    <div className="min-h-screen bg-[#fff5f5]" style={{ fontFamily: "sans-serif" }}>

      {/* ── HERO ── */}
      <section className="relative bg-[#1c1917] overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #c0392b 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f59e0b 0%, transparent 40%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-20 sm:py-28 text-center">
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

          <div className="max-w-xl mx-auto">
            <SearchBar />
          </div>

          <div className="flex items-center justify-center gap-8 mt-12 flex-wrap">
            {[
              { valor: meta ? String(meta.total) : String(spots.length), label: "Sitios turísticos" },
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
              <span className="text-[#7c3a2e]">
                {meta?.total ?? spots.length} sitio{(meta?.total ?? spots.length) !== 1 ? "s" : ""} encontrado{(meta?.total ?? spots.length) !== 1 ? "s" : ""}
              </span>
            </span>
            <Link href="/" className="text-xs text-[#c0392b] hover:underline ml-auto">
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
              <h2 className="text-2xl font-bold text-[#1c1917]">Todos los sitios</h2>
              <p className="text-[#7c3a2e] text-sm mt-0.5">
                Haz clic en cualquier lugar para ver más detalles
              </p>
            </div>
            <div className="ml-auto h-px flex-1 bg-[#fde8e8]" />
            <span className="text-[#c0392b] text-sm font-semibold bg-[#fde8e8] px-3 py-1 rounded-full">
              {meta?.total ?? spots.length} sitios
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
                <div className="absolute inset-0 bg-[#c0392b]/0 group-hover:bg-[#c0392b]/10 transition-colors duration-300" />
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h2 className="text-lg font-bold text-[#1c1917] mb-2 group-hover:text-[#c0392b] transition-colors leading-snug">
                  {spot.name}
                </h2>
                <p className="text-[#5a3e3b] text-sm leading-relaxed line-clamp-3 flex-1">
                  {spot.description}
                </p>
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

        {/* ── PAGINACIÓN ── */}
        {meta && meta.lastPage > 1 && (
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Info */}
            <p className="text-sm text-[#7c3a2e]">
              Página{" "}
              <span className="font-bold text-[#1c1917]">{meta.currentPage}</span>
              {" "}de{" "}
              <span className="font-bold text-[#1c1917]">{meta.lastPage}</span>
              {" "}— {meta.total} sitios en total
            </p>

            {/* Controles */}
            <div className="flex items-center gap-2">

              {/* Anterior */}
              {meta.currentPage > 1 ? (
                <Link
                  href={buildPageUrl(meta.currentPage - 1)}
                  className="px-4 py-2 rounded-full border border-[#fde8e8] bg-white text-[#1c1917] text-sm font-semibold hover:bg-[#fff5f5] hover:border-[#c0392b]/30 transition-all"
                >
                  ← Anterior
                </Link>
              ) : (
                <span className="px-4 py-2 rounded-full border border-[#fde8e8] bg-[#fff9f9] text-[#c4908a] text-sm font-semibold cursor-not-allowed">
                  ← Anterior
                </span>
              )}

              {/* Números de página */}
              <div className="flex items-center gap-1">
                {Array.from({ length: meta.lastPage }, (_, i) => i + 1).map((p) => {
                  const isActive = p === meta.currentPage;
                  // Mostrar: primera, última, actual y sus vecinas
                  const show =
                    p === 1 ||
                    p === meta.lastPage ||
                    Math.abs(p - meta.currentPage) <= 1;

                  // Puntos suspensivos
                  const showDotsBefore =
                    p === meta.currentPage - 2 && meta.currentPage - 2 > 1;
                  const showDotsAfter =
                    p === meta.currentPage + 2 && meta.currentPage + 2 < meta.lastPage;

                  if (showDotsBefore || showDotsAfter) {
                    return (
                      <span key={p} className="text-[#c4908a] text-sm px-1">
                        …
                      </span>
                    );
                  }

                  if (!show) return null;

                  return (
                    <Link
                      key={p}
                      href={buildPageUrl(p)}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-[#c0392b] text-white shadow-sm"
                          : "bg-white border border-[#fde8e8] text-[#1c1917] hover:bg-[#fff5f5] hover:border-[#c0392b]/30"
                      }`}
                    >
                      {p}
                    </Link>
                  );
                })}
              </div>

              {/* Siguiente */}
              {meta.currentPage < meta.lastPage ? (
                <Link
                  href={buildPageUrl(meta.currentPage + 1)}
                  className="px-4 py-2 rounded-full border border-[#fde8e8] bg-white text-[#1c1917] text-sm font-semibold hover:bg-[#fff5f5] hover:border-[#c0392b]/30 transition-all"
                >
                  Siguiente →
                </Link>
              ) : (
                <span className="px-4 py-2 rounded-full border border-[#fde8e8] bg-[#fff9f9] text-[#c4908a] text-sm font-semibold cursor-not-allowed">
                  Siguiente →
                </span>
              )}
            </div>
          </div>
        )}
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