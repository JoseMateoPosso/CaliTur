import Link from "next/link";
import SearchBar from "./components/SearchBar";

interface TouristSpot {
  id: number;
  name: string;
  description: string;
  imageUrl: string | null;
}

export default async function Home({ searchParams, }: { searchParams: Promise<{ search?: string }>; }) {
  // Extraemos el término de búsqueda de los parámetros de la URL
  const { search } = await searchParams;

  //Armamos la URL para el fetch, incluyendo el término de búsqueda si existe
  let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/tourist-spots`;
  if (search) {
    apiUrl += `?search=${search}`;
  }
  
  // Hacemos la llamada HTTP a tu servidor en Render
  const res = await fetch(apiUrl, {
    cache: 'no-store'
  });
  const paginatedResponse = await res.json();
  const spots: TouristSpot[] = paginatedResponse.data;

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-extrabold text-blue-600 mb-10 text-center drop-shadow-sm">
        Descubre CaliTur 🌴
      </h1>

      <SearchBar />

      {/* Grilla (Grid) que se adapta a celulares, tablets y pantallas grandes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">

        {/* Mapeamos (iteramos) el arreglo de sitios turísticos */}
        {spots.map((spot) => (
          <div key={spot.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">

            {/* Si hay imagen de Supabase, la mostramos. Si no, un cuadro gris */}
            {spot.imageUrl ? (
              <img
                src={spot.imageUrl}
                alt={spot.name}
                className="w-full h-56 object-cover"
              />
            ) : (
              <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                Sin imagen fotográfica
              </div>
            )}

            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{spot.name}</h2>
              {/* line-clamp-3 corta el texto si es muy largo y le pone "..." */}
              <p className="text-gray-600 line-clamp-3">{spot.description}</p>

              <Link
                href={`/spots/${spot.id}`}
                className="mt-4 block text-center w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Ver más detalles
              </Link>
            </div>

          </div>
        ))}

      </div>
    </main>
  );
}