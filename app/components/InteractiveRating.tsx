"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InteractiveRating({ spotId }: { spotId: number }) {
    const [rating, setRating] = useState(0);
    const [text, setText] = useState("");
    const [hover, setHover] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error" | "warn"; text: string } | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const router = useRouter();

    useEffect(() => {
        const cookieRow = document.cookie
            .split("; ")
            .find((row) => row.startsWith("calitur_token="));
        if (cookieRow) setIsLoggedIn(true);
    }, []);

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoggedIn) return;

        if (rating === 0) {
            setMessage({ type: "warn", text: "Selecciona una calificación de estrellas para continuar." });
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        try {
            const cookieRow = document.cookie
                .split("; ")
                .find((row) => row.startsWith("calitur_token="));
            const token = cookieRow ? cookieRow.split("=")[1] : null;

            const payload = { text, rating, spotId };

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.message || "Error al enviar la reseña.");
            }

            setMessage({ type: "success", text: "¡Gracias por tu reseña! Tu opinión ayuda a otros viajeros." });
            setRating(0);
            setText("");
            router.refresh();
        } catch (error: any) {
            setMessage({ type: "error", text: error.message || "Ocurrió un error al enviar tu reseña." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const etiquetasEstrellas = ["", "Malo", "Regular", "Bueno", "Muy bueno", "Excelente"];

    return (
        <div
            className="mt-8 bg-white rounded-3xl border border-[#fde8e8] overflow-hidden shadow-sm"
            style={{ fontFamily: "sans-serif" }}
        >
            {/* Encabezado */}
            <div className="bg-gradient-to-r from-[#c0392b] to-[#e57373] px-7 py-5">
                <h3 className="text-white font-bold text-lg">Deja tu reseña</h3>
                <p className="text-white/70 text-sm mt-0.5">
                    ¿Visitaste este lugar? Comparte tu experiencia
                </p>
            </div>

            <div className="px-7 py-6">
                {!isLoggedIn ? (
                    <div className="flex items-start gap-4 bg-[#fff5f5] border border-[#fde8e8] rounded-2xl p-5">
                        <span className="text-2xl mt-0.5">🔒</span>
                        <div>
                            <p className="text-[#1c1917] font-semibold text-sm mb-1">
                                Inicia sesión para dejar una reseña
                            </p>
                            <p className="text-[#7c3a2e] text-sm">
                                <Link href="/login" className="text-[#c0392b] font-bold hover:underline">
                                    Iniciar sesión
                                </Link>{" "}
                                o{" "}
                                <Link href="/register" className="text-[#c0392b] font-bold hover:underline">
                                    Registrarse
                                </Link>{" "}
                                para compartir tu experiencia.
                            </p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmitReview} className="space-y-5">

                        {/* Selector de estrellas */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1c1917] mb-3">
                                Calificación
                            </label>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        disabled={isSubmitting}
                                        className="transition-transform hover:scale-125 focus:outline-none disabled:cursor-not-allowed"
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        onClick={() => setRating(star)}
                                        aria-label={`${star} estrellas`}
                                    >
                                        <span
                                            className="text-4xl leading-none"
                                            style={{
                                                color: star <= (hover || rating) ? "#f59e0b" : "#e5e7eb",
                                                transition: "color 0.15s ease",
                                            }}
                                        >
                                            ★
                                        </span>
                                    </button>
                                ))}
                                {(hover || rating) > 0 && (
                                    <span className="ml-3 text-sm text-[#7c3a2e] font-medium">
                                        {etiquetasEstrellas[hover || rating]}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Comentario */}
                        <div>
                            <label className="block text-sm font-semibold text-[#1c1917] mb-2">
                                Tu comentario
                            </label>
                            <textarea
                                required
                                rows={4}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                disabled={isSubmitting}
                                placeholder="Cuéntanos cómo fue tu experiencia visitando este lugar..."
                                className="w-full px-4 py-3 rounded-xl border border-[#fde8e8] bg-[#fff9f9] text-[#1c1917] placeholder-[#c4908a] focus:ring-2 focus:ring-[#c0392b]/30 focus:border-[#c0392b] outline-none resize-none disabled:opacity-60 text-sm transition-all"
                            />
                            <p className="text-xs text-[#c4908a] mt-1 text-right">
                                {text.length} caracteres
                            </p>
                        </div>

                        {/* Botón enviar */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto px-8 py-3 bg-[#c0392b] hover:bg-[#a93226] disabled:bg-[#e57373] text-white font-semibold rounded-full transition-colors duration-200 text-sm shadow-sm"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2 justify-center">
                                    <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Enviando...
                                </span>
                            ) : (
                                "Publicar reseña"
                            )}
                        </button>

                        {/* Mensaje de feedback */}
                        {message && (
                            <div
                                className={`rounded-xl px-4 py-3 text-sm font-medium flex items-start gap-2 ${
                                    message.type === "success"
                                        ? "bg-green-50 text-green-800 border border-green-200"
                                        : message.type === "warn"
                                        ? "bg-[#fff9e6] text-[#92400e] border border-[#fde68a]"
                                        : "bg-[#fff5f5] text-[#c0392b] border border-[#fde8e8]"
                                }`}
                            >
                                <span>
                                    {message.type === "success" ? "✅" : message.type === "warn" ? "⚠️" : "❌"}
                                </span>
                                {message.text}
                            </div>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
}