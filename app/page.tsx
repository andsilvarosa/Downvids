"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Download, 
  Facebook, 
  Loader2, 
  Link as LinkIcon, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { toast, Toaster } from "sonner";
import { downloadFacebookVideo, FacebookVideoInfo } from "@/lib/facebook";

export default function FacebookDownloader() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<FacebookVideoInfo | null>(null);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast.error("Por favor, insira uma URL do Facebook");
      return;
    }

    setIsLoading(true);
    setVideoInfo(null);
    
    try {
      const info = await downloadFacebookVideo(url);
      setVideoInfo(info);
      toast.success("Vídeo processado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao processar o vídeo");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = (fileUrl: string, quality: string) => {
    // Open in new tab as fallback or try to trigger download
    window.open(fileUrl, "_blank");
    toast.info(`Iniciando download da versão ${quality}...`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] font-sans selection:bg-blue-100">
      <Toaster position="top-center" richColors />
      
      {/* Navigation / Header */}
      <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold tracking-tight text-blue-600">
            <Facebook className="h-6 w-6" />
            <span className="text-xl">FB Save</span>
          </div>
          <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
            <a href="#" className="transition-colors hover:text-blue-600">Recursos</a>
            <a href="#" className="transition-colors hover:text-blue-600">Como usar</a>
            <a href="#" className="transition-colors hover:text-blue-600">Segurança</a>
          </div>
          <Button variant="outline" size="sm" className="hidden border-blue-200 text-blue-600 hover:bg-blue-50 md:flex">
            Suporte
          </Button>
        </div>
      </nav>

      <main className="container mx-auto max-w-5xl px-4 py-12 md:py-24">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-6xl">
              Baixe vídeos do <span className="text-blue-600">Facebook</span> em segundos.
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-600 sm:text-xl">
              A maneira mais rápida e segura de salvar Reels, Vídeos e transmissões do Facebook em alta qualidade.
            </p>
          </motion.div>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-10 max-w-2xl"
          >
            <form 
              onSubmit={handleDownload}
              className="flex flex-col gap-3 rounded-2xl bg-white p-2 shadow-xl shadow-blue-500/5 ring-1 ring-slate-200 sm:flex-row"
            >
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Cole o link do vídeo aqui..."
                  className="h-12 border-none bg-transparent pl-10 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                disabled={isLoading}
                className="h-12 rounded-xl bg-blue-600 px-8 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Obter Vídeo
                  </>
                )}
              </Button>
            </form>
            <div className="mt-4 flex items-center justify-center gap-4 text-xs font-medium text-slate-400">
               <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Seguro & Gratuito</span>
               <span className="flex items-center gap-1"><Zap className="h-3 w-3" /> Alta Velocidade</span>
               <span className="flex items-center gap-1 text-slate-300">|</span>
               <span className="flex items-center gap-1 underline decoration-slate-200 underline-offset-4 cursor-pointer hover:text-slate-500">Privacidade</span>
            </div>
          </motion.div>
        </div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mx-auto max-w-2xl"
            >
              <Card className="overflow-hidden border-none bg-white shadow-lg shadow-blue-500/5 ring-1 ring-slate-100">
                <div className="flex flex-col md:flex-row">
                  <Skeleton className="h-48 w-full md:h-auto md:w-64" />
                  <div className="flex-1 p-6">
                    <Skeleton className="mb-4 h-6 w-3/4" />
                    <Skeleton className="mb-2 h-4 w-full" />
                    <Skeleton className="mb-6 h-4 w-1/2" />
                    <div className="flex gap-3">
                      <Skeleton className="h-10 w-24" />
                      <Skeleton className="h-10 w-24" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {videoInfo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mx-auto max-w-2xl"
            >
              <Card className="overflow-hidden border-none bg-white shadow-2xl shadow-blue-500/10 ring-1 ring-slate-100">
                <div className="flex flex-col md:flex-row">
                  <div className="relative aspect-video w-full md:w-72 md:aspect-square">
                    <Image 
                      src={videoInfo.thumbnail} 
                      alt={videoInfo.title}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Fonte: {videoInfo.source}</p>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <CardTitle className="mb-2 line-clamp-2 text-xl leading-tight">{videoInfo.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <LinkIcon className="h-3 w-3" />
                         Link validado e pronto para download
                      </CardDescription>
                    </div>
                    
                    <div className="mt-8 flex flex-wrap gap-3">
                      {videoInfo.links.map((link, idx) => (
                        <Button 
                          key={idx} 
                          onClick={() => downloadFile(link.url, link.quality)}
                          className={`${idx === 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-800 hover:bg-slate-900'} font-bold shadow-sm transition-transform active:scale-95`}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Baixar {link.quality}
                        </Button>
                      ))}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-400 hover:text-slate-600"
                        onClick={() => window.open(url, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
              <p className="mt-4 text-center text-xs text-slate-400 italic">
                Nota: Se o download não iniciar automaticamente, clique com o botão direito e selecione &quot;Salvar vídeo como...&quot;.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features / FAQ Section */}
        <div className="mt-32 grid gap-12 md:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
               <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="mb-2 font-bold uppercase tracking-wide text-xs text-slate-400">Privacidade Total</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Não armazenamos seus vídeos ou dados. Todo o processamento é feito de forma segura e anônima.</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
               <Zap className="h-6 w-6" />
            </div>
            <h3 className="mb-2 font-bold uppercase tracking-wide text-xs text-slate-400">Qualidade HD</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Sempre que disponível, fornecemos links para as versões em alta definição (720p, 1080p).</p>
          </div>
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
               <Info className="h-6 w-6" />
            </div>
            <h3 className="mb-2 font-bold uppercase tracking-wide text-xs text-slate-400">Multi-Plataforma</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Funciona perfeitamente em Chrome, Safari, dispositivos móveis Android e iOS (iPhone/iPad).</p>
          </div>
        </div>
      </main>

      <footer className="mt-24 border-t bg-white py-12">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <p className="text-sm text-slate-400">
            © 2026 FB Save - Ferramenta de download gratuita. Não temos afiliação com a Meta ou Facebook.
          </p>
        </div>
      </footer>
    </div>
  );
}
