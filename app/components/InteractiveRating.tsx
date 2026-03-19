"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function InteractiveRating({ spotId }: { spotId: number }) {
    console.log("Rendering InteractiveRating for spotId:", spotId); // Debugging line

    // Estados para construir el JSON de tu curl
    const [rating, setRating] = useState(0);
    const [text, setText] = useState("");

    // Estados de la interfaz
    const [hover, setHover] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const router = useRouter();

    // Verificamos si el usuario tiene su Token JWT (está logueado)
    useEffect(() => {
        const cookieRow = document.cookie.split("; ").find((row) => row.startsWith("calitur_token="));
        if (cookieRow) setIsLoggedIn(true);
    }, []);

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoggedIn) return;

        if (rating === 0) {
            setMessage("Please select a star rating! ⭐");
            return;
        }

        setIsSubmitting(true);
        setMessage("");

        try {
            const cookieRow = document.cookie.split("; ").find((row) => row.startsWith("calitur_token="));
            const token = cookieRow ? cookieRow.split("=")[1] : null;

            // Armamos el body EXACTAMENTE como pide tu curl
            const payload = {
                text: text,
                rating: rating,
                spotId: spotId
            };

            // Disparamos al endpoint (agregamos el token por seguridad)
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
                throw new Error(errData.message || "Failed to submit review");
            }

            setMessage("Thanks for your review! 🌟");
            // Limpiamos el formulario después del éxito
            setRating(0);
            setText("");
            router.refresh();

        } catch (error: any) {
            setMessage(error.message || "An error occurred while rating.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Leave a Review</h3>

            {!isLoggedIn ? (
                <p className="text-sm text-gray-600 bg-white p-4 rounded-lg border border-gray-200 inline-block">
                    You must <Link href="/login" className="text-blue-600 font-bold hover:underline">log in</Link> or <Link href="/register" className="text-blue-600 font-bold hover:underline">sign up</Link> to leave a review.
                </p>
            ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">

                    {/* Selector de Estrellas */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    disabled={isSubmitting}
                                    className="text-3xl transition-transform cursor-pointer hover:scale-110"
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    onClick={() => setRating(star)}
                                >
                                    <span className={`${star <= (hover || rating) ? "text-yellow-400" : "text-gray-300"}`}>★</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Campo de Texto para el Comentario */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your comment</label>
                        <textarea
                            required
                            rows={3}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            disabled={isSubmitting}
                            placeholder="Tell us about your experience..."
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none disabled:bg-gray-100"
                        />
                    </div>

                    {/* 3. Botón de Enviar */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors disabled:bg-blue-400 shadow-sm"
                    >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </button>

                    {/* Mensaje de éxito o error */}
                    {message && (
                        <p className={`mt-2 text-sm font-medium ${message.includes("error") || message.includes("select") ? "text-red-600" : "text-green-600"}`}>
                            {message}
                        </p>
                    )}
                </form>
            )}
        </div>
    );
}