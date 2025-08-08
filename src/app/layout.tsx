import { AuthProvider } from "@/contexts/AuthContext";
import { LoadingProvider } from "@/contexts/LoadingContext";

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <LoadingProvider>
                        {children}
                    </LoadingProvider>
                </AuthProvider>
            </body>
        </html>
    )
};