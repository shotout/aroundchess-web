import { useLoadingAPI } from "@/app/store/loadingApi";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useApiClient } from "@/functions/api-client";
import { formatDateNews } from "@/functions/format-date";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useChessNewsStore } from "../../app/store/chessNewsStore";
import DotSpinner from "../game-history/Spinner";
import NoData from "../NoData/NoData";
import { usePagination } from "../pagination/hook/usePagination";
import { Pagination } from "../pagination/pagination";

export default function Article() {
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
  const { currentData,currentPage } = usePagination(chessNews);
  const { isLoading: loadingFetch } = useLoadingAPI();
  const [searchLoading, setSearchLoading] = useState(false);
  const [query, setQuery] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<number>(1);
  const [pagination, setPagination] = useState<number>(1);
  const [pages, setPages] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = () => {
    setIsLoading(true);
    getNewsCategories({})
      .then((response) => {
        console.log("getNewsCategories", response.data);
        setCategories(response.data);
        setSelectedTab(response.data[0].id);
      })
      .finally(() => {
        fetchSavedArticle();
      });
  };
  const fetchSavedArticle = () => {
    getNewsSaved({}).then((response) => {
      console.log("getNewsSaved", response.data);
      setSavedArticles(response.data);
      setIsLoading(false);
    });
  };
  const fetchArticles = () => {
    let params = { categoryId: selectedTab, page: currentPage };
    getNews(params).then((response) => {
      console.log("getNews", response.data);
      setChessNews(response.data);
    });
  };
  useEffect(() => {
    fetchArticles();
  }, [selectedTab]);
  useEffect(() => {
    if (query.length >= 3) {
      setSearchLoading(true);
      const timer = setTimeout(() => {
        let params = { categoryId: selectedTab, search: query };
        getNews(params).then((response) => {
          console.log("getNews search", response.data);
          setChessNews(response.data);
          setSearchLoading(false);
        });
      }, 300); // Debounce for better performance
      return () => clearTimeout(timer);
    }
  }, [query]);
  const handleOnSearch = (e: any) => {
    setQuery(e.target.value);
  };
  if (isLoading) return <DotSpinner />;
  return (
    <div className="flex flex-col w-full p-[32px] justify-center items-between">
      <div className="flex items-center gap-2">
        <Image
          alt=""
          src={"/icons/sidebar-news-icon.png"}
          width={1000}
          height={1000}
          className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9"
        />
        <h1 className="text-xl md:text-[32px] font-semibold">Chess News</h1>
      </div>
      <p className="text-gray-600 text-md md:text-[18px] py-[8px]">
        Stay updated with the latest chess news, tournaments, and player
        insights from around the world.
      </p>
      <div className="flex flex-col xl:flex-row gap-4">
        <div className="md:border md:border-input md:rounded-md md:px-3 md:py-2 bg-white xl:w-2/3">
          <div className="flex flex-col mt-4 md:mt-0 bg-white">
            <div className="mt-4 flex items-center bg-[#F8F9FC] border border-input rounded-md px-2 bg-[#F8F9FC] gap-2">
              <Search className="h-6 w-6" color="#73778B" />
              <input
                onChange={handleOnSearch}
                placeholder="Search topics..."
                className="w-full text-[12px] h-[36px] bg-[#F8F9FC]  focus:border-0 focus:outline-none border-none outline-none"
              />
              {/* <Button>Search</Button> */}
            </div>
            <div className="flex items-center mt-4 w-full min-h-[44px]">
              <div className="flex gap-2 bg-white overflow-x-auto overflow-y-hidden max-w-full">
                {categories.length > 0 &&
                  categories.map((tab: any, index) => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTab(tab.id)}
                      className={`py-1 px-3 font-medium rounded-[4px] border-input border
                  ${
                    tab.id == selectedTab
                      ? `bg-[#81CFF3] text-black`
                      : `bg-white`
                  }
                `}
                    >
                      <span className="text-xs sm:text-sm md:text-md lg:text-md xl:text-lg">
                        {tab.name}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
          {(loadingFetch || searchLoading) && (
            <div className="flex w-full h-1/2 items-center justify-center gap-2">
              <DotSpinner />
            </div>
          )}
          {!searchLoading && !loadingFetch && chessNews.length == 0 && (
            <div className="flex w-full h-1/2 items-center justify-center gap-2">
              <NoData>News is empty</NoData>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
            {!searchLoading &&
              !loadingFetch &&
              chessNews.map((article: any, index: number) => (
                <Link href={`/chess-news/${article.id}`} key={index}>
                  <Card className="rounded-md overflow-hidden border border-input shadow-md h-[254px]">
                    <Image
                      src={article.imageUrl}
                      alt={article.imageCaption}
                      width={1000}
                      height={1000}
                      className="w-full max-h-[115px] object-cover p-2 rounded-md"
                    />
                    <CardContent className="px-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-[11px]">
                          {formatDateNews(article.publishedAt)}
                        </p>
                        <p className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-[10px] border border-[#221AE9] font-semibold rounded-[4px] px-1 py-[1px] text-[#221AE9]">
                          {article.category.name}
                        </p>
                      </div>
                      <h2 className="line-clamp-2 text-[9px] sm:text-[12px] md:text-[12px] lg:text-[12px] font-semibold mt-2">
                        {article.title}
                      </h2>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: article.content.replace(
                            /\*\*(.*?)\*\*/g,
                            "<b>$1</b>"
                          ),
                        }}
                        className="line-clamp-3 text-[8px] sm:text-[10px] md:text-[10px] lg:text-[11px] font-normal mt-2"
                      />
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
          {/* Pagination */}
          {!loadingFetch && currentData.length > 0 && (
            <Pagination data={currentData} />
          )}
        </div>
        <div className="md:border md:border-input md:rounded-md md:px-4 md:py-4 bg-white sm:w-full xl:w-1/3">
          <span className="text-md font-bold mt-4">Saved Articles</span>
          <div className="flex flex-col mt-2 gap-2">
            {savedArticles.length == 0 && (
              <div className="flex justify-center items-center">
                <NoData>Saved is empty</NoData>
              </div>
            )}
            {savedArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white flex shadow-md rounded-lg border border-input gap-2 p-3"
              >
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  width={1000}
                  height={1000}
                  className="w-16 h-16 rounded-[4px] object-cover"
                />
                <div className="flex flex-col flex-1 gap-2">
                  <div className="flex flex-row justify-between items-center">
                    <p className="block text-[8px] sm:text-[10px] md:text-[10px] lg:text-[11px]">
                      {formatDateNews(article.publishedAt)}
                    </p>
                    <span className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-[10px] border border-[#221AE9] font-semibold rounded-[4px] px-1 py-[1px] text-[#221AE9]">
                      {article.category.name}
                    </span>
                  </div>
                  <div className="flex flex-row items-center justify-between max-h-[40px] ">
                    <span className="line-clamp-2 text-[9px] sm:text-[12px] md:text-[12px] lg:text-[12px] font-semibold">
                      {article.title}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
