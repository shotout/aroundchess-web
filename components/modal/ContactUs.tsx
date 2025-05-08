"use client";

import { useContactUs } from "@/app/store/contactUs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Mail, Send, Upload, UploadCloud } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { subjectForm } from "@/app/store/constants";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { useSuccessSent } from "@/app/store/successSent";
import { useApiClient } from "@/functions/api-client";

export function ContactUs() {
  const router = useRouter();
  const { contactUs } = useApiClient();
  const { open, setOpen } = useContactUs();
  const { setOpen: setOpenSent } = useSuccessSent();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [file, setFile] = useState<any>(null);

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
    let body = form;
    const formData = new FormData();

    body.file = formData.append("file", file);

    console.log("current", form);
    contactUs(body).then(() => {
      console.log("success send contact us");
      setOpen(false);
      setOpenSent(true);
    });
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      console.log("file:", file);

      if (!file) return;

      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: { name: string; size: number }) => {
    // Check file type (simple check for correct extension)
    if (
      !file.name.toLowerCase().endsWith(".png") &&
      !file.name.toLowerCase().endsWith(".jpg") &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      alert("Please upload a correct file.");
      return;
    }

    // Check file size (20MB = 20 * 1024 * 1024 bytes)
    if (file.size > 20 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }
    setFile(file);
    setFileName(file.name);
    setFileSize(file.size);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-[16px] max-w-sm sm:max-w-[640px] bg-white max-h-[90%]">
        <Image
          src={`/images/contact-us/${
            widthC < 768 ? `background-mobile` : `background-laptop`
          }.png`}
          alt="Logo"
          width={1000}
          height={1000}
          className="w-full h-full fixed absolute inset-0 rounded-[12px] object-cover z-0"
          priority
        />

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

        <div className="flex flex-col justify-center z-20 gap-4 overflow-auto p-2 pt-0 lg:p-[32px]:pt-0 ">
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
                  form.name.length > 0 ? `border-[#2E3133]` : `border-[#C0CED4]`
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
                form.email.length > 0 ? `border-[#2E3133]` : `border-[#C0CED4]`
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
                className="hidden"
                accept=".jpg, .png, .pdf"
                onChange={handleFileInput}
              />

              {fileName ? (
                <div className="lg:h-[48px] cursor-pointer flex flex-row items-center justify-center bg-white rounded-full border border-[#C0CED4] gap-2 shadow-md">
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
                  Max Size: 20MB
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            className="btn-primary rounded-full min-h-[48px] sm:min-w-[333px] flex flex-row items-center justify-center gap-2"
          >
            <Send
              className="w-[18px] h-[13.65px] sm:w-[18px] sm:h-[13.65px] lg:w-[26px] lg:h-[20px]"
              color={"#fff"}
              fill="#fff"
            />
            <span className="text-[12px] sm:text-[11px] lg:text-[16px]">
              Send us a message
            </span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
