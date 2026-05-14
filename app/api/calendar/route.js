import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                room: true,
                user: true,
            },
            orderBy: [
                { date: "asc" },
                { startTime: "asc" },
            ],
        });

        return Response.json(bookings);
    } catch (error) {
        console.log(error);

        return Response.json(
            { error: "Error al cargar calendario" },
            { status: 500 }
        );
    }
}