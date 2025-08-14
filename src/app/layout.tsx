import { AuthProvider } from "@/contexts/AuthContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { Theme, Container, Card } from "@radix-ui/themes";
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
                            <Container maxWidth="50%" align="center">
                                <Card m="5">
                                    {children}
                                </Card>
                            </Container>
                        </LoadingProvider>
                    </AuthProvider>
                    {/* <ThemePanel/> */}
                </Theme>
            </body>
        </html>
    )
};