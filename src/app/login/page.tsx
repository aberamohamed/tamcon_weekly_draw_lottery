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
import { Trophy, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn, ScaleIn } from '@/components/shared/LotterySkeletons';

const loginSchema = z.object({
  phoneNumber: z.string().min(10, 'Invalid phone number'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export default function LoginPage() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const { login } = useAuth();

  const phoneForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phoneNumber: '' },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  async function onPhoneSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    try {
      await authApi.requestOtp(values.phoneNumber);
      setPhone(values.phoneNumber);
      setStep('otp');
      toast.success('OTP sent to your phone');
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function onOtpSubmit(values: z.infer<typeof otpSchema>) {
    setLoading(true);
    try {
      const response = await authApi.verifyOtp(phone, values.otp);
      login(response.user, response.token);
      toast.success('Login successful!');
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#2D338B]/5 rounded-full blur-[80px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#F7941E]/5 rounded-full blur-[80px]" 
        />
      </div>

      <div className="w-full max-w-md">
        <FadeIn>
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="rounded-3xl bg-[#2D338B] p-4 shadow-xl shadow-[#2D338B]/20 cursor-pointer"
            >
              <Trophy className="h-8 w-8 text-white" />
            </motion.div>
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tighter">
                <span className="text-[#2D338B]">TAM</span>
                <span className="text-[#F7941E]">CON.</span>
              </h1>
              <p className="text-muted-foreground font-semibold">Ethiopia's Premier Digital Lottery</p>
            </div>
          </div>
        </FadeIn>

        <ScaleIn delay={0.2}>
          <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-sm border border-white/20">
            <CardHeader className="space-y-1 pb-6 text-center">
              <CardTitle className="text-3xl font-black text-[#2D338B]">
                {step === 'phone' ? 'Welcome Back' : 'Verify Identity'}
              </CardTitle>
              <CardDescription className="font-medium text-lg">
                {step === 'phone' 
                  ? 'Enter your phone number to continue' 
                  : `Enter the 6-digit code sent to ${phone}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {step === 'phone' ? (
                  <motion.div
                    key="phone-step"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Form {...phoneForm}>
                      <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-6">
                        <FormField
                          control={phoneForm.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-bold text-[#2D338B] ml-1">Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="0911223344" {...field} className="h-14 rounded-2xl border-zinc-200 focus:ring-2 focus:ring-[#2D338B]/20 focus:border-[#2D338B] text-lg font-semibold px-6 transition-all" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full h-14 rounded-2xl bg-[#2D338B] hover:bg-[#2D338B]/90 font-black text-xl shadow-xl shadow-[#2D338B]/20 transition-all hover:-translate-y-1" disabled={loading}>
                          {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : 'Get OTP'}
                          {!loading && <ArrowRight className="ml-2 h-6 w-6" />}
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="otp-step"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Form {...otpForm}>
                      <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6">
                        <FormField
                          control={otpForm.control}
                          name="otp"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-bold text-[#F7941E] ml-1">Verification Code</FormLabel>
                              <FormControl>
                                <Input placeholder="123456" {...field} className="h-16 text-center text-3xl tracking-[0.6em] font-black rounded-2xl border-zinc-200 bg-zinc-50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full h-14 rounded-2xl bg-[#F7941E] hover:bg-[#F7941E]/90 font-black text-xl text-white shadow-xl shadow-[#F7941E]/20 transition-all hover:-translate-y-1" disabled={loading}>
                          {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : 'Verify & Login'}
                        </Button>
                        <Button variant="ghost" className="w-full font-bold text-zinc-500 hover:text-[#2D338B] hover:bg-[#2D338B]/5 rounded-xl h-12" onClick={() => setStep('phone')} disabled={loading}>
                          Change Phone Number
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </ScaleIn>

        <FadeIn delay={0.4}>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 text-sm text-muted-foreground font-semibold">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#2D338B]" />
              Secure Bank-Grade Encryption
            </div>
            <p className="text-center px-12 opacity-60">
              By continuing, you agree to Tamcon's <br />
              <span className="text-[#2D338B] cursor-pointer hover:underline">Terms</span> and <span className="text-[#2D338B] cursor-pointer hover:underline">Privacy Policy</span>
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
