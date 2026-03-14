"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id, name }: { id: number; name: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        // Pregunta de confirmación súper clara para evitar clicks accidentales
        const confirmacion = window.confirm(`⚠️ ¿Estás totalmente seguro de que deseas eliminar "${name}"? Esta acción no se puede deshacer.`);

        if (!confirmacion) return;

        setIsDeleting(true);

        try {
            // Extraemos la manilla VIP (Token)
            const cookieRow = document.cookie
                .split("; ")
                .find((row) => row.startsWith("calitur_token="));
            const token = cookieRow ? cookieRow.split("=")[1] : null;

            if (!token) throw new Error("No estás autorizado.");

            // Disparamos el misil (Petición DELETE)
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tourist-spots/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("No se pudo eliminar el sitio.");
            }

            // Recargamos la tabla en el servidor para que el sitio desaparezca
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
            className="text-red-600 hover:text-red-900 transition-colors px-3 py-1 bg-red-50 hover:bg-red-100 rounded-md font-medium disabled:opacity-50"
        >
            {isDeleting ? "Borrando..." : "Eliminar"}
        </button>
    );
}