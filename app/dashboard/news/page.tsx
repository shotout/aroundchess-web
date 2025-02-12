"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Pin, Bookmark, Calendar, Filter, ExternalLink, Search } from "lucide-react"
import { format } from "date-fns"
import { NewsService } from "@/lib/services/news-service"
import { type NewsArticle } from "@/types/news"
import { NewsSkeletonGrid } from "@/components/skeletons/news-skeleton"
import { cn } from "@/lib/utils"

const categories = [
  "All",
  "Tournaments",
  "Strategy",
  "Tips",
  "Players",
  "Technology",
]

const newsSources = [
  { id: "chess-com", name: "Chess.com", url: "https://www.chess.com/news" },
  { id: "chessbase", name: "ChessBase", url: "https://en.chessbase.com" },
  { id: "chess-journal", name: "The Chess Journal", url: "https://thechessjournal.com" },
  { id: "chess24", name: "Chess24", url: "https://chess24.com/en/news" },
  { id: "lichess", name: "Lichess Blog", url: "https://lichess.org/blog" },
]

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [filter, setFilter] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSource, setSelectedSource] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const newsService = NewsService.getInstance()
    const fetchNews = async () => {
      setIsLoading(true)
      try {
        let fetchedArticles: NewsArticle[]
        
        if (selectedSource !== "all") {
          fetchedArticles = await newsService.getNewsFromSource(selectedSource)
        } else if (filter !== "All") {
          fetchedArticles = await newsService.getNewsByCategory(filter)
        } else if (searchQuery) {
          fetchedArticles = await newsService.searchNews(searchQuery)
        } else {
          fetchedArticles = await newsService.fetchNews()
        }
        
        setArticles(fetchedArticles)
      } catch (error) {
        console.error("Error fetching news:", error)
        // TODO: Add proper error handling UI
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [selectedSource, filter, searchQuery])

  const toggleArticleStatus = (id: string, status: "star" | "pin" | "save") => {
    setArticles(prev => prev.map(article => {
      if (article.id === id) {
        switch (status) {
          case "star":
            return { ...article, isStarred: !article.isStarred }
          case "pin":
            return { ...article, isPinned: !article.isPinned }
          case "save":
            return { ...article, isSaved: !article.isSaved }
        }
      }
      return article
    }))
  }

  const filteredArticles = articles
    .sort((a, b) => {
      // Show pinned articles first
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      // Then sort by date
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Chess News</h1>
        <p className="text-muted-foreground">Stay updated with the latest chess news, tournaments, and player insights from around the world.</p>
      </div>

      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        <div className="w-full md:w-3/4">
          {/* Search and Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      placeholder="Search news..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedSource} onValueChange={setSelectedSource}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      {newsSources.map(source => (
                        <SelectItem key={source.id} value={source.name}>
                          {source.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Badge
                      key={category}
                      variant={filter === category ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer px-3 py-1 hover:bg-primary/90 transition-colors",
                        filter === category ? "bg-primary text-primary-foreground" : "hover:text-primary-foreground"
                      )}
                      onClick={() => setFilter(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* News Grid */}
          {isLoading ? (
            <NewsSkeletonGrid />
          ) : filteredArticles.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No articles found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArticles.map(article => (
                <Card key={article.id} className={cn(
                  "transition-all duration-200 hover:shadow-lg",
                  article.isPinned ? "border-blue-500 shadow-blue-100" : ""
                )}>
                  <CardHeader className="p-4 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-base leading-tight line-clamp-2">
                        {article.title}
                      </CardTitle>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleArticleStatus(article.id, "star")}
                        >
                          <Star className={cn("h-4 w-4", article.isStarred ? "fill-yellow-400 text-yellow-400" : "")} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleArticleStatus(article.id, "pin")}
                        >
                          <Pin className={cn("h-4 w-4", article.isPinned ? "fill-blue-500 text-blue-500" : "")} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleArticleStatus(article.id, "save")}
                        >
                          <Bookmark className={cn("h-4 w-4", article.isSaved ? "fill-green-500 text-green-500" : "")} />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">{article.summary}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <Badge variant="secondary" className="text-xs">
                        {article.source}
                      </Badge>
                      <span>{format(new Date(article.date), "MMM d, yyyy")}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs" asChild>
                      <a href={article.url} target="_blank" rel="noopener noreferrer">
                        Read More <ExternalLink className="ml-2 h-3 w-3" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-1/4 space-y-4">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Saved Items</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Tabs defaultValue="saved">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="saved">Saved</TabsTrigger>
                  <TabsTrigger value="starred">Starred</TabsTrigger>
                  <TabsTrigger value="pinned">Pinned</TabsTrigger>
                </TabsList>
                <TabsContent value="saved">
                  <ScrollArea className="h-[400px]">
                    {articles.filter(a => a.isSaved).map(article => (
                      <div key={article.id} className="p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <h4 className="font-medium text-sm line-clamp-1">{article.title}</h4>
                        <p className="text-xs text-gray-500">{article.source}</p>
                      </div>
                    ))}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="starred">
                  <ScrollArea className="h-[400px]">
                    {articles.filter(a => a.isStarred).map(article => (
                      <div key={article.id} className="p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <h4 className="font-medium text-sm line-clamp-1">{article.title}</h4>
                        <p className="text-xs text-gray-500">{article.source}</p>
                      </div>
                    ))}
                  </ScrollArea>
                </TabsContent>
                <TabsContent value="pinned">
                  <ScrollArea className="h-[400px]">
                    {articles.filter(a => a.isPinned).map(article => (
                      <div key={article.id} className="p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <h4 className="font-medium text-sm line-clamp-1">{article.title}</h4>
                        <p className="text-xs text-gray-500">{article.source}</p>
                      </div>
                    ))}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 