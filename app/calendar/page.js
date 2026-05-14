"use client";

import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { useSession } from "next-auth/react";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";

moment.locale("es");

const localizer = momentLocalizer(moment);

export default function CalendarPage() {
    const { data: session } = useSession();

    const [events, setEvents] = useState([]);
    const [availableRooms, setAvailableRooms] = useState([]);
    const [scheduleOpen, setScheduleOpen] = useState(false);
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [calendarView, setCalendarView] = useState("week");
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [form, setForm] = useState({
        roomId: "",
        date: "",
        startTime: "",
        endTime: "",
    });

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        const res = await fetch("/api/calendar");
        const data = await res.json();

        const parsed = data.map((booking) => {
            const bookingDate = booking.date.split("T")[0];

            return {
                id: booking.id,
                title: `${booking.startTime} - ${booking.room.name}`,
                start: new Date(`${bookingDate}T${booking.startTime}`),
                end: new Date(`${bookingDate}T${booking.endTime}`),
                resource: booking,
            };
        });

        setEvents(parsed);
    };

    const loadAvailableRooms = async (date, startTime, endTime) => {
        if (!date || !startTime || !endTime) return;

        const res = await fetch(
            `/api/rooms/available?date=${date}&startTime=${startTime}&endTime=${endTime}`
        );

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Error al buscar disponibilidad");
            setAvailableRooms([]);
            return;
        }

        setAvailableRooms(data);
    };

    const handleSelectSlot = async ({ start, end }) => {
        const date = moment(start).format("YYYY-MM-DD");

        let startTime = moment(start).format("HH:mm");
        let endTime = moment(end).format("HH:mm");

        if (startTime === "00:00" && endTime === "00:00") {
            startTime = "09:00";
            endTime = "10:00";
        }

        if (startTime >= endTime) {
            endTime = moment(start).add(1, "hour").format("HH:mm");
        }

        setForm({
            roomId: "",
            date,
            startTime,
            endTime,
        });

        await loadAvailableRooms(date, startTime, endTime);
        setScheduleOpen(true);
    };

    const handleSelectEvent = (event) => {
        setSelectedBooking(event.resource);
        setDetailOpen(true);
    };

    const refreshAvailability = async () => {
        setForm({ ...form, roomId: "" });
        await loadAvailableRooms(form.date, form.startTime, form.endTime);
    };

    const createBooking = async () => {
        if (!session?.user?.id) {
            alert("Debes iniciar sesión");
            return;
        }

        if (!form.roomId) {
            alert("Debes seleccionar una sala disponible");
            return;
        }

        const res = await fetch("/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                roomId: form.roomId,
                userId: session.user.id,
                date: form.date,
                startTime: form.startTime,
                endTime: form.endTime,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Error al crear reserva");
            return;
        }

        alert("Reserva creada correctamente");

        setScheduleOpen(false);
        setAvailableRooms([]);
        setForm({
            roomId: "",
            date: "",
            startTime: "",
            endTime: "",
        });

        loadBookings();
    };

    return (
        <main className="min-h-screen px-4 py-6 sm:px-8">
            <section className="mx-auto max-w-7xl">
                <div className="bg-white/90 border border-[#d8f5e4] rounded-3xl shadow-sm p-5 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#08213b]">
                        Calendario de Reservas
                    </h1>

                    <p className="text-sm sm:text-base text-gray-600 mt-1">
                        Visualiza, agenda y revisa reservas de salas.
                    </p>
                </div>

                <div className="mt-6 bg-white/90 border border-[#d8f5e4] rounded-3xl shadow-sm p-4 overflow-x-auto">
                    <div className="h-[700px] min-w-[900px]">
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            views={["month", "week", "day", "agenda"]}
                            view={calendarView}
                            date={calendarDate}
                            onView={(view) => setCalendarView(view)}
                            onNavigate={(date) => setCalendarDate(date)}
                            selectable
                            popup
                            onSelectSlot={handleSelectSlot}
                            onSelectEvent={handleSelectEvent}
                            messages={{
                                today: "Hoy",
                                previous: "Anterior",
                                next: "Siguiente",
                                month: "Mes",
                                week: "Semana",
                                day: "Día",
                                agenda: "Agenda",
                                date: "Fecha",
                                time: "Hora",
                                event: "Reserva",
                                noEventsInRange: "No hay reservas en este rango.",
                            }}
                        />
                    </div>
                </div>
            </section>

            {scheduleOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl p-5 sm:p-6 border border-[#d8f5e4]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-[#08213b]">
                                    Agendar sala
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Selecciona fecha, horario y sala disponible.
                                </p>
                            </div>

                            <button
                                onClick={() => setScheduleOpen(false)}
                                className="rounded-xl bg-[#2f3b52] text-white px-3 py-2 text-sm font-medium hover:bg-[#253146] transition"
                            >
                                Cerrar
                            </button>
                        </div>

                        <div className="mt-6 flex flex-col gap-4">
                            <input
                                type="date"
                                className="w-full rounded-xl border border-gray-200 p-3 focus:border-[#00c16a] focus:ring-4 focus:ring-[#00c16a]/20"
                                value={form.date}
                                onChange={(e) =>
                                    setForm({ ...form, date: e.target.value, roomId: "" })
                                }
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="time"
                                    className="w-full rounded-xl border border-gray-200 p-3 focus:border-[#00c16a] focus:ring-4 focus:ring-[#00c16a]/20"
                                    value={form.startTime}
                                    onChange={(e) =>
                                        setForm({ ...form, startTime: e.target.value, roomId: "" })
                                    }
                                />

                                <input
                                    type="time"
                                    className="w-full rounded-xl border border-gray-200 p-3 focus:border-[#00c16a] focus:ring-4 focus:ring-[#00c16a]/20"
                                    value={form.endTime}
                                    onChange={(e) =>
                                        setForm({ ...form, endTime: e.target.value, roomId: "" })
                                    }
                                />
                            </div>

                            <button
                                onClick={refreshAvailability}
                                className="w-full rounded-xl bg-[#2f3b52] text-white p-3 font-semibold hover:bg-[#253146] transition"
                            >
                                Buscar salas disponibles
                            </button>

                            <select
                                className="w-full rounded-xl border border-gray-200 p-3 focus:border-[#00c16a] focus:ring-4 focus:ring-[#00c16a]/20"
                                value={form.roomId}
                                onChange={(e) =>
                                    setForm({ ...form, roomId: e.target.value })
                                }
                            >
                                <option value="">Seleccionar sala disponible</option>

                                {availableRooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.name} - {room.capacity} personas
                                    </option>
                                ))}
                            </select>

                            {availableRooms.length === 0 && (
                                <p className="text-sm text-red-500">
                                    No hay salas disponibles para ese día y horario.
                                </p>
                            )}

                            <button
                                onClick={createBooking}
                                disabled={!form.roomId || availableRooms.length === 0}
                                className="w-full rounded-xl bg-[#008c4b] text-white font-bold p-3 shadow-md hover:bg-[#007242] transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Confirmar reserva
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {detailOpen && selectedBooking && (
                <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-2xl rounded-3xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto border border-[#d8f5e4]">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-[#08213b]">
                                    Detalle de reserva
                                </h2>

                                <p className="text-sm text-gray-500">
                                    Reserva #{selectedBooking.id}
                                </p>
                            </div>

                            <button
                                onClick={() => setDetailOpen(false)}
                                className="bg-gray-100 rounded-xl px-4 py-2 text-sm font-medium"
                            >
                                Cerrar
                            </button>
                        </div>

                        <div className="mt-5 rounded-2xl border border-[#d8f5e4] bg-[#eafff4] p-4">
                            <h3 className="font-bold text-[#08213b]">
                                Reserva Programada
                            </h3>

                            <p className="mt-2 text-sm">
                                <strong>Fecha:</strong>{" "}
                                {moment(selectedBooking.date).format("YYYY-MM-DD")}
                            </p>

                            <p className="text-sm">
                                <strong>Horario:</strong>{" "}
                                {selectedBooking.startTime} - {selectedBooking.endTime} hrs
                            </p>

                            <p className="text-sm">
                                <strong>Estado:</strong> {selectedBooking.status}
                            </p>
                        </div>

                        <div className="mt-5 space-y-2 text-sm sm:text-base">
                            <p><strong>Sala:</strong> {selectedBooking.room.name}</p>
                            <p><strong>Código:</strong> {selectedBooking.room.code}</p>
                            <p><strong>Capacidad:</strong> {selectedBooking.room.capacity} personas</p>
                            <p><strong>Ubicación:</strong> {selectedBooking.room.location || "Sin ubicación"}</p>
                            <p><strong>Reservado por:</strong> {selectedBooking.user?.name || "Usuario"}</p>
                            <p><strong>Email:</strong> {selectedBooking.user?.email || "No disponible"}</p>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}