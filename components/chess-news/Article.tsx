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
          className="py-2 px-3 rounded-[4px] bg-gray-100 border border-input animate-pulse min-h-[40px] sm:min-h-[44px] h-full"
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
        // Move "AroundChess Guides" to the front if it exists
        const guidesIndex = response.data.findIndex(
          (cat: { name: string; }) => cat.name === "AroundChess Guides"
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
    if (categories.length > 0 && selectedTab === null) {
      setSelectedTab(categories[0].id);
    }
  }, [categories, selectedTab]);

  useEffect(() => {
    if (selectedTab === null) return;
    const key = String(selectedTab);
    const cache = chessNews[key];
    const now = Date.now();
    if (cache && now - cache.fetchedAt < CACHE_DURATION_MS && !query) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    getNews({ categoryId: selectedTab, search: query || undefined }).then(
      (response) => {
        setChessNews(key, response.data);
        setIsLoading(false);
      }
    );
  }, [selectedTab]);

  useEffect(() => {
    if (selectedTab === null) return;
    const key = String(selectedTab);
    if (query.length >= 3) {
      setSearchLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(true);
        getNews({ categoryId: selectedTab, search: query }).then((response) => {
          setChessNews(key, response.data);
          setIsLoading(false);
          setSearchLoading(false);
        });
      }, 300);
      return () => clearTimeout(timer);
    }
    if (query.length === 0) {
      const cache = chessNews[key];
      const now = Date.now();
      if (cache && now - cache.fetchedAt < CACHE_DURATION_MS) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      getNews({ categoryId: selectedTab }).then((response) => {
        setChessNews(key, response.data);
        setIsLoading(false);
      });
    }
  }, [query, selectedTab]);

  const handleOnSearch = (e: any) => {
    setQuery(e.target.value);
  };

  const articles =
    selectedTab !== null ? chessNews[String(selectedTab)]?.data || [] : [];
  const { currentData } = usePagination(articles);

  return (
    <div className="flex flex-col w-full p-4 sm:p-6 lg:p-8 justify-center items-between">
      <div className="flex items-center gap-2">
        <Image
          alt=""
          src={"/icons/sidebar-news-icon.png"}
          width={1000}
          height={1000}
          className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9"
        />
        <h1 className="text-xl md:text-[32px] font-semibold">Chess Blog</h1>
      </div>
      <p className="text-gray-600 text-sm md:text-[18px] py-2 md:py-[8px]">
        Stay updated with the latest blog posts, tournaments, and player
        insights from around the world.
      </p>
      <div className="flex flex-col xl:flex-row gap-4">
        <div
          className={`md:border md:border-input md:rounded-md md:px-3 md:py-2 bg-white ${
            sessionId !== "" ? `xl:w-2/3` : `xl:w-full`
          }`}
        >
          <div className="flex flex-col mt-4 md:mt-0 bg-white">
            <div className="mt-4 flex items-center bg-[#F8F9FC] border border-input rounded-md px-2 gap-2">
              <Search
                className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"
                color="#73778B"
              />
              <input
                onChange={handleOnSearch}
                placeholder="Search topics..."
                className="w-full text-xs sm:text-sm h-[36px] sm:h-[40px] bg-[#F8F9FC] focus:border-0 focus:outline-none border-none outline-none"
              />
            </div>
            <div className="flex items-start mt-4 w-full">
              <div className="w-full bg-white">
                {categories.length === 0 ? (
                  <CategorySkeleton count={5} />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-1">
                    {categories.map((tab: any) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setSelectedTab(tab.id);
                          setQuery("");
                        }}
                        className={`py-2 px-3 font-medium rounded-[4px] border-input border transition-all duration-200 hover:shadow-sm
                          text-xs sm:text-sm
                          min-h-[40px] sm:min-h-[44px]
                          ${
                            tab.id === selectedTab
                              ? `bg-[#81CFF3] text-black `
                              : `bg-white hover:bg-gray-50`
                          }
                        `}
                      >
                        <span
                          className="truncate w-full text-center block leading-tight"
                          title={tab.name}
                        >
                          {tab.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            {(isLoading || searchLoading) ? (
              <ArticleSkeletonGrid count={6} />
            ) : articles.length === 0 ? (
              <div className="flex w-full h-32 sm:h-40 items-center justify-center gap-2">
                <NoData>News is empty</NoData>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mt-6">
                {articles.map((article: any, index: number) => (
                  <Link href={`/chess-news/${article.slug}`} key={index}>
                    <div className="rounded-md overflow-hidden p-2 border border-input shadow-md h-[240px] sm:h-[254px] hover:shadow-lg transition-shadow duration-200">
                      {article.imageUrl && article.imageUrl.trim() !== "" ? (
                        <Image
                          src={article.imageUrl}
                          alt={
                            article.imageCaption ||
                            article.title ||
                            "Article image"
                          }
                          width={1000}
                          height={1000}
                          className="w-full h-[100px] sm:h-[115px] object-cover p-4 rounded-md"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-[100px] sm:h-[115px] bg-gray-200 flex items-center justify-center  rounded-md">
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
                        <span
                          dangerouslySetInnerHTML={{
                            __html: (article.content || "").replace(
                              /\*\*(.*?)\*\*/g,
                              "<b>$1</b>"
                            ),
                          }}
                          className="line-clamp-3 text-[8px] sm:text-[10px] md:text-[10px] lg:text-[11px] font-normal text-gray-600 leading-tight"
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
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
          <span className="text-sm sm:text-md font-bold mt-4 block">
            Saved Articles
          </span>
          <div className="flex flex-col mt-2 gap-2">
            {savedArticles.length === 0 && (
              <div className="flex justify-center items-center py-8">
                <NoData>Saved is empty</NoData>
              </div>
            )}
            {savedArticles.map((article) => (
              <Link href={`/chess-news/${article.slug}`} key={article.id}>
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}