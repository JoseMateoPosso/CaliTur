"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditarSitioPage() {
    const router = useRouter();
    const params = useParams(); // Extraemos el [id] de la URL
    const id = params.id;

    // Estados del formulario
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);

    // Estados de la interfaz
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true); // Para el estado de carga inicial
    const [error, setError] = useState("");

    // Cuando la página carga, buscamos los datos actuales del sitio
    useEffect(() => {
        const fetchSpot = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tourist-spots/${id}`);
                if (!res.ok) throw new Error("No se pudo cargar el sitio.");

                const data = await res.json();
                setName(data.name);
                setDescription(data.description);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsFetching(false);
            }
        };

        if (id) fetchSpot();
    }, [id]);

    // Al guardar, enviamos los cambios (PATCH)
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const cookieRow = document.cookie.split("; ").find((row) => row.startsWith("calitur_token="));
            const token = cookieRow ? cookieRow.split("=")[1] : null;
            if (!token) throw new Error("No tienes autorización.");

            // --- PASO A: Actualizar textos con PATCH ---
            const patchRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tourist-spots/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description }),
            });

            if (!patchRes.ok) throw new Error("Error al actualizar el texto.");

            // --- PASO B: Actualizar foto (Solo si el usuario seleccionó una nueva) ---
            if (image) {
                const formData = new FormData();
                formData.append("file", image);

                const imgRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tourist-spots/${id}/image`, {
                    method: "POST", // Tu backend usa POST para la imagen, ¡lo respetamos!
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                });

                if (!imgRes.ok) throw new Error("El texto se actualizó, pero hubo un error con la nueva foto.");
            }

            router.push("/admin");
            router.refresh();

        } catch (err: any) {
            setError(err.message || "Ocurrió un error al actualizar.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) {
        return <div className="p-8 text-center text-gray-500 font-medium">Cargando datos del sitio... ⏳</div>;
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-200 mt-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">✏️ Editar Sitio #{id}</h1>
                <Link href="/admin" className="text-gray-500 hover:text-blue-600 transition-colors">
                    ← Cancelar
                </Link>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 font-medium text-sm">{error}</div>}

            <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre del Lugar</label>
                    <input
                        type="text" required value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                    <textarea
                        required rows={4} value={description} onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Reemplazar Fotografía (Déjalo vacío para conservar la actual)
                    </label>
                    <input
                        type="file" accept="image/*"
                        onChange={(e) => { if (e.target.files && e.target.files.length > 0) setImage(e.target.files[0]); }}
                        className="w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
                    />
                </div>

                <button
                    type="submit" disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-400 mt-4"
                >
                    {isLoading ? "Guardando cambios..." : "Actualizar Sitio"}
                </button>
            </form>
        </div>
    );
}