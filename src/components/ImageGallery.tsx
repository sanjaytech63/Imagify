// src/components/ImageGallery.tsx
import { motion } from 'framer-motion'
import ImageCard from './ImageCard'
import { useImageStore } from '../store/useImageStore'

interface ImageGalleryProps {
  activeNav: string
  searchQuery: string
}

const ImageGallery = ({ activeNav, searchQuery }: ImageGalleryProps) => {
  const images = useImageStore(state => state.images)
  const searchImages = useImageStore(state => state.searchImages)
  const getFavorites = useImageStore(state => state.getFavorites)

  let filteredImages = images

  if (activeNav === 'favorites') {
    filteredImages = getFavorites()
  }

  if (searchQuery) {
    filteredImages = searchImages(searchQuery)
  }

  if (filteredImages.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-96 text-gray-500 dark:text-gray-400"
      >
        <div className="text-6xl mb-4">📷</div>
        <h3 className="text-xl font-semibold mb-2">
          {searchQuery ? 'No images found' : 'No images yet'}
        </h3>
        <p className="text-center">
          {searchQuery 
            ? 'Try a different search term or upload some images'
            : 'Upload your first image to get started'
          }
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
    >
      {filteredImages.map((image, index) => (
        <ImageCard key={image.id} image={image} index={index} />
      ))}
    </motion.div>
  )
}

export default ImageGallery