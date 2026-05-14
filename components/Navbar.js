"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    if (pathname === "/login" || pathname === "/register" || !session) {
        return null;
    }

    const isAdmin = session?.user?.role === "ADMIN";

    return (
        <header className="border-b border-[#d8f5e4] bg-white/90 backdrop-blur sticky top-0 z-50">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/calendar" className="flex items-center">
                        <Image
                            src="/images/logo-horizontal.png"
                            alt="Skedify"
                            width={180}
                            height={50}
                            className="h-auto w-[130px] sm:w-[170px] object-contain"
                            priority
                        />
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/calendar" className="text-sm font-medium text-[#08213b] hover:text-[#00c16a] transition">
                            Inicio
                        </Link>

                        <Link href="/dashboard" className="text-sm font-medium text-[#08213b] hover:text-[#00c16a] transition">
                            Dashboard
                        </Link>

                        <Link href="/rooms" className="text-sm font-medium text-[#08213b] hover:text-[#00c16a] transition">
                            Salas
                        </Link>

                        <Link href="/my-bookings" className="text-sm font-medium text-[#08213b] hover:text-[#00c16a] transition">
                            Mis reservas
                        </Link>

                        <Link href="/calendar" className="text-sm font-medium text-[#08213b] hover:text-[#00c16a] transition">
                            Calendario
                        </Link>

                        {isAdmin && (
                            <Link href="/admin/rooms" className="text-sm font-medium text-[#08213b] hover:text-[#00c16a] transition">
                                Administrar salas
                            </Link>
                        )}

                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="rounded-xl bg-[#008c4b] text-white font-bold px-4 py-2 shadow-md hover:bg-[#007242] transition"
                        >
                            Salir
                        </button>
                    </nav>

                    <button
                        onClick={() => setOpen(!open)}
                        className="md:hidden rounded-xl border border-[#d8f5e4] px-3 py-2 text-[#08213b]"
                    >
                        ☰
                    </button>
                </div>

                {open && (
                    <div className="md:hidden border-t border-[#d8f5e4] py-4 flex flex-col gap-4">
                        <Link href="/calendar" onClick={() => setOpen(false)}>
                            Inicio
                        </Link>

                        <Link href="/dashboard" onClick={() => setOpen(false)}>
                            Dashboard
                        </Link>

                        <Link href="/rooms" onClick={() => setOpen(false)}>
                            Salas
                        </Link>

                        <Link href="/my-bookings" onClick={() => setOpen(false)}>
                            Mis reservas
                        </Link>

                        <Link href="/calendar" onClick={() => setOpen(false)}>
                            Calendario
                        </Link>

                        {isAdmin && (
                            <Link href="/admin/rooms" onClick={() => setOpen(false)}>
                                Administrar salas
                            </Link>
                        )}

                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="w-full rounded-xl bg-[#008c4b] text-white font-bold px-4 py-2 shadow-md hover:bg-[#007242] transition"
                        >
                            Salir
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}