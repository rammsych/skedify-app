import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return Response.json(
                { error: "Todos los campos son obligatorios" },
                { status: 400 }
            );
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return Response.json(
                { error: "El usuario ya existe" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        return Response.json({
            message: "Usuario creado correctamente",
            user,
        });
    } catch (error) {
        console.log(error);
        return Response.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}