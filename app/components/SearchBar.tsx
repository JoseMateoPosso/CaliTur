"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Leemos si ya hay una búsqueda en la URL para que el input no empiece vacío
    const defaultSearch = searchParams.get("search") || "";
    const [searchTerm, setSearchTerm] = useState(defaultSearch);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim() === "") {
            router.push("/"); // Si está vacío, limpiamos la URL
        } else {
            router.push(`/?search=${searchTerm}`); // Si hay texto, lo ponemos en la URL
        }
    };

    return (
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10 flex gap-2">
            <input
                type="text"
                placeholder="Ej: Gato del Río, Cristo Rey, San Antonio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-sm"
            >
                Buscar
            </button>
        </form>
    );
}