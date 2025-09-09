import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ImageItem } from '../types'

interface ImageStore {
  images: ImageItem[]
  addImage: (image: Omit<ImageItem, 'id'>) => void
  removeImage: (id: string) => void
  toggleFavorite: (id: string) => void
  searchImages: (query: string) => ImageItem[]
  getFavorites: () => ImageItem[]
}

export const useImageStore = create<ImageStore>()(
  persist(
    (set, get) => ({
      images: [
        
      ],

      addImage: (imageData) => {
        const newImage: ImageItem = {
          ...imageData,
          id: Math.random().toString(36).substr(2, 9),
        }
        set((state) => ({ images: [newImage, ...state.images] }))
      },

      removeImage: (id) => {
        set((state) => ({ images: state.images.filter(img => img.id !== id) }))
      },

      toggleFavorite: (id) => {
        set((state) => ({
          images: state.images.map(img =>
            img.id === id ? { ...img, isFavorite: !img.isFavorite } : img
          )
        }))
      },

      searchImages: (query) => {
        const { images } = get()
        if (!query.trim()) return images
        
        const searchTerm = query.toLowerCase()
        return images.filter(img =>
          img.title.toLowerCase().includes(searchTerm) ||
          img.size.toLowerCase().includes(searchTerm) ||
          img.uploadedAt.toLowerCase().includes(searchTerm)
        )
      },

      getFavorites: () => {
        const { images } = get()
        return images.filter(img => img.isFavorite)
      },
    }),
    {
      name: 'image-storage',
    }
  )
)