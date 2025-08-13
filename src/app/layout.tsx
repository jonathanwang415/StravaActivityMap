import { AuthProvider } from "@/contexts/AuthContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { Theme, ThemePanel } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

export default function RootLayout({
    children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <Theme accentColor="purple" grayColor="sand" panelBackground="solid" radius="full">
                    <AuthProvider>
                        <LoadingProvider>
                            {children}
                        </LoadingProvider>
                    </AuthProvider>
                    {/* <ThemePanel/> */}
                </Theme>
            </body>
        </html>
    )
};