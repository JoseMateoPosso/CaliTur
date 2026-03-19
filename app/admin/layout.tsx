import Link from "next/link";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            className="flex flex-1 bg-[#fff5f5]"
            style={{ fontFamily: "sans-serif", minHeight: "calc(100vh - 64px)" }}
        >
            {/* ── SIDEBAR ── */}
            <aside className="w-72 bg-[#1c1917] text-white hidden md:flex flex-col shrink-0">

                {/* Marca */}
                <div className="px-7 py-8 border-b border-white/10">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-8 h-8 rounded-full bg-[#c0392b] flex items-center justify-center text-white text-sm font-bold">
                            C
                        </div>
                        <span className="text-[#f59e0b] font-bold text-lg tracking-wide">
                            CaliTur
                        </span>
                    </div>
                    <p className="text-white/40 text-xs mt-1">
                        Panel de administración
                    </p>
                </div>

                {/* Navegación */}
                <nav className="flex-1 px-4 py-6 space-y-2">
                    <p className="text-white/30 text-xs uppercase tracking-widest px-3 mb-3">
                        Contenido
                    </p>

                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 bg-[#c0392b] rounded-xl text-white text-sm font-medium transition-all hover:bg-[#a93226] group"
                    >
                        <span className="text-base">📊</span>
                        <span>Mis sitios</span>
                        <span className="ml-auto text-white/50 text-xs group-hover:text-white/80 transition-colors">
                            Tabla
                        </span>
                    </Link>

                    <Link
                        href="/admin/nuevo"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 text-sm font-medium transition-all hover:bg-white/10 hover:text-white"
                    >
                        <span className="text-base">📸</span>
                        <span>Nuevo sitio</span>
                        <span className="ml-auto bg-[#f59e0b]/20 text-[#f59e0b] text-xs px-2 py-0.5 rounded-full">
                            +
                        </span>
                    </Link>
                </nav>

                {/* Footer sidebar */}
                <div className="px-7 py-5 border-t border-white/10">
                    <Link
                        href="/"
                        className="text-white/40 hover:text-white/80 text-xs transition-colors flex items-center gap-2"
                    >
                        ← Ver sitio público
                    </Link>
                </div>
            </aside>

            {/* Barra mobile */}
            <div className="md:hidden w-full fixed top-16 left-0 z-40 bg-[#1c1917] text-white px-4 py-3 flex items-center justify-between shadow-lg">
                <span className="text-[#f59e0b] font-bold text-sm">Admin</span>
                <div className="flex items-center gap-3 text-sm">
                    <Link href="/admin" className="text-white/70 hover:text-white">
                        Sitios
                    </Link>
                    <Link
                        href="/admin/nuevo"
                        className="bg-[#c0392b] hover:bg-[#a93226] text-white px-3 py-1 rounded-lg transition-colors"
                    >
                        + Nuevo
                    </Link>
                </div>
            </div>

            {/* ── CONTENIDO PRINCIPAL ── */}
            <main className="flex-1 p-6 sm:p-10 overflow-y-auto md:mt-0 mt-12">
                {children}
            </main>
        </div>
    );
}