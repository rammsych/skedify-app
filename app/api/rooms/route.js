import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const rooms = await prisma.room.findMany({
            include: {
                images: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return Response.json(rooms);
    } catch (error) {
        console.log(error);

        return Response.json(
            { error: "Error al obtener salas" },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const body = await req.json();

        const {
            code,
            name,
            capacity,
            location,
            description,
            openingTime,
            closingTime,
            isAvailable,
            images,
        } = body;

        if (!code || !name || !capacity) {
            return Response.json(
                { error: "Código, nombre y capacidad son obligatorios" },
                { status: 400 }
            );
        }

        const existingRoom = await prisma.room.findUnique({
            where: {
                code,
            },
        });

        if (existingRoom) {
            return Response.json(
                { error: "Ya existe una sala con ese código" },
                { status: 400 }
            );
        }

        const room = await prisma.room.create({
            data: {
                code,
                name,
                capacity: Number(capacity),
                location,
                description,
                openingTime,
                closingTime,
                isAvailable: isAvailable ?? true,

                images: {
                    create:
                        images?.map((url) => ({
                            url,
                        })) || [],
                },
            },
            include: {
                images: true,
            },
        });

        return Response.json(room);
    } catch (error) {
        console.log(error);

        return Response.json(
            { error: "Error al crear sala" },
            { status: 500 }
        );
    }
}