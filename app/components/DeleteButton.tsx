"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id, name }: { id: number; name: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        const confirmacion = window.confirm(
            `⚠️ ¿Estás seguro de que deseas eliminar "${name}"? Esta acción no se puede deshacer.`
        );
        if (!confirmacion) return;

        setIsDeleting(true);

        try {
            const cookieRow = document.cookie
                .split("; ")
                .find((row) => row.startsWith("calitur_token="));
            const token = cookieRow ? cookieRow.split("=")[1] : null;

            if (!token) throw new Error("No estás autorizado.");

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tourist-spots/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("No se pudo eliminar el sitio.");

            router.refresh();
        } catch (error: any) {
            alert(error.message || "Ocurrió un error al intentar eliminar.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-[#c0392b] hover:text-white transition-all px-3 py-1.5 bg-[#fff5f5] hover:bg-[#c0392b] border border-[#fde8e8] hover:border-[#c0392b] rounded-lg text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: "sans-serif" }}
        >
            {isDeleting ? (
                <span className="flex items-center gap-1.5">
                    <span className="inline-block w-3 h-3 border-2 border-[#c0392b]/30 border-t-[#c0392b] rounded-full animate-spin" />
                    Eliminando...
                </span>
            ) : (
                "Eliminar"
            )}
        </button>
    );
}