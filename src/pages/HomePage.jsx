import { useContext, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

import Sidebar from "../components/Sidebar";
import { GlobalContext } from "../contexts/global";
import socket from "../config/socket";
import ChatItem from "../components/ChatItem";
import https from "../helpers/https";

export default function HomePage() {
  const { messages, fetchMessages, createMessage, groupId } =
    useContext(GlobalContext);
  const [newMessage, setNewMessage] = useState("");
  const [summaryPopup, setSummaryPopup] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatRef = useRef(null);
  const [aiMessages, setAiMessages] = useState([]);

  useEffect(() => {
    // Listen for socket events
    socket.on("mySocketId", (arg) => {
      console.log(`socketId:`, arg);
    });

    socket.on("handShakeAuth", (arg) => {
      console.log(`handShakeAuth:`, arg);
    });

    // Listen for new messages with the emit matching your server controller
    socket.on("newMessage", (newMsg) => {
      console.log("New message received via newMessage:", newMsg);
      if (groupId) {
        fetchMessages(groupId);
      }
    });

    // Add listener for AI chat responses
    socket.on("chat.verse", (updatedChats) => {
      console.log("AI response received:", updatedChats);

      // Get the latest AI message (last item in the array)
      if (updatedChats && updatedChats.length > 0) {
        const latestMessage = updatedChats[updatedChats.length - 1];

        // Add AI message to the messages array with the correct format
        // and associate it with the current group
        const aiMessage = {
          content: latestMessage.text,
          createdAt: new Date().toISOString(),
          User: { username: "AiChatVerse" },
          isAi: true,
          groupId: groupId, // Associate with current group
        };

        setAiMessages((prev) => [...prev, aiMessage]);
      }
    });

    return () => {
      socket.off("mySocketId");
      socket.off("handShakeAuth");
      socket.off("newMessage");
      socket.off("chat.verse");
    };
  }, [groupId, fetchMessages]);

  // Add a separate effect to handle scrolling when messages change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Function to send a message to the AI
  const sendMessageToAI = async (prompt) => {
    setIsAiLoading(true);
    try {
      const result = await https({
        method: "POST",
        url: "/chats",
        data: {
          text: prompt,
        },
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
          "Content-Type": "application/json",
        },
      });
      console.log("AI Response:", result.data);
      // AI response is handled by the socket event
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupId) {
      toast.error("Please select a group first");
      return;
    }

    if (!newMessage.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    const messageToSend = newMessage.trim();

    // Check if the message starts with @AiChatVerse
    if (messageToSend.startsWith("@AiChatVerse")) {
      // Extract the prompt (everything after @AiChatVerse)
      const aiPrompt = messageToSend.substring("@AiChatVerse".length).trim();

      if (!aiPrompt) {
        toast.warning("Please provide a prompt after @AiChatVerse");
        return;
      }

      try {
        // First send the user's message with the @AiChatVerse prefix
        await createMessage(groupId, messageToSend);
        setNewMessage("");

        // Then send to AI endpoint
        await sendMessageToAI(aiPrompt);
      } catch (error) {
        console.error("Error in AI conversation:", error);
        toast.error("Failed to process AI request");
      }
    } else {
      // Regular message handling
      try {
        await createMessage(groupId, messageToSend);
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);

        // Provide more specific error messages based on the error
        if (error.response) {
          if (error.response.status === 400) {
            toast.error(
              `Bad request: ${
                error.response.data?.message || "Invalid message format"
              }`
            );
          } else if (error.response.status === 401) {
            toast.error("You are not authorized. Please log in again.");
            // Optionally redirect to login
            // navigate("/login");
          } else {
            toast.error(
              `Server error (${error.response.status}): ${
                error.response.data?.message || "Unknown error"
              }`
            );
          }
        } else if (error.request) {
          toast.error("Network error. Please check your connection.");
        } else {
          toast.error(
            "Failed to send message: " + (error.message || "Unknown error")
          );
        }
      }
    }
  };

  return (
    <div className="flex-1 flex flex-row h-screen bg-[#1A1B1E] text-[#E9ECEF]">
      {/* List Online Users */}
      <Sidebar />

      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#30363D] bg-[#20232A] shadow-sm">
          <div className="relative flex items-center space-x-4">
            <div className="flex flex-col leading-tight">
              <div className="text-xl font-medium">
                <span className="text-[#E9ECEF] mr-3 flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Messages
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <button
              className="flex items-center text-xs text-[#9CA3AF] hover:text-[#E9ECEF] transition-colors bg-[#2C3036] py-1 px-3 rounded-full"
              onClick={() => {
                setNewMessage("@AiChatVerse ");
                setTimeout(() => {
                  document.querySelector("input[type='text']").focus();
                }, 100);
              }}
            >
              <svg
                className="w-4 h-4 mr-1 text-blue-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
                <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
                <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
              </svg>
              Ask AI
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div
          id="chats"
          ref={chatRef}
          className="flex flex-col flex-1 space-y-4 p-4 overflow-y-auto bg-[#20232A] scrollbar-thin scrollbar-thumb-[#30363D] scrollbar-track-[#1A1B1E]"
        >
          {/* Combine regular messages and AI messages that belong to the current group */}
          {[...messages, ...aiMessages.filter((msg) => msg.groupId === groupId)]
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map((m, idx) => {
              // More robust way to check if message is from current user
              const currentUserId = parseInt(localStorage.userId);
              const isMyMessage =
                (m.UserId && m.UserId === currentUserId) ||
                (m.SenderId && m.SenderId === currentUserId);

              // Check if this is an AI message
              const isAiMessage =
                m.isAi ||
                m.content?.startsWith("@AiChatVerse") ||
                m.message?.startsWith("@AiChatVerse") ||
                m.User?.username === "AiChatVerse" ||
                m.username === "AiChatVerse";

              return (
                <ChatItem
                  key={`${idx}-${
                    m.id || m.UserId || m.SenderId || "ai-" + idx
                  }`}
                  username={
                    isAiMessage
                      ? "AiChatVerse"
                      : m.User?.username || "Unknown User"
                  }
                  message={m.content || m.message} // Try both content and message fields
                  isMe={isMyMessage}
                  isAi={isAiMessage}
                  createdAt={m.createdAt}
                />
              );
            })}

          {/* AI Loading Indicator */}
          {isAiLoading && (
            <div className="flex items-center space-x-2 p-4 bg-[#2C3036] bg-opacity-60 rounded-lg self-start max-w-md">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm shadow-sm">
                AI
              </div>
              <div className="text-[#E9ECEF] flex items-center">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
                <span className="ml-2 text-sm">AI is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-[#30363D] bg-[#20232A] p-4"
        >
          <div className="flex gap-3 items-center">
            <input
              type="text"
              placeholder={
                groupId
                  ? "Type a message or @AiChatVerse followed by your prompt..."
                  : "Select a group first"
              }
              className="w-full p-3 rounded-lg bg-[#2C3036] text-[#E9ECEF] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] transition-all duration-200 border border-[#30363D]"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
              }}
              disabled={!groupId || isAiLoading}
            />
            <button
              type="submit"
              className={`px-5 py-3 rounded-lg transition-all duration-200 ${
                !groupId || isAiLoading
                  ? "bg-[#4B5563] cursor-not-allowed opacity-50"
                  : "bg-[#4F46E5] hover:bg-[#4338CA] text-white"
              }`}
              disabled={!groupId || isAiLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>

          {/* AI Helper Text */}
          <p className="text-xs text-[#9CA3AF] mt-2 ml-1">
            Tip: Type{" "}
            <span className="text-blue-400 font-medium">@AiChatVerse</span>{" "}
            followed by your question to interact with AI
          </p>
        </form>

        {/* Popup */}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm transition-all duration-300">
            <div className="bg-[#20232A] rounded-xl shadow-2xl p-6 w-11/12 max-w-lg border border-[#30363D] transform transition-all">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#E9ECEF]">
                  Ringkasan AI
                </h2>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-[#9CA3AF] hover:text-white transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <textarea
                className="w-full h-48 p-4 border rounded-lg text-[#E9ECEF] bg-[#2C3036] border-[#30363D] resize-none focus:outline-none focus:ring-1 focus:ring-[#4F46E5]"
                value={summaryPopup}
                readOnly
              />
              <div className="mt-5 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(summaryPopup);
                    toast.success("Copied to clipboard!");
                  }}
                  className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                    <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
                  </svg>
                  Salin
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 bg-[#374151] hover:bg-[#4B5563] text-white rounded-lg transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
