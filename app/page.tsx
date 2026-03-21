import Link from "next/link";
import SearchBar from "./components/SearchBar";
import {TouristSpot, Category, Meta} from "@/types";

// Diccionario visual constante fuera del componente para no re-renderizarlo
const categoryIcons: Record<string, string> = {
  Cultura: "🎭",
  Naturaleza: "🌿",
  Gastronomía: "🍲",
  Historia: "🏛️",
  "Vida Nocturna": "💃",
  Aventura: "🧗",
  default: "📍",
};

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string; category?: string }>;
}) {
  // Extraemos category (AQUÍ AHORA LLEGA EL ID, ej: "2")
  const { search, page, category } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;

  // Construcción segura de Query Params para el Backend
  const params = new URLSearchParams();
  params.set("page", String(currentPage));
  params.set("limit", "9");
  if (search) params.set("search", search);
  if (category) params.set("category", category); // Enviamos el ID al backend

  async function fetchTouristSpots() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tourist-spots/?${params.toString()}`,
        { cache: "no-store" } // Evita caché estática en listados dinámicos
      );

      if (!res.ok) {
        console.warn("Backend dormido o error de respuesta:", res.statusText);
        return null;
      }
      return await res.json();
    } catch (error) {
      console.error("Error de red (Backend posiblemente apagado):", error);
      return null;
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`, {
        cache: "no-store"
      });
      if (!res.ok) {
        console.warn("No se pudieron cargar las categorías:", res.statusText);
        return [];
      }
      return await res.json();
    } catch (error) {
      console.error("Error de red al cargar categorías:", error);
      return [];
    }
  }

  // Promise.all para reducir el tiempo de carga a la mitad (Paralelismo)
  const [paginatedResponse, dynamicCategories] = await Promise.all([
    fetchTouristSpots(),
    fetchCategories(),
  ]);

  // Paracaídas de seguridad ante caídas del servidor
  const spots: TouristSpot[] = paginatedResponse?.data || [];
  const meta: Meta | undefined = paginatedResponse?.meta;
  const categories: Category[] = dynamicCategories || [];

  // Como 'category' en la URL es un ID (ej: "3"), 
  // buscamos el objeto real en el array para mostrar su nombre en la UI ("Filtrando por: Gastronomía")
  const activeCategoryObj = categories.find((c) => String(c.id) === category);
  const activeCategoryName = activeCategoryObj ? activeCategoryObj.name : null;

  // Constructor maestro de URLs para manejar estados complejos de filtrado
  const buildFilterUrl = (p: number, categoryId?: string | null) => {
    const q = new URLSearchParams();
    q.set("page", String(p));

    // Mantenemos la búsqueda si existe
    if (search) q.set("search", search);

    // Lógica robusta: Si nos pasan null, borramos la categoría (botón "Todos").
    // Si nos pasan un ID, lo usamos. Si no nos pasan este argumento, mantenemos el ID actual.
    if (categoryId !== null) {
      const catToUse = categoryId !== undefined ? categoryId : category;
      if (catToUse) q.set("category", catToUse);
    }

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

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 text-center">
          <span className="inline-block bg-[#f59e0b]/15 text-[#f59e0b] text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 border border-[#f59e0b]/30">
            Santiago de Cali, Colombia
          </span>

          <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight mb-6">
            Descubre la magia de{" "}
            <span className="text-[#c0392b]">Cali</span>
          </h1>

          <p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Explora los sitios turísticos más emblemáticos de la Sucursal del
            Cielo. Cultura, naturaleza e historia en un solo lugar.
          </p>

          <div className="max-w-xl mx-auto mb-12">
            <SearchBar />
          </div>

          {/* ── FILTRO DE CATEGORÍAS (DINÁMICO POR ID) ── */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-8 pb-12">
            <div className="flex flex-wrap justify-center gap-3">
              {/* Botón "Todos" pasa 'null' para limpiar la categoría de la URL */}
              <Link
                href={buildFilterUrl(1, null)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${!category
                  ? "bg-[#c0392b] text-white shadow-lg scale-105"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
              >
                Todos
              </Link>

              {/* Iteramos sobre las categorías de la API */}
              {categories.map((cat: Category) => {
                // Verificamos si esta categoría es la activa (comparando IDs como strings)
                const isActive = category === String(cat.id);

                return (
                  <Link
                    key={cat.id}
                    href={buildFilterUrl(1, String(cat.id))} // Pasamos el ID a la URL
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${isActive
                      ? "bg-[#c0392b] text-white shadow-lg scale-105 border border-white/20"
                      : "bg-white/10 text-white/70 hover:bg-white/20 border border-transparent"
                      }`}
                  >
                    <span>{categoryIcons[cat.name] || categoryIcons.default}</span>
                    {cat.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-center gap-8 mt-12 flex-wrap border-t border-white/10 pt-8">
            {[
              { valor: meta ? String(meta.total) : String(spots.length), label: "Sitios encontrados" },
              { valor: "Cali", label: "Ubicación" },
              { valor: "Gratis", label: "Acceso" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-[#f59e0b] text-2xl font-bold">{stat.valor}</p>
                <p className="text-white/50 text-xs mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEEDBACK DE BÚSQUEDA / FILTRO ── */}
      {(search || category) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
          <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-[#fde8e8] shadow-sm">
            <span className="text-[#1c1917] text-sm">
              Filtrando por:{" "}
              {/* Mostramos el nombre, no el ID, para mejor UX */}
              {activeCategoryName && (
                <span className="bg-[#fde8e8] text-[#c0392b] px-2 py-0.5 rounded font-bold mx-1">
                  {activeCategoryName}
                </span>
              )}
              {search && (
                <>
                  Búsqueda: <span className="bg-[#fde8e8] text-[#c0392b] px-2 py-0.5 rounded font-bold mx-1">"{search}"</span>
                </>
              )}
            </span>
            <Link href={buildFilterUrl(1, null)} className="text-xs text-[#c0392b] font-bold hover:underline ml-auto">
              Limpiar filtros ×
            </Link>
          </div>
        </div>
      )}

      {/* ── GRILLA DE SITIOS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        {spots.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#c4908a]/30">
            <span className="text-6xl block mb-4">📍</span>
            <h3 className="text-xl font-bold text-[#1c1917] mb-2">No hay sitios disponibles</h3>
            <p className="text-[#7c3a2e] text-sm mb-6">Parece que no hay resultados para esta selección.</p>
            <Link href="/" className="bg-[#c0392b] text-white px-6 py-2 rounded-full text-sm font-bold">Ver todo</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {spots.map((spot) => (
              <Link
                key={spot.id}
                href={`/spots/${spot.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-[#fde8e8] hover:border-[#c0392b]/40 hover:shadow-2xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-56 bg-[#fde8e8] overflow-hidden">
                  {spot.imageUrl ? (
                    <img
                      src={spot.imageUrl}
                      alt={spot.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#c4908a]">📷</div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#1c1917]/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter">
                      {spot.categories?.[0]?.name || "General"}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#1c1917] mb-2 group-hover:text-[#c0392b] transition-colors">
                    {spot.name}
                  </h2>
                  <p className="text-[#5a3e3b] text-sm line-clamp-2 mb-4">{spot.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-[#fde8e8]">
                    <span className="text-[#c0392b] text-xs font-bold uppercase tracking-wider">Explorar sitio</span>
                    <span className="text-[#f59e0b]">★★★★★</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ── PAGINACIÓN ── */}
        {meta && meta.lastPage > 1 && (
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-[#fde8e8]">
            <p className="text-sm text-[#7c3a2e]">
              Página <span className="font-bold text-[#1c1917]">{meta.currentPage}</span> de {meta.lastPage}
            </p>

            <div className="flex items-center gap-2">
              <Link
                href={buildFilterUrl(meta.currentPage - 1)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${meta.currentPage > 1 ? "bg-white border border-[#fde8e8] text-[#1c1917] hover:bg-[#fff5f5]" : "opacity-0 pointer-events-none"
                  }`}
              >
                Anterior
              </Link>

              <div className="flex gap-1">
                {Array.from({ length: meta.lastPage }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={buildFilterUrl(p)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${p === meta.currentPage ? "bg-[#c0392b] text-white shadow-md" : "bg-white border border-[#fde8e8] text-[#1c1917] hover:bg-[#fff5f5]"
                      }`}
                  >
                    {p}
                  </Link>
                ))}
              </div>

              <Link
                href={buildFilterUrl(meta.currentPage + 1)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${meta.currentPage < meta.lastPage ? "bg-white border border-[#fde8e8] text-[#1c1917] hover:bg-[#fff5f5]" : "opacity-0 pointer-events-none"
                  }`}
              >
                Siguiente
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="bg-[#1c1917] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">¿Tu sitio favorito no está aquí?</h2>
          <p className="text-white/50 mb-10 max-w-lg mx-auto">Únete a la comunidad de CaliTur y ayuda a otros viajeros a descubrir los rincones ocultos de la ciudad.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register" className="bg-[#c0392b] text-white px-10 py-4 rounded-full font-bold hover:bg-[#a93226] transition-all">Crear cuenta</Link>
            <Link href="/login" className="bg-white/5 text-white border border-white/10 px-10 py-4 rounded-full font-bold hover:bg-white/10 transition-all">Iniciar Sesión</Link>
          </div>
        </div>
      </section>
    </div>
  );
}