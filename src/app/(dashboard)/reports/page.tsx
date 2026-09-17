'use client';

import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, FolderKanbanIcon, AlertCircle, Clock, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { format, parseISO } from 'date-fns';

export default function ReportsPage() {
  const { cases, activeUser, organizations } = useAppStore();
  const [selectedOrg, setSelectedOrg] = useState<string>('all');

  if (!activeUser || activeUser.role !== 'Investigator') {
    return (
      <div className="flex h-[50vh] items-center justify-center text-muted-foreground">
        You do not have permission to view reports.
      </div>
    );
  }

  const filteredCases = selectedOrg === 'all' 
    ? cases 
    : cases.filter(c => c.organizationId === selectedOrg);

  // --- KPIs ---
  const totalCases = filteredCases.length;
  const openCases = filteredCases.filter(c => ['New — Needs Triage', 'In Progress', 'Under Investigation'].includes(c.status)).length;
  const criticalCases = filteredCases.filter(c => c.severity === 'Critical').length;
  
  // --- Data Aggregation ---
  const sortedCasesAsc = [...filteredCases].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  
  const dateCounts = sortedCasesAsc.reduce((acc, c) => {
    try {
      const date = format(parseISO(c.createdAt), 'MMM dd');
      acc[date] = (acc[date] || 0) + 1;
    } catch {
      // skip
    }
    return acc;
  }, {} as Record<string, number>);
  const volumeData = Object.entries(dateCounts).map(([date, cases]) => ({ date, cases }));

  const categoryCounts = filteredCases.reduce((acc, c) => {
    const cat = c.category || 'Unassigned';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);

  const severityCounts = filteredCases.reduce((acc, c) => {
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

  const statusCounts = filteredCases.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const statusColors: Record<string, string> = {
    'New — Needs Triage': '#3b82f6',
    'In Progress': '#f59e0b',
    'Under Investigation': '#8b5cf6',
    'Resolved': '#10b981',
    'Closed': '#64748b'
  };
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({
    name, value, color: statusColors[name] || '#94a3b8'
  }));

  const sourceCounts = filteredCases.reduce((acc, c) => {
    acc[c.source] = (acc[c.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const sourceColors: Record<string, string> = {
    'Email': '#0ea5e9',
    'Hotline': '#d946ef'
  };
  const sourceData = Object.entries(sourceCounts).map(([name, value]) => ({
    name, value, color: sourceColors[name] || '#94a3b8'
  }));

  const orgCounts = filteredCases.reduce((acc, c) => {
    const org = organizations.find(o => o.id === c.organizationId)?.name || 'Unknown';
    acc[org] = (acc[org] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const orgData = Object.entries(orgCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

  // --- Export Function ---
  const handleExport = () => {
    const headers = ['Case Number', 'Organization', 'Status', 'Severity', 'Category', 'Source', 'Created At', 'Reporter'];
    const csvData = filteredCases.map(c => {
      const orgName = organizations.find(o => o.id === c.organizationId)?.name || 'Unknown';
      return [
        c.caseNumber,
        `"${orgName}"`,
        c.status,
        c.severity || 'Unrated',
        `"${c.category || ''}"`,
        c.source,
        c.createdAt,
        c.reporterEmail || c.reporterPhone || 'Anonymous'
      ].join(',');
    });
    
    const csvContent = [headers.join(','), ...csvData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `tari_cases_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Advanced Analytics</h1>
          <p className="text-muted-foreground">In-depth reporting and platform insights.</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedOrg} onValueChange={(val) => setSelectedOrg(val || 'all')}>
            <SelectTrigger className="w-[250px] bg-white">
              <SelectValue placeholder="Filter by Organization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Global View (All Organizations)</SelectItem>
              {organizations.map(org => (
                <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleExport} className="bg-primary text-primary-foreground flex items-center gap-2">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
            <FolderKanbanIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCases}</div>
            <p className="text-xs text-muted-foreground mt-1">Based on current filter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Investigations</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openCases}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires active work</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Critical Priority</CardTitle>
            <ShieldAlert className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalCases}</div>
            <p className="text-xs text-muted-foreground mt-1">SLA breach risk</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14.2 days</div>
            <p className="text-xs text-muted-foreground mt-1">Trailing 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Case Volume Over Time</CardTitle>
          <CardDescription>Number of reports submitted chronologically.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={volumeData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f766e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area type="monotone" dataKey="cases" stroke="#0f766e" strokeWidth={3} fillOpacity={1} fill="url(#colorCases)" activeDot={{ r: 6, fill: '#0f766e', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {selectedOrg === 'all' && (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Cases by Client Organization</CardTitle>
              <CardDescription>Distribution of volume across managed tenants.</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orgData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#475569', fontWeight: 500 }} axisLine={false} tickLine={false} width={130} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={severityData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                  {severityData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Case Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                  {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Intake Source</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                  {sourceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="value" fill="#0f766e" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
