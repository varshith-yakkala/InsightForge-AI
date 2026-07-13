import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { LuFiles, LuLayers, LuZap, LuMessageCircle, LuTimer, LuGauge } from 'react-icons/lu'
import { Navbar } from '@/components/layout/Navbar'
import { Card } from '@/components/ui/Card'
import { mockDashboardStats } from '@/data/mockData'
import { formatNumber, formatMs } from '@/utils/format'
import { fileTypeConfig } from '@/components/common/FileTypeIcon'

const stats = mockDashboardStats

const pieColors = ['#ef4444', '#4f46e5', '#06b6d4']

export function DashboardPage() {
  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      <Navbar title="Dashboard" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <h1 className="text-lg font-semibold text-text">Overview</h1>
            <p className="mt-0.5 text-xs text-text-muted">System-wide indexing and query performance</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard icon={<LuFiles className="h-4 w-4 text-secondary" />} label="Documents Indexed" value={formatNumber(stats.documentsIndexed)} />
            <StatCard icon={<LuLayers className="h-4 w-4 text-primary" />} label="Chunks" value={formatNumber(stats.totalChunks)} />
            <StatCard icon={<LuZap className="h-4 w-4 text-warning" />} label="Embeddings" value={formatNumber(stats.totalEmbeddings)} />
            <StatCard icon={<LuMessageCircle className="h-4 w-4 text-success" />} label="Queries" value={formatNumber(stats.totalQueries)} />
            <StatCard icon={<LuTimer className="h-4 w-4 text-secondary" />} label="Avg Retrieval" value={formatMs(stats.avgRetrievalMs)} />
            <StatCard icon={<LuGauge className="h-4 w-4 text-primary" />} label="Avg LLM Response" value={formatMs(stats.avgLlmResponseMs)} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="p-4 lg:col-span-2">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">Upload Trend (7 days)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={stats.uploadTrend}>
                  <defs>
                    <linearGradient id="uploadGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} width={28} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2} fill="url(#uploadGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">Document Types</h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={stats.documentTypeBreakdown}
                    dataKey="count"
                    nameKey="type"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                  >
                    {stats.documentTypeBreakdown.map((entry, i) => (
                      <Cell key={entry.type} fill={pieColors[i % pieColors.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 flex justify-center gap-3">
                {stats.documentTypeBreakdown.map((d) => (
                  <div key={d.type} className="flex items-center gap-1.5 text-[11px] text-text-muted">
                    <span className={`h-2 w-2 rounded-full ${fileTypeConfig(d.type).bg.replace('/10', '')}`} />
                    {d.type.toUpperCase()} ({d.count})
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4 lg:col-span-3">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">Queries Over Time</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.queriesTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} width={32} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                  <Bar dataKey="count" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

const tooltipStyle = {
  background: '#111827',
  border: '1px solid #1f2937',
  borderRadius: 8,
  fontSize: 12,
  color: '#f9fafb',
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="rounded-xl border border-border bg-card p-3.5">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">{icon}</div>
      <p className="text-lg font-semibold text-text">{value}</p>
      <p className="mt-0.5 text-[10.5px] text-text-muted">{label}</p>
    </motion.div>
  )
}
