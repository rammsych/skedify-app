import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body>

                <Providers>

                    <Navbar />

                    {children}

                </Providers>

            </body>
        </html>
    );
}