"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.ok) {
            router.push("/calendar");
        } else {
            alert("Credenciales incorrectas");
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#eafff4] via-white to-[#eef7ff] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <Image
                        src="/images/logo.jpeg"
                        alt="Skedify"
                        width={280}
                        height={90}
                        className="h-auto w-[220px] sm:w-[280px] object-contain"
                        priority
                    />
                </div>

                <form
                    onSubmit={handleLogin}
                    className="bg-white/90 backdrop-blur border border-[#d8f5e4] rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col gap-5"
                >
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-[#08213b]">
                            Bienvenido
                        </h1>

                        <p className="text-sm sm:text-base text-gray-500 mt-2">
                            Gestiona tus salas y reservas inteligentes.
                        </p>
                    </div>

                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm sm:text-base focus:border-[#00c16a] focus:ring-4 focus:ring-[#00c16a]/20"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm sm:text-base focus:border-[#00c16a] focus:ring-4 focus:ring-[#00c16a]/20"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="rounded-xl bg-[#008c4b] text-white font-bold px-4 py-2 shadow-md hover:bg-[#007242] transition"
                    >
                        Ingresar
                    </button>

                    <p className="text-center text-xs text-gray-400">
                        Skedify · Schedule smarter.
                    </p>
                </form>
            </div>
        </main>
    );
}