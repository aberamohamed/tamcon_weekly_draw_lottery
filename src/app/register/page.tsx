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
import { useRouter } from 'next/navigation';
import { Trophy, ShieldCheck, ArrowRight, Loader2, User, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { FadeIn, ScaleIn } from '@/components/shared/LotterySkeletons';
import Link from 'next/link';

const registerSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
});

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '' },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setLoading(true);
    try {
      await authApi.register(values);
      toast.success('Account created! Please login with your email OTP.');
      router.push('/login');
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
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
              <CardTitle className="text-2xl font-bold text-[#2D338B]">Create Account</CardTitle>
              <CardDescription className="text-sm font-medium">
                Join thousands of players and try your luck every week
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-zinc-700">Full Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input
                              placeholder="Abebe Bikila"
                              {...field}
                              className="h-11 rounded-lg border-zinc-200 focus:ring-1 focus:ring-[#2D338B] pl-10 text-sm transition-all"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-zinc-700">Email Address</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input
                              placeholder="abebe@gmail.com"
                              type="email"
                              {...field}
                              className="h-11 rounded-lg border-zinc-200 focus:ring-1 focus:ring-[#2D338B] pl-10 text-sm transition-all"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <motion.div whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full h-11 rounded-lg bg-[#2D338B] hover:bg-[#2D338B]/90 font-bold text-sm"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          Create Account <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </motion.div>

                  <p className="text-center text-xs font-medium text-zinc-500">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[#2D338B] hover:underline font-bold">
                      Sign In
                    </Link>
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </ScaleIn>

        <FadeIn delay={0.4}>
          <div className="mt-6 flex flex-col items-center justify-center gap-2 text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3 w-3" />
              Secure & Private
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
