import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { DemoInbox } from './components/demos/DemoInbox'
import { PipelineBoard } from './components/pipeline/PipelineBoard'
import { ListeningAnalytics } from './components/analytics/ListeningAnalytics'
import { CampaignBoard } from './components/campaigns/CampaignBoard'
import { ReleaseCalendar } from './components/releases/ReleaseCalendar'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <div className="text-center">
        <div className="font-display text-4xl uppercase text-rtf-border mb-3">{title}</div>
        <div className="text-sm font-body text-rtf-gray">Coming soon</div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/demos" replace />} />
          <Route path="/demos" element={<DemoInbox />} />
          <Route path="/pipeline" element={<PipelineBoard />} />
          <Route path="/roster" element={<PlaceholderPage title="Roster" />} />
          <Route path="/campaigns" element={<CampaignBoard />} />
          <Route path="/releases" element={<ReleaseCalendar />} />
          <Route path="/briefs" element={<PlaceholderPage title="Briefs" />} />
          <Route path="/analytics" element={<ListeningAnalytics />} />
          <Route path="/trends" element={<PlaceholderPage title="Trend Radar" />} />
          <Route path="/comps" element={<PlaceholderPage title="Comp Tracks" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}
