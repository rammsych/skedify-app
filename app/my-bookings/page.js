"use client";

import { useEffect, useState } from "react";

export default function MyBookingsPage() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        const res = await fetch("/api/my-bookings");
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
    };

    const deleteBooking = async (id) => {
        const confirmDelete = confirm("¿Cancelar reserva?");
        if (!confirmDelete) return;

        const res = await fetch(`/api/bookings/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            alert("Error al cancelar");
            return;
        }

        loadBookings();
    };

    return (
        <main className="min-h-screen px-4 py-6 sm:px-8">
            <section className="mx-auto max-w-6xl">
                <div className="bg-white/90 border border-[#d8f5e4] rounded-3xl shadow-sm p-5 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#08213b]">
                        Mis reservas
                    </h1>
                    <p className="text-sm sm:text-base text-gray-500 mt-1">
                        Revisa y administra tus reservas activas.
                    </p>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-4">
                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            className="bg-white/90 border border-[#d8f5e4] rounded-3xl shadow-sm p-5"
                        >
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-[#08213b]">
                                        {booking.room.name}
                                    </h2>

                                    <p className="text-sm text-gray-500">
                                        Código: {booking.room.code}
                                    </p>

                                    <div className="mt-3 space-y-1">
                                        <p className="text-sm text-gray-600">
                                            📅 {booking.date.split("T")[0]}
                                        </p>

                                        <p className="text-sm text-gray-600">
                                            🕒 {booking.startTime} - {booking.endTime}
                                        </p>

                                        <p className="text-sm text-gray-600">
                                            Estado: {booking.status}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => deleteBooking(booking.id)}
                                    className="w-full sm:w-auto rounded-xl bg-red-500 text-white px-5 py-3 text-sm font-medium hover:bg-red-600 transition"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ))}

                    {bookings.length === 0 && (
                        <div className="bg-white/90 border border-[#d8f5e4] rounded-3xl p-8 text-center">
                            <p className="text-gray-500">
                                No tienes reservas activas.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}