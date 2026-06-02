import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import MainLayout from './layouts/MainLayout'
import useStore from './store'

// Pages
import Dashboard from './pages/Dashboard'
import IdeaGenerator from './pages/IdeaGenerator'
import ScriptGenerator from './pages/ScriptGenerator'
import HookGenerator from './pages/HookGenerator'
import { CTAGenerator, TitleGenerator, HashtagGenerator, ThumbnailTextGenerator, BioGenerator } from './pages/ContentTools'
import { ScriptRewriter, LongToShorts, ViralAnalyzer, PerformancePredictor } from './pages/AdvancedTools'
import { TrendingDiscovery, ViralKeywords } from './pages/TrendsKeywords'
import AIAssistant from './pages/AIAssistant'
import { ContentRepurposer, MultiPlatformGenerator } from './pages/PlatformTools'
import { ContentCalendar, SeriesPlanner, CollabIdeas } from './pages/StrategyTools'
import { SavedLibrary, History, ExportCenter, SettingsPage } from './pages/LibraryTools'

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/ideas': 'Idea Generator',
  '/script': 'Script Generator',
  '/hooks': 'Hook Generator',
  '/cta': 'CTA Generator',
  '/titles': 'Title Generator',
  '/hashtags': 'Hashtag Generator',
  '/thumbnail': 'Thumbnail Text',
  '/bio': 'Bio Generator',
  '/rewriter': 'Script Rewriter',
  '/converter': 'Long → Shorts',
  '/repurpose': 'Content Repurposer',
  '/analyzer': 'Viral Analyzer',
  '/predictor': 'Performance Predictor',
  '/trends': 'Trending Discovery',
  '/keywords': 'Viral Keywords',
  '/assistant': 'AI Assistant',
  '/multi-platform': 'Multi-Platform',
  '/calendar': 'Content Calendar',
  '/series': 'Series Planner',
  '/collabs': 'Collab Ideas',
  '/saved': 'Saved Library',
  '/history': 'History',
  '/export': 'Export Center',
  '/settings': 'Settings',
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const { theme } = useStore()
  const location = useLocation()
  const title = PAGE_TITLES[location.pathname] || 'Shorts Machine AI'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'Satoshi, sans-serif',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <MainLayout title={title}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
            <Route path="/ideas" element={<PageWrapper><IdeaGenerator /></PageWrapper>} />
            <Route path="/script" element={<PageWrapper><ScriptGenerator /></PageWrapper>} />
            <Route path="/hooks" element={<PageWrapper><HookGenerator /></PageWrapper>} />
            <Route path="/cta" element={<PageWrapper><CTAGenerator /></PageWrapper>} />
            <Route path="/titles" element={<PageWrapper><TitleGenerator /></PageWrapper>} />
            <Route path="/hashtags" element={<PageWrapper><HashtagGenerator /></PageWrapper>} />
            <Route path="/thumbnail" element={<PageWrapper><ThumbnailTextGenerator /></PageWrapper>} />
            <Route path="/bio" element={<PageWrapper><BioGenerator /></PageWrapper>} />
            <Route path="/rewriter" element={<PageWrapper><ScriptRewriter /></PageWrapper>} />
            <Route path="/converter" element={<PageWrapper><LongToShorts /></PageWrapper>} />
            <Route path="/repurpose" element={<PageWrapper><ContentRepurposer /></PageWrapper>} />
            <Route path="/analyzer" element={<PageWrapper><ViralAnalyzer /></PageWrapper>} />
            <Route path="/predictor" element={<PageWrapper><PerformancePredictor /></PageWrapper>} />
            <Route path="/trends" element={<PageWrapper><TrendingDiscovery /></PageWrapper>} />
            <Route path="/keywords" element={<PageWrapper><ViralKeywords /></PageWrapper>} />
            <Route path="/assistant" element={<PageWrapper><AIAssistant /></PageWrapper>} />
            <Route path="/multi-platform" element={<PageWrapper><MultiPlatformGenerator /></PageWrapper>} />
            <Route path="/calendar" element={<PageWrapper><ContentCalendar /></PageWrapper>} />
            <Route path="/series" element={<PageWrapper><SeriesPlanner /></PageWrapper>} />
            <Route path="/collabs" element={<PageWrapper><CollabIdeas /></PageWrapper>} />
            <Route path="/saved" element={<PageWrapper><SavedLibrary /></PageWrapper>} />
            <Route path="/history" element={<PageWrapper><History /></PageWrapper>} />
            <Route path="/export" element={<PageWrapper><ExportCenter /></PageWrapper>} />
            <Route path="/settings" element={<PageWrapper><SettingsPage /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </MainLayout>
    </>
  )
}
