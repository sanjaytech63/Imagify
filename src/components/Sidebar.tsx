
import { motion } from 'framer-motion'
import { NavItem } from '../types'

interface SidebarProps {
  activeNav: string
  setActiveNav: (id: string) => void
  darkMode: boolean
  toggleDarkMode: () => void
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

const Sidebar = ({ activeNav, setActiveNav, darkMode, toggleDarkMode }: SidebarProps) => {
  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden md:flex flex-col w-64 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-lg p-6 m-4"
    >
      <div className="flex items-center mb-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
          I
        </div>
        <h1 className="text-2xl font-bold ml-3 dark:text-white">Imagify</h1>
      </div>
      
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full flex items-center p-3 rounded-2xl text-left transition-all ${
              activeNav === item.id 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
                : 'bg-white/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => setActiveNav(item.id)}
          >
            <span className="text-xl mr-3">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </motion.button>
        ))}
      </nav>

      <div className="pt-6 mt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Dark Mode</span>
          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              darkMode ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default Sidebar