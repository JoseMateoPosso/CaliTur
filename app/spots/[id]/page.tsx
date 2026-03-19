import Link from "next/link";
import InteractiveRating from "../../components/InteractiveRating";
import MapWrapper from "../../components/MapWrapper";
import ReviewsList from "../../components/ReviewsList";

interface TouristSpot {
    id: number;
    name: string;
    description: string;
    imageUrl: string | null;
    category?: string;
    latitude?: number | null;
    longitude?: number | null;
}

export default async function SpotDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tourist-spots/${id}`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        return (
            <main
                className="min-h-screen bg-[#fff5f5] flex items-center justify-center px-4"
                style={{ fontFamily: "sans-serif" }}
            >
                <div className="text-center">
                    <span className="text-7xl block mb-4">😢</span>
                    <h1 className="text-3xl font-bold text-[#c0392b] mb-2">
                        Sitio no encontrado
                    </h1>
                    <p className="text-[#7c3a2e] mb-6">
                        El sitio turístico que buscas no existe o fue eliminado.
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-[#c0392b] hover:bg-[#a93226] text-white font-semibold py-3 px-7 rounded-full transition-colors"
                    >
                        ← Volver al inicio
                    </Link>
                </div>
            </main>
        );
    }

    const spot: TouristSpot = await res.json();

    return (
        <main className="min-h-screen bg-[#fff5f5]" style={{ fontFamily: "sans-serif" }}>

            {/* ── HERO CON IMAGEN ── */}
            <section className="relative w-full h-[65vh] min-h-[400px] overflow-hidden">
                {spot.imageUrl ? (
                    <img
                        src={spot.imageUrl}
                        alt={spot.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#c0392b] to-[#e57373] flex items-center justify-center">
                        <span className="text-white text-6xl opacity-20">📷</span>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <Link
                    href="/"
                    className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm hover:bg-white text-[#c0392b] font-semibold text-sm py-2 px-5 rounded-full transition-all shadow-md"
                >
                    ← Inicio
                </Link>

                <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 sm:px-12">
                    {spot.category && (
                        <span className="inline-block bg-[#f59e0b] text-[#1c1917] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                            {spot.category}
                        </span>
                    )}
                    <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight">
                        {spot.name}
                    </h1>
                </div>
            </section>

            {/* ── CONTENIDO ── */}
            <section className="max-w-4xl mx-auto px-4 sm:px-8 py-12">

                {/* Descripción */}
                <div className="bg-white rounded-3xl border border-[#fde8e8] p-8 sm:p-12 mb-8 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-[#c0392b] rounded-full" />
                        <h2 className="text-xl font-bold text-[#1c1917]">Sobre este lugar</h2>
                    </div>
                    <p className="text-[#3d2b29] text-lg leading-relaxed whitespace-pre-line">
                        {spot.description}
                    </p>
                </div>

                {/* Mapa */}
                {spot.latitude && spot.longitude ? (
                    <div className="bg-white rounded-3xl border border-[#fde8e8] p-8 sm:p-12 mb-8 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-8 bg-[#f59e0b] rounded-full" />
                            <h2 className="text-xl font-bold text-[#1c1917]">📍 Ubicación</h2>
                        </div>
                        <div className="h-80 w-full rounded-2xl border border-gray-100 shadow-inner relative z-0 overflow-hidden">
                            <MapWrapper lat={spot.latitude} lng={spot.longitude} name={spot.name} />
                        </div>
                    </div>
                ) : (
                    <div className="bg-white/50 border border-[#fde8e8] p-6 rounded-3xl text-[#c4908a] text-sm italic mb-8 text-center shadow-sm">
                        📍 La ubicación exacta en el mapa aún no está disponible para este sitio.
                    </div>
                )}

                {/* Reseñas existentes */}
                <ReviewsList spotId={spot.id} />

                {/* Formulario nueva reseña */}
                <InteractiveRating spotId={spot.id} />

                {/* Botón volver */}
                <div className="mt-10 text-center">
                    <Link
                        href="/"
                        className="inline-block bg-[#1c1917] hover:bg-[#c0392b] text-white font-semibold py-3 px-8 rounded-full transition-colors duration-300 text-sm"
                    >
                        ← Explorar más sitios de Cali
                    </Link>
                </div>
            </section>
        </main>
    );
}