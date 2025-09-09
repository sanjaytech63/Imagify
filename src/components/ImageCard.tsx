import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ImageItem } from '../types'
import { useImageStore } from '../store/useImageStore'

interface ImageCardProps {
  image: ImageItem
  index: number
}

const ImageCard = ({ image, index }: ImageCardProps) => {
  const [isFavorite, setIsFavorite] = useState(image.isFavorite)
  const [isHovered, setIsHovered] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const {removeImage} = useImageStore()

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    const link = document.createElement('a')
    link.href = image.src
    link.download = `${image.title.replace(/\s+/g, '_')}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

const handleShare = async (e: React.MouseEvent) => {
  e.stopPropagation()
  try {
    const response = await fetch(image.src)
    const blob = await response.blob()
    const file = new File([blob], image.title, { type: blob.type })

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: image.title,
        text: `Check out this image: ${image.title}`,
      })
    } else {
      await navigator.clipboard.writeText(image.src)
      alert('Image copied to clipboard!')
    }
  } catch (error) {
    console.error('Error sharing:', error)
  }
}



  const handleImageClick = () => {
    setShowPreview(true)
  }

  const closePreview = () => {
    setShowPreview(false)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleImageClick}
      >
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image.src}
            alt={image.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 flex items-center justify-center space-x-4"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/90 w-10 h-10 rounded-full flex items-center justify-center text-purple-600 shadow-md"
                  onClick={()=>removeImage(image?.id)}
                >
                  ❌
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/90 w-10 h-10 rounded-full flex items-center justify-center text-blue-600 shadow-md"
                  onClick={handleDownload}
                >
                  ⬇️
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white/90 w-10 h-10 rounded-full flex items-center justify-center text-green-600 shadow-md"
                  onClick={handleShare}
                >
                  ➤
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">{image.title}</h3>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">{image.size}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{image.uploadedAt}</span>
          </div>
        </div>
      </motion.div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={closePreview}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-white dark:bg-gray-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with title and close button */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white truncate">
                  {image.title}
                </h2>
                <button
                  onClick={closePreview}
                  className=" w-10 h-10 flex cursor-pointer justify-center items-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              {/* Image */}
              <div className="relative flex items-center justify-center p-4 w-full">
                <img
                  src={image.src}
                  alt={image.title}
                  className="max-h-full w-2xl object-contain rounded-xl"
                />
              </div>

              {/* Footer with actions and metadata */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{image.size}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{image.uploadedAt}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={` w-10 h-10 flex cursor-pointer justify-center items-center rounded-full ${isFavorite ? 'bg-red-100 text-red-500 dark:bg-red-900/30' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}
                      onClick={handleFavorite}
                    >
                      {isFavorite ? '❤️' : '🤍'}
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className=" w-10 h-10 flex cursor-pointer justify-center items-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
                      onClick={handleDownload}
                    >
                      ⬇️
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 flex cursor-pointer justify-center items-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-300"
                      onClick={handleShare}
                    >
                      ➤
                    </motion.button>
                  </div>
                </div>

                {/* Tags (optional) */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full text-sm">
                    Nature
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm">
                    Landscape
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full text-sm">
                    Outdoor
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ImageCard