"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const defaultSearch = searchParams.get("search") || "";
    const [searchTerm, setSearchTerm] = useState(defaultSearch);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim() === "") {
            router.push("/");
        } else {
            router.push(`/?search=${searchTerm}`);
        }
    };

    return (
        <form
            onSubmit={handleSearch}
            className="w-full flex gap-2"
            style={{ fontFamily: "sans-serif" }}
        >
            <div className="relative flex-1">
                {/* Ícono lupa */}
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-base pointer-events-none">
                    🔍
                </span>
                <input
                    type="text"
                    placeholder="Busca: Gato del Río, Cristo Rey, San Antonio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/60 focus:border-[#f59e0b]/60 text-sm transition-all"
                />
                {/* Botón limpiar */}
                {searchTerm && (
                    <button
                        type="button"
                        onClick={() => { setSearchTerm(""); router.push("/"); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors text-lg leading-none"
                        aria-label="Limpiar búsqueda"
                    >
                        ×
                    </button>
                )}
            </div>
            <button
                type="submit"
                className="bg-[#c0392b] hover:bg-[#a93226] text-white px-6 py-3.5 rounded-full font-semibold text-sm transition-colors shadow-sm shrink-0"
            >
                Buscar
            </button>
        </form>
    );
}