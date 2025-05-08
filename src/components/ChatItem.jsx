import './ChatItem.css';
export default function ChatItem({ isMe, username, message, createdAt }) {
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
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (isYesterday) {
      return "Yesterday";
    } else if (isThisWeek) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString();
    }
  }

  return (
    <>
      <div class="chat-message">
        <div class={`flex items-end ${isMe ? "justify-end" : ""}`}>
          <div
            class={`flex flex-col space-y-2 text-sm max-w-xs sm:max-w-xl mx-2 order-2 ${isMe ? "items-end order-1" : "items-start order-2"
              }`}
          >

            <div className={`${isMe
              ? "chat-message-container-me"
              : "chat-message-container"
              }`}>

              <span
                class={`px-4 py-2 rounded-lg inline-block ${isMe
                  ? "rounded-br-none bg-blue-600 text-white"
                  : "rounded-bl-none bg-gray-300  text-gray-600"
                  }`}
              ><p className={`${isMe
                ? "message-title-me"
                : "message-title"
                }`}>{username}</p>
                {message}
              </span>
              <small className="chat-date">{formatDate(createdAt)}</small>
            </div>

          </div>
          <div
            class={`relative inline-flex items-center justify-center w-6 h-6 sm:w-12 sm:h-12 overflow-hidden rounded-full self-center order-1 ${isMe
              ? "text-white bg-blue-600 order-2"
              : "text-white bg-gray-600 order-1"
              } `}
          >
            <span className="font-medium">{username[0]}</span>
          </div>
        </div>
      </div>
    </>
  );
}
