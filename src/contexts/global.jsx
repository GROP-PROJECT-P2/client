import { createContext, useState } from "react";
import https from "../helpers/https";

export const GlobalContext = createContext({
  data: [],
  messages: [],
  groupId: 0,
});

export function GlobalProvider(props) {
  const [groups, setGroups] = useState([]);
  async function fetchData() {
    const result = await https({
      method: "GET",
      url: "/groups",
      headers: {
        Authorization: `Bearer ${localStorage.access_token}`,
      },
    });
    const response = result.data;
    setGroups(response);
  }

  // groupId
  const [groupId, setGroupId] = useState(null);
  function setGroupIdHandler(id) {
    setGroupId(id);
  }

  // messages
  const [messages, setMessages] = useState([]);
  async function fetchMessages(id) {
    const result = await https({
      method: "GET",
      url: `/groups/${id}`,
      headers: {
        Authorization: `Bearer ${localStorage.access_token}`,
      },
    });
    const response = result.data;

    // Add this debugging log to see the exact structure
    console.log("Messages from server:", JSON.stringify(response, null, 2));

    setMessages(response);
  }

  // create message
  async function createMessage(id, message) {
    try {
      if (!id) {
        throw new Error("Group ID is required");
      }

      if (!message || message.trim() === "") {
        throw new Error("Message cannot be empty");
      }

      console.log("Sending message to group:", id, "Message:", message);

      // Update to match exactly what the server controller expects
      const result = await https({
        method: "POST",
        url: `/groups/${id}`,
        data: {
          content: message, // Server expects 'content' based on your controller code
        },
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Message sent successfully:", result.data);

      // DON'T fetch messages here - wait for the socket event instead
      // This prevents double-fetching

      return result;
    } catch (error) {
      console.error("Error in createMessage:", error);
      console.error("Error response:", error.response?.data);
      console.error("Status code:", error.response?.status);
      throw error;
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        data: groups,
        fetchData,
        messages: messages,
        fetchMessages,
        createMessage,
        groupId,
        setGroupIdHandler,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
}
