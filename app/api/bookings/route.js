import { prisma } from "@/lib/prisma";

export async function POST(req) {

    try {

        const body = await req.json();

        const {
            roomId,
            userId,
            date,
            startTime,
            endTime,
        } = body;

        if (
            !roomId ||
            !userId ||
            !date ||
            !startTime ||
            !endTime
        ) {

            return Response.json(
                { error: "Todos los campos son obligatorios" },
                { status: 400 }
            );
        }

        const room = await prisma.room.findUnique({
            where: {
                id: roomId,
            },
        });

        if (!room) {

            return Response.json(
                { error: "Sala no encontrada" },
                { status: 404 }
            );
        }

        // validar fecha pasada

        const bookingDate = new Date(date);

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        if (bookingDate < today) {

            return Response.json(
                {
                    error: "No puedes reservar fechas pasadas",
                },
                { status: 400 }
            );
        }

        // validar hora inicio/fin

        if (startTime >= endTime) {

            return Response.json(
                {
                    error:
                        "La hora de término debe ser mayor",
                },
                { status: 400 }
            );
        }

        // validar horario sala

        if (
            startTime < room.openingTime ||
            endTime > room.closingTime
        ) {

            return Response.json(
                {
                    error:
                        "Horario fuera disponibilidad sala",
                },
                { status: 400 }
            );
        }

        // validar conflictos

        const existingBooking =
            await prisma.booking.findFirst({

                where: {

                    roomId,

                    date: bookingDate,

                    OR: [
                        {
                            startTime: {
                                lt: endTime,
                            },

                            endTime: {
                                gt: startTime,
                            },
                        },
                    ],
                },
            });

        if (existingBooking) {

            return Response.json(
                {
                    error:
                        "La sala ya está reservada en ese horario",
                },
                { status: 400 }
            );
        }

        const booking =
            await prisma.booking.create({

                data: {
                    roomId,
                    userId,
                    date: bookingDate,
                    startTime,
                    endTime,
                },
            });

        return Response.json(booking);

    } catch (error) {

        console.log(error);

        return Response.json(
            { error: "Error al crear reserva" },
            { status: 500 }
        );
    }
}