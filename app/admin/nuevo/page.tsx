"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NuevoSitioPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const cookieRow = document.cookie
                .split("; ")
                .find((row) => row.startsWith("calitur_token="));
            const token = cookieRow ? cookieRow.split("=")[1] : null;
            if (!token) throw new Error("No tienes autorización. Vuelve a iniciar sesión.");

            const createRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tourist-spots`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description }),
            });

            if (!createRes.ok) {
                const errData = await createRes.json();
                throw new Error(errData.message || "Error al crear el sitio turístico.");
            }

            const newSpot = await createRes.json();

            if (image && newSpot.id) {
                const formData = new FormData();
                formData.append("file", image);
                const imgRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/tourist-spots/${newSpot.id}/image`,
                    {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` },
                        body: formData,
                    }
                );
                if (!imgRes.ok) throw new Error("El sitio se creó, pero hubo un error al subir la foto.");
            }

            router.push("/admin");
            router.refresh();
        } catch (err: any) {
            const errorMessage = Array.isArray(err.message) ? err.message.join(", ") : err.message;
            setError(errorMessage || "Ocurrió un error inesperado.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-4" style={{ fontFamily: "sans-serif" }}>

            {/* Encabezado */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#1c1917]">Nuevo sitio turístico</h1>
                    <p className="text-[#7c3a2e] text-sm mt-0.5">Completa los campos para agregar un nuevo lugar</p>
                </div>
                <Link
                    href="/admin"
                    className="text-sm text-[#c4908a] hover:text-[#c0392b] transition-colors"
                >
                    ← Cancelar
                </Link>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-start gap-2 bg-[#fff5f5] border border-[#fde8e8] text-[#c0392b] px-4 py-3 rounded-xl mb-6 text-sm font-medium">
                    <span>❌</span> {error}
                </div>
            )}

            <div className="bg-white rounded-2xl border border-[#fde8e8] overflow-hidden shadow-sm">

                {/* Preview de imagen */}
                {previewUrl ? (
                    <div className="relative h-48 overflow-hidden bg-[#fff5f5]">
                        <img src={previewUrl} alt="Vista previa" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-end px-5 pb-4">
                            <span className="text-white text-xs font-medium bg-black/40 px-2 py-1 rounded-full">
                                Vista previa de la imagen
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => { setImage(null); setPreviewUrl(null); }}
                            className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm transition-colors"
                            aria-label="Quitar imagen"
                        >
                            ×
                        </button>
                    </div>
                ) : (
                    <div className="h-24 bg-[#fff5f5] flex items-center justify-center border-b border-[#fde8e8]">
                        <span className="text-[#c4908a] text-sm">La vista previa de la imagen aparecerá aquí</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="p-7 space-y-5">

                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1c1917] mb-2">
                            Nombre del lugar
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej: Zoológico de Cali"
                            className="w-full px-4 py-3 rounded-xl border border-[#fde8e8] bg-[#fff9f9] text-[#1c1917] placeholder-[#c4908a] focus:outline-none focus:ring-2 focus:ring-[#c0392b]/30 focus:border-[#c0392b] transition-all text-sm"
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1c1917] mb-2">
                            Descripción
                        </label>
                        <textarea
                            required
                            rows={5}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Escribe una descripción atractiva del lugar..."
                            className="w-full px-4 py-3 rounded-xl border border-[#fde8e8] bg-[#fff9f9] text-[#1c1917] placeholder-[#c4908a] focus:outline-none focus:ring-2 focus:ring-[#c0392b]/30 focus:border-[#c0392b] transition-all text-sm resize-none"
                        />
                        <p className="text-xs text-[#c4908a] mt-1 text-right">{description.length} caracteres</p>
                    </div>

                    {/* Foto */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1c1917] mb-2">
                            Fotografía
                            <span className="text-[#c4908a] font-normal ml-1">(opcional)</span>
                        </label>
                        <label className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-dashed border-[#f5b8b0] bg-[#fff5f5] hover:bg-[#fde8e8] hover:border-[#c0392b] transition-all cursor-pointer text-sm text-[#c0392b] font-medium">
                            <span>📷</span>
                            <span>{image ? image.name : "Seleccionar imagen..."}</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Botones */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-[#c0392b] hover:bg-[#a93226] disabled:bg-[#e57373] text-white font-semibold py-3 rounded-full transition-colors text-sm shadow-sm"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2 justify-center">
                                    <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Guardando sitio...
                                </span>
                            ) : (
                                "Guardar sitio turístico"
                            )}
                        </button>
                        <Link
                            href="/admin"
                            className="px-6 py-3 rounded-full border border-[#fde8e8] text-[#7c3a2e] hover:bg-[#fff5f5] transition-colors text-sm font-medium text-center"
                        >
                            Cancelar
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}