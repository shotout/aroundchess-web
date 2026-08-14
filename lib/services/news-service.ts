import { NewsArticle } from "@/types/news"

export class NewsService {
  private static instance: NewsService
  private constructor() {}

  public static getInstance(): NewsService {
    if (!NewsService.instance) {
      NewsService.instance = new NewsService()
    }
    return NewsService.instance
  }

  async fetchNews(source?: string): Promise<NewsArticle[]> {
    return [
      {
        id: "1",
        title: "Magnus Carlsen Wins Superbet Chess Classic",
        source: "Chess.com",
        date: "2024-03-20",
        summary: "World Champion Magnus Carlsen secured victory in the Superbet Chess Classic with a round to spare, demonstrating his exceptional endgame technique in a crucial match against Alireza Firouzja.",
        url: "https://chess.com/news/article-1",
        category: "Tournaments",
      },
      {
        id: "2",
        title: "Revolutionary Chess Opening Theory Discovered",
        source: "ChessBase",
        date: "2024-03-19",
        summary: "A groundbreaking discovery in the Sicilian Defense has turned traditional theory on its head. GM Vidit Gujrathi demonstrates a new approach to the Najdorf variation.",
        url: "https://chessbase.com/news/article-2",
        category: "Strategy",
      },
      {
        id: "3",
        title: "Chess AI Reaches New Heights",
        source: "Chess24",
        date: "2024-03-18",
        summary: "The latest version of AlphaZero has demonstrated unprecedented understanding of positional play, leading to discussions about the future of chess training and analysis.",
        url: "https://chess24.com/news/article-3",
        category: "Technology",
      },
      {
        id: "4",
        title: "Improve Your Tactical Vision",
        source: "The Chess Journal",
        date: "2024-03-17",
        summary: "Master the art of tactical vision with these essential pattern recognition exercises. GM Peter Svidler shares his insights on improving calculation skills.",
        url: "https://thechessjournal.com/article-4",
        category: "Tips",
      },
      {
        id: "5",
        title: "New Training Program for Young Players",
        source: "Lichess Blog",
        date: "2024-03-16",
        summary: "Lichess introduces a comprehensive training program designed specifically for young players, featuring interactive lessons and personalized feedback.",
        url: "https://lichess.org/blog/article-5",
        category: "Tips",
      },
    ]
  }

  async getNewsFromSource(source: string): Promise<NewsArticle[]> {
    const allNews = await this.fetchNews()
    return allNews.filter(article => article.source === source)
  }

  async getNewsByCategory(category: string): Promise<NewsArticle[]> {
    const allNews = await this.fetchNews()
    return category === "All" 
      ? allNews 
      : allNews.filter(article => article.category === category)
  }

  async searchNews(query: string): Promise<NewsArticle[]> {
    const allNews = await this.fetchNews()
    const lowercaseQuery = query.toLowerCase()
    return allNews.filter(article => 
      article.title.toLowerCase().includes(lowercaseQuery) ||
      article.summary.toLowerCase().includes(lowercaseQuery)
    )
  }
} 