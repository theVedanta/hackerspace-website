import "./globals.css";

export const metadata = {
    title: "UA HackerSpace",
    description: "Hackathon Club of the University of Alabama",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`.plus-jakarta-sans dark antialiased`}>
                {children}
            </body>
        </html>
    );
}
