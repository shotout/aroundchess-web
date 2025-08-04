import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useChessNewsStore } from "../../app/store/chessNewsStore";
import { useApiClient } from "@/functions/api-client";
import { useProfileStore } from "@/app/store/profile";
import { usePagination } from "../pagination/hook/usePagination";
import { Pagination } from "../pagination/pagination";
import { formatDateNews } from "@/functions/format-date";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import NoData from "../NoData/NoData";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ArticleSkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mt-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-md overflow-hidden p-2 border border-input shadow-md h-[240px] sm:h-[254px] animate-pulse bg-gray-100"
        >
          <div className="w-full h-[100px] sm:h-[115px] bg-gray-200 rounded-md mb-2" />
          <div className="px-2 py-1">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="h-3 w-16 bg-gray-300 rounded" />
              <div className="h-3 w-12 bg-gray-300 rounded" />
            </div>
            <div className="h-4 w-3/4 bg-gray-300 rounded mb-2" />
            <div className="h-3 w-full bg-gray-200 rounded mb-1" />
            <div className="h-3 w-5/6 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CategorySkeleton({ count = 5 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="py-2 px-3 rounded-[4px] bg-gray-100 border border-input animate-pulse min-h-[40px] sm:min-h-[44px]"
        >
          <div className="h-3 w-3/4 bg-gray-300 rounded mx-auto" />
        </div>
      ))}
    </div>
  );
}

const CACHE_DURATION_MS = 60 * 60 * 1000;

