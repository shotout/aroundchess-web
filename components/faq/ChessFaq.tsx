"use client";
import { useEffect, useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useApiClient } from "@/functions/api-client";
import DotSpinner from "../game-history/Spinner";
import { searchFAQs } from "./search";
interface Question {
  question: string;
  answer: string[];
}

interface Category {
  id: string;
  label: string;
  questions: Question[];
}

const tabs = [
  {
    id: "General",
    label: "General Questions",
    img: "/images/faq/question-mark.png",
  },
  { id: "Analysis", label: "Analysis", img: "/images/faq/analysis-mark.png" },
  {
    id: "Theory",
    title: "Handbook: ",
    label: "Chess Theory",
    img: "/images/faq/theory-mark.png",
  },
  {
    id: "Practice",
    title: "Playground: ",
    label: "Practice",
    img: "/images/faq/practice-mark.png",
  },
];
export default function ChessFAQ() {
  const { getFAQ, isLoading } = useApiClient();
  const [activeTab, setActiveTab] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<any[]>([]);
  const [question, setQuestion] = useState<any[]>([]);
  const [openQuestion, setOpenQuestion] = useState<number>(0);
  const [widthContainer, setWidthContainer] = useState<number>(700);
  const [mounted, setMounted] = useState<boolean>(true);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<
    { id: string; label: string; questions: Question[] }[]
  >([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    fetchFAQ();
  }, []);
  useEffect(() => {
    if (typeof window === "undefined" || !mounted) return;

    // Initial size calculation
    handleResize();

    // Add event listeners
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mounted]);
  const handleResize = () => {
    let widthC = window?.innerWidth;
    setWidthContainer(widthC);
  };
  const fetchFAQ = () => {
    getFAQ({})
      .then((response) => {
        console.log("getFAQ", response);
        setData(response.data);
        setFilteredData(response.data);
        setQuestion(response.data[0].questions);
        setActiveTab(response.data[0].label);
      })
      .finally(() => {});
  };

  const toggleQuestion = (index: any) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };
  useEffect(() => {
    if (data.length > 0) {
      if (query.length >= 3) {
        const timer = setTimeout(() => {
          setSearchLoading(true);
          const results = searchFAQs(data, query);
          setSearchResults(results);
          setActiveTab(results[0].label);
          setQuestion(results[0].questions);
          setFilteredData(results);
          console.log("results", results);
          setSearchLoading(false);
        }, 300); // Debounce for better performance
        return () => clearTimeout(timer);
      } else {
        setQuestion(data[0].questions);
        setActiveTab(data[0].label);
        setFilteredData(data);
      }
    }
  }, [query, data]);

  const handleOnSearch = (e: any) => {
    setQuery(e.target.value);
  };
  if (isLoading) return <DotSpinner />;
  return (
    <div className="flex flex-col w-full bg-gradient-to-b from-[#BDD5FF] via-[#FCFCFD] to-[#FCFCFD] gap-3">
      {/* Header with logo */}
      <div className="relative flex justify-center p-[16px] md:mt-[72px]">
        <Image
          src={`/images/faq/background-${
            widthContainer < 1024 ? `mobile` : `laptop`
          }.png`}
          alt="background"
          width={1000}
          height={1000}
          className="w-full absolute inset-0 object-contain"
        />
        <div className="flex items-center">
          <Image
            src="/icons/logo.png"
            alt="logo"
            width={1000}
            height={1000}
            className="w-[155.75px] h-[50px] object-contain"
          />
        </div>
      </div>

      {/* FAQ Title */}
      <h1 className="text-[18px] font-semibold text-center px-[16px] md:text-[33.47px]">
        Frequently Asked Questions
      </h1>

      {/* Search Bar */}
      <div className="relative flex flex-row items-center md:w-[445px] md:self-center mx-[16px] p-3 gap-2 bg-[#F8F9FC] rounded-md border border-[#DEDEDE]">
        <Search size={20} color="#73778B" className="pl-1" />
        <input
          value={query}
          type="text"
          placeholder="Search"
          className="font-normal text-[12px] w-full h-full bg-[#F8F9FC] focus:border-0 focus:outline-none"
          onChange={handleOnSearch}
        />
      </div>

      {/* Tabs > Mobile width*/}
      <div className="hidden md:flex w-[95%] self-center flex-row items-center justify-center xl:justify-around gap-8 mx-[16px] z-1 mt-[100px] rounded-[8px]">
        {filteredData.map((tab, index) => (
          <button
            key={tab.id}
            className="relative flex flex flex-row items-center justify-center bg-[#FFF] sm:min-w-[300px] lg:min-w-[400px] xl:min-w-[522px] py-[24px] pr-[9px] h-[92px] border border-[#DEDEDE] rounded-[8px]"
          >
            <Image
              src={
                tab.label.includes("General")
                  ? "/images/faq/question-mark.png"
                  : "/images/faq/analysis-mark.png"
              }
              alt="background"
              width={1000}
              height={1000}
              className="sm:w-2/3 lg:w-[116px] h-full absolute left- inset-0 object-cover z-0"
            />
            <button
              className={`z-10 flex flex-col items-center justify-center bg-[#ffffff80] w-fill p-[12px] min-h-[44px] max-h-[71px] rounded-[12px] justify-self-center ${
                activeTab === tab.label
                  ? "text-[#221AE9] border border-[#221AE9] font-bold"
                  : "border border-gray-300 rounded-md"
              }`}
              onClick={() => {
                setQuestion(tab.questions);
                setActiveTab(tab.label);
              }}
            >
              <span className="sm:text-[12px] lg:text-[20px] font-medium text-center">
                {tab.label}
              </span>
            </button>
          </button>
        ))}
      </div>
      {/* Tabs Mobile width*/}
      <div className="md:hidden flex flex-row items-center gap-1 mx-[16px]">
        {filteredData.map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-col items-center justify-center min-w-[23%] px-[12px] h-[42px] rounded-[12px] ${
              activeTab === tab.label
                ? "text-[#221AE9] border border-[#221AE9]"
                : "bg-white border border-gray-300 rounded-md"
            }`}
            onClick={() => {
              setQuestion(tab.questions);
              setActiveTab(tab.label);
            }}
          >
            <div className="flex flex-col items-start">
              <span className="block text-[11px] font-medium text-start">
                {tab.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Category Title */}
      <h2 className="text-[16px] md:text-[24px] text-center font-bold mx-4 mt-8">
        {activeTab}
      </h2>

      {/* Accordion FAQ items */}
      <div className="space-y-3 mx-4 mb-[32px]">
        {question != null &&
          question.length > 0 &&
          question.map((faq: any, index: number) => (
            <div key={index} className="bg-white rounded-md shadow">
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-[20px] py-2 text-left flex justify-between items-center"
              >
                <span className="font-semibold text-[12px] md:text-[16px]">
                  {faq.question}
                </span>
                {openQuestion === index ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              {openQuestion === index && (
                <div className="px-[20px] py-[5px] md:py-[10px] border-t bg-[#F2FBFE]">
                  {Array.isArray(faq.answer) && faq.answer.length > 0 ? (
                    <div className="lspace-y-1">
                      {faq.answer.map((line: any, i: number) => (
                        <span
                          key={i}
                          className="font-normal text-[12px] md:text-[14px] text-[#585858]"
                        >
                          {line}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="font-normal text-[12px] md:text-[14px] text-[#585858]">
                      {faq.answer}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
