"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { useInView } from "react-intersection-observer"

interface TopicItem {
  id: string
  title: string
  icon: React.ReactNode
  description: string
}

interface LearnSidebarProps {
  topics: TopicItem[]
  activeTab: string
  setActiveTab: (tab: string) => void
}

function SidebarContent({ topics, activeTab, setActiveTab }: LearnSidebarProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <div className="flex-1 flex flex-col h-full" ref={ref}>
      <div className="p-6 pb-2">
        <h2 className="text-xl font-semibold text-gray-900">Endgame Basics</h2>
        <p className="text-[14px] --sm text-muted-foreground mt-1">Master essential endgame techniques</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 py-2">
          {topics.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-[14px] --sm transition-all duration-200 mb-1
                ${
                  activeTab === item.id
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className={`${activeTab === item.id ? "text-blue-600" : "text-gray-500"}`}>{item.icon}</div>
                <div className="flex-1">
                  <div className={`${activeTab === item.id ? "font-medium" : ""}`}>{item.title}</div>
                  <div className="text-[14px] --xs text-muted-foreground mt-0.5">{item.description}</div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export function LearnSidebar({ topics, activeTab, setActiveTab }: LearnSidebarProps) {
  return (
    <>
      <div className="lg:hidden mb-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full bg-white hover:bg-gray-100">
              <Menu className="mr-2 h-4 w-4" />
              Select Topic
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SidebarContent topics={topics} activeTab={activeTab} setActiveTab={setActiveTab} />
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden lg:block">
        <Card className="sticky top-4 h-[calc(100vh-8rem)] flex flex-col bg-white">
          <CardContent className="p-0 flex flex-col h-full">
            <SidebarContent topics={topics} activeTab={activeTab} setActiveTab={setActiveTab} />
          </CardContent>
        </Card>
      </div>
    </>
  )
} 
