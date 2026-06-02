import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useStore = create(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark'
        set({ theme: newTheme })
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
        document.documentElement.classList.toggle('light', newTheme === 'light')
      },

      // Sidebar
      sidebarOpen: true,
      toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),

      // User preferences
      preferences: {
        defaultNiche: '',
        defaultTone: 'engaging',
        defaultDuration: '60',
        defaultPlatform: 'youtube',
      },
      setPreference: (key, value) =>
        set(s => ({ preferences: { ...s.preferences, [key]: value } })),

      // Saved library
      savedItems: [],
      saveItem: (item) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
        set(s => ({ savedItems: [{ ...item, id, savedAt: new Date().toISOString() }, ...s.savedItems] }))
      },
      removeItem: (id) =>
        set(s => ({ savedItems: s.savedItems.filter(i => i.id !== id) })),
      clearSaved: () => set({ savedItems: [] }),

      // History
      history: [],
      addToHistory: (entry) => {
        set(s => ({
          history: [
            { ...entry, id: `${Date.now()}`, timestamp: new Date().toISOString() },
            ...s.history.slice(0, 199)
          ]
        }))
      },
      clearHistory: () => set({ history: [] }),

      // Stats
      stats: {
        totalGenerations: 0,
        ideasGenerated: 0,
        scriptsGenerated: 0,
        hooksGenerated: 0,
      },
      incrementStat: (key, amount = 1) =>
        set(s => ({ stats: { ...s.stats, [key]: (s.stats[key] || 0) + amount, totalGenerations: s.stats.totalGenerations + amount } })),

      // Content Calendar
      calendarItems: [],
      addCalendarItem: (item) =>
        set(s => ({ calendarItems: [...s.calendarItems, { ...item, id: `${Date.now()}` }] })),
      removeCalendarItem: (id) =>
        set(s => ({ calendarItems: s.calendarItems.filter(i => i.id !== id) })),

      // Series
      series: [],
      addSeries: (s_) =>
        set(s => ({ series: [...s.series, { ...s_, id: `${Date.now()}` }] })),
      removeSeries: (id) =>
        set(s => ({ series: s.series.filter(i => i.id !== id) })),

      // Chat messages
      chatMessages: [],
      addChatMessage: (msg) =>
        set(s => ({ chatMessages: [...s.chatMessages, { ...msg, id: `${Date.now()}` }] })),
      clearChat: () => set({ chatMessages: [] }),
    }),
    {
      name: 'yt-shorts-machine',
      partialize: (state) => ({
        theme: state.theme,
        preferences: state.preferences,
        savedItems: state.savedItems,
        history: state.history,
        stats: state.stats,
        calendarItems: state.calendarItems,
        series: state.series,
        chatMessages: state.chatMessages,
      }),
    }
  )
)

export default useStore
