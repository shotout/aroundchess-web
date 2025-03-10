export interface NewsArticle {
  id: string
  title: string
  source: string
  date: string
  summary: string
  url: string
  category: string
  isStarred?: boolean
  isPinned?: boolean
  isSaved?: boolean
}

export interface NewsSource {
  id: string
  name: string
  url: string
} 