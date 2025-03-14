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
  Share2Icon,
} from "lucide-react";
import ShareButton from "@/components/button/ShareButton";
import { useChessNewsStore } from "@/app/store/chessNewsStore";
import { useParams } from "next/navigation";
import { formatDate } from "@/functions/format-date";

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

export default function Detail() {
  const {
    isLoading,
    setIsLoading,
    categories,
    chessNews,
    setChessNews,
    detailNews,
    setDetailNews,
  } = useChessNewsStore();
  const [selectedTab, setSelectedTab] = useState<string>("All");
  const [saved, setSaved] = useState<any>({});
  const [pagination, setPagination] = useState<number>(1);
  const [pages, setPages] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [htmlContent, setHtmlContent] = useState("");
  const params = useParams ();
  useEffect(() => {
    fetchDetailNews();
  }, []);
  const fetchDetailNews = () => {
    fetch(process.env.BASE_URL + "/news/articles/" + params.id).then(
      (res) => {
        res.json().then((response) => {
          setIsLoading(true);
          setDetailNews(response.data);
          console.log(response.data);
        });
      }
    );
  };
  const toggleSave = (id: number) => {
    setSaved((prev: any[]) => ({ ...prev, [id]: !prev[id] }));
  };
  return (
    <div className="flex flex-col p-4 gap-2">
      <div className="flex flex-col xl:flex-row gap-4">
        <div className="md:border md:border-input md:rounded-md md:px-3 md:py-2 bg-white xl:max-w-[737px]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-2 md:mb-3 md:mt-2">
            <div className="flex flex-row items-center gap-2">
              <ArrowLeft size={24} />
              <span className="text-sm sm:text-sm md:text-md lg:text-md">
                {formatDate(detailNews?.publishedAt)}
              </span>
            </div>
            <div className="flex flex-row items-center justify-between gap-2">
              <p className="text-sm sm:text-sm md:text-md lg:text-md min-w-[136px] text-center border border-[#221AE9] font-semibold rounded-[4px] px-1 py-[1px] text-[#221AE9]">
                {detailNews?.category.name}
              </p>
              <div className="flex flex-row items-center gap-2">
                <ShareButton save={toggleSave} />
              </div>
            </div>
          </div>
          <span dangerouslySetInnerHTML={{ __html: detailNews?.content }}></span>
          <div className="flex justify-end my-4">
            <ShareButton isFull={true} save={toggleSave} />
          </div>
          <span className="text-md font-semibold mt-4">Related Articles</span>
          <div className="flex flex-row max-w-full overflow-x-auto gap-3">
            {articles.map((article: any, index: number) => (
              <Card
                key={index}
                className="rounded-md xl:min-w-[229px] overflow-hidden border border-input shadow-md"
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  width={1000}
                  height={1000}
                  className="w-full min-h-[100px] object-cover p-2 rounded-md"
                />
                <CardContent className="px-2">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-[11px]">
                      {article.date}
                    </p>
                    <p className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-[10px] border border-[#221AE9] font-semibold rounded-[4px] px-1 py-[1px] text-[#221AE9]">
                      {article.category}
                    </p>
                  </div>
                  <h2 className="line-clamp-2 text-[9px] sm:text-[12px] md:text-[12px] lg:text-[12px] font-semibold mt-2">
                    {article.title}
                  </h2>
                  <h2 className="line-clamp-3 text-[8px] sm:text-[10px] md:text-[10px] lg:text-[11px] font-normal mt-2">
                    {article.title}
                  </h2>
                </CardContent>
              </Card>
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
            <div className="w-1/2 md:w-1/3 gap-1 flex items-center self-center overflow-x-auto">
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
          <span className="text-md font-semibold mt-4">Most Reads Article</span>
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
