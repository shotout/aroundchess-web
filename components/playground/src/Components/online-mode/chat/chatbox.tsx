"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { Input } from "../../../Components/ui/input";
import useStore from "../../../lib/hooks/useStore";
import useChatStore from "../../../store/useChatStore";
import { pusherClient } from "../../../lib/pusher";
import { sendMessage } from "../../../lib/db/chat/chat-server";
import { ChatMessage } from "./message";
import { Button } from "../../../Components/ui/button";

export default function Chat({
  playerId,
  roomId,
}: {
  playerId: string;
  roomId: string;
}) {
  const [message, setMessage] = useState("");
  const chatStore = useStore(useChatStore, (state) => state);
  const { isOpen, setIsOpen } = useChatStore((state) => state);

  const {
    messages,
    addMessage,
    setRoomId,
    roomId: chatRoomid,
  } = chatStore! || {
    messages: [],
    setRoomId() {},
    addMessage: () => {},
  };

  useEffect(() => {
    if (isOpen && chatRoomid) {
      setRoomId(chatRoomid);
      
      const channel = pusherClient.subscribe(`chat-${chatRoomid}`);
      
      return () => {
        pusherClient.unsubscribe(`chat-${chatRoomid}`);
      };
    }
  }, [isOpen, chatRoomid, setRoomId]);

  return (
    <>
      <div className="relative z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 relative"
          variant="ghost"
        >
          <MessageSquare />
          {messages && messages.length > 0 && (
            <span className="absolute top-1 right-1 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
          )}
        </Button>
        <div
          className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 ${
            isOpen
              ? "-translate-y-20"
              : "translate-y-[120%] max-sm:translate-y-[100%]"
          } bg-white dark:bg-gray-800 w-[340px] sm:w-[600px] shadow-lg rounded-lg transition-transform duration-300`}
        >
          <div className="p-4 border-b">
            <h2 className="text-lg font-bold">Chat</h2>
          </div>
          <div
            className="p-4 overflow-y-auto no-scrollbar h-96 max-sm:h-64"
            ref={(el) => {
              if (el) {
                el.scrollTop = el.scrollHeight;
              }
            }}
          >
            {messages && messages.length > 0 ? (
              <ChatMessage messages={messages} playerId={playerId} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span>No messages yet</span>
              </div>
            )}
          </div>
          <div className="p-4 flex gap-2 items-center">
            <Input
              className="dark:border-gray-200"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              className="mt-0 w-1/4"
              onClick={async () => {
                await sendMessage(roomId, message, playerId);
                setMessage("");
              }}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
