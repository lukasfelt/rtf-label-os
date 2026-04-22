import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Campaign, Release } from '../types'
import { SEED_CAMPAIGNS, SEED_RELEASES } from '../lib/constants'

interface PipelineStore {
  campaigns: Campaign[]
  releases: Release[]
  addCampaign: (campaign: Omit<Campaign, 'id'>) => void
  updateCampaign: (id: string, updates: Partial<Campaign>) => void
  addRelease: (release: Omit<Release, 'id'>) => void
}

export const usePipelineStore = create<PipelineStore>()(
  persist(
    (set) => ({
      campaigns: SEED_CAMPAIGNS,
      releases: SEED_RELEASES,

      addCampaign: (campaign) =>
        set((state) => ({
          campaigns: [{ ...campaign, id: Date.now().toString() }, ...state.campaigns],
        })),

      updateCampaign: (id, updates) =>
        set((state) => ({
          campaigns: state.campaigns.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),

      addRelease: (release) =>
        set((state) => ({
          releases: [{ ...release, id: Date.now().toString() }, ...state.releases],
        })),
    }),
    { name: 'rtf_pipeline' }
  )
)
