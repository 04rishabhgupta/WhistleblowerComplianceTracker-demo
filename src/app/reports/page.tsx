'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ReportsPage() {
  const { cases, activeUser } = useAppStore();

  if (activeUser?.role !== 'Compliance Admin') {
    return (
      <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
        You do not have permission to view reports.
      </div>
    );
  }

  // Calculate mock data for charts based on current cases
  const categoryCounts = cases.reduce((acc, c) => {
    const cat = c.category || 'Unassigned';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value }));

  const severityCounts = cases.reduce((acc, c) => {
    const sev = c.severity || 'Unrated';
    acc[sev] = (acc[sev] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const severityData = [
    { name: 'Critical', value: severityCounts['Critical'] || 0, color: '#ef4444' },
    { name: 'High', value: severityCounts['High'] || 0, color: '#f97316' },
    { name: 'Medium', value: severityCounts['Medium'] || 0, color: '#f59e0b' },
    { name: 'Low', value: severityCounts['Low'] || 0, color: '#64748b' },
    { name: 'Unrated', value: severityCounts['Unrated'] || 0, color: '#cbd5e1' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Compliance Reports</h1>
        <p className="text-muted-foreground">High-level insights and case analytics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cases by Category</CardTitle>
            <CardDescription>Distribution of case topics across all reports.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="value" fill="#0f766e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cases by Severity</CardTitle>
            <CardDescription>Breakdown of assigned case severities.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
