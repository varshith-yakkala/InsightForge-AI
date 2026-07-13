import { useState } from 'react'
import toast from 'react-hot-toast'
import { LuSave, LuRotateCcw, LuMoon, LuSun } from 'react-icons/lu'
import { Navbar } from '@/components/layout/Navbar'
import { Card, CardHeader, CardBody } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useSettingsStore } from '@/store/settingsStore'
import { cn } from '@/utils/cn'

const llmOptions = ['gpt-4-turbo', 'gpt-4o', 'claude-sonnet-4-6', 'claude-haiku-4-5', 'llama-3.1-70b']
const embeddingOptions = ['text-embedding-3-large', 'text-embedding-3-small', 'bge-large-en-v1.5', 'e5-mistral-7b']
const accentSwatches = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899']

export function SettingsPage() {
  const settings = useSettingsStore()
  const [local, setLocal] = useState(settings)

  function save() {
    settings.update(local)
    toast.success('Settings saved')
  }

  function reset() {
    settings.reset()
    setLocal(useSettingsStore.getState())
    toast('Restored defaults', { icon: '↺' })
  }

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      <Navbar title="Settings" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-text">Settings</h1>
              <p className="mt-0.5 text-xs text-text-muted">Configure models, retrieval behavior, and appearance</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" icon={<LuRotateCcw className="h-3.5 w-3.5" />} onClick={reset}>
                Reset
              </Button>
              <Button size="sm" icon={<LuSave className="h-3.5 w-3.5" />} onClick={save}>
                Save changes
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-medium text-text">Models</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <Select label="LLM model" value={local.llmModel} options={llmOptions} onChange={(v) => setLocal((s) => ({ ...s, llmModel: v }))} />
              <Select
                label="Embedding model"
                value={local.embeddingModel}
                options={embeddingOptions}
                onChange={(v) => setLocal((s) => ({ ...s, embeddingModel: v }))}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-medium text-text">Chunking & Retrieval</h2>
            </CardHeader>
            <CardBody className="space-y-5">
              <SliderField label="Chunk size" value={local.chunkSize} min={128} max={2048} step={64} suffix=" tokens" onChange={(v) => setLocal((s) => ({ ...s, chunkSize: v }))} />
              <SliderField label="Chunk overlap" value={local.chunkOverlap} min={0} max={256} step={8} suffix=" tokens" onChange={(v) => setLocal((s) => ({ ...s, chunkOverlap: v }))} />
              <SliderField label="Top-K retrieval" value={local.topK} min={1} max={20} step={1} onChange={(v) => setLocal((s) => ({ ...s, topK: v }))} />
              <SliderField label="Temperature" value={local.temperature} min={0} max={1} step={0.05} decimals={2} onChange={(v) => setLocal((s) => ({ ...s, temperature: v }))} />
              <SliderField label="Max tokens" value={local.maxTokens} min={256} max={4096} step={128} onChange={(v) => setLocal((s) => ({ ...s, maxTokens: v }))} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-medium text-text">Appearance</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <label className="mb-2 block text-xs font-medium text-text-light">Theme</label>
                <div className="flex gap-2">
                  <ThemeOption
                    icon={<LuMoon className="h-4 w-4" />}
                    label="Dark"
                    active={local.theme === 'dark'}
                    onClick={() => setLocal((s) => ({ ...s, theme: 'dark' }))}
                  />
                  <ThemeOption
                    icon={<LuSun className="h-4 w-4" />}
                    label="Light"
                    active={local.theme === 'light'}
                    onClick={() => setLocal((s) => ({ ...s, theme: 'light' }))}
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-text-light">Accent color</label>
                <div className="flex gap-2">
                  {accentSwatches.map((c) => (
                    <button
                      key={c}
                      onClick={() => setLocal((s) => ({ ...s, accentColor: c }))}
                      className={cn(
                        'focus-ring h-7 w-7 rounded-full ring-2 ring-offset-2 ring-offset-card transition-transform hover:scale-110',
                        local.accentColor === c ? 'ring-white/60' : 'ring-transparent',
                      )}
                      style={{ backgroundColor: c }}
                      aria-label={c}
                    />
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-medium text-text">Backend</h2>
            </CardHeader>
            <CardBody>
              <label className="mb-1.5 block text-xs font-medium text-text-light">Backend URL</label>
              <input
                value={local.backendUrl}
                onChange={(e) => setLocal((s) => ({ ...s, backendUrl: e.target.value }))}
                placeholder="http://localhost:8000"
                className="focus-ring w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-xs text-text placeholder:text-text-muted"
              />
              <p className="mt-1.5 text-[11px] text-text-muted">
                If unreachable, InsightForge AI automatically falls back to demo mode with simulated responses.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-text-light">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus-ring w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-xs text-text"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}

function SliderField({
  label,
  value,
  min,
  max,
  step,
  suffix = '',
  decimals = 0,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  suffix?: string
  decimals?: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-xs font-medium text-text-light">{label}</label>
        <span className="font-mono text-xs text-primary">
          {value.toFixed(decimals)}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="focus-ring h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/5 accent-[#4F46E5]"
      />
    </div>
  )
}

function ThemeOption({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'focus-ring flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-xs font-medium transition-colors',
        active ? 'border-primary/50 bg-primary/10 text-text' : 'border-border text-text-muted hover:text-text',
      )}
    >
      {icon}
      {label}
    </button>
  )
}
