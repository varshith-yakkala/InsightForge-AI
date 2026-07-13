import { LuSparkles, LuGithub, LuBookOpen } from 'react-icons/lu'
import { Navbar } from '@/components/layout/Navbar'
import { Card, CardBody } from '@/components/ui/Card'

export function AboutPage() {
  return (
    <div className="flex h-full min-w-0 flex-1 flex-col">
      <Navbar title="About" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-xl">
          <div className="mb-6 flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-xl shadow-primary/30">
              <LuSparkles className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-text">
              InsightForge <span className="gradient-text">AI</span>
            </h1>
            <p className="mt-1 text-xs text-text-muted">Version 2.4.1 · Retrieval-Augmented Generation Platform</p>
          </div>

          <Card>
            <CardBody className="space-y-3 text-sm text-text-light">
              <p>
                InsightForge AI turns your documents into a searchable, conversational knowledge base. Every answer is
                grounded in retrieved passages from your own files, with transparent citations and similarity scores
                so you can verify what the model is drawing from.
              </p>
              <p>Built for teams who need fast, trustworthy answers over internal PDFs, notes, and transcripts.</p>
            </CardBody>
          </Card>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <a
              href="#"
              className="focus-ring flex items-center gap-2 rounded-xl border border-border bg-card p-3.5 text-xs text-text-light transition-colors hover:border-border-light hover:text-text"
            >
              <LuBookOpen className="h-4 w-4 text-secondary" />
              Documentation
            </a>
            <a
              href="#"
              className="focus-ring flex items-center gap-2 rounded-xl border border-border bg-card p-3.5 text-xs text-text-light transition-colors hover:border-border-light hover:text-text"
            >
              <LuGithub className="h-4 w-4 text-secondary" />
              View source
            </a>
          </div>

          <p className="mt-6 text-center text-[11px] text-text-muted">
            © {new Date().getFullYear()} InsightForge AI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
