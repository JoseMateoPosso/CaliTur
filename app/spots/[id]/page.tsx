import Link from "next/link";
import InteractiveRating from "../../components/InteractiveRating";

// La misma interfaz de nuestros datos
interface TouristSpot {
    id: number;
    name: string;
    description: string;
    imageUrl: string | null;
}

// Definimos que esta página recibe el [id] dinámico de la URL
export default async function SpotDetailsPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    // Extraemos el ID de la URL
    const { id } = await params;

    // Hacemos fetch a tu API para traer UN SOLO sitio turístico
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tourist-spots/${id}`, {
        cache: 'no-store'
    });

    if (!res.ok) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-3xl font-bold text-red-500">Sitio no encontrado 😢</h1>
            </div>
        );
    }

    // NO usamos .data porque el endpoint GET /:id devuelve el objeto directo
    const spot: TouristSpot = await res.json();

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">

                {/* Imagen Gigante */}
                {spot.imageUrl ? (
                    <img
                        src={spot.imageUrl}
                        alt={spot.name}
                        className="w-full h-96 object-cover"
                    />
                ) : (
                    <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-500 text-xl font-medium">
                        Imagen no disponible
                    </div>
                )}

                {/* Contenido */}
                <div className="p-8 sm:p-12">
                    <div className="flex justify-between items-start mb-6">
                        <h1 className="text-4xl font-extrabold text-gray-900">{spot.name}</h1>
                        <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full">
                            ID: {spot.id}
                        </span>
                    </div>

                    <p className="text-lg text-gray-600 leading-relaxed mb-8 whitespace-pre-line">
                        {spot.description}
                    </p>
                    <InteractiveRating spotId={spot.id} />

                    <Link
                        href="/"
                        className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                    >
                        ← Volver al inicio
                    </Link>
                </div>

            </div>
        </main>
    );
}