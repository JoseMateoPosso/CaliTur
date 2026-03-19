import Link from "next/link";
import DeleteButton from "../components/DeleteButton";

interface TouristSpot {
    id: number;
    name: string;
    description: string;
    imageUrl: string | null;
}

export default async function AdminDashboard({
    searchParams,
}: {
    searchParams: Promise<{ page?: string }>;
}) {
    const { page } = await searchParams;
    const currentPage = page ? parseInt(page, 10) : 1;

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/tourist-spots?page=${currentPage}`,
        { cache: "no-store" }
    );

    const paginatedResponse = await res.json();
    const spots: TouristSpot[] = paginatedResponse.data;
    const meta = paginatedResponse.meta;

    return (
        <div style={{ fontFamily: "sans-serif" }}>

            {/* ── ENCABEZADO ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#1c1917]">
                        Gestión de sitios turísticos
                    </h1>
                    <p className="text-[#7c3a2e] text-sm mt-0.5">
                        {meta?.total ?? spots.length} sitios registrados en total
                    </p>
                </div>
                <Link
                    href="/admin/nuevo"
                    className="inline-flex items-center gap-2 bg-[#c0392b] hover:bg-[#a93226] text-white font-semibold py-2.5 px-5 rounded-full transition-colors shadow-sm text-sm shrink-0"
                >
                    <span className="text-base leading-none">+</span>
                    Nuevo sitio
                </Link>
            </div>

            {/* ── TABLA ── */}
            <div className="bg-white rounded-2xl border border-[#fde8e8] overflow-hidden shadow-sm">

                {/* Sin datos */}
                {spots.length === 0 && (
                    <div className="text-center py-20 text-[#c4908a]">
                        <span className="text-5xl block mb-3">🗺️</span>
                        <p className="font-semibold text-[#1c1917]">No hay sitios registrados</p>
                        <p className="text-sm mt-1">Crea el primero con el botón de arriba.</p>
                    </div>
                )}

                {spots.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-[#fff5f5] border-b border-[#fde8e8]">
                                    <th className="px-6 py-4 text-left text-xs font-bold text-[#c0392b] uppercase tracking-wider">
                                        ID
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-[#c0392b] uppercase tracking-wider">
                                        Imagen
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-[#c0392b] uppercase tracking-wider">
                                        Nombre
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-[#c0392b] uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#fde8e8]">
                                {spots.map((spot) => (
                                    <tr
                                        key={spot.id}
                                        className="hover:bg-[#fff9f9] transition-colors group"
                                    >
                                        {/* ID */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-xs font-bold text-[#c4908a] bg-[#fff5f5] px-2 py-1 rounded-full">
                                                #{spot.id}
                                            </span>
                                        </td>

                                        {/* Imagen */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {spot.imageUrl ? (
                                                <img
                                                    src={spot.imageUrl}
                                                    alt={spot.name}
                                                    className="w-12 h-12 rounded-xl object-cover border border-[#fde8e8] shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-[#fff5f5] border border-[#fde8e8] flex items-center justify-center text-[10px] text-[#c4908a] font-medium">
                                                    📷
                                                </div>
                                            )}
                                        </td>

                                        {/* Nombre */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-semibold text-[#1c1917] group-hover:text-[#c0392b] transition-colors">
                                                {spot.name}
                                            </span>
                                        </td>

                                        {/* Acciones */}
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={`/spots/${spot.id}`}
                                                    className="text-[#7c3a2e] hover:text-[#1c1917] transition-colors px-3 py-1.5 bg-[#fff5f5] hover:bg-[#fde8e8] rounded-lg text-xs font-medium"
                                                >
                                                    Ver
                                                </Link>
                                                <Link
                                                    href={`/admin/editar/${spot.id}`}
                                                    className="text-[#f59e0b] hover:text-[#b45309] transition-colors px-3 py-1.5 bg-[#fffbeb] hover:bg-[#fef3c7] rounded-lg text-xs font-medium"
                                                >
                                                    Editar
                                                </Link>
                                                <DeleteButton id={spot.id} name={spot.name} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── PAGINACIÓN ── */}
                {meta && meta.lastPage > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-[#fde8e8] bg-[#fff9f9] gap-3">
                        <span className="text-xs text-[#7c3a2e]">
                            Página{" "}
                            <span className="font-bold text-[#1c1917]">{meta.currentPage}</span>
                            {" "}de{" "}
                            <span className="font-bold text-[#1c1917]">{meta.lastPage}</span>
                            {" "}— {meta.total} sitios en total
                        </span>

                        <div className="flex gap-2">
                            {meta.currentPage > 1 ? (
                                <Link
                                    href={`/admin?page=${meta.currentPage - 1}`}
                                    className="px-4 py-2 border border-[#fde8e8] rounded-full text-xs font-semibold text-[#1c1917] bg-white hover:bg-[#fff5f5] hover:border-[#c0392b]/30 transition-all"
                                >
                                    ← Anterior
                                </Link>
                            ) : (
                                <button
                                    disabled
                                    className="px-4 py-2 border border-[#fde8e8] rounded-full text-xs font-semibold text-[#c4908a] bg-[#fff9f9] cursor-not-allowed"
                                >
                                    ← Anterior
                                </button>
                            )}

                            {meta.currentPage < meta.lastPage ? (
                                <Link
                                    href={`/admin?page=${meta.currentPage + 1}`}
                                    className="px-4 py-2 border border-[#fde8e8] rounded-full text-xs font-semibold text-[#1c1917] bg-white hover:bg-[#fff5f5] hover:border-[#c0392b]/30 transition-all"
                                >
                                    Siguiente →
                                </Link>
                            ) : (
                                <button
                                    disabled
                                    className="px-4 py-2 border border-[#fde8e8] rounded-full text-xs font-semibold text-[#c4908a] bg-[#fff9f9] cursor-not-allowed"
                                >
                                    Siguiente →
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}