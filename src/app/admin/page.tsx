'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/services/api/admin.api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { 
  Users, 
  DollarSign, 
  Ticket, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { FadeIn, ScaleIn, StatsCardSkeleton } from '@/components/shared/LotterySkeletons';

const BRAND_COLORS = ['#2D338B', '#F7941E', '#4F46E5', '#FB923C'];

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminApi.getStats,
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <StatsCardSkeleton key={i} />)}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4 h-[450px]"><CardContent className="h-full bg-muted/20 animate-pulse" /></Card>
          <Card className="lg:col-span-3 h-[450px]"><CardContent className="h-full bg-muted/20 animate-pulse" /></Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-[#2D338B]">KPI Dashboard</h1>
            <p className="text-muted-foreground font-medium">Real-time overview of the lottery platform performance.</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-[#2D338B] text-white rounded-xl font-bold shadow-lg shadow-[#2D338B]/20"
          >
            Export Report <ChevronRight className="h-4 w-4" />
          </motion.button>
        </div>
      </FadeIn>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: 'Total Revenue', value: `${stats?.kpis.totalRevenue.toLocaleString()} ETB`, icon: DollarSign, trend: '+12.5%', trendType: 'up', color: '#2D338B' },
          { title: 'Active Users', value: stats?.kpis.activeUsers.toLocaleString(), icon: Users, trend: '+4.2%', trendType: 'up', color: '#4F46E5' },
          { title: 'Tickets Sold', value: stats?.kpis.totalTicketsSold.toLocaleString(), icon: Ticket, trend: '-2.1%', trendType: 'down', color: '#F7941E' },
          { title: 'Conversion Rate', value: `${stats?.kpis.conversionRate}%`, icon: TrendingUp, trend: '+1.2%', trendType: 'up', color: '#10B981' },
        ].map((kpi, i) => (
          <ScaleIn key={kpi.title} delay={i * 0.1}>
            <Card className="border-none shadow-xl hover:shadow-2xl transition-all rounded-3xl overflow-hidden group">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{kpi.title}</CardTitle>
                <div className="p-2 rounded-xl bg-muted group-hover:bg-[#2D338B]/10 transition-colors">
                  <kpi.icon className={`h-4 w-4`} style={{ color: kpi.color }} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">{kpi.value}</div>
                <div className={`text-xs font-bold flex items-center mt-2 ${kpi.trendType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.trendType === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {kpi.trend} <span className="text-muted-foreground ml-1 font-medium">from last period</span>
                </div>
              </CardContent>
            </Card>
          </ScaleIn>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <FadeIn delay={0.4} className="lg:col-span-4">
          <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <div className="w-2 h-6 bg-[#2D338B] rounded-full" />
                Revenue Growth (6 Weeks)
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={stats?.revenue}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2D338B" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2D338B" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#2D338B" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.5} className="lg:col-span-3">
          <Card className="border-none shadow-xl rounded-3xl overflow-hidden h-full">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <div className="w-2 h-6 bg-[#F7941E] rounded-full" />
                Ticket Distribution
              </CardTitle>
              <CardDescription className="font-medium">By customer segments</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats?.ticketDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    animationBegin={500}
                    animationDuration={1500}
                  >
                    {stats?.ticketDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BRAND_COLORS[index % BRAND_COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '15px' }} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.6} className="lg:col-span-7">
          <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <div className="w-2 h-6 bg-green-500 rounded-full" />
                Winner Statistics
              </CardTitle>
              <CardDescription className="font-medium">Monthly winner distribution trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats?.winnerStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '15px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="winners" 
                    stroke="#10b981" 
                    strokeWidth={5} 
                    dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} 
                    activeDot={{ r: 10, strokeWidth: 0 }} 
                    animationDuration={2500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  );
}

