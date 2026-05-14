"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
    const [data, setData] = useState(null);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        const res = await fetch("/api/dashboard");
        const result = await res.json();
        setData(result);
    };

    if (!data) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <p className="text-[#08213b] font-medium">Cargando dashboard...</p>
            </main>
        );
    }

    return (
        <main className="min-h-screen px-4 py-6 sm:px-8">
            <section className="mx-auto max-w-7xl">
                <div className="bg-white/90 border border-[#d8f5e4] rounded-3xl shadow-sm p-5 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#08213b]">
                        Dashboard
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Resumen general de Skedify.
                    </p>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    <div className="bg-white/90 border border-[#d8f5e4] rounded-3xl shadow-sm p-6">
                        <p className="text-sm text-gray-500">Total salas</p>
                        <h2 className="mt-2 text-4xl font-bold text-[#00c16a]">
                            {data.totalRooms}
                        </h2>
                    </div>

                    <div className="bg-white/90 border border-[#d8f5e4] rounded-3xl shadow-sm p-6">
                        <p className="text-sm text-gray-500">Total reservas</p>
                        <h2 className="mt-2 text-4xl font-bold text-[#00c16a]">
                            {data.totalBookings}
                        </h2>
                    </div>

                    <div className="bg-white/90 border border-[#d8f5e4] rounded-3xl shadow-sm p-6">
                        <p className="text-sm text-gray-500">Reservas próximas</p>
                        <h2 className="mt-2 text-4xl font-bold text-[#00c16a]">
                            {data.bookingsToday}
                        </h2>
                    </div>
                </div>

                <div className="mt-10 bg-white/90 border border-[#d8f5e4] rounded-3xl shadow-sm p-6">
                    <h2 className="text-xl font-bold text-[#08213b]">
                        Próximas reservas
                    </h2>

                    <div className="mt-6 grid grid-cols-1 gap-4">
                        {data.upcomingBookings.map((booking) => (
                            <div key={booking.id} className="border border-[#d8f5e4] rounded-2xl p-4 bg-[#fafffc]">
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                                    <div>
                                        <h3 className="font-bold text-[#08213b]">
                                            {booking.room.name}
                                        </h3>

                                        <p className="text-sm text-gray-500">
                                            Usuario: {booking.user.name}
                                        </p>
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        <p>📅 {booking.date.split("T")[0]}</p>
                                        <p>🕒 {booking.startTime} - {booking.endTime}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {data.upcomingBookings.length === 0 && (
                            <p className="text-sm text-gray-500">
                                No hay reservas próximas.
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}