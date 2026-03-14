import Link from "next/link";
import DeleteButton from "../components/DeleteButton";

interface TouristSpot {
    id: number;
    name: string;
    description: string;
    imageUrl: string | null;
}

// Recibimos los searchParams para leer en qué página estamos
export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ page?: string }>; }) {
    const { page } = await searchParams;
    // Si no hay página en la URL, asumimos que es la página 1
    const currentPage = page ? parseInt(page, 10) : 1;

    // Le pasamos la página actual a tu API en Render
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tourist-spots?page=${currentPage}`, {
        cache: "no-store",
    });

    const paginatedResponse = await res.json();
    const spots: TouristSpot[] = paginatedResponse.data;

    // Extraemos los datos de paginación que nos manda tu Backend
    const meta = paginatedResponse.meta; // { total, page, lastPage }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Gestión de Sitios Turísticos
                </h1>
                <Link
                    href="/admin/nuevo"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors shadow-sm"
                >
                    + Nuevo Sitio
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Imagen</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {spots.map((spot) => (
                            <tr key={spot.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{spot.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {spot.imageUrl ? (
                                        <img src={spot.imageUrl} alt={spot.name} className="w-12 h-12 rounded-lg object-cover shadow-sm border border-gray-100" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-medium border border-gray-200">Sin foto</div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">{spot.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center space-x-4">
                                    <Link
                                        href={`/admin/editar/${spot.id}`}
                                        className="text-blue-600 hover:text-blue-900 transition-colors px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-md font-medium inline-block"
                                    >
                                        Editar
                                    </Link>
                                    <DeleteButton id={spot.id} name={spot.name} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* === CONTROLES DE PAGINACIÓN === */}
                {meta && (
                    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 gap-4">
                        <span className="text-sm text-gray-700">
                            Mostrando página <span className="font-bold">{meta.currentPage}</span> de <span className="font-bold">{meta.lastPage}</span>
                            {" "}(Total: {meta.total} sitios)
                        </span>

                        <div className="flex space-x-2">
                            {/* Botón Anterior */}
                            {meta.currentPage > 1 ? (
                                <Link
                                    href={`/admin?page=${meta.currentPage - 1}`}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    Anterior
                                </Link>
                            ) : (
                                <button disabled className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-400 bg-gray-100 cursor-not-allowed">
                                    Anterior
                                </button>
                            )}

                            {/* Botón Siguiente */}
                            {meta.currentPage < meta.lastPage ? (
                                <Link
                                    href={`/admin?page=${meta.currentPage + 1}`}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    Siguiente
                                </Link>
                            ) : (
                                <button disabled className="px-4 py-2 border border-gray-200 rounded-md text-sm font-medium text-gray-400 bg-gray-100 cursor-not-allowed">
                                    Siguiente
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}