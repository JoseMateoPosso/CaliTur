import Link from "next/link";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-[80vh] bg-gray-50 border-t border-gray-200">

            {/* SIDEBAR (Menú Lateral Oscuro) */}
            <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col shadow-xl">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-xl font-black text-blue-400 tracking-wider">PANEL VIP</h2>
                </div>

                <nav className="flex-1 p-4 space-y-3">
                    <Link
                        href="/admin"
                        className="block px-4 py-3 bg-blue-600 rounded-lg text-white font-medium shadow-sm hover:bg-blue-700 transition-colors"
                    >
                        📊 Mis Sitios (Tabla)
                    </Link>

                    <Link
                        href="/admin/nuevo"
                        className="block px-4 py-3 rounded-lg text-gray-300 font-medium hover:bg-gray-800 hover:text-white transition-colors"
                    >
                        📸 + Nuevo Sitio
                    </Link>
                </nav>
            </aside>

            {/* CONTENIDO PRINCIPAL (El lado derecho) */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>

        </div>
    );
}