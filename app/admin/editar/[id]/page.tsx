"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditarSitioPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSpot = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tourist-spots/${id}`);
                if (!res.ok) throw new Error("No se pudo cargar el sitio.");
                const data = await res.json();
                setName(data.name);
                setDescription(data.description);
                if (data.imageUrl) setPreviewUrl(data.imageUrl);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsFetching(false);
            }
        };
        if (id) fetchSpot();
    }, [id]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const cookieRow = document.cookie.split("; ").find((row) => row.startsWith("calitur_token="));
            const token = cookieRow ? cookieRow.split("=")[1] : null;
            if (!token) throw new Error("No tienes autorización.");

            const patchRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tourist-spots/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name, description }),
            });
            if (!patchRes.ok) throw new Error("Error al actualizar el texto.");

            if (image) {
                const formData = new FormData();
                formData.append("file", image);
                const imgRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tourist-spots/${id}/image`, {
                    method: "POST",
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
        return (
            <div className="flex items-center justify-center py-24" style={{ fontFamily: "sans-serif" }}>
                <div className="text-center">
                    <span className="inline-block w-8 h-8 border-2 border-[#fde8e8] border-t-[#c0392b] rounded-full animate-spin mb-4" />
                    <p className="text-[#7c3a2e] text-sm">Cargando datos del sitio...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-4" style={{ fontFamily: "sans-serif" }}>

            {/* Encabezado */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#1c1917]">Editar sitio</h1>
                    <p className="text-[#7c3a2e] text-sm mt-0.5">ID #{id}</p>
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

                {/* Preview imagen actual */}
                {previewUrl && (
                    <div className="relative h-48 overflow-hidden bg-[#fff5f5]">
                        <img src={previewUrl} alt="Vista previa" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-end px-5 pb-4">
                            <span className="text-white text-xs font-medium bg-black/40 px-2 py-1 rounded-full">
                                {image ? "Nueva imagen seleccionada" : "Imagen actual"}
                            </span>
                        </div>
                    </div>
                )}

                <form onSubmit={handleUpdate} className="p-7 space-y-5">

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
                            className="w-full px-4 py-3 rounded-xl border border-[#fde8e8] bg-[#fff9f9] text-[#1c1917] placeholder-[#c4908a] focus:outline-none focus:ring-2 focus:ring-[#c0392b]/30 focus:border-[#c0392b] transition-all text-sm resize-none"
                        />
                        <p className="text-xs text-[#c4908a] mt-1 text-right">{description.length} caracteres</p>
                    </div>

                    {/* Foto */}
                    <div>
                        <label className="block text-sm font-semibold text-[#1c1917] mb-2">
                            Reemplazar fotografía
                            <span className="text-[#c4908a] font-normal ml-1">(déjalo vacío para conservar la actual)</span>
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
                                    Guardando cambios...
                                </span>
                            ) : (
                                "Guardar cambios"
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