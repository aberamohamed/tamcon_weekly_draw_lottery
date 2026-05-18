'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { authApi } from '@/services/api/auth.api';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Trophy, ShieldCheck, ArrowRight, Loader2, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn, ScaleIn } from '@/components/shared/LotterySkeletons';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export default function LoginPage() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const { login } = useAuth();

  const emailForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '' },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  async function onEmailSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      await authApi.requestOtp(values.email);
      setEmail(values.email);
      setStep('otp');
      toast.success('OTP sent to your email');
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function onOtpSubmit(values: z.infer<typeof otpSchema>) {
    setLoading(true);
    try {
      await login(email, values.otp);
      toast.success('Login successful!');
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <FadeIn>
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <div className="rounded-2xl bg-[#2D338B] p-4 text-white">
              <Trophy className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tighter">
                <span className="text-[#2D338B]">TAM</span>
                <span className="text-[#F7941E]">CON.</span>
              </h1>
              <p className="text-muted-foreground font-medium text-sm">Ethiopia's Premier Digital Lottery</p>
            </div>
          </div>
        </FadeIn>

        <ScaleIn delay={0.2}>
          <Card className="border border-zinc-200 shadow-none rounded-xl overflow-hidden bg-white">
            <CardHeader className="space-y-1 pb-6 text-center">
              <CardTitle className="text-2xl font-bold text-[#2D338B]">
                {step === 'email' ? 'Welcome Back' : 'Verify Identity'}
              </CardTitle>
              <CardDescription className="text-sm font-medium">
                {step === 'email' 
                  ? 'Enter your email to continue' 
                  : `Enter the 6-digit code sent to ${email}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <AnimatePresence mode="wait">
                {step === 'email' ? (
                  <motion.div
                    key="email-step"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Form {...emailForm}>
                      <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-5">
                        <FormField
                          control={emailForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-zinc-700">Email Address</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                  <Input placeholder="abebe@gmail.com" {...field} className="h-11 rounded-lg border-zinc-200 focus:ring-1 focus:ring-[#2D338B] pl-10 text-sm transition-all" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full h-11 rounded-lg bg-[#2D338B] hover:bg-[#2D338B]/90 font-bold text-sm" disabled={loading}>
                          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Get OTP'}
                          {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="otp-step"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Form {...otpForm}>
                      <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-5">
                        <FormField
                          control={otpForm.control}
                          name="otp"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-zinc-700">Verification Code</FormLabel>
                              <FormControl>
                                <Input placeholder="123456" {...field} className="h-12 text-center text-2xl tracking-[0.4em] font-bold rounded-lg border-zinc-200 bg-zinc-50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full h-11 rounded-lg bg-[#F7941E] hover:bg-[#F7941E]/90 font-bold text-sm text-white" disabled={loading}>
                          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Verify & Login'}
                        </Button>
                        <Button variant="ghost" className="w-full text-xs font-bold text-zinc-400 hover:text-[#2D338B] h-10" onClick={() => setStep('email')} disabled={loading}>
                          Change Email Address
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <p className="mt-6 text-center text-xs font-medium text-zinc-500">
                Don't have an account?{' '}
                <Link href="/register" className="text-[#2D338B] hover:underline font-bold">Create Account</Link>
              </p>
            </CardContent>
          </Card>
        </ScaleIn>

        <FadeIn delay={0.4}>
          <div className="mt-6 flex flex-col items-center justify-center gap-2 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3" />
              Secure Data Encryption
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
