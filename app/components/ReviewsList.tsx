interface Review {
    id: number;
    text?: string;
    rating?: number;
    createdAt?: string;
    user?: { name?: string };
}

export default async function ReviewsList({ spotId }: { spotId: number }) {
    let reviews: Review[] = [];

    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/reviews/spot/${spotId}`,
            { cache: "no-store" }
        );
        if (res.ok) reviews = await res.json();
    } catch {
        reviews = [];
    }

    if (reviews.length === 0) {
        return (
            <div
                className="bg-white/60 border border-[#fde8e8] rounded-3xl p-8 text-center mb-8"
                style={{ fontFamily: "sans-serif" }}
            >
                <span className="text-4xl block mb-3">💬</span>
                <p className="text-[#1c1917] font-semibold text-sm">
                    Aún no hay reseñas para este lugar
                </p>
                <p className="text-[#c4908a] text-xs mt-1">
                    ¡Sé el primero en compartir tu experiencia!
                </p>
            </div>
        );
    }

    const avgRating =
        reviews.some((r) => r.rating)
            ? (
                reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0) /
                reviews.filter((r) => r.rating).length
            ).toFixed(1)
            : null;

    return (
        <div className="mb-8" style={{ fontFamily: "sans-serif" }}>

            {/* Encabezado */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-[#f59e0b] rounded-full" />
                    <div>
                        <h2 className="text-xl font-bold text-[#1c1917]">Reseñas</h2>
                        <p className="text-[#7c3a2e] text-xs mt-0.5">
                            {reviews.length} opinión{reviews.length !== 1 ? "es" : ""} de visitantes
                        </p>
                    </div>
                </div>

                {/* Promedio */}
                {avgRating && (
                    <div className="text-center bg-white border border-[#fde8e8] rounded-2xl px-4 py-2 shadow-sm">
                        <p className="text-2xl font-bold text-[#1c1917] leading-none">{avgRating}</p>
                        <div className="flex justify-center mt-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <span
                                    key={s}
                                    className="text-sm"
                                    style={{
                                        color: s <= Math.round(Number(avgRating)) ? "#f59e0b" : "#fde8e8",
                                    }}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <p className="text-[#c4908a] text-xs mt-0.5">promedio</p>
                    </div>
                )}
            </div>

            {/* Lista */}
            <div className="grid gap-4">
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        className="bg-white rounded-2xl border border-[#fde8e8] p-5 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-3 mb-3">
                            {/* Avatar + nombre */}
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-[#fff5f5] border border-[#fde8e8] flex items-center justify-center text-sm font-bold text-[#c0392b] shrink-0">
                                    {review.user?.name
                                        ? review.user.name.charAt(0).toUpperCase()
                                        : "?"}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-[#1c1917]">
                                        {review.user?.name ?? "Visitante anónimo"}
                                    </p>
                                    {review.createdAt && (
                                        <p className="text-xs text-[#c4908a]">
                                            {new Date(review.createdAt).toLocaleDateString("es-CO", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Estrellas */}
                            {review.rating && (
                                <div className="flex shrink-0">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <span
                                            key={s}
                                            className="text-base"
                                            style={{
                                                color: s <= review.rating! ? "#f59e0b" : "#fde8e8",
                                            }}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Texto */}
                        {review.text && (
                            <p className="text-[#3d2b29] text-sm leading-relaxed">{review.text}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}