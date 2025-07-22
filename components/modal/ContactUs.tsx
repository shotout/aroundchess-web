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
  const { contactUs, isLoading } = useApiClient();
  const { open, setOpen } = useContactUs();
  const { setOpen: setOpenSent } = useSuccessSent();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [totalSize, setTotalSize] = useState(0);
  const [errorSize, setErrorSize] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [widthC, setWidthC] = useState<number>(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    topics: "",
    message: "",
  });

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const updateWidth = () => {
      setWidthC(window?.innerWidth || 0);
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const isFormValid = () => {
    return form.name.trim().length > 0 && 
           form.email.trim().length > 0 && 
           form.topics.length > 0 && 
           form.message.trim().length > 0;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid() || errorSize) return;

    try {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("email", form.email.trim());
      formData.append("topics", form.topics);
      formData.append("message", form.message.trim());

      if (files && files.length > 0) {
        files.forEach((f: File) => {
          formData.append("files", f);
        });
      }

      await contactUs(formData);
      
      setOpen(false);
      setOpenSent(true);
      setFiles([]);
      setTotalSize(0);
      setErrorSize(false);
      setForm({
        name: "",
        email: "",
        topics: "",
        message: "",
      });
    } catch (error) {
      // Handle error appropriately
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    const combinedFiles = [...files, ...newFiles];
    setFiles(combinedFiles);
    handleMaxSize(combinedFiles);
  };

  const handleMaxSize = (fileList: File[]) => {
    const total = fileList.reduce((sum, file) => sum + file.size, 0);
    setTotalSize(total);
    setErrorSize(total >= 20971520);
  };

  const handleDelete = (fileToDelete: File) => {
    const filteredFiles = files.filter((file) => file.name !== fileToDelete.name);
    setFiles(filteredFiles);
    handleMaxSize(filteredFiles);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <form onSubmit={handleSendMessage} className="flex flex-col justify-center z-20 gap-4 p-2 pt-0 lg:p-[32px]:pt-0 overflow-y-auto">
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
                  required
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
                required
              />
            </div>

            <div className="space-y-2 w-full">
              <label htmlFor="topics" className="text-[14px] font-medium">
                Topic
              </label>
              <Select
                name="subject"
                value={form.topics}
                onValueChange={(value) => setForm({ ...form, topics: value })}
                required
              >
                <SelectTrigger
                  className={`w-full align-top text-gray-500 text-left font-normal text-[14px] shadow-sm min-h-[44px] bg-[#FAFDFF] rounded-[8px] border ${
                    form.topics.length > 0
                      ? `border-[#2E3133]`
                      : `border-[#C0CED4]`
                  } px-[16px] py-[12px]`}
                >
                  <SelectValue placeholder="Select Topic" />
                </SelectTrigger>
                <SelectContent className="border border-[#C0CED4]">
                  {subjectForm.map((item) => (
                    <SelectItem key={item.value} value={item.label}>
                      {item.label}
                    </SelectItem>
                  ))}
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
                required
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

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="lg:h-[48px] cursor-pointer flex flex-row items-center justify-center bg-white rounded-full border border-[#C0CED4] gap-2 shadow-md"
                >
                  <Upload className="h-[20px] w-[20px] text-[#221AE9]" />
                  <span className="font-medium text-[16px] text-[#221AE9]">
                    Choose File
                  </span>
                </div>
                
                <div className="flex flex-row justify-between items-center">
                  <span className="font-normal text-[16px] text-[#585858]">
                    Supported Format: PNG, JPG, PDF
                  </span>
                  <span className="font-normal text-[16px] text-[#585858]">
                    Max Size: {formatFileSize(20971520, "B")}
                  </span>
                </div>

                <div className="flex flex-col overflow-y-auto max-h-[30vh] gap-2 px-2">
                  {files.map((item, index) => (
                    <FileUploadCard
                      handleDeleteFile={handleDelete}
                      item={item}
                      key={`${item.name}-${index}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={errorSize || isLoading || !isFormValid()}
              className={`${
                errorSize || isLoading || !isFormValid()
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
                Please remove some files or upload smaller ones.
              </span>
            )}
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}