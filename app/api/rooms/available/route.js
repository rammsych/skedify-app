import { prisma } from "@/lib/prisma";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);

        const date = searchParams.get("date");
        const startTime = searchParams.get("startTime");
        const endTime = searchParams.get("endTime");

        if (!date || !startTime || !endTime) {
            return Response.json(
                { error: "Fecha, hora inicio y hora término son obligatorias" },
                { status: 400 }
            );
        }

        if (startTime >= endTime) {
            return Response.json(
                { error: "La hora de término debe ser mayor a la hora de inicio" },
                { status: 400 }
            );
        }

        const rooms = await prisma.room.findMany({
            where: {
                isAvailable: true,
                openingTime: {
                    lte: startTime,
                },
                closingTime: {
                    gte: endTime,
                },
                bookings: {
                    none: {
                        date: new Date(date),
                        startTime: {
                            lt: endTime,
                        },
                        endTime: {
                            gt: startTime,
                        },
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });

        return Response.json(rooms);
    } catch (error) {
        console.log(error);

        return Response.json(
            { error: "Error al buscar salas disponibles" },
            { status: 500 }
        );
    }
}