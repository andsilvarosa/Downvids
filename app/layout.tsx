import type {Metadata} from 'next';
import './globals.css';
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "FB Save - Baixador de Vídeos do Facebook",
  description: "Baixe vídeos, Reels e fotos do Facebook em alta qualidade gratuitamente.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={cn("font-sans", inter.variable)}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
