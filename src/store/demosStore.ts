import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Demo, AIAnalysis } from '../types'
import { SEED_DEMOS } from '../lib/constants'

interface DemosStore {
  demos: Demo[]
  selectedDemoId: string | null
  addDemo: (demo: Omit<Demo, 'id'>) => void
  updateDemo: (id: string, updates: Partial<Demo>) => void
  setAnalysis: (id: string, analysis: AIAnalysis) => void
  selectDemo: (id: string | null) => void
  updateStatus: (id: string, status: Demo['status']) => void
}

export const useDemosStore = create<DemosStore>()(
  persist(
    (set) => ({
      demos: SEED_DEMOS,
      selectedDemoId: null,

      addDemo: (demo) =>
        set((state) => ({
          demos: [
            { ...demo, id: Date.now().toString() },
            ...state.demos,
          ],
        })),

      updateDemo: (id, updates) =>
        set((state) => ({
          demos: state.demos.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        })),

      setAnalysis: (id, analysis) =>
        set((state) => ({
          demos: state.demos.map((d) =>
            d.id === id ? { ...d, aiAnalysis: analysis } : d
          ),
        })),

      selectDemo: (id) => set({ selectedDemoId: id }),

      updateStatus: (id, status) =>
        set((state) => ({
          demos: state.demos.map((d) => (d.id === id ? { ...d, status } : d)),
        })),
    }),
    {
      name: 'rtf_demos',
    }
  )
)
