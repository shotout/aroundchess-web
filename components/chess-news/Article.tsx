import { useLoadingAPI } from "@/app/store/loadingApi";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useApiClient } from "@/functions/api-client";
import { formatDateNews } from "@/functions/format-date";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useChessNewsStore } from "../../app/store/chessNewsStore";
import DotSpinner from "../game-history/Spinner";
import NoData from "../NoData/NoData";
import { usePagination } from "../pagination/hook/usePagination";
import { Pagination } from "../pagination/pagination";
import { useProfileStore } from "@/app/store/profile";

export default function Article() {
  const { sessionId, hydrated } = useProfileStore();
  const {
    categories,
    setCategories,
    chessNews,
    setChessNews,
    detailNews,
    setDetailNews,
    savedArticles,
    setSavedArticles,
    setIsLoading,
    isLoading,
  } = useChessNewsStore();
  const {
    getNews,
    getNewsCategories,
    getNewsById,
    getNewsSaved,
    toggleSaveNews,
  } = useApiClient();
  const { currentData, currentPage } = usePagination(chessNews);
  const { isLoading: loadingFetch } = useLoadingAPI();
  const [searchLoading, setSearchLoading] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [stateNews, setStateNews] = useState<number>(0);
  const [selectedTab, setSelectedTab] = useState<number>(1);
  const hasRun = useRef(false);

  useLayoutEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    getNewsCategories({}).then((response) => {
      if (response.data.length > 0) {
        console.log("getNewsCategories", response.data);
        setCategories(response.data);
        setStateNews(response.data);
        setSelectedTab(response.data[0].id);
        fetchArticles(response.data[0].id);
      }
      if (sessionId != "") {
        fetchSavedArticle();
      }
    });
  };

  const fetchSavedArticle = () => {
    getNewsSaved({}).then((response) => {
      console.log("getNewsSaved", response.data);
      setSavedArticles(response.data);
    });
  };

  const fetchArticles = (id: string) => {
    const idArticle = id != null ? id : selectedTab;
    const params = { categoryId: idArticle, page: currentPage };
    getNews(params).then((response) => {
      console.log("getNews", response.data);
      setChessNews(response.data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (query.length >= 3) {
      setSearchLoading(true);
      const timer = setTimeout(() => {
        const params = { categoryId: selectedTab, search: query };
        getNews(params).then((response) => {
          setChessNews(response.data);
          setSearchLoading(false);
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [query]);

  const handleOnSearch = (e: any) => {
    setQuery(e.target.value);
  };

  if (isLoading) return <DotSpinner />;

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
            sessionId != "" ? `xl:w-2/3` : `xl:w-full`
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

            {/* Updated Categories Grid */}
            <div className="flex items-start mt-4 w-full">
              <div className="w-full bg-white">
                {categories.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-1">
                    {categories.map((tab: any, index) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setSelectedTab(tab.id);
                          fetchArticles(tab.id);
                        }}
                        className={`py-2 px-3 font-medium rounded-[4px] border-input border transition-all duration-200 hover:shadow-sm
                          text-xs sm:text-sm
                          min-h-[40px] sm:min-h-[44px]
                          ${
                            tab.id == selectedTab
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
            {(loadingFetch || searchLoading) && (
              <div className="flex w-full h-32 sm:h-40 items-center justify-center gap-2">
                <DotSpinner />
              </div>
            )}
            {!searchLoading && !loadingFetch && chessNews.length == 0 && (
              <div className="flex w-full h-32 sm:h-40 items-center justify-center gap-2">
                <NoData>News is empty</NoData>
              </div>
            )}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 mt-6">
            {!searchLoading &&
              !loadingFetch &&
              chessNews.map((article: any, index: number) => (
                <Link href={`/chess-news/${article.slug}`} key={index}>
                  <Card className="rounded-md overflow-hidden border border-input shadow-md h-[240px] sm:h-[254px] hover:shadow-lg transition-shadow duration-200">
                    <Image
                      src={article.imageUrl}
                      alt={article.imageCaption}
                      width={1000}
                      height={1000}
                      className="w-full h-[100px] sm:h-[115px] object-cover p-2 rounded-md"
                    />
                    <CardContent className="px-2 py-1">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <p className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-[11px] text-gray-500">
                          {formatDateNews(article.publishedAt)}
                        </p>
                        <p className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-[10px] border border-[#221AE9] font-semibold rounded-[4px] px-1 py-[1px] text-[#221AE9] whitespace-nowrap">
                          {article.category.name}
                        </p>
                      </div>
                      <h2 className="line-clamp-2 text-[9px] sm:text-[12px] md:text-[12px] lg:text-[12px] font-semibold mb-2 leading-tight">
                        {article.title}
                      </h2>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: article.content.replace(
                            /\*\*(.*?)\*\*/g,
                            "<b>$1</b>"
                          ),
                        }}
                        className="line-clamp-3 text-[8px] sm:text-[10px] md:text-[10px] lg:text-[11px] font-normal text-gray-600 leading-tight"
                      />
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>

          {/* Pagination */}
          {!loadingFetch && currentData.length > 0 && (
            <div className="mt-6">
              <Pagination data={currentData} />
            </div>
          )}
        </div>

        {/* Saved Articles Sidebar */}
        <div
          className={`md:border md:border-input md:rounded-md md:px-4 md:py-4 bg-white sm:w-full ${
            sessionId != "" ? `xl:w-1/3` : `hidden`
          }`}
        >
          <span className="text-sm sm:text-md font-bold mt-4 block">
            Saved Articles
          </span>
          <div className="flex flex-col mt-2 gap-2">
            {savedArticles.length == 0 && (
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
