"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NuevoSitioPage() {
    const router = useRouter();

    // Estados del formulario
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);

    // Estados de la interfaz
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Obtenemos el token de autenticación del cookie (si existe)
            const cookieRow = document.cookie
                .split("; ")
                .find((row) => row.startsWith("calitur_token="));
            const token = cookieRow ? cookieRow.split("=")[1] : null;

            if (!token) throw new Error("No tienes autorización. Vuelve a iniciar sesión.");

            // Creación del sitio turístico (sin foto)
            const createRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tourist-spots`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Le decimos que va texto
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description }),
            });

            if (!createRes.ok) {
                const errData = await createRes.json();
                // Mostrar el error exacto que manda el Backend
                throw new Error(errData.message || "Error al crear el sitio turístico.");
            }

            // Capturamos la respuesta del backend (que trae el ID del nuevo sitio)
            const newSpot = await createRes.json();

            // Si el admin subió una foto, la subimos a Supabase usando el endpoint específico
            if (image && newSpot.id) {
                const formData = new FormData();
                formData.append("file", image);

                const imgRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tourist-spots/${newSpot.id}/image`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });

                if (!imgRes.ok) {
                    throw new Error("El sitio se creó, pero hubo un error al subir la foto a Supabase.");
                }
            }

            // Si todo salió bien, redirigimos al admin al dashboard para que vea su nuevo sitio en la tabla
            router.push("/admin");
            router.refresh();

        } catch (err: any) {
            // Si err.message es un array (como el de class-validator), lo unimos en un string
            const errorMessage = Array.isArray(err.message) ? err.message.join(", ") : err.message;
            setError(errorMessage || "Ocurrió un error inesperado.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-4">

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">📸 Agregar Nuevo Sitio</h1>
                <Link href="/admin" className="text-gray-500 hover:text-blue-600 transition-colors">
                    ← Cancelar
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 font-medium text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo: Nombre */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre del Lugar
                    </label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Ej: Zoológico de Cali"
                    />
                </div>

                {/* Campo: Descripción */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Descripción
                    </label>
                    <textarea
                        required
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        placeholder="Escribe una descripción atractiva..."
                    />
                </div>

                {/* Campo: Foto */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Fotografía (Opcional)
                    </label>
                    <input
                        type="file"
                        accept="image/*" // Solo permitimos imágenes
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setImage(e.target.files[0]);
                            }
                        }}
                        className="w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
                    />
                </div>

                {/* Botón de Submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-400 mt-4"
                >
                    {isLoading ? "Subiendo foto y guardando..." : "Guardar Sitio Turístico"}
                </button>
            </form>

        </div>
    );
}