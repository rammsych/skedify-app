import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return Response.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        const bookings = await prisma.booking.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                room: true,
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
            { error: "Error al obtener reservas" },
            { status: 500 }
        );
    }
}