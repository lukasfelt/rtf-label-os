import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AIAnalysis } from '../types'

interface AnalyticsStore {
  currentDemoId: string | null
  currentAnalysis: AIAnalysis | null
  isAnalyzing: boolean
  analysisStep: number
  setCurrentDemo: (id: string | null) => void
  setAnalysis: (analysis: AIAnalysis | null) => void
  setAnalyzing: (v: boolean) => void
  setStep: (step: number) => void
}

export const useAnalyticsStore = create<AnalyticsStore>()(
  persist(
    (set) => ({
      currentDemoId: null,
      currentAnalysis: null,
      isAnalyzing: false,
      analysisStep: 0,

      setCurrentDemo: (id) => set({ currentDemoId: id, currentAnalysis: null }),
      setAnalysis: (analysis) => set({ currentAnalysis: analysis }),
      setAnalyzing: (v) => set({ isAnalyzing: v }),
      setStep: (step) => set({ analysisStep: step }),
    }),
    { name: 'rtf_analytics' }
  )
)
