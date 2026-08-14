"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Pencil } from "lucide-react"

interface ComputerPlayerNameProps {
  className?: string
}

export function ComputerPlayerName({ className }: ComputerPlayerNameProps) {
  const [playerName, setPlayerName] = useState("You")
  const [isEditing, setIsEditing] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedName = localStorage.getItem("computerPlayerName")
    if (savedName) {
      setPlayerName(savedName)
    }

    const handleNameChange = (e: CustomEvent<{ name: string }>) => {
      setPlayerName(e.detail.name)
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "computerPlayerName") {
        if (!e.newValue) {
          setPlayerName("You")
        }
      }
    }

    window.addEventListener('computerPlayerNameChange', handleNameChange as EventListener)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('computerPlayerNameChange', handleNameChange as EventListener)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const handleNameChange = (tempName: string) => {
    if (!tempName.trim()) return
    setPlayerName(tempName)
    localStorage.setItem("computerPlayerName", tempName)
    window.dispatchEvent(new CustomEvent('computerPlayerNameChange', { 
      detail: { name: tempName } 
    }))
  }

  const handleDoubleClick = () => {
    setIsEditing(true)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 0)
  }

  const handleBlur = () => {
    setIsEditing(false)
    setIsHovered(false)
    if (inputRef.current?.value) {
      handleNameChange(inputRef.current.value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur()
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
      setIsHovered(false)
    }
  }

  return (
    <div 
      className="flex items-center gap-1.5 group/name"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={cn(
          "h-8 min-w-[2rem] px-3 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md",
          "hover:from-blue-600 hover:to-indigo-700 transition-all duration-200",
          className
        )}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            defaultValue={playerName}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-white text-[14px] --sm font-medium text-center focus:outline-none"
            maxLength={20}
          />
        ) : (
          <div 
            className="w-full flex items-center justify-center"
            onDoubleClick={handleDoubleClick}
          >
            <span className="text-white text-[14px] --sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
              {playerName}
            </span>
          </div>
        )}
      </div>
      <Pencil 
        className={cn(
          "w-3.5 h-3.5 text-gray-400 transition-all duration-200",
          isHovered && "text-indigo-500"
        )} 
      />
    </div>
  )
}
