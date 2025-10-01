import { motion } from 'framer-motion'
import { useState } from 'react'

interface TopNavbarProps {
  darkMode: boolean
  toggleDarkMode: () => void
  setShowUploadSection: (show: boolean) => void
  setMobileSidebarOpen: (open: boolean) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const TopNavbar = ({
  darkMode,
  toggleDarkMode,
  setShowUploadSection,
  setMobileSidebarOpen,
  searchQuery,
  setSearchQuery
}: TopNavbarProps) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-lg m-4 p-4 flex items-center justify-between"
    >
      <div className="flex items-center">
        <button
          className="md:hidden mr-4 p-2 rounded-2xl bg-white/50 dark:bg-gray-700/50"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <span className="text-xl">☰</span>
        </button>
        <div className="flex items-center flex-1 max-w-md">
          <div className="relative flex items-center w-full">
            <span className="absolute left-3 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search images..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="pl-10 pr-10 py-2 w-full bg-white/50 dark:bg-gray-700/50 rounded-2xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <span className="text-lg">×</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-2xl shadow-md hover:shadow-lg transition-shadow"
          onClick={() => setShowUploadSection(true)}
        >
          <span className="hidden sm:inline">Upload</span>
          <span className="sm:hidden">📤</span>
        </motion.button>

        {/* <button className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400">
          <span className="text-xl">🔔</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-2xl bg-white/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300"
        >
          {darkMode ? '☀️' : '🌙'}
        </button> */}

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-purple-500">
            <img
              src="photo.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden md:block">
            <h4 className="font-medium dark:text-white">Sanjay Choudhary</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default TopNavbar