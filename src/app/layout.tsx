import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FIFA Figs - Compre e Troque Figurinhas",
  description: "A melhor plataforma para comprar, vender e trocar figurinhas da FIFA. Conecte-se com outros colecionadores e complete seu álbum!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-mesh">
        <AuthProvider>
          <div className="flex flex-col min-h-screen relative z-0">
            <Header />
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 flex flex-col">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
