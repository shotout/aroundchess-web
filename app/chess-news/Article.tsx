import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import { useChessNewsStore } from "../store/chessNewsStore";
import Link from "next/link";

const tournaments = [
  {
    date: "Mar 26, 2024",
    title: "How clever kids in Ukraine are on World Chess Day",
    image: "/images/auth-background.png",
    category: "Tournaments",
  },
  {
    date: "Mar 20, 2024",
    title:
      "Idris Lanza Chess Tournament Held, attended by 330 Chess Players from Jakarta",
    image: "/images/auth-background.png",
    category: "Tournaments",
  },
];
const articles = [
  {
    id: 1,
    title:
      "Idris Lane Chess Tournament Held, attend by 330 Chess Players from Jakarta",
    date: "Mar 24, 2024",
    image: "/images/auth-background.png",
    category: "Tournaments",
  },
  {
    id: 2,
    title: "Hall of Fame: The 50 Greatest Chess Players of All Time",
    date: "Mar 24, 2024",
    image: "/images/auth-background.png",
    category: "Players",
  },
  {
    id: 3,
    title: "World Rapid & Blitz Champions",
    date: "Mar 24, 2024",
    image: "/images/auth-background.png",
    category: "Tournaments",
  },
  {
    id: 4,
    title: "How clever kids in Ukraine are on World Chess Day",
    date: "Mar 20, 2024",
    image: "/images/auth-background.png",
    category: "World",
  },
];

export default function Article() {
  const {
    isLoading,
    setIsLoading,
    categories,
    setCategories,
    chessNews,
    setChessNews,
    detailNews,
    setDetailNews,
  } = useChessNewsStore();

  const [selectedTab, setSelectedTab] = useState<number>(1);
  const [pagination, setPagination] = useState<number>(1);
  const [pages, setPages] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = () => {
    fetch(process.env.BASE_URL + "/news/categories").then((res) => {
      res.json().then((response) => {
        setIsLoading(true);
        setCategories(response.data);
        setSelectedTab(response.data[0].id);
        fetchArticles();
      });
    });
  };
  const fetchArticles = () => {
    fetch(
      process.env.BASE_URL +
        "/news/articles?page=" +
        pagination +
        "&limit=10&categoryId=" +
        selectedTab
    ).then((res) => {
      res.json().then((response) => {
        console.log(response.data);
        setChessNews(response.data);
        setIsLoading(false);
      });
    });
  };
  return (
    <div className="flex flex-col p-8">
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
      <p className="text-gray-600 text-md md:text-[18px]">
        Stay updated with the latest chess news, tournaments, and player
        insights from around the world.
      </p>
      <div className="flex flex-col xl:flex-row gap-4">
        <div className="md:border md:border-input md:rounded-md md:px-3 md:py-2 bg-white xl:max-w-[737px]">
          <div className="flex flex-col mt-4 md:mt-0 bg-white">
            <div className="mt-4 flex items-center gap-0 border border-input rounded-md px-2 bg-[#F8F9FC]">
              <Search className="h-6 w-6" color="#73778B" />
              <Input
                placeholder="Search topics..."
                className="w-full border-0"
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
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
            {chessNews.map((article: any, index: number) => (
              <Link href={`/chess-news/${article.id}`} key={index}>
              <Card
                className="rounded-md overflow-hidden border border-input shadow-md"
              >
                <Image
                  src={article.imageUrl}
                  alt={article.imageCaption}
                  width={1000}
                  height={1000}
                  className="w-full min-h-[100px] object-cover p-2 rounded-md"
                />
                <CardContent className="px-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-[11px]">
                      {article.publishedAt}
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
          <div className="flex justify-center items-center mt-6">
            <button
              disabled={pagination == 1}
              onClick={() => setPagination((pagination) => pagination - 1)}
              className="p-2 "
            >
              <ChevronLeft
                color={pagination == 1 ? "#221AE925" : "#221AE9"}
                size={28}
              />
            </button>
            <div className="w-1/2 md:w-1/3 gap-1 flex items-center overflow-x-auto">
              {pages.map((num) => (
                <button
                  key={num}
                  className={`p-4 w-8 h-8 flex items-center justify-center rounded-[8px] text-xs ${
                    num === pagination
                      ? "bg-[#81CFF3] text-[#221AE9] font-bold"
                      : "border"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <button
              disabled={pagination == pages.length}
              onClick={() => setPagination((pagination) => pagination + 1)}
              className="p-2 "
            >
              <ChevronRight
                color={pagination == pages.length ? "#221AE925" : "#221AE9"}
                size={28}
              />
            </button>
          </div>
        </div>
        <div className="md:border md:border-input md:rounded-md md:px-4 md:py-4 bg-white">
          <span className="text-md font-bold mt-4">Saved Articles</span>
          <div className="flex flex-col mt-2 gap-2">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-white flex shadow-md rounded-lg rounded-sm border border-input gap-2 p-3"
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  width={1000}
                  height={1000}
                  className="w-16 h-16 rounded-[4px] object-cover"
                />
                <div className="flex flex-col flex-1 gap-2">
                  <div className="flex flex-row justify-between items-center">
                    <p className="block text-[8px] sm:text-[10px] md:text-[10px] lg:text-[11px]">
                      {article.date}
                    </p>
                    <span className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-[10px] border border-[#221AE9] font-semibold rounded-[4px] px-1 py-[1px] text-primary">
                      {article.category}
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
