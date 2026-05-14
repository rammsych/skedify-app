"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function RoomsPage() {
    const { data: session } = useSession();

    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const [form, setForm] = useState({
        date: "",
        startTime: "",
        endTime: "",
    });

    useEffect(() => {
        loadRooms();
    }, []);

    const loadRooms = async () => {
        const res = await fetch("/api/rooms");
        const data = await res.json();
        setRooms(data);
    };

    const createBooking = async () => {
        if (!session?.user?.id) {
            alert("Debes iniciar sesión");
            return;
        }

        const res = await fetch("/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                roomId: selectedRoom.id,
                userId: session.user.id,
                date: form.date,
                startTime: form.startTime,
                endTime: form.endTime,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Error al reservar");
            return;
        }

        alert("Reserva creada correctamente");
        setSelectedRoom(null);
        setForm({ date: "", startTime: "", endTime: "" });
    };

    return (
        <main className="min-h-screen px-4 py-6 sm:px-8">
            <section className="mx-auto max-w-7xl">
                <div className="bg-white/90 border border-[#d8f5e4] rounded-3xl shadow-sm p-5 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#08213b]">
                        Salas disponibles
                    </h1>
                    <p className="text-gray-500 text-sm sm:text-base mt-1">
                        Selecciona una sala y agenda una reserva.
                    </p>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className="bg-white/90 border border-[#d8f5e4] rounded-3xl shadow-sm overflow-hidden"
                        >
                            <div className="p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg sm:text-xl font-bold text-[#08213b]">
                                            {room.name}
                                        </h2>
                                        <p className="text-sm text-gray-500">
                                            Código: {room.code}
                                        </p>
                                    </div>

                                    <span className="text-xs sm:text-sm bg-[#eafff4] text-[#08213b] px-3 py-1 rounded-full border border-[#d8f5e4]">
                                        {room.capacity} personas
                                    </span>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <p className="text-sm text-gray-600">
                                        📍 {room.location || "Sin ubicación"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        🕒 {room.openingTime || "--"} - {room.closingTime || "--"}
                                    </p>
                                    <p className="text-sm text-gray-600 line-clamp-3">
                                        {room.description || "Sin descripción"}
                                    </p>
                                </div>

                                <button
                                    onClick={() => setSelectedRoom(room)}
                                    disabled={!room.isAvailable}
                                    className="mt-6 w-full rounded-xl bg-[#008c4b] text-white font-bold p-3 shadow-md hover:bg-[#007242] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    {room.isAvailable ? "Reservar sala" : "No disponible"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {selectedRoom && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white w-full max-w-md rounded-3xl p-5 sm:p-6 border border-[#d8f5e4]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-[#08213b]">
                                    Reservar {selectedRoom.name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Completa fecha y horario.
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedRoom(null)}
                                className="bg-gray-100 rounded-xl px-3 py-2 text-sm"
                            >
                                Cerrar
                            </button>
                        </div>

                        <div className="mt-6 flex flex-col gap-4">
                            <input
                                type="date"
                                className="w-full rounded-xl border border-gray-200 p-3 focus:border-[#00c16a] focus:ring-4 focus:ring-[#00c16a]/20"
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="time"
                                    className="w-full rounded-xl border border-gray-200 p-3 focus:border-[#00c16a] focus:ring-4 focus:ring-[#00c16a]/20"
                                    value={form.startTime}
                                    onChange={(e) =>
                                        setForm({ ...form, startTime: e.target.value })
                                    }
                                />

                                <input
                                    type="time"
                                    className="w-full rounded-xl border border-gray-200 p-3 focus:border-[#00c16a] focus:ring-4 focus:ring-[#00c16a]/20"
                                    value={form.endTime}
                                    onChange={(e) =>
                                        setForm({ ...form, endTime: e.target.value })
                                    }
                                />
                            </div>

                            <button
                                onClick={createBooking}
                                className="w-full rounded-xl bg-gradient-to-r from-[#00c16a] to-[#7fe600] text-[#08213b] font-bold p-3 shadow-md"
                            >
                                Confirmar reserva
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}