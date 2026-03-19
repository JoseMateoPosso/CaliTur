"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        setIsLoading(true);

        try {
            // El endpoint correcto según la arquitectura NestJS es /auth/register
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (!res.ok) {
                const errData = await res.json();
                const msg = Array.isArray(errData.message)
                    ? errData.message.join(", ")
                    : errData.message;
                throw new Error(msg || "Error al crear la cuenta.");
            }

            // Registro exitoso → redirigir al login
            router.push("/login?registered=true");

        } catch (err: any) {
            setError(err.message || "Ocurrió un error inesperado.");
        } finally {
            setIsLoading(false);
        }
    };

    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
    const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

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
                        "radial-gradient(circle at 80% 50%, #c0392b 0%, transparent 45%), radial-gradient(circle at 15% 25%, #f59e0b 0%, transparent 40%)",
                }}
            />

            <div className="relative w-full max-w-md">
                {/* Tarjeta */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Encabezado */}
                    <div className="bg-gradient-to-r from-[#c0392b] to-[#e57373] px-8 py-8 text-center">
                        <span className="text-4xl block mb-3">🌴</span>
                        <h1 className="text-2xl font-bold text-white">Crear cuenta</h1>
                        <p className="text-white/70 text-sm mt-1">
                            Únete y empieza a explorar Cali
                        </p>
                    </div>

                    {/* Formulario */}
                    <div className="px-8 py-8">
                        <form onSubmit={handleRegister} className="space-y-4">
                            
                            {/* Mensaje de Error (Ubicado correctamente dentro del form) */}
                            {error && (
                                <div className="flex items-start gap-2 bg-[#fff5f5] border border-[#fde8e8] text-[#c0392b] px-4 py-3 rounded-xl mb-4 text-sm font-medium">
                                    <span className="mt-0.5">❌</span>
                                    {error}
                                </div>
                            )}

                            {/* Nombre */}
                            <div>
                                <label className="block text-sm font-semibold text-[#1c1917] mb-2">
                                    Nombre completo
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ej: Juan Pérez"
                                    className="w-full px-4 py-3 rounded-xl border border-[#fde8e8] bg-[#fff9f9] text-[#1c1917] placeholder-[#c4908a] focus:outline-none focus:ring-2 focus:ring-[#c0392b]/30 focus:border-[#c0392b] transition-all text-sm"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-[#1c1917] mb-2">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tucorreo@ejemplo.com"
                                    className="w-full px-4 py-3 rounded-xl border border-[#fde8e8] bg-[#fff9f9] text-[#1c1917] placeholder-[#c4908a] focus:outline-none focus:ring-2 focus:ring-[#c0392b]/30 focus:border-[#c0392b] transition-all text-sm"
                                />
                            </div>

                            {/* Contraseña */}
                            <div>
                                <label className="block text-sm font-semibold text-[#1c1917] mb-2">
                                    Contraseña
                                    <span className="text-[#c4908a] font-normal ml-1">(mínimo 6 caracteres)</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 pr-12 rounded-xl border border-[#fde8e8] bg-[#fff9f9] text-[#1c1917] placeholder-[#c4908a] focus:outline-none focus:ring-2 focus:ring-[#c0392b]/30 focus:border-[#c0392b] transition-all text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c4908a] hover:text-[#c0392b] transition-colors text-sm"
                                    >
                                        {showPassword ? "🙈" : "👁️"}
                                    </button>
                                </div>
                                {password.length > 0 && (
                                    <div className="mt-2 flex gap-1">
                                        {[1, 2, 3].map((level) => (
                                            <div
                                                key={level}
                                                className="h-1 flex-1 rounded-full transition-all"
                                                style={{
                                                    background:
                                                        password.length >= level * 4
                                                            ? level === 1 ? "#e57373" : level === 2 ? "#f59e0b" : "#22c55e"
                                                            : "#fde8e8",
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Confirmar contraseña */}
                            <div>
                                <label className="block text-sm font-semibold text-[#1c1917] mb-2">
                                    Confirmar contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className={`w-full px-4 py-3 pr-12 rounded-xl border bg-[#fff9f9] text-[#1c1917] placeholder-[#c4908a] focus:outline-none focus:ring-2 transition-all text-sm ${passwordsMismatch
                                                ? "border-[#c0392b] focus:ring-[#c0392b]/30"
                                                : passwordsMatch
                                                    ? "border-green-400 focus:ring-green-400/30"
                                                    : "border-[#fde8e8] focus:ring-[#c0392b]/30 focus:border-[#c0392b]"
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#c4908a] hover:text-[#c0392b] transition-colors text-sm"
                                    >
                                        {showConfirm ? "🙈" : "👁️"}
                                    </button>
                                </div>
                            </div>

                            {/* Botón */}
                            <button
                                type="submit"
                                disabled={isLoading || passwordsMismatch}
                                className="w-full bg-[#c0392b] hover:bg-[#a93226] disabled:bg-[#e57373] text-white font-semibold py-3.5 rounded-full transition-colors text-sm shadow-sm mt-2"
                            >
                                {isLoading ? "Creando cuenta..." : "Crear cuenta"}
                            </button>
                        </form>

                        {/* Footer */}
                        <div className="mt-6 pt-6 border-t border-[#fde8e8] text-center space-y-2">
                            <p className="text-sm text-[#7c3a2e]">
                                ¿Ya tienes cuenta?{" "}
                                <Link href="/login" className="text-[#c0392b] font-bold hover:underline">
                                    Iniciar sesión
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}