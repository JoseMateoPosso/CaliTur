"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    // Estados para guardar lo que el usuario escribe
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Estados para manejar la experiencia del usuario (UX)
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // La función que se ejecuta al darle clic a "Ingresar"
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Evitamos que la página recargue
        setError("");
        setIsLoading(true);

        try {
            // Hacemos la petición POST a tu API en Render
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                throw new Error("Credenciales incorrectas");
            }

            // Extraemos la respuesta (que debería contener el Token JWT)
            const data = await res.json();

            // Guardamos el token en una Cookie del navegador válida por 1 día
            document.cookie = `calitur_token=${data.access_token}; path=/; max-age=86400`;

            // Conducimos al usuario a la zona VIP (Dashboard)
            router.push("/admin");

        } catch (err) {
            setError("Correo o contraseña incorrectos. ¡Intenta de nuevo!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-blue-600 mb-2">🌴 CaliTur VIP</h1>
                    <p className="text-gray-500">Ingresa tus credenciales de administrador</p>
                </div>

                {/* Mostramos el mensaje de error si existe */}
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                            placeholder="admin@calitur.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-400"
                    >
                        {isLoading ? "Verificando..." : "Ingresar al Panel"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <a href="/" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                        ← Volver al inicio
                    </a>
                </div>
            </div>
        </main>
    );
}