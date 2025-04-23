"use client";
import { useEffect, useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

export default function ChessFAQ() {
  const [activeTab, setActiveTab] = useState<string>("General");
  const [openQuestion, setOpenQuestion] = useState<number>(0);
  const [widthContainer, setWidthContainer] = useState<number>(700);
  const [mounted, setMounted] = useState<boolean>(true);

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
  const tabs = [
    { id: "General", label: "General", img: "/images/faq/question-mark.png" },
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

  // Sample FAQ questions - replace with your actual content
  const faqs = [
    {
      question: "[QUESTION HERE]",
      answer: ["[SENTENCE ANSWER HERE]", "[SENTENCE ANSWER HERE]"],
    },
    { question: "[QUESTION HERE]", answer: ["[SENTENCE ANSWER HERE]"] },
    { question: "[QUESTION HERE]", answer: ["[SENTENCE ANSWER HERE]"] },
    { question: "[QUESTION HERE]", answer: ["[SENTENCE ANSWER HERE]"] },
  ];

  const toggleQuestion = (index: any) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

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
          type="text"
          placeholder="Search"
          className="font-normal text-[12px] w-full h-full bg-[#F8F9FC]"
        />
      </div>

      {/* Tabs > Mobile width*/}
      <div className="hidden md:flex w-full flex-row items-center justify-center gap-8 mx-[16px] z-1 mt-[100px] rounded-[8px]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className="relative flex flex flex-row items-center justify-end bg-[#FFF] min-w-[200px] py-[24px] pr-[9px] h-[92px] border border-[#DEDEDE] rounded-[8px]"
          >
            <Image
              src={tab.img}
              alt="background"
              width={1000}
              height={1000}
              className="w-1/2 h-full absolute left- inset-0 object-cover z-0"
            />
            <button
              className={`z-10 flex flex-col items-start justify-center bg-[#ffffff80] max-w-[160px] p-[12px] min-h-[44px] max-h-[71px] rounded-[12px] justify-self-end ${
                activeTab === tab.id
                  ? "text-[#221AE9] border border-[#221AE9]"
                  : "bg-white border border-gray-300 rounded-md"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="text-[16px] font-medium text-start">
                {tab.title}
              </span>
              <span className="text-[20px] font-medium text-start">
                {tab.label}
              </span>
            </button>
          </button>
        ))}
      </div>
      {/* Tabs Mobile width*/}
      <div className="md:hidden flex flex-row items-center gap-1 mx-[16px]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex flex-col items-center justify-center min-w-[23%] px-[12px] h-[42px] rounded-[12px] ${
              activeTab === tab.id
                ? "text-[#221AE9] border border-[#221AE9]"
                : "bg-white border border-gray-300 rounded-md"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <div className="flex flex-col items-start">
              <span className="text-[8px] font-medium text-start">
                {tab.title}
              </span>
              <span className="block text-[11px] font-medium text-start">
                {tab.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Category Title */}
      <h2 className="text-[16px] md:text-[24px] font-medium mx-4">
        {activeTab}
      </h2>

      {/* Accordion FAQ items */}
      <div className="space-y-3 mx-4 mb-[32px]">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-md shadow">
            <button
              onClick={() => toggleQuestion(index)}
              className="w-full px-[20px] py-2 text-left flex justify-between items-center"
            >
              <span className="font-bold text-[12px] md:text-[18px]">
                {faq.question}
              </span>
              {openQuestion === index ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>

            {openQuestion === index && (
              <div className="px-[20px] py-[5px] md:py-[10px] border-t">
                <ul className="list-disc pl-6 space-y-1">
                  {faq.answer.map((line, i) => (
                    <li
                      key={i}
                      className="font-normal text-[12px] md:text-[18px]"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
