"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mail,
  Phone,
  MapPin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  MessageCircle,
  Clock,
  Users,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import emailjs from "@emailjs/browser";
import { subjectForm } from "../store/constants";
import { toast } from "sonner";

export default function ContactPage() {
  const form = React.useRef<any|HTMLFormElement>(null);

  const sendToEmail = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const { current } = form;
    emailjs
      .sendForm("service_kj7oisp", "template_zc6g14o", current, {
        publicKey: "jTUGjAIqTwezcSh2k",
      })
      .then(
        () => {
          toast.success("Form send successfully!");
          form.current?.reset()

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
    <>
      <SiteHeader />
      <section className="relative w-full py-12 md:py-24 lg:py-32">
        <div className="absolute inset-0 dot-pattern opacity-[0.4]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white"></div>
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
              Get in Touch
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-600 dark:text-gray-300 md:text-xl">
              We&apos;re here to help and answer any question you might have. We
              look forward to hearing from you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-primary/10 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form ref={form} onSubmit={sendToEmail} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-sm font-medium">
                        Subject
                      </label>
                      <Select name="subject">
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a subject" />
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
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Your message"
                        className="min-h-[120px] w-full"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="h-full border-primary/10 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 mt-1 text-primary" />
                    <div>
                      <p className="font-semibold">Address</p>
                      <p className="text-sm text-muted-foreground">
                        Via Molinazzo 2, 6900 Lugano, Switzerland
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 mt-1 text-primary" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-sm text-muted-foreground">
                        contact@aroundchess.com
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 mt-1 text-primary" />
                    <div>
                      <p className="font-semibold">Phone</p>
                      <p className="text-sm text-muted-foreground">
                        +41 91 291 30 22
                      </p>
                    </div>
                  </div>
                  <div className="pt-4">
                    <p className="font-semibold mb-2">Follow Us</p>
                    <div className="flex space-x-4">
                      <Link
                        href="#"
                        className="text-gray-400 hover:text-primary"
                      >
                        <span className="sr-only">Facebook</span>
                        <Facebook className="h-6 w-6" />
                      </Link>
                      <Link
                        href="#"
                        className="text-gray-400 hover:text-primary"
                      >
                        <span className="sr-only">Twitter</span>
                        <Twitter className="h-6 w-6" />
                      </Link>
                      <Link
                        href="#"
                        className="text-gray-400 hover:text-primary"
                      >
                        <span className="sr-only">Instagram</span>
                        <Instagram className="h-6 w-6" />
                      </Link>
                      <Link
                        href="#"
                        className="text-gray-400 hover:text-primary"
                      >
                        <span className="sr-only">YouTube</span>
                        <Youtube className="h-6 w-6" />
                      </Link>
                      <Link
                        href="#"
                        className="text-gray-400 hover:text-primary"
                      >
                        <span className="sr-only">LinkedIn</span>
                        <Linkedin className="h-6 w-6" />
                      </Link>
                    </div>
                  </div>
                  <div className="pt-4">
                    <p className="font-semibold mb-2">Office Hours</p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                      <p>Saturday: 10:00 AM - 2:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
            Why Choose Around Chess?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<MessageCircle className="w-10 h-10" />}
              title="24/7 Support"
              description="Our dedicated team is always ready to assist you with any questions or concerns."
            />
            <FeatureCard
              icon={<Clock className="w-10 h-10" />}
              title="Quick Response Time"
              description="We pride ourselves on our fast and efficient customer service."
            />
            <FeatureCard
              icon={<Users className="w-10 h-10" />}
              title="Community-Driven"
              description="Join a vibrant community of chess enthusiasts and learn from each other."
            />
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-t from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible className="w-full mx-auto">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                How quickly can I expect a response to my inquiry?
              </AccordionTrigger>
              <AccordionContent>
                We strive to respond to all inquiries within 24 hours. For
                urgent matters, our support team is available via live chat
                during business hours.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                Can I request a personalized demo of the AroundChess?
              </AccordionTrigger>
              <AccordionContent>
                We offer personalized demos for individuals and organizations.
                Please contact us to schedule a demo tailored to your specific
                needs and interests.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Do you offer support in languages other than English?
              </AccordionTrigger>
              <AccordionContent>
                Yes, we provide support in several languages including Spanish,
                French, German, and Italian. Please specify your preferred
                language when contacting us.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                How can I report a bug or suggest a new feature?
              </AccordionTrigger>
              <AccordionContent>
                We welcome your feedback! You can report bugs or suggest new
                features through our contact form. Select &quot;Bug Report&quot;
                or &quot;Feature Request&quot; in the subject dropdown to ensure
                it reaches the right team.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <CTASection />
      <SiteFooter />
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/10"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">
        {title}
      </h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}

function CTASection() {
  return (
    <section className="w-full py-8 sm:py-16 lg:py-24 bg-gradient">
      <div className="container px-4 md:px-6 mx-auto max-w-[90rem]">
        <motion.div
          className="bg-primary rounded-3xl overflow-hidden shadow-2xl relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          {/* Add decorative background elements */}
          <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse-slow"></div>
          <div className="absolute bottom-0 right-1/4 w-[250px] h-[250px] bg-purple-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse-slow"></div>

          <div className="px-6 py-24 sm:px-12 sm:py-32 lg:px-16 relative z-10">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to Elevate Your Chess Game?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-200">
                Join thousands of players who are already benefiting from our
                AI-powered analysis.
              </p>
              <motion.div
                className="mt-10 flex items-center justify-center gap-x-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100"
                >
                  <Link href="/register">Get Started Now →</Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