export default function Article() {
  const { sessionId } = useProfileStore();
  const {
    categories,
    setCategories,
    chessNews,
    setChessNews,
    savedArticles,
    setSavedArticles,
    setIsLoading,
    isLoading,
  } = useChessNewsStore();
  const { getNews, getNewsCategories, getNewsSaved } = useApiClient();
  const [searchLoading, setSearchLoading] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<number | null>(null);
  const hasRun = useRef(false);

  useLayoutEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    getNewsCategories({}).then((response) => {
      if (response.data.length > 0) {
        const guidesIndex = response.data.findIndex(
          (cat: { name: string }) => cat.name === "AroundChess Guides"
        );
        const newCategories = [...response.data];
        if (guidesIndex > -1) {
          const [guidesCategory] = newCategories.splice(guidesIndex, 1);
          newCategories.unshift(guidesCategory);
        }
        setCategories(newCategories);
      }
      if (sessionId !== "") {
        getNewsSaved({}).then((res) => setSavedArticles(res.data));
      }
    });
  }, []);

  useEffect(() => {
    const key = selectedTab === null ? "all" : String(selectedTab);
    const cache = chessNews[key];
    const now = Date.now();
    if (cache && now - cache.fetchedAt < CACHE_DURATION_MS && !query) return;
    if (!cache?.data?.length) setIsLoading(true);
    const searchParams =
      selectedTab === null
        ? { search: query || undefined }
        : { categoryId: selectedTab, search: query || undefined };
    getNews(searchParams).then((response) => {
      setChessNews(key, response.data);
      setIsLoading(false);
    });
  }, [selectedTab, categories.length]);

  useEffect(() => {
    if (query.length >= 3) {
      setSearchLoading(true);
      const timer = setTimeout(() => {
        const key = selectedTab === null ? "all" : String(selectedTab);
        const searchParams =
          selectedTab === null
            ? { search: query }
            : { categoryId: selectedTab, search: query };
        getNews(searchParams).then((response) => {
          setChessNews(key, response.data);
          setSearchLoading(false);
        });
      }, 300);
      return () => clearTimeout(timer);
    }
    if (query.length === 0) {
      const key = selectedTab === null ? "all" : String(selectedTab);
      const cache = chessNews[key];
      const now = Date.now();
      if (cache && now - cache.fetchedAt < CACHE_DURATION_MS) return;
      if (!cache?.data?.length) setIsLoading(true);
      const searchParams =
        selectedTab === null ? {} : { categoryId: selectedTab };
      getNews(searchParams).then((response) => {
        setChessNews(key, response.data);
        setIsLoading(false);
      });
    }
  }, [query]);

  const handleOnSearch = (e: any) => {
    setQuery(e.target.value);
  };

  const articles =
    selectedTab === null
      ? chessNews["all"]?.data || []
      : chessNews[String(selectedTab)]?.data || [];
  const { currentData } = usePagination(articles);

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
        Stay updated with the latest blog posts, tournaments, and player insights from
        around the world.
      </p>
      <div className="flex flex-col xl:flex-row gap-4">
        <div
          className={`md:border md:border-input md:rounded-md md:px-3 md:py-2 bg-white ${
            sessionId !== "" ? `xl:w-2/3` : `xl:w-full`
          }`}
        >
          <div className="mt-4 flex items-center bg-[#F8F9FC] border border-input rounded-md px-2 gap-2">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" color="#73778B" />
            <input
              onChange={handleOnSearch}
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
                        setSelectedTab(tab.id === selectedTab ? null : tab.id);
                        setQuery("");
                      }}
                      className={`py-2 px-3 font-medium rounded-[4px] border-input border text-xs sm:text-sm min-h-[40px] sm:min-h-[44px] transition-all duration-200 ${
                        tab.id === selectedTab ? `bg-[#81CFF3] text-black` : `bg-white hover:bg-gray-50`
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
          {(isLoading || searchLoading) && articles.length === 0 ? (
            <ArticleSkeletonGrid count={6} />
          ) : articles.length === 0 ? (
            <div className="flex w-full h-32 sm:h-40 items-center justify-center">
              <NoData>News is empty</NoData>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mt-6">
              {articles.map((article) => (
                <Link href={`/chess-news/${article.slug}`} key={article.slug}>
                  <div className="rounded-md overflow-hidden p-2 border border-input shadow-md h-auto sm:h-auto hover:shadow-lg transition-shadow duration-200">
                    {article.imageUrl?.trim() !== "" ? (
                      <Image
                        src={article.imageUrl}
                        alt={article.imageCaption || article.title || "Image"}
                        width={1000}
                        height={1000}
                        className="w-full h-[100px] sm:h-[115px] object-cover p-4 rounded-md"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
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
                      {/* <div className="prose prose-sm line-clamp-3 text-gray-600 leading-tight mt-1">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ children }) => <h1 className="text-xs font-bold">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-xs font-semibold">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-xs font-semibold">{children}</h3>,
                            p: ({ children }) => <p className="text-xs leading-relaxed">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc pl-6 mb-0 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-6 mb-0 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                            blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700">{children}</blockquote>,
                            code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                            pre: ({ children }) => <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">{children}</pre>,
                            a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">{children}</a>,
                            // eslint-disable-next-line @next/next/no-img-element
                            img: ({ src, alt }) => <img src={src} alt={alt} className="max-w-full h-auto rounded-md my-4"/>,
                            table: ({ children }) => <div className="overflow-x-auto my-4"><table className="min-w-full border-collapse border border-gray-300">{children}</table></div>,
                            th: ({ children }) => <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">{children}</th>,
                            td: ({ children }) => <td className="border border-gray-300 px-4 py-2">{children}</td>,
                          }}
                        >
                          {article.content || ""}
                        </ReactMarkdown>
                      </div> */}
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
        <div
          className={`md:border md:border-input md:rounded-md md:px-4 md:py-4 bg-white sm:w-full ${
            sessionId !== "" ? `xl:w-1/3` : `hidden`
          }`}
        >
          <span className="text-sm sm:text-md font-bold mt-4 block">Saved Articles</span>
          <div className="flex flex-col mt-2 gap-2">
            {savedArticles.length === 0 ? (
              <div className="flex justify-center items-center py-8">
                <NoData>Saved is empty</NoData>
              </div>
            ) : (
              savedArticles.map((article) => (
                <Link href={`/chess-news/${article.slug}`} key={article.slug}>
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
      </div>
    </div>
  );
}