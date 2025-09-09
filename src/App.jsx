import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Sidebar from './components/Sidebar'
import TopNavbar from './components/TopNavbar'
import ImageGallery from './components/ImageGallery'
import UploadSection from './components/UploadSection'
import MobileSidebar from './components/MobileSidebar'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  const [activeNav, setActiveNav] = useState('home')
  const [showUploadSection, setShowUploadSection] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex flex-1">
        <Sidebar 
          activeNav={activeNav} 
          setActiveNav={setActiveNav}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
        
        <MobileSidebar 
          activeNav={activeNav} 
          setActiveNav={setActiveNav}
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />
        
        <div className="flex-1 flex flex-col">
          <TopNavbar 
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            setShowUploadSection={setShowUploadSection}
            setMobileSidebarOpen={setMobileSidebarOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            <AnimatePresence>
              {showUploadSection && (
                <UploadSection onClose={() => setShowUploadSection(false)} />
              )}
            </AnimatePresence>
            
            <ImageGallery activeNav={activeNav} searchQuery={searchQuery} />
          </main>
        </div>
      </div>
    </div>
  )
}

export default App