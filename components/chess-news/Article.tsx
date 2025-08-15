import { useEffect, useState } from "react"
import { useChessNewsStore } from "../../app/store/chessNewsStore"
import { useApiClient } from "@/functions/api-client"
import { useProfileStore } from "@/app/store/profile"
import { usePagination } from "../pagination/hook/usePagination"
import { Pagination } from "../pagination/pagination"
import { formatDateNews } from "@/functions/format-date"
import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import NoData from "../NoData/NoData"
import { ArticleSkeletonGrid, CategorySkeleton } from "./SkeletonNews"


export default function Article() {
  const { sessionId } = useProfileStore()
  const { getNews, getNewsCategories, getNewsSaved } = useApiClient()
  const {
    categories,
    setCategories,
    savedArticles,
    setSavedArticles,
    isLoading,
    fetchChessNews,
    chessNews,
  } = useChessNewsStore()
  const [query, setQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState<number | null>(null)

  useEffect(() => {
    getNewsCategories({}).then((r) => {
      const cats = r.data
      const idx = cats.findIndex((c: any) => c.name === "AroundChess Guides")
      if (idx > -1) {
        const [g] = cats.splice(idx, 1)
        cats.unshift(g)
      }
      setCategories(cats)
    })
    if (sessionId) {
      getNewsSaved({}).then((r) => setSavedArticles(r.data))
    }
  }, [
    getNewsCategories,
    getNewsSaved,
    sessionId,
    setCategories,
    setSavedArticles,
  ])

  useEffect(() => {
    fetchChessNews(selectedTab, query, getNews)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTab, query])

  const key = selectedTab === null ? "all" : String(selectedTab)
  const allArticles = chessNews[key]?.data || []
  const { currentData } = usePagination(allArticles)

  return (
    <div className="flex flex-col w-full p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-2">
        <Image
          alt=""
          src="/icons/sidebar-news-icon.png"
          width={1000}
          height={1000}
          className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9"
        />
        <h1 className="text-xl md:text-[32px] font-semibold">Chess Blog</h1>
      </div>
      <p className="text-gray-600 text-sm md:text-[18px] py-2 md:py-[8px]">
        Stay updated with the latest blog posts, tournaments, and player insights
        from around the world.
      </p>
      <div className="flex flex-col xl:flex-row gap-4">
        <div
          className={`md:border md:border-input md:rounded-md md:px-3 md:py-2 bg-white ${
            sessionId ? "xl:w-2/3" : "xl:w-full"
          }`}
        >
          <div className="mt-4 flex items-center bg-[#F8F9FC] border border-input rounded-md px-2 gap-2">
            <Search
              className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"
              color="#73778B"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics..."
              className="w-full text-xs sm:text-sm h-[36px] sm:h-[40px] bg-[#F8F9FC] focus:border-0 focus:outline-none"
            />
          </div>
          <div className="flex items-start mt-4 w-full">
            <div className="w-full bg-white">
              {categories.length === 0 ? (
                <CategorySkeleton count={5} />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-1">
                  {categories.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setSelectedTab((prev) =>
                          prev === tab.id ? null : tab.id
                        )
                        setQuery("")
                      }}
                      className={`py-2 px-3 font-medium rounded-[4px] border-input border text-xs sm:text-sm min-h-[40px] sm:min-h-[44px] transition-all duration-200 ${
                        tab.id === selectedTab
                          ? "bg-[#81CFF3] text-black"
                          : "bg-white hover:bg-gray-50"
                      }`}
                    >
                      <span className="truncate w-full text-center block leading-tight">
                        {tab.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {isLoading && allArticles.length === 0 ? (
            <ArticleSkeletonGrid count={6} />
          ) : allArticles.length === 0 ? (
            <div className="flex w-full h-32 sm:h-40 items-center justify-center">
              <NoData>News is empty</NoData>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mt-6">
              {currentData.map((article) => (
                <Link href={`/chess-blog/${article.slug}`} key={article.slug}>
                  <div className="rounded-md overflow-hidden p-2 border border-input shadow-md min-h-[210px] h-auto sm:h-auto hover:shadow-lg transition-shadow duration-200">
                    {article.imageUrl?.trim() !== "" ? (
                      <Image
                        src={article.imageUrl}
                        alt={article.imageCaption || article.title || "Image"}
                        width={1000}
                        height={1000}
                        className="w-full h-[100px] sm:h-[115px] object-cover p-4 rounded-md"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                        }}
                      />
                    ) : (
                      <div className="w-full h-[100px] sm:h-[115px] bg-gray-200 flex items-center justify-center rounded-md">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                    <div className="px-2 py-1">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <p className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-[11px] text-gray-500">
                          {formatDateNews(article.publishedAt)}
                        </p>
                        <p className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-[10px] border border-[#221AE9] font-semibold rounded-[4px] px-1 py-[1px] text-[#221AE9] whitespace-nowrap">
                          {article.category?.name || "Uncategorized"}
                        </p>
                      </div>
                      <h2 className="line-clamp-2 text-[9px] sm:text-[12px] md:text-[12px] lg:text-[12px] font-semibold mb-2 leading-tight">
                        {article.title || "Untitled"}
                      </h2>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {!isLoading && currentData.length > 0 && (
            <div className="mt-6">
              <Pagination data={currentData} />
            </div>
          )}
        </div>
        {sessionId && (
          <div className="md:border md:border-input md:rounded-md md:px-4 md:py-4 bg-white sm:w-full xl:w-1/3">
            <span className="text-sm sm:text-md font-bold mt-4 block">
              Saved Articles
            </span>
            <div className="flex flex-col mt-2 gap-2">
              {savedArticles.length === 0 ? (
                <div className="flex justify-center items-center py-8">
                  <NoData>Nothing saved yet…</NoData>
                </div>
              ) : (
                savedArticles.map((article) => (
                  <Link
                    href={`/chess-blog/${article.slug}`}
                    key={article.slug}
                  >
                    <div className="bg-white flex shadow-md rounded-lg border border-input gap-2 p-3 hover:shadow-lg transition-shadow duration-200">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        width={1000}
                        height={1000}
                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-[4px] object-cover flex-shrink-0"
                      />
                      <div className="flex flex-col flex-1 gap-1 sm:gap-2 min-w-0">
                        <div className="flex flex-row justify-between items-center gap-2">
                          <p className="block text-[8px] sm:text-[10px] md:text-[10px] lg:text-[11px] text-gray-500 truncate">
                            {formatDateNews(article.publishedAt)}
                          </p>
                          <span className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-[10px] border border-[#221AE9] font-semibold rounded-[4px] px-1 py-[1px] text-[#221AE9] whitespace-nowrap flex-shrink-0">
                            {article.category.name}
                          </span>
                        </div>
                        <div className="flex flex-row items-center justify-between">
                          <span className="line-clamp-2 text-[9px] sm:text-[12px] md:text-[12px] lg:text-[12px] font-semibold leading-tight">
                            {article.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}