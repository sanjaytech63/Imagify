// src/components/UploadSection.tsx
import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useImageStore } from '../store/useImageStore'

interface UploadSectionProps {
  onClose: () => void
}

interface UploadedFile {
  id: string
  file: File
  preview: string
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
}

const UploadSection = ({ onClose }: UploadSectionProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<UploadedFile[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const addImage = useImageStore(state => state.addImage)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = useCallback((files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'))

    if (imageFiles.length === 0) {
      alert('Please select image files only.')
      return
    }

    // Check file size (max 10MB)
    const validFiles = imageFiles.filter(file => file.size <= 10 * 1024 * 1024)
    const invalidFiles = imageFiles.filter(file => file.size > 10 * 1024 * 1024)

    if (invalidFiles.length > 0) {
      alert(`${invalidFiles.length} file(s) exceed the 10MB limit and were not selected.`)
    }

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'pending'
    }))

    setSelectedFiles(prev => [...prev, ...newFiles])
  }, [])

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveFile = (id: string) => {
    const file = selectedFiles.find(f => f.id === id)
    if (file) {
      URL.revokeObjectURL(file.preview)
    }
    setSelectedFiles(prev => prev.filter(file => file.id !== id))
  }
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const simulateUpload = (file: UploadedFile) => {
    return new Promise<void>((resolve) => {
      const updatedFile = { ...file, status: 'uploading' as const }
      setSelectedFiles(prev => prev.map(f => f.id === file.id ? updatedFile : f))

      let progress = 0
      const interval = setInterval(async () => {
        progress += Math.random() * 15
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          setSelectedFiles(prev => prev.map(f =>
            f.id === file.id ? { ...f, progress: 100, status: 'completed' as const } : f
          ))

          const base64Src = await fileToBase64(file.file)

          addImage({
            src: base64Src, 
            title: file.file.name,
            size: `${(file.file.size / 1024 / 1024).toFixed(1)} MB`,
            uploadedAt: 'Just now',
            isFavorite: false
          })

          resolve()
        } else {
          setSelectedFiles(prev => prev.map(f =>
            f.id === file.id ? { ...f, progress } : f
          ))
        }
      }, 200)
    })
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one file to upload.')
      return
    }

    const pendingFiles = selectedFiles.filter(file => file.status === 'pending')

    for (const file of pendingFiles) {
      await simulateUpload(file)
    }
  }

  const handleClose = () => {
    selectedFiles.forEach(file => URL.revokeObjectURL(file.preview))
    onClose()
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload Images</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="text-2xl">✕</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            {/* File selection area */}
            <div
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-6 ${isDragging
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500'
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleBrowseClick}
            >
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-500">
                  <span className="text-3xl">📁</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Drag & Drop your files here
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    or <span className="text-purple-600 dark:text-purple-400">browse files</span>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    Supports JPG, PNG, WEBP, GIF (Max 10MB each)
                  </p>
                </div>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>

            {/* Selected files list */}
            {selectedFiles.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Selected Files ({selectedFiles.length})
                </h3>

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={file.preview}
                          alt={file.file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="ml-3 flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {file.file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(file.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>

                        {file.status !== 'pending' && (
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                            <div
                              className={`h-2 rounded-full ${file.status === 'completed'
                                  ? 'bg-green-500'
                                  : file.status === 'error'
                                    ? 'bg-red-500'
                                    : 'bg-blue-500'
                                }`}
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveFile(file.id)
                        }}
                        className="ml-2 p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                        disabled={file.status === 'uploading'}
                      >
                        <span className="text-lg">×</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-6 grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl shadow-md hover:shadow-lg transition-shadow font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleUpload}
              disabled={selectedFiles.length === 0 || selectedFiles.every(f => f.status === 'completed' || f.status === 'uploading')}
            >
              {selectedFiles.some(f => f.status === 'uploading') ? (
                <span className="flex items-center justify-center">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block mr-2"
                  >
                    ⏳
                  </motion.span>
                  Uploading...
                </span>
              ) : selectedFiles.every(f => f.status === 'completed') ? (
                'Upload Complete!'
              ) : (
                `Upload ${selectedFiles.length} File${selectedFiles.length !== 1 ? 's' : ''}`
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default UploadSection