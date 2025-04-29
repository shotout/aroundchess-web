import { useChessNewsStore } from "@/app/store/chessNewsStore";
import ShareButton from "@/components/button/ShareButton";
import { Card, CardContent } from "@/components/ui/card";
import { useApiClient } from "@/functions/api-client";
import { formatDateNews } from "@/functions/format-date";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DotSpinner from "../game-history/Spinner";
import NoData from "../NoData/NoData";

export default function Detail() {
  const {
    isLoading,
    setIsLoading,
    categories,
    chessNews,
    setChessNews,
    savedArticles,
    setSavedArticles,
    mostReadsArticle,
    setMostReadsArticle,
    detailNews,
    setDetailNews,
  } = useChessNewsStore();
  const {
    getNewsById,
    toggleSaveNews,
    getMostRead,
    isLoading: fetchLoading,
  } = useApiClient();
  const [selectedTab, setSelectedTab] = useState<string>("All");
  const [saved, setSaved] = useState<any>({});
  const [pagination, setPagination] = useState<number>(1);
  const [pages, setPages] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [htmlContent, setHtmlContent] = useState("");
  const router = useRouter();
  const params = useParams();
  useEffect(() => {
    setIsLoading(true);
    fetchMostRead();
    console.log("params", params);
  }, []);
  const fetchMostRead = () => {
    getMostRead({})
      .then((response) => {
        console.log("getMostRead", response.data);
        setMostReadsArticle(response.data);
      })
      .catch((e) => {
        console.log("error most read get", e);
      })
      .finally(() => {
        fetchDetailNews();
      });
  };
  const fetchDetailNews = () => {
    getNewsById({}, params.id).then((response) => {
      setDetailNews(response.data);
      setIsLoading(false);
      console.log(response.data);
    });
  };
  const toggleSave = (id: number) => {
    toggleSaveNews({ articleId: params.id }).then((response) => {
      console.log(response.data);
      setSaved((prev: any[]) => ({ ...prev, [id]: !prev[id] }));
      fetchDetailNews();
    });
  };
  if (isLoading) return <DotSpinner />;
  if (detailNews)
    return (
      <div className="flex flex-col p-4 gap-2">
        <div className="flex flex-col xl:flex-row gap-4">
          <div className="md:border md:border-input md:rounded-md md:px-3 md:py-2 bg-white xl:w-2/3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-2 md:mb-3 md:mt-2">
              <div
                className="flex flex-row items-center gap-2 cursor-pointer"
                onClick={() => router.back()}
              >
                <ArrowLeft size={24} />
                <span className="text-sm sm:text-sm md:text-md lg:text-md">
                  {formatDateNews(detailNews?.publishedAt)}
                </span>
              </div>
              <div className="flex flex-row items-center justify-between gap-2">
                <p className="text-sm sm:text-sm md:text-md lg:text-md min-w-[136px] text-center border border-[#221AE9] font-semibold rounded-[4px] px-1 py-[1px] text-[#221AE9]">
                  {detailNews?.category?.name}
                </p>
                <div className="flex flex-row items-center gap-2">
                  {}
                  <ShareButton save={toggleSave} saved={detailNews?.isSaved} />
                </div>
              </div>
            </div>
            <span className="font-medium text-[20px] mb-[16px]">
              {detailNews?.title}
            </span>
            <Image
              src={detailNews?.imageUrl}
              alt={detailNews?.imageCaption}
              width={1000}
              height={1000}
              className="w-full object-contain"
            />
            <span
              dangerouslySetInnerHTML={{ __html: detailNews?.content }}
            ></span>
            <div className="flex justify-end my-4">
              <ShareButton isFull={true} save={toggleSave} />
            </div>
            <span className="text-md font-semibold mt-4">Related Articles</span>
            <div className="flex flex-row max-w-full overflow-x-auto gap-3 mt-2">
              {detailNews &&
                detailNews?.relatedArticles != null &&
                detailNews?.relatedArticles.map(
                  (article: any, index: number) => (
                    <Card
                      key={index}
                      className="rounded-md xl:w-[229px] max-h-[254px] overflow-hidden border border-input shadow-md"
                    >
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
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
                            {detailNews?.category?.name}
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
                  )
                )}
            </div>
          </div>
          <div className="md:border md:border-input md:rounded-md md:px-4 md:py-4 bg-white sm:w-full xl:w-1/3">
            <span className="text-md font-semibold mt-4">
              Most Reads Article
            </span>
            <div className="flex flex-col mt-2 gap-2">
              {mostReadsArticle.length == 0 && (
                <div className="flex justify-center items-center">
                  <NoData>Most Reads is empty</NoData>
                </div>
              )}
              {mostReadsArticle.map((article: any) => (
                <div
                  key={article.id}
                  className="bg-white flex shadow-md rounded-lg rounded-sm border border-input gap-2 p-3"
                >
                  <Image
                    src={article.imageUrl}
                    alt={article.imageCaption}
                    width={1000}
                    height={1000}
                    className="w-16 h-16 rounded-[4px] object-cover"
                  />
                  <div className="flex flex-col flex-1 gap-2">
                    <div className="flex flex-row justify-between items-center">
                      <p className="block text-[8px] sm:text-[10px] md:text-[10px] lg:text-[11px]">
                        {formatDateNews(article.publishedAt)}
                      </p>
                      <span className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-[10px] border border-[#221AE9] font-semibold rounded-[4px] px-1 py-[1px] text-primary">
                        {article?.category?.name}
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
