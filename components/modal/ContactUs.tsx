"use client";

import { subjectForm } from "@/app/store/constants";
import { useContactUs } from "@/app/store/contactUs";
import { useSuccessSent } from "@/app/store/successSent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useApiClient } from "@/functions/api-client";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Mail, Send, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import DotSpinner from "../game-history/Spinner";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FileUploadCard } from "./upload-card/fileUpload";
import formatFileSize from "@/functions/format-file-size";

export function ContactUs() {
  const router = useRouter();
  const { contactUs, isLoading } = useApiClient();
  const { open, setOpen } = useContactUs();
  const { setOpen: setOpenSent } = useSuccessSent();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [totalSize, setTotalSize] = useState(0);
  const [errorSize, setErrorSize] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [files, setFiles] = useState<any[]>([]);
  const [file, setFile] = useState<any[]>([]);

  const [widthC, setWidthC] = useState<number>(0);
  const [form, setForm] = useState<any>({
    name: "",
    email: "",
    topics: "",
    message: "",
    file: "",
  });
  const handleOnChange = (e: any) => {
    console.log("handleOnChange", e);
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    setWidthC(window?.innerWidth);
    setOpen(open);
  }, [open]);
  const handleSendMessage = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const formData = new FormData();

    // Append all form fields to FormData
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("topics", form.topics);
    formData.append("message", form.message);

    // Append the files if they exist
    if (files && files.length > 0) {
      files.forEach((f: File) => {
        console.log("file foreach", f);
        formData.append("files", f);
      });
    }
    console.log("formData contact us", Array.from(formData.entries()));

    contactUs(formData).then(() => {
      console.log("success send contact us");
      setOpen(false);
      setOpenSent(true);
      setFiles([]);
      setFileName("");
      setFileSize(0);
      setForm({
        name: "",
        email: "",
        topics: "",
        message: "",
        file: "",
      });
    });
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("e.target.files", e.target.files);
    const allFile = e.target.files ? Array.from(e.target.files) : [];
    let combine = files.concat(allFile);
    console.log("allFile", combine);
    setFiles(combine);
    handleMaxSize(combine);
  };

  const handleMaxSize = (files: any) => {
    let total = 0;
    files.map((file: any) => {
      total += file.size;
    });
    setTotalSize(total);
    console.log("totalSize", totalSize, formatFileSize(totalSize, "B"));
    if (total >= 20971520.01) {
      setErrorSize(true);
    } else {
      setErrorSize(false);
    }
  };
  const handleDelete = (param: any) => {
    console.log("param", param);
    let filesDeleted = files.filter((item) => item.name !== param.name);
    setFiles(filesDeleted);
    handleMaxSize(filesDeleted);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogOverlay className="fixed inset-0 bg-black/50" /> */}

      <DialogContent
        style={{
          backgroundImage: `url(/images/contact-us/${
            widthC < 768 ? `background-mobile` : `background-laptop`
          }.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          maxHeight: "95vh",
          width: "100%",
        }}
        className="rounded-[16px] max-w-sm sm:max-w-[640px] bg-white max-h-[95%] overflow-y-auto"
      >
        <DialogHeader className="flex flex-col justify-center items-center z-20">
          <DialogTitle>
            <span className="font-medium text-[18px] lg:text-[32px]">
              Contact Us
            </span>
          </DialogTitle>
          <DialogDescription>
            <span className="font-normal text-[14px] lg:text-[20px]">
              Our Team will get back to you as soon as possible.
            </span>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea>
          <div className="flex flex-col justify-center z-20 gap-4 p-2 pt-0 lg:p-[32px]:pt-0 overflow-y-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="space-y-2 w-full">
                <label htmlFor="full-name" className="text-[14px] font-medium">
                  Full Name
                </label>
                <Input
                  id="full-name"
                  name="name"
                  type="text"
                  placeholder="Enter Your Name"
                  className={`w-full align-top text-left font-normal text-[14px] shadow-sm min-h-[44px] bg-[#FAFDFF] rounded-[8px] border ${
                    form.name.length > 0
                      ? `border-[#2E3133]`
                      : `border-[#C0CED4]`
                  } px-[16px] py-[12px]`}
                  value={form.name}
                  onChange={handleOnChange}
                />
              </div>
            </div>
            <div className="space-y-2 w-full">
              <label
                htmlFor="email"
                className="flex flex-row gap-2 text-[14px] font-medium"
              >
                <Mail size={20} /> Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your Email Address"
                className={`w-full align-top text-left font-normal text-[14px] shadow-sm min-h-[44px] bg-[#FAFDFF] rounded-[8px] border ${
                  form.email.length > 0
                    ? `border-[#2E3133]`
                    : `border-[#C0CED4]`
                } px-[16px] py-[12px]`}
                value={form.email}
                onChange={handleOnChange}
              />
            </div>

            <div className="space-y-2 w-full">
              <label htmlFor="topics" className="text-[14px] font-medium">
                Topic
              </label>
              <Select
                name="subject"
                value={form.topics}
                onValueChange={(e) => setForm({ ...form, topics: e })}
              >
                <SelectTrigger
                  className={`w-full align-top text-left font-normal text-[14px] shadow-sm min-h-[44px] bg-[#FAFDFF] rounded-[8px] border ${
                    form.topics.length > 0
                      ? `border-[#2E3133]`
                      : `border-[#C0CED4]`
                  } px-[16px] py-[12px]`}
                >
                  <SelectValue placeholder="Select topics" />
                </SelectTrigger>
                <SelectContent className="border border-[#C0CED4]">
                  {subjectForm.map((item, index) => {
                    return (
                      <SelectItem key={item.value} value={item.label}>
                        {item.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 w-full">
              <label htmlFor="message" className="text-[14px] font-medium">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Enter your message here"
                className={`w-full align-top text-left font-normal text-[14px] shadow-sm min-h-[80px] bg-[#FAFDFF] rounded-[8px] border ${
                  form.message.length > 0
                    ? `border-[#2E3133]`
                    : `border-[#C0CED4]`
                } px-[16px] py-[12px]`}
                value={form.message}
                onChange={handleOnChange}
              />
            </div>
            <div className="space-y-2 w-full">
              <label htmlFor="file" className="text-[14px] font-medium">
                Optional: Upload File
              </label>
              <div className="w-full flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple={true}
                  className="hidden"
                  accept=".jpg, .png, .pdf"
                  onChange={handleFileInput}
                />

                {fileName ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer lg:h-[48px] cursor-pointer flex flex-row items-center justify-center bg-white rounded-full border border-[#C0CED4] gap-2 shadow-md"
                  >
                    <Upload className="h-[20px] w-[20px] text-[#221AE9]" />
                    <p className="text-gray-800 font-medium">{fileName}</p>
                    <p className="text-gray-500 text-sm">
                      {(fileSize / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div className="lg:h-[48px] cursor-pointer flex flex-row items-center justify-center bg-white rounded-full border border-[#C0CED4] gap-2 shadow-md">
                    <Upload className="h-[20px] w-[20px] text-[#221AE9]" />
                    <span
                      className="font-medium text-[16px] text-[#221AE9]"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Choose File
                    </span>
                  </div>
                )}
                <div className="flex flex-row justify-between items-center">
                  <span className="font-normal text-[16px] text-[#585858]">
                    Supported Format: PNG, JPG, PDF
                  </span>
                  <span className="font-normal text-[16px] text-[#585858]">
                    Max Size: {formatFileSize(totalSize, "B")}/
                    {formatFileSize(20971520.01, "B")}
                  </span>
                </div>

                {/* render per file waiting upload */}
                <div className="flex flex-col overflow-y-auto max-h-[30vh] gap-2 px-2">
                  {files &&
                    files.length > 0 &&
                    files.map((item: any, index: number) => {
                      return (
                        <FileUploadCard
                          handleDeleteFile={(param: any) => handleDelete(param)}
                          item={item}
                          key={index}
                        />
                      );
                    })}
                </div>
              </div>
            </div>
            <button
              disabled={
                errorSize ||
                isLoading ||
                (form.name.length == 0 &&
                  form.email.length == 0 &&
                  form.topics.length == 0 &&
                  form.message.length == 0 &&
                  form.file.length == 0)
              }
              onClick={handleSendMessage}
              className={`${
                errorSize ||
                isLoading ||
                (form.name.length == 0 &&
                  form.email.length == 0 &&
                  form.topics.length == 0 &&
                  form.message.length == 0 &&
                  form.file.length == 0)
                  ? `opacity-70`
                  : ``
              } absolute bottom-0 btn-primary rounded-full min-h-[48px] sm:min-w-[333px] flex flex-row items-center justify-center gap-2`}
            >
              {isLoading ? (
                <DotSpinner size={5} />
              ) : (
                <>
                  <Send
                    className="w-[18px] h-[13.65px] sm:w-[18px] sm:h-[13.65px] lg:w-[26px] lg:h-[20px]"
                    color={"#fff"}
                    fill="#fff"
                  />
                  <span className="text-[12px] sm:text-[11px] lg:text-[16px]">
                    Send message
                  </span>
                </>
              )}
            </button>
            {errorSize && (
              <span className="text-[14px] text-[#FD0000] font-normal text-center">
                Upload Failed: The total file size exceeds the 20MB limit.
                Please remove some files or upload smaller ones.
              </span>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
