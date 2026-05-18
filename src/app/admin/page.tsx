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
  Coins, 
  Ticket, 
  TrendingUp
} from 'lucide-react';
import { FadeIn, ScaleIn, StatsCardSkeleton } from '@/components/shared/LotterySkeletons';
import { Skeleton } from '@/components/ui/skeleton';

import { extractArray } from '@/lib/extractArray';

const BRAND_COLORS = ['#2D338B', '#F7941E', '#4F46E5', '#FB923C'];

function PageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[1, 2, 3, 4, 5, 6].map((i) => <StatsCardSkeleton key={i} />)}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 h-[450px]"><CardContent className="h-full bg-muted/20 animate-pulse" /></Card>
        <Card className="lg:col-span-3 h-[450px]"><CardContent className="h-full bg-muted/20 animate-pulse" /></Card>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminApi.getStats(),
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['admin-revenue-weeks'],
    queryFn: () => adminApi.getRevenueWeeks(),
  });

  const isLoading = statsLoading || revenueLoading;

  if (isLoading) return <PageSkeleton />;

  const revenueChartData = extractArray(revenueData);

  return (
    <div className="space-y-8">
      <FadeIn>
        <div>
          <h1 className="text-4xl font-black tracking-tight text-[#2D338B]">KPI Dashboard</h1>
          <p className="text-muted-foreground font-medium">Real-time overview of the lottery platform performance.</p>
        </div>
      </FadeIn>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          { title: 'Total Users', value: stats?.totalUsers?.toLocaleString() ?? '—', icon: Users, color: '#4F46E5' },
          { title: 'Tickets (This Week)', value: stats?.currentWeekTicketsSold?.toLocaleString() ?? '—', icon: Ticket, color: '#F7941E' },
          { title: 'Revenue (This Week)', value: stats?.currentWeekRevenue != null ? `${stats?.currentWeekRevenue.toLocaleString()} ETB` : '—', icon: 'ETB', color: '#2D338B' },
          { title: 'Current Prize Pool', value: stats?.currentPrizePool != null ? `${stats?.currentPrizePool.toLocaleString()} ETB` : '—', icon: TrendingUp, color: '#10B981' },
          { title: 'Last Draw Winners', value: stats?.lastDrawWinners?.toLocaleString() ?? '—', icon: Users, color: '#FB923C' },
          { title: 'Last Draw Payout', value: stats?.lastDrawPayout != null ? `${stats?.lastDrawPayout.toLocaleString()} ETB` : '—', icon: 'ETB', color: '#8B5CF6' },
        ].map((kpi, i) => (
          <ScaleIn key={kpi.title} delay={i * 0.1}>
            <Card className="border border-zinc-200 bg-white transition-all rounded-2xl overflow-hidden group pt-0">
              <div className="flex flex-row items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/30">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.1em]">{kpi.title}</p>
                <div className="p-2 rounded-lg bg-white border border-zinc-100 group-hover:bg-[#2D338B]/5 transition-colors flex items-center justify-center min-w-8 h-8">
                  {typeof kpi.icon === 'string' ? (
                    <span className="text-[10px] font-black tracking-wider leading-none" style={{ color: kpi.color }}>
                      {kpi.icon}
                    </span>
                  ) : (
                    (() => {
                      const IconComponent = kpi.icon;
                      return <IconComponent className="h-4 w-4" style={{ color: kpi.color }} />;
                    })()
                  )}
                </div>
              </div>
              <CardContent>
                <div className="text-3xl font-black">{kpi.value}</div>
              </CardContent>
            </Card>
          </ScaleIn>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <FadeIn delay={0.4}>
          <Card className="border border-zinc-200 bg-white rounded-2xl overflow-hidden pt-0 shadow-none h-full">
            <div className="bg-[#2D338B]/5 px-4 py-3 border-b border-[#2D338B]/10">
              <h3 className="text-[11px] font-black text-[#2D338B] flex items-center gap-2 uppercase tracking-wider">
                <div className="w-1 h-3.5 bg-[#2D338B] rounded-full" />
                Revenue Growth (6 Weeks)
              </h3>
            </div>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={revenueChartData}>
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

        <FadeIn delay={0.5}>
          <Card className="border border-zinc-200 bg-white rounded-2xl overflow-hidden h-full pt-0 shadow-none">
            <div className="bg-[#F7941E]/5 px-4 py-3 border-b border-[#F7941E]/10">
              <h3 className="text-[11px] font-black text-[#F7941E] flex items-center gap-2 uppercase tracking-wider">
                <div className="w-1 h-3.5 bg-[#F7941E] rounded-full" />
                Ticket Distribution
              </h3>
            </div>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={(stats?.packageDistribution ?? []).map((d: any) => ({ name: `${d.package} Ticket(s)`, value: d.count }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                    animationBegin={500}
                    animationDuration={1500}
                  >
                    {(stats?.packageDistribution ?? []).map((entry: any, index: number) => (
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

        <FadeIn delay={0.6}>
          <Card className="border border-zinc-200 bg-white rounded-2xl overflow-hidden pt-0 shadow-none">
            <div className="bg-green-50 px-4 py-3 border-b border-green-100">
              <h3 className="text-[11px] font-black text-green-700 flex items-center gap-2 uppercase tracking-wider">
                <div className="w-1 h-3.5 bg-green-500 rounded-full" />
                Winner Statistics
              </h3>
            </div>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats?.winnerStats ?? []}>
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

