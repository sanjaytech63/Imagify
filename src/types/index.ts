export interface ImageItem {
  id: string
  src: string
  title: string
  size: string
  uploadedAt: string
  isFavorite: boolean
}

export interface NavItem {
  id: string
  label: string
  icon: string
}

export interface User {
  name: string
  avatar: string
  email: string
}
