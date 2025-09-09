import { motion, AnimatePresence } from 'framer-motion'
import { NavItem } from '../types'

interface MobileSidebarProps {
  activeNav: string
  setActiveNav: (id: string) => void
  mobileSidebarOpen: boolean
  setMobileSidebarOpen: (open: boolean) => void
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'uploads', label: 'Uploads', icon: '📤' },
  { id: 'favorites', label: 'Favorites', icon: '❤️' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

const MobileSidebar = ({ 
  activeNav, 
  setActiveNav, 
  mobileSidebarOpen, 
  setMobileSidebarOpen 
}: MobileSidebarProps) => {
  return (
    <AnimatePresence>
      {mobileSidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-64 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-lg z-50 p-6 md:hidden"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  I
                </div>
                <h1 className="text-2xl font-bold ml-3 dark:text-white">Imagify</h1>
              </div>
              <button 
                onClick={() => setMobileSidebarOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                ✕
              </button>
            </div>
            
            <nav className="space-y-2">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full flex items-center p-3 rounded-2xl text-left transition-all ${
                    activeNav === item.id 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                      : 'bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => {
                    setActiveNav(item.id)
                    setMobileSidebarOpen(false)
                  }}
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileSidebar