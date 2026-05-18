"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket, Trophy, ShieldCheck, Zap, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, ScaleIn } from "@/components/shared/LotterySkeletons";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { PaymentReceiptView } from "@/components/shared/PaymentReceiptView";

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const paymentStatus = searchParams.get('payment') || searchParams.get('status');
  const txRef = searchParams.get('tx_ref') || searchParams.get('trx_ref');
  const isPaymentRedirect = !!paymentStatus && !!txRef;

  if (isPaymentRedirect) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-background/60">
          <Link className="flex items-center justify-center group" href="/">
            <Trophy className="h-6 w-6 text-[#2D338B]" />
            <span className="ml-2 text-xl font-black tracking-tighter">
              <span className="text-[#2D338B]">TAM</span>
              <span className="text-[#F7941E]">CON.</span>
            </span>
          </Link>
        </header>
        <main className="flex-1">
          <PaymentReceiptView txRef={txRef!} />
        </main>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-[#2D338B]/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, -45, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-[#F7941E]/10 rounded-full blur-[100px]" 
        />
      </div>

      <header className="px-4 lg:px-6 h-16 flex items-center border-b backdrop-blur-md sticky top-0 z-50 bg-background/60">
        <Link className="flex items-center justify-center group" href="#">
          <Trophy className="h-6 w-6 text-[#2D338B] transition-transform group-hover:rotate-12" />
          <span className="ml-2 text-xl font-black tracking-tighter">
            <span className="text-[#2D338B]">TAM</span>
            <span className="text-[#F7941E]">CON.</span>
          </span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-8 items-center">
          <Link className="text-sm font-semibold hover:text-[#2D338B] transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-semibold hover:text-[#2D338B] transition-colors" href="/login">
            Login
          </Link>
          <Button asChild size="sm" className="bg-[#2D338B] hover:bg-[#2D338B]/90 shadow-lg shadow-[#2D338B]/20">
            <Link href="/register">Join Now</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="relative w-full py-20 md:py-32 lg:py-48 overflow-hidden">
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center">
              <FadeIn>
                <Badge variant="outline" className="px-4 py-1.5 border-[#2D338B]/30 text-[#2D338B] bg-[#2D338B]/5 backdrop-blur-sm rounded-full">
                  <Sparkles className="h-3 w-3 mr-2 inline" />
                  Next Draw: Friday 8:00 PM
                </Badge>
              </FadeIn>
              
              <div className="space-y-4 max-w-4xl mx-auto">
                <FadeIn delay={0.2}>
                  <h1 className="text-5xl font-black tracking-tight sm:text-7xl md:text-8xl/none">
                    Win Big with <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2D338B] to-[#F7941E]">
                      Tamcon Weekly
                    </span>
                  </h1>
                </FadeIn>
                <FadeIn delay={0.4}>
                  <p className="mx-auto max-w-[700px] text-muted-foreground md:text-2xl font-medium leading-relaxed">
                    Ethiopia's most transparent digital lottery. Buy tickets for just <span className="text-foreground font-bold">10 ETB</span> and win life-changing prizes every week.
                  </p>
                </FadeIn>
              </div>

              <FadeIn delay={0.6}>
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button size="lg" className="px-10 h-14 text-lg bg-[#2D338B] hover:bg-[#2D338B]/90 shadow-2xl shadow-[#2D338B]/30" asChild>
                    <Link href="/register">
                      Buy Tickets <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="px-10 h-14 text-lg border-[#2D338B]/20 hover:bg-[#2D338B]/5" asChild>
                    <Link href="#how-it-works">How it Works</Link>
                  </Button>
                </div>
              </FadeIn>
            </div>
          </div>

          {/* Floating animated lottery balls */}
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute top-[20%] right-[15%] hidden lg:block"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F7941E] to-[#F7941E]/40 shadow-xl flex items-center justify-center text-white font-bold text-2xl border-4 border-white">
              7
            </div>
          </motion.div>
          <motion.div 
            animate={{ y: [0, 20, 0], rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[25%] left-[10%] hidden lg:block"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2D338B] to-[#2D338B]/40 shadow-xl flex items-center justify-center text-white font-bold text-3xl border-4 border-white">
              24
            </div>
          </motion.div>
          
          {/* New Balls */}
          <motion.div 
            animate={{ y: [0, -30, 0], x: [0, 10, 0] }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute top-[40%] left-[5%] hidden lg:block opacity-40"
          >
            <div className="w-14 h-14 rounded-full bg-[#2D338B] text-white flex items-center justify-center font-bold text-xl border-2 border-white">
              3
            </div>
          </motion.div>
          
          <motion.div 
            animate={{ scale: [1, 1.2, 1], y: [0, 15, 0] }}
            transition={{ duration: 9, repeat: Infinity }}
            className="absolute top-[15%] left-[25%] hidden lg:block opacity-30"
          >
            <div className="w-16 h-16 rounded-full bg-[#F7941E] text-white flex items-center justify-center font-bold text-xl border-2 border-white">
              42
            </div>
          </motion.div>

          {/* GREEN WINNER BALL */}
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 10, -10, 0],
              filter: ["drop-shadow(0 0 0px #22c55e)", "drop-shadow(0 0 20px #22c55e)", "drop-shadow(0 0 0px #22c55e)"]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute top-[60%] right-[10%] hidden lg:block"
          >
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-500 to-green-700 shadow-2xl flex items-center justify-center text-white font-black text-xl border-4 border-white relative leading-none text-center">
                <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-yellow-400 fill-current" />
                Winner
              </div>
              <div className="mt-2 px-3 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full">JACKPOT!</div>
            </div>
          </motion.div>
        </section>
        
        <section id="features" className="w-full py-24 bg-zinc-50/50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              <ScaleIn delay={0.1}>
                <Card className="border-none shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-white rounded-3xl overflow-hidden group">
                  <CardContent className="p-10 space-y-4 text-center">
                    <div className="p-4 rounded-2xl bg-[#2D338B]/5 w-fit mx-auto mb-6 transition-colors group-hover:bg-[#2D338B]/10">
                      <ShieldCheck className="h-10 w-10 text-[#2D338B]" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight">100% Secure</h3>
                    <p className="text-muted-foreground text-lg">
                      Blockchain-powered draws ensure complete transparency and fairness.
                    </p>
                  </CardContent>
                </Card>
              </ScaleIn>
              <ScaleIn delay={0.2}>
                <Card className="border-none shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-white rounded-3xl overflow-hidden group">
                  <CardContent className="p-10 space-y-4 text-center">
                    <div className="p-4 rounded-2xl bg-[#F7941E]/5 w-fit mx-auto mb-6 transition-colors group-hover:bg-[#F7941E]/10">
                      <Zap className="h-10 w-10 text-[#F7941E]" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight">Instant Payouts</h3>
                    <p className="text-muted-foreground text-lg">
                      Winners receive their prizes directly into their digital wallets instantly.
                    </p>
                  </CardContent>
                </Card>
              </ScaleIn>
              <ScaleIn delay={0.3}>
                <Card className="border-none shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-white rounded-3xl overflow-hidden group">
                  <CardContent className="p-10 space-y-4 text-center">
                    <div className="p-4 rounded-2xl bg-[#2D338B]/5 w-fit mx-auto mb-6 transition-colors group-hover:bg-[#2D338B]/10">
                      <Ticket className="h-10 w-10 text-[#2D338B]" />
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight">Low Entry Cost</h3>
                    <p className="text-muted-foreground text-lg">
                      Participate for just 10 ETB. The more you play, the better your chances.
                    </p>
                  </CardContent>
                </Card>
              </ScaleIn>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 border-t bg-white">
        <div className="container px-4 md:px-6 mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#2D338B]" />
            <span className="font-bold">TAMCON WEEKLY</span>
          </div>
          <p className="text-sm text-muted-foreground font-medium">© 2024 Tamcon Lottery Inc. All rights reserved.</p>
          <nav className="flex gap-8">
            <Link className="text-sm font-semibold hover:text-[#2D338B] transition-colors" href="#">Terms</Link>
            <Link className="text-sm font-semibold hover:text-[#2D338B] transition-colors" href="#">Privacy</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}


