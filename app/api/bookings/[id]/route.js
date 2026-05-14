import { prisma } from "@/lib/prisma";

export async function DELETE(req, context) {

    try {

        const { id } = await context.params;

        await prisma.booking.delete({
            where: {
                id,
            },
        });

        return Response.json({
            message: "Reserva eliminada",
        });

    } catch (error) {

        console.log(error);

        return Response.json(
            { error: "Error al eliminar reserva" },
            { status: 500 }
        );
    }
}