import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const totalRooms = await prisma.room.count();

        const totalBookings = await prisma.booking.count();

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const bookingsToday = await prisma.booking.count({
            where: {
                date: {
                    gte: today,
                },
            },
        });

        const upcomingBookings = await prisma.booking.findMany({
            include: {
                room: true,
                user: true,
            },

            orderBy: {
                date: "asc",
            },

            take: 5,
        });

        return Response.json({
            totalRooms,
            totalBookings,
            bookingsToday,
            upcomingBookings,
        });

    } catch (error) {

        console.log(error);

        return Response.json(
            { error: "Error dashboard" },
            { status: 500 }
        );
    }
}