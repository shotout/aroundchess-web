import { useChessNewsStore } from "@/app/store/chessNewsStore";
import ShareButton from "@/components/button/ShareButton";
import { Card, CardContent } from "@/components/ui/card";
import { useApiClient } from "@/functions/api-client";
import { formatDateNews } from "@/functions/format-date";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NoData from "../NoData/NoData";
import { DetailSkeleton } from "./SkeletonNews";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { ScrollArea } from "../ui/scroll-area";

const CACHE_DURATION_MS = 60 * 60 * 1000;

export default function Detail() {
  const {
    isLoading,
    setIsLoading,
    detailNews,
    setDetailNews,
    detailNewsFetchedAt,
    setDetailNewsFetchedAt,
    mostReadsArticle,
    setMostReadsArticle,
    mostReadsFetchedAt,
    setMostReadsFetchedAt,
  } = useChessNewsStore();
  const { getNewsBySlug, toggleSaveNews, getMostRead } = useApiClient();
  const [saved, setSaved] = useState<any>({});
  const router = useRouter();
  const params = useParams();
  const slug = params?.id as string;
  const [localDetail, setLocalDetail] = useState<any>(null);
  const [localMostReads, setLocalMostReads] = useState<any[]>([]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    const now = Date.now();

    if (
      detailNews &&
      detailNews.slug === slug &&
      detailNewsFetchedAt &&
      now - detailNewsFetchedAt < CACHE_DURATION_MS
    ) {
      setLocalDetail(detailNews);
      setIsLoading(false);
    } else {
      getNewsBySlug({}, slug).then((response) => {
        if (!cancelled) {
          setLocalDetail(response.data);
          setDetailNews(response.data);
          setDetailNewsFetchedAt(Date.now());
          setIsLoading(false);
        }
      });
    }

    if (
      mostReadsArticle &&
      mostReadsFetchedAt &&
      now - mostReadsFetchedAt < CACHE_DURATION_MS
    ) {
      setLocalMostReads(mostReadsArticle);
    } else {
      getMostRead({}).then((response) => {
        if (!cancelled) {
          setLocalMostReads(response.data);
          setMostReadsArticle(response.data);
          setMostReadsFetchedAt(Date.now());
        }
      });
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const toggleSave = (id: number) => {
    toggleSaveNews({ articleId: localDetail?.id }).then(() => {
      setSaved((prev: any[]) => ({ ...prev, [id]: !prev[id] }));
      getNewsBySlug({}, slug).then((response) => {
        setLocalDetail(response.data);
        setDetailNews(response.data);
        setDetailNewsFetchedAt(Date.now());
      });
    });
  };

  if (isLoading || !localDetail) return <DetailSkeleton />;

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
                {formatDateNews(localDetail?.publishedAt)}
              </span>
            </div>
            <div className="flex flex-row items-center justify-between gap-2">
              <p className="text-sm sm:text-sm md:text-md lg:text-md min-w-[136px] text-center border border-[#221AE9] font-semibold rounded-[4px] px-1 py-[1px] text-[#221AE9]">
                {localDetail?.category?.name}
              </p>
              <div className="flex flex-row items-center gap-2">
                <ShareButton
                  save={toggleSave}
                  saved={localDetail?.isSaved}
                  title={localDetail?.title}
                  slug={localDetail?.slug}
                />
              </div>
            </div>
          </div>
          <span className="font-medium text-[20px] mb-[16px]">
            {localDetail?.title}
          </span>
          {localDetail?.imageUrl && localDetail.imageUrl.trim() !== "" ? (
            <Image
              src={localDetail.imageUrl}
              alt={
                localDetail?.imageCaption ||
                localDetail?.title ||
                "Article image"
              }
              width={1000}
              height={1000}
              className="w-full object-contain"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-md mb-4">
              <span className="text-gray-500">No Image Available</span>
            </div>
          )}

          <div className="prose prose-sm max-w-[2/3] mt-4">
            <MarkdownPreview
              source={localDetail?.content}
              className="w-full md:max-w-[66vw]"
              style={{
                margin: "0 auto",
                padding: 16,
                ["--color-canvas-default" as string]: "#ffffff",
                ["--color-canvas-subtle" as string]: "#f6f8fa",
                ["--color-border-default" as string]: "#d0d7de",
                ["--color-fg-default" as string]: "#24292f",
              }}
              data-color-mode="light"
            />
          </div>

          <div className="flex justify-end my-4">
            <ShareButton
              isFull={true}
              save={toggleSave}
              saved={localDetail?.isSaved}
              title={localDetail?.title}
              slug={localDetail?.slug}
            />
          </div>
          <span className="text-md font-semibold mt-4">Related Articles</span>
          <div className="flex flex-row max-w-full overflow-x-auto gap-3 mt-2">
            {localDetail &&
              localDetail?.relatedArticles != null &&
              localDetail?.relatedArticles.map(
                (article: any, index: number) => (
                  <Card
                    onClick={() => router.push("/chess-blog/" + article.slug)}
                    key={index}
                    className="cursor-pointer rounded-md xl:w-[229px] max-h-[254px] overflow-hidden border border-input shadow-md"
                  >
                    {article.imageUrl && article.imageUrl.trim() !== "" ? (
                      <Image
                        src={article.imageUrl}
                        alt={article.title || "Related article image"}
                        width={1000}
                        height={1000}
                        className="w-full max-h-[115px] object-cover p-2 rounded-md"
                      />
                    ) : (
                      <div className="w-full h-[115px] bg-gray-200 flex items-center justify-center m-2 rounded-md">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                    <CardContent className="px-2">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-[11px]">
                          {formatDateNews(article.publishedAt)}
                        </p>
                        <p className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-[10px] border border-[#221AE9] font-semibold rounded-[4px] px-1 py-[1px] text-[#221AE9]">
                          {article?.category?.name || "Uncategorized"}
                        </p>
                      </div>
                      <h2 className="line-clamp-2 text-[9px] sm:text-[12px] md:text-[12px] lg:text-[12px] font-semibold mt-2">
                        {article.title || "Untitled"}
                      </h2>
                      <h2 className="line-clamp-3 text-[8px] sm:text-[10px] md:text-[10px] lg:text-[11px] font-normal mt-2">
                        {article.title || "Untitled"}
                      </h2>
                    </CardContent>
                  </Card>
                )
              )}
          </div>
        </div>
        <div className="md:border md:border-input md:rounded-md md:px-4 md:py-4 bg-white sm:w-full xl:w-1/3 xl:sticky xl:top-4 xl:h-fit">
          <span className="text-md font-semibold mt-4">Most Read Articles</span>
          <div className="flex flex-col mt-2 gap-2">
            {localMostReads.length === 0 && (
              <div className="flex justify-center items-center">
                <NoData>Most Reads is empty</NoData>
              </div>
            )}
            <ScrollArea className="h-[77vh]">
              {localMostReads.map((article: any) => (
                <div
                  onClick={() => router.push("/chess-blog/" + article.slug)}
                  key={article.id}
                  className="cursor-pointer bg-white mt-2 flex shadow-md rounded-sm border border-input gap-2 p-3"
                >
                  {article.imageUrl && article.imageUrl.trim() !== "" ? (
                    <Image
                      src={article.imageUrl}
                      alt={
                        article.imageCaption ||
                        article.title ||
                        "Most read article image"
                      }
                      width={1000}
                      height={1000}
                      className="w-16 h-16 rounded-[4px] object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-[4px]">
                      <span className="text-gray-500 text-xs">No Image</span>
                    </div>
                  )}
                  <div className="flex flex-col flex-1 gap-2">
                    <div className="flex flex-row justify-between items-center">
                      <p className="block text-[8px] sm:text-[10px] md:text-[10px] lg:text-[11px]">
                        {formatDateNews(article.publishedAt)}
                      </p>
                      <span className="text-[8px] sm:text-[10px] md:text-[10px] lg:text-[10px] border border-[#221AE9] font-semibold rounded-[4px] px-1 py-[1px] text-primary">
                        {article?.category?.name || "Uncategorized"}
                      </span>
                    </div>
                    <div className="flex flex-row items-center justify-between max-h-[40px] ">
                      <span className="line-clamp-2 text-[9px] sm:text-[12px] md:text-[12px] lg:text-[12px] font-semibold">
                        {article.title || "Untitled"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
