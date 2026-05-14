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
import { 
  Trophy, 
  ShieldCheck, 
  ArrowRight, 
  Loader2, 
  User, 
  Mail, 
  Phone, 
  Wallet,
  Camera,
  FileText,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Heart,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeIn, ScaleIn } from '@/components/shared/LotterySkeletons';
import Link from 'next/link';

const registerSchema = z.object({
  fullName: z.string().min(3, 'Full name is required'),
  motherName: z.string().min(3, "Mother's name is required"),
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Please select your gender' }),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(10, 'Invalid phone number'),
  idType: z.string().min(1, 'Please select ID type'),
  idNumber: z.string().min(5, 'Invalid ID number'),
});

type Step = 'personal' | 'contact' | 'verification';

export default function RegisterPage() {
  const [step, setStep] = useState<Step>('personal');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      motherName: '',
      gender: 'male',
      email: '',
      phoneNumber: '',
      idType: 'National ID',
      idNumber: '',
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setLoading(true);
    try {
      await authApi.register(values);
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const nextStep = () => {
    if (step === 'personal') setStep('contact');
    else if (step === 'contact') setStep('verification');
  };

  const prevStep = () => {
    if (step === 'verification') setStep('contact');
    else if (step === 'contact') setStep('personal');
  };

  const steps = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'verification', label: 'Verify', icon: ShieldCheck },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 relative overflow-hidden">
      <div className="w-full max-w-2xl my-8 relative z-10">
        <FadeIn>
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
            <div className="rounded-2xl bg-[#2D338B] p-4 text-white">
              <Trophy className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tighter">
                <span className="text-[#2D338B]">OPEN</span>
                <span className="text-[#F7941E]">ACCOUNT.</span>
              </h1>
              <p className="text-muted-foreground font-medium text-sm">Join Ethiopia's secure digital lottery network</p>
            </div>
          </div>
        </FadeIn>

        <ScaleIn delay={0.2}>
          <Card className="border border-zinc-200 shadow-none rounded-xl overflow-hidden bg-white">
            {/* Progress Bar */}
            <div className="flex border-b border-zinc-100">
              {steps.map((s, i) => {
                const isActive = step === s.id;
                const isPast = steps.findIndex(x => x.id === step) > i;
                return (
                  <div 
                    key={s.id}
                    className={`flex-1 py-3 flex items-center justify-center gap-2 border-b-2 transition-all ${
                      isActive ? 'border-[#2D338B] bg-[#2D338B]/5 text-[#2D338B]' : isPast ? 'border-green-500 text-green-600' : 'border-transparent text-muted-foreground'
                    }`}
                  >
                    <s.icon className="h-4 w-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:inline">{s.label}</span>
                  </div>
                );
              })}
            </div>

            <CardContent className="p-6 sm:p-10">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <AnimatePresence mode="wait">
                    {step === 'personal' && (
                      <motion.div
                        key="personal"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-5"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-zinc-700">Full Name</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    <Input placeholder="Abebe Bikila" {...field} className="h-11 rounded-lg border-zinc-200 focus:ring-1 focus:ring-[#2D338B] pl-10 text-sm" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="motherName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-zinc-700">Mother's Name</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Heart className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    <Input placeholder="Muluemebet Kassahun" {...field} className="h-11 rounded-lg border-zinc-200 focus:ring-1 focus:ring-[#2D338B] pl-10 text-sm" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm font-medium text-zinc-700">Gender</FormLabel>
                              <div className="flex gap-3">
                                {['male', 'female'].map((g) => (
                                  <button
                                    key={g}
                                    type="button"
                                    onClick={() => field.onChange(g)}
                                    className={`flex-1 h-11 rounded-lg border font-medium capitalize transition-all flex items-center justify-center gap-2 text-sm ${
                                      field.value === g 
                                        ? 'border-[#2D338B] bg-[#2D338B]/5 text-[#2D338B]' 
                                        : 'border-zinc-200 text-zinc-500 hover:bg-zinc-50'
                                    }`}
                                  >
                                    <Users className="h-4 w-4" />
                                    {g}
                                  </button>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                    )}

                    {step === 'contact' && (
                      <motion.div
                        key="contact"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-5"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-zinc-700">Email Address</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    <Input placeholder="abebe@gmail.com" {...field} className="h-11 rounded-lg border-zinc-200 focus:ring-1 focus:ring-[#2D338B] pl-10 text-sm" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-zinc-700">Phone Number</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    <Input placeholder="0911223344" {...field} className="h-11 rounded-lg border-zinc-200 focus:ring-1 focus:ring-[#2D338B] pl-10 text-sm" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </motion.div>
                    )}

                    {step === 'verification' && (
                      <motion.div
                        key="verification"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-5"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Profile Photo</label>
                            <div className="h-24 border border-dashed border-zinc-200 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-zinc-50 transition-colors cursor-pointer bg-white">
                              <Camera className="h-6 w-6 text-zinc-400" />
                              <span className="text-[10px] font-bold text-zinc-400 uppercase">Capture</span>
                            </div>
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="idNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-sm font-medium text-zinc-700">ID Number</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                                    <Input placeholder="ID123456789" {...field} className="h-11 rounded-lg border-zinc-200 focus:ring-1 focus:ring-[#2D338B] pl-10 text-sm" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">ID Document Upload</label>
                          <div className="h-24 border border-dashed border-zinc-200 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-zinc-50 transition-colors cursor-pointer bg-white">
                            <FileText className="h-6 w-6 text-zinc-400" />
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">Upload Front & Back</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-3 pt-2">
                    {step !== 'personal' && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={prevStep}
                        className="h-11 rounded-lg border-zinc-200 text-sm font-semibold px-5"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1.5" />
                        Back
                      </Button>
                    )}
                    
                    {step !== 'verification' ? (
                      <Button 
                        type="button" 
                        onClick={nextStep}
                        className="flex-1 h-11 rounded-lg bg-[#2D338B] hover:bg-[#2D338B]/90 font-bold text-sm"
                      >
                        Continue
                        <ChevronRight className="ml-1.5 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        className="flex-1 h-11 rounded-lg bg-[#F7941E] hover:bg-[#F7941E]/90 font-bold text-sm text-white" 
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : 'Register Account'}
                        {!loading && <UserCheck className="ml-1.5 h-4 w-4" />}
                      </Button>
                    )}
                  </div>

                  <p className="text-center text-xs font-medium text-zinc-500">
                    Already have an account?{' '}
                    <Link href="/login" className="text-[#2D338B] hover:underline font-bold">Sign In</Link>
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
              Secure Data Encryption
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
