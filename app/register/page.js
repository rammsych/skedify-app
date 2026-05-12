"use client";

import { useState } from "react";

export default function RegisterPage() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {

            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Usuario creado correctamente");

                setName("");
                setEmail("");
                setPassword("");

            } else {
                alert(data.error);
            }

        } catch (error) {
            console.log(error);
            alert("Error al registrar usuario");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">

            <form
                onSubmit={handleRegister}
                className="flex flex-col gap-4 w-80 border p-6 rounded"
            >

                <h1 className="text-2xl font-bold text-center">
                    Registro
                </h1>

                <input
                    type="text"
                    placeholder="Nombre"
                    className="border p-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Correo"
                    className="border p-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    className="border p-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="submit"
                    className="bg-black text-white p-2 rounded"
                >
                    Crear cuenta
                </button>

            </form>

        </div>
    );
}