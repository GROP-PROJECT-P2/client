import "./ChatItem.css";

export default function ChatItem({
  isMe,
  username,
  message,
  isAi = false,
  createdAt,
}) {
  const formatDate = (formatDate) => {
    const date = new Date(formatDate);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const isThisWeek = (() => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 6);
      return date >= oneWeekAgo;
    })();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (isYesterday) {
      return "Yesterday";
    } else if (isThisWeek) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString();
    }
  };

  // For AI messages, remove the @AiChatVerse prefix before displaying
  const displayMessage =
    isAi && message?.startsWith("@AiChatVerse")
      ? message.substring("@AiChatVerse".length).trim()
      : message;

  return (
    <div className="chat-message my-2">
      <div className={`flex items-end ${isMe ? "justify-end" : ""}`}>
        {/* Avatar for sender (not me) */}
        {!isMe && (
          <div
            className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-sm mr-2 ${
              isAi
                ? "bg-gradient-to-br from-blue-500 to-purple-600"
                : "bg-gradient-to-br from-gray-500 to-gray-600"
            }`}
          >
            {username[0]}
          </div>
        )}

        <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
          <div
            className={`max-w-xs sm:max-w-md overflow-hidden ${
              isMe ? "chat-message-container-me" : "chat-message-container"
            }`}
          >
            <div
              className={`px-4 py-3 rounded-2xl shadow-sm ${
                isMe
                  ? "bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-white"
                  : isAi
                  ? "bg-gradient-to-r from-[#1E40AF] to-[#3B82F6] text-white border border-blue-300"
                  : "bg-[#2C3036] text-[#E9ECEF] border border-[#30363D]"
              }`}
            >
              <p
                className={`text-xs font-semibold mb-1 ${
                  isMe
                    ? "text-[#E9ECEF]"
                    : isAi
                    ? "text-blue-200 flex items-center"
                    : "text-[#A5B4FC]"
                }`}
              >
                {isAi ? (
                  <>
                    AiChatVerse
                    <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-blue-700 text-blue-100">
                      AI
                    </span>
                  </>
                ) : (
                  username
                )}
              </p>
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {displayMessage}
              </p>
            </div>
            <p className="text-xs text-[#9CA3AF] mt-1 px-1">
              {formatDate(createdAt)}
            </p>
          </div>
        </div>

        {/* Avatar for me */}
        {isMe && (
          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#6366F1] flex items-center justify-center text-white font-medium text-sm shadow-sm ml-2">
            {username[0]}
          </div>
        )}
      </div>
    </div>
  );
}
