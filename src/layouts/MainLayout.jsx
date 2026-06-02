import { motion } from 'framer-motion'
import Sidebar from '../components/layout/Sidebar'
import Header from '../components/layout/Header'
import useStore from '../store'

export default function MainLayout({ children, title }) {
  const { sidebarOpen } = useStore()

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <motion.main
        animate={{ marginLeft: sidebarOpen ? 260 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="flex-1 flex flex-col min-h-screen overflow-hidden"
      >
        <Header title={title} />
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-5 py-6">
            {children}
          </div>
        </div>
      </motion.main>
    </div>
  )
}
