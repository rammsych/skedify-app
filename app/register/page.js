"use client";

import { useState } from "react";
import Image from "next/image";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Usuario creado correctamente");
            setName("");
            setEmail("");
            setPassword("");
        } else {
            alert(data.error || "Error al registrar usuario");
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#eafff4] via-white to-[#eef7ff] flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <Image
                        src="/images/logo-horizontal.png"
                        alt="Skedify"
                        width={260}
                        height={80}
                        className="h-auto w-[220px] sm:w-[260px] object-contain"
                        priority
                    />
                </div>

                <form
                    onSubmit={handleRegister}
                    className="bg-white/90 border border-[#d8f5e4] rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col gap-5"
                >
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-[#08213b]">
                            Crear cuenta
                        </h1>

                        <p className="text-sm sm:text-base text-gray-500 mt-2">
                            Regístrate para reservar salas.
                        </p>
                    </div>

                    <input
                        type="text"
                        placeholder="Nombre"
                        className="w-full rounded-xl border border-gray-200 p-3 focus:border-[#00c16a] focus:ring-4 focus:ring-[#00c16a]/20"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <input
                        type="email"
                        placeholder="Correo"
                        className="w-full rounded-xl border border-gray-200 p-3 focus:border-[#00c16a] focus:ring-4 focus:ring-[#00c16a]/20"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="w-full rounded-xl border border-gray-200 p-3 focus:border-[#00c16a] focus:ring-4 focus:ring-[#00c16a]/20"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button
                        type="submit"
                        className="w-full rounded-xl bg-gradient-to-r from-[#00c16a] to-[#7fe600] text-[#08213b] font-bold p-3 shadow-lg"
                    >
                        Crear cuenta
                    </button>
                </form>
            </div>
        </main>
    );
}