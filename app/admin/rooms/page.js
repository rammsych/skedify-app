"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminRoomsPage() {
    const [rooms, setRooms] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        code: "",
        name: "",
        capacity: "",
        location: "",
        description: "",
        openingTime: "09:00",
        closingTime: "18:00",
        isAvailable: true,
    });

    const loadRooms = async () => {
        const res = await fetch("/api/rooms");
        const data = await res.json();
        setRooms(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
        loadRooms();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const uploadedImages = [];

            if (imageFiles.length > 0) {
                for (const file of imageFiles) {
                    const fileExt = file.name.split(".").pop();

                    const fileName = `room-${Date.now()}-${Math.random()
                        .toString(36)
                        .substring(2)}.${fileExt}`;

                    const { error } = await supabase.storage
                        .from("room-images")
                        .upload(fileName, file);

                    if (error) {
                        console.log(error);
                        alert("Error al subir imágenes");
                        setLoading(false);
                        return;
                    }

                    const { data } = supabase.storage
                        .from("room-images")
                        .getPublicUrl(fileName);

                    uploadedImages.push(data.publicUrl);
                }
            }

            const res = await fetch("/api/rooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...form,
                    images: uploadedImages,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Error al crear sala");
                setLoading(false);
                return;
            }

            alert("Sala creada correctamente");

            setForm({
                code: "",
                name: "",
                capacity: "",
                location: "",
                description: "",
                openingTime: "09:00",
                closingTime: "18:00",
                isAvailable: true,
            });

            setImageFiles([]);

            const input = document.getElementById("room-images-input");
            if (input) input.value = "";

            await loadRooms();
        } catch (error) {
            console.log(error);
            alert("Error inesperado al crear sala");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen px-4 py-6 sm:px-8">
            <section className="mx-auto max-w-7xl">
                <div className="bg-white/90 border border-[#d8f5e4] rounded-3xl shadow-sm p-5 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#08213b]">
                        Administración de salas
                    </h1>

                    <p className="text-sm sm:text-base text-gray-500 mt-1">
                        Crea salas, define disponibilidad y agrega fotografías.
                    </p>
                </div>

                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white/90 border border-[#d8f5e4] rounded-3xl shadow-sm p-5 sm:p-8 flex flex-col gap-4"
                    >
                        <h2 className="text-lg sm:text-xl font-bold text-[#08213b]">
                            Nueva sala
                        </h2>

                        <input
                            className="w-full rounded-xl border border-gray-200 p-3 focus:border-[#008c4b] focus:ring-4 focus:ring-[#008c4b]/20"
                            placeholder="Código de sala"
                            value={form.code}
                            onChange={(e) => setForm({ ...form, code: e.target.value })}
                        />

                        <input
                            className="w-full rounded-xl border border-gray-200 p-3 focus:border-[#008c4b] focus:ring-4 focus:ring-[#008c4b]/20"
                            placeholder="Nombre de sala"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />

                        <input
                            className="w-full rounded-xl border border-gray-200 p-3 focus:border-[#008c4b] focus:ring-4 focus:ring-[#008c4b]/20"
                            type="number"
                            placeholder="Capacidad"
                            value={form.capacity}
                            onChange={(e) =>
                                setForm({ ...form, capacity: e.target.value })
                            }
                        />

                        <input
                            className="w-full rounded-xl border border-gray-200 p-3 focus:border-[#008c4b] focus:ring-4 focus:ring-[#008c4b]/20"
                            placeholder="Ubicación"
                            value={form.location}
                            onChange={(e) =>
                                setForm({ ...form, location: e.target.value })
                            }
                        />

                        <textarea
                            className="w-full rounded-xl border border-gray-200 p-3 min-h-24 focus:border-[#008c4b] focus:ring-4 focus:ring-[#008c4b]/20"
                            placeholder="Descripción"
                            value={form.description}
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                className="w-full rounded-xl border border-gray-200 p-3 focus:border-[#008c4b] focus:ring-4 focus:ring-[#008c4b]/20"
                                type="time"
                                value={form.openingTime}
                                onChange={(e) =>
                                    setForm({ ...form, openingTime: e.target.value })
                                }
                            />

                            <input
                                className="w-full rounded-xl border border-gray-200 p-3 focus:border-[#008c4b] focus:ring-4 focus:ring-[#008c4b]/20"
                                type="time"
                                value={form.closingTime}
                                onChange={(e) =>
                                    setForm({ ...form, closingTime: e.target.value })
                                }
                            />
                        </div>

                        <label className="flex items-center gap-2 text-sm sm:text-base text-[#08213b]">
                            <input
                                type="checkbox"
                                checked={form.isAvailable}
                                onChange={(e) =>
                                    setForm({ ...form, isAvailable: e.target.checked })
                                }
                            />
                            Sala disponible
                        </label>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium text-[#08213b]">
                                Fotos de la sala
                            </label>

                            <input
                                id="room-images-input"
                                type="file"
                                accept="image/*"
                                multiple
                                className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm focus:border-[#008c4b] focus:ring-4 focus:ring-[#008c4b]/20"
                                onChange={(e) =>
                                    setImageFiles(Array.from(e.target.files || []))
                                }
                            />

                            {imageFiles.length > 0 && (
                                <p className="text-xs text-gray-500">
                                    {imageFiles.length} imagen(es) seleccionada(s)
                                </p>
                            )}

                            {imageFiles.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                                    {imageFiles.map((file, index) => (
                                        <div
                                            key={`${file.name}-${index}`}
                                            className="rounded-2xl overflow-hidden border border-[#d8f5e4] bg-white"
                                        >
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Vista previa ${index + 1}`}
                                                className="h-24 w-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-[#008c4b] text-white font-bold p-3 shadow-md hover:bg-[#007242] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {loading ? "Guardando..." : "Guardar sala"}
                        </button>
                    </form>

                    <div className="bg-white/90 border border-[#d8f5e4] rounded-3xl shadow-sm p-5 sm:p-8">
                        <h2 className="text-lg sm:text-xl font-bold text-[#08213b]">
                            Salas registradas
                        </h2>

                        <div className="mt-4 grid grid-cols-1 gap-4">
                            {rooms.map((room) => (
                                <div
                                    key={room.id}
                                    className="border border-[#d8f5e4] rounded-2xl p-4 bg-[#fafffc]"
                                >
                                    {room.images?.length > 0 ? (
                                        <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            {room.images.slice(0, 3).map((image) => (
                                                <img
                                                    key={image.id}
                                                    src={image.url}
                                                    alt={room.name}
                                                    className="h-24 w-full rounded-xl object-cover border border-[#d8f5e4]"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="mb-4 h-24 rounded-xl bg-[#eafff4] border border-[#d8f5e4] flex items-center justify-center text-sm text-gray-500">
                                            Sin fotos
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div>
                                            <h3 className="font-bold text-[#08213b]">
                                                {room.name}
                                            </h3>

                                            <p className="text-sm text-gray-500">
                                                Código: {room.code} · Capacidad: {room.capacity}
                                            </p>

                                            <p className="text-sm text-gray-500">
                                                Horario: {room.openingTime || "-"} a{" "}
                                                {room.closingTime || "-"}
                                            </p>
                                        </div>

                                        <span
                                            className={`text-sm rounded-full px-3 py-1 border ${room.isAvailable
                                                    ? "bg-[#eafff4] border-[#d8f5e4] text-[#08213b]"
                                                    : "bg-gray-100 border-gray-200 text-gray-500"
                                                }`}
                                        >
                                            {room.isAvailable ? "Disponible" : "No disponible"}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {rooms.length === 0 && (
                                <p className="text-sm text-gray-500">
                                    Aún no hay salas registradas.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}