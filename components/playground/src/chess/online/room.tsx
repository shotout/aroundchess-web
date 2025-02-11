"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Room() {
  const [roomId, setRoomId] = useState("")
  const router = useRouter()

  const handleJoinRoom = async () => {
    if (!roomId.trim()) return
    router.push(`/playground/online-multiplayer/room/${roomId}`)
  }

  const handleCreateRoom = async () => {
    router.push(`/playground/online-multiplayer/room/new`)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <Button onClick={handleJoinRoom}>Join</Button>
      </div>
      <div className="text-center">
        <span className="text-sm">or</span>
      </div>
      <Button onClick={handleCreateRoom} className="w-full">
        Create New Room
      </Button>
    </div>
  )
} 