"use client";

import { useContactUs } from "@/app/store/contactUs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Mail, Send } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

export function ContactUs() {
  const router = useRouter();
  const { open, setOpen } = useContactUs();
  const [form, setForm] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    topic: "",
    message: "",
  });
  const [widthC, setWidthC] = useState<number>(0);
  useEffect(() => {
    setWidthC(window?.innerWidth);

    setOpen(open);
  }, [open]);

  const handleOnChange = (e: any) => {
    console.log("handleOnChange", e);
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSendMessage = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const { current } = form;
    emailjs
      .sendForm("service_kj7oisp", "template_zc6g14o", current, {
        publicKey: "jTUGjAIqTwezcSh2k",
      })
      .then(
        () => {
          toast.success("Form send successfully!");
          form.current?.reset();

          // window.location.reload();
          console.log("SUCCESS!");
        },
        (error) => {
          toast.error(error.text);
          console.log("FAILED...", error.text);
        }
      );
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
              <label htmlFor="first-name" className="text-[14px] font-medium">
                First Name
              </label>
              <Input
                id="first-name"
                name="firstName"
                type="text"
                placeholder="Type here..."
                className={`w-full shadow-sm min-h-[44px] bg-[#FAFDFF] border ${
                  form.firstName.length > 0
                    ? `border-[#2E3133]`
                    : `border-[#C0CED4]`
                } px-[16px] py-[12px]`}
                value={form.firstName}
                onChange={handleOnChange}
              />
            </div>
            <div className="space-y-2 w-full">
              <label htmlFor="last-name" className="text-[14px] font-medium">
                Last Name
              </label>
              <Input
                id="last-name"
                name="lastName"
                type="text"
                placeholder="Type here..."
                className={`w-full shadow-sm min-h-[44px] bg-[#FAFDFF] border ${
                  form.lastName.length > 0
                    ? `border-[#2E3133]`
                    : `border-[#C0CED4]`
                } px-[16px] py-[12px]`}
                value={form.lastName}
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
              type="text"
              placeholder="Type here..."
              className={`w-full shadow-sm min-h-[44px] bg-[#FAFDFF] border ${
                form.email.length > 0 ? `border-[#2E3133]` : `border-[#C0CED4]`
              } px-[16px] py-[12px]`}
              value={form.email}
              onChange={handleOnChange}
            />
          </div>

          <div className="space-y-2 w-full">
            <label htmlFor="topic" className="text-[14px] font-medium">
              Topic
            </label>
            <Select name="subject">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select topic" />
              </SelectTrigger>
              <SelectContent>
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
            <Input
              id="message"
              name="message"
              type="text"
              placeholder="Enter your message here"
              className={`w-full shadow-sm min-h-[64px] bg-[#FAFDFF] border ${
                form.message.length > 0
                  ? `border-[#2E3133]`
                  : `border-[#C0CED4]`
              } px-[16px] py-[12px]`}
              value={form.message}
              onChange={handleOnChange}
            />
          </div>
          <button
            onClick={handleSendMessage}
            className="btn-primary rounded-full min-h-[48px] min-w-[333px] flex flex-row items-center justify-center gap-2"
          >
            <Send
              className="w-[10px] h-[7.5px] sm:w-[18px] sm:h-[13.65px] lg:w-[26px] lg:h-[20px]"
              color={"#fff"}
              fill="#fff"
            />
            <span className="text-[8px] sm:text-[11px] lg:text-[16px]">
              Send us a message
            </span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
