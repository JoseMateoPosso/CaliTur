"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) throw new Error("Credenciales incorrectas");

            const data = await res.json();
            document.cookie = `calitur_token=${data.access_token}; path=/; max-age=86400`;
            router.push("/admin");

        } catch {
            setError("Correo o contraseña incorrectos. ¡Intenta de nuevo!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main
            className="min-h-screen bg-[#1c1917] flex items-center justify-center p-4 relative overflow-hidden"
            style={{ fontFamily: "sans-serif" }}
        >
            {/* Decoración de fondo */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 15% 50%, #c0392b 0%, transparent 45%), radial-gradient(circle at 85% 20%, #f59e0b 0%, transparent 40%)",
                }}
            />

            <div className="relative w-full max-w-md">

                {/* Tarjeta */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

                    {/* Encabezado */}
                    <div className="bg-gradient-to-r from-[#c0392b] to-[#e57373] px-8 py-8 text-center">
                        <span className="text-4xl block mb-3">🌴</span>
                        <h1 className="text-2xl font-bold text-white">
                            Bienvenido a CaliTur
                        </h1>
                        <p className="text-white/70 text-sm mt-1">
                            Ingresa tus credenciales para continuar
                        </p>
                    </div>

                    {/* Formulario */}
                    <div className="px-8 py-8">

                        {/* Error */}
                        {error && (
                            <div className="flex items-start gap-2 bg-[#fff5f5] border border-[#fde8e8] text-[#c0392b] px-4 py-3 rounded-xl mb-6 text-sm font-medium">
                                <span className="mt-0.5">❌</span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">

                            {/* Correo */}
                            <div>
                                <label className="block text-sm font-semibold text-[#1c1917] mb-2">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="admin@calitur.com"
                                    className="w-full px-4 py-3 rounded-xl border border-[#fde8e8] bg-[#fff9f9] text-[#1c1917] placeholder-[#c4908a] focus:outline-none focus:ring-2 focus:ring-[#c0392b]/30 focus:border-[#c0392b] transition-all text-sm"
                                />
                            </div>

                            {/* Contraseña */}
                            <div>
                                <label className="block text-sm font-semibold text-[#1c1917] mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 pr-12 rounded-xl border border-[#fde8e8] bg-[#fff9f9] text-[#1c1917] placeholder-[#c4908a] focus:outline-none focus:ring-2 focus:ring-[#c0392b]/30 focus:border-[#c0392b] transition-all text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c4908a] hover:text-[#c0392b] transition-colors text-sm"
                                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                            </div>

                            {/* Botón */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#c0392b] hover:bg-[#a93226] disabled:bg-[#e57373] text-white font-semibold py-3.5 rounded-full transition-colors text-sm shadow-sm mt-2"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2 justify-center">
                                        <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                        Verificando...
                                    </span>
                                ) : (
                                    "Ingresar al panel"
                                )}
                            </button>
                        </form>

                        {/* Footer del formulario */}
                        <div className="mt-6 pt-6 border-t border-[#fde8e8] text-center space-y-2">
                            <p className="text-sm text-[#7c3a2e]">
                                ¿No tienes cuenta?{" "}
                                <Link href="/register" className="text-[#c0392b] font-bold hover:underline">
                                    Regístrate
                                </Link>
                            </p>
                            <Link
                                href="/"
                                className="block text-xs text-[#c4908a] hover:text-[#c0392b] transition-colors"
                            >
                                ← Volver al inicio
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Texto bajo la tarjeta */}
                <p className="text-center text-white/30 text-xs mt-6">
                    © {new Date().getFullYear()} CaliTur — Santiago de Cali, Colombia
                </p>
            </div>
        </main>
    );
}