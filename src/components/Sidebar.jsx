import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { GlobalContext } from "../contexts/global";
import socket from "../config/socket";
import "./Sidebar.css";
import https from "../helpers/https";
import { toast } from "react-toastify";
// import socket from "../config/socket";

export default function Sidebar() {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const navigate = useNavigate();

  const { data, fetchData, setGroupIdHandler, groupId } =
    useContext(GlobalContext);
  const { messages, fetchMessages } = useContext(GlobalContext);

  // useEffect(() => {
  //   socket.on("online:users", (arg) => {
  //     setOnlineUsers(arg);
  //   });

  //   return () => {
  //     socket.off("online:users");
  //   };
  // }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const [showDialog, setShowDialog] = useState(false);
  const [showJoinDialog, setShowJoinDialog] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [code, setCode] = useState("");

  // Dialog open/close handlers
  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

  const openJoinDialog = () => setShowJoinDialog(true);
  const closeJoinDialog = () => setShowJoinDialog(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await https({
        method: "POST",
        url: "/groups",
        data: {
          name: groupName,
        },
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      toast.success("Group created successfully");
      setGroupName("");
      fetchData();
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
    closeDialog();
  };

  const handleJoin = async (e) => {
    e.preventDefault();

    try {
      const result = await https({
        method: "GET",
        url: `/groups/join/${code}`,
        headers: {
          Authorization: `Bearer ${localStorage.access_token}`,
        },
      });
      toast.success("Group joined successfully");
      setCode("");
      fetchData();
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred. Please try again.");
      }
    }
    closeJoinDialog();
  };

  return (
    <div className="w-64 md:w-96 border-r border-[#30363D] flex flex-col h-full bg-[#20232A]">
      <div className="border-b border-[#30363D] p-4 flex flex-row justify-between items-center">
        <h1 className="text-2xl font-bold text-[#E9ECEF]">Chat Groups</h1>
        <div className="flex gap-2">
          <button
            onClick={openDialog}
            className="p-2 bg-[#4F46E5] text-white rounded-md hover:bg-[#4338CA] transition-colors shadow-sm"
            title="Create new group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            className="p-2 bg-[#10B981] text-white rounded-md hover:bg-[#059669] transition-colors shadow-sm"
            onClick={openJoinDialog}
            title="Join a group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M11 6a3 3 0 11-6 0 3 3 0 016 0zM14 17a6 6 0 00-12 0h12z" />
              <path d="M13 8a1 1 0 100 2h4a1 1 0 100-2h-4z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 py-2">
        {data.length === 0 ? (
          <div className="text-center py-8 text-[#9CA3AF] px-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-[#4B5563] mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
              />
            </svg>
            <p>No groups yet. Create or join a group to start chatting.</p>
          </div>
        ) : (
          <ul>
            {data.map((group) => {
              const isActive = groupId === group.Room.id;
              return (
                <li
                  onClick={() => {
                    fetchMessages(group.Room.id);
                    socket.emit("join_group", group.Room.id);
                    console.log(`Joining group: ${group.Room.id}`);
                    localStorage.setItem("currentGroupId", group.Room.id);
                    setGroupIdHandler(group.Room.id);
                  }}
                  className={`mx-2 mb-1 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#2C3036] ${
                    isActive
                      ? "bg-[#2C3036] shadow-sm border-l-4 border-[#4F46E5]"
                      : "border-l-4 border-transparent"
                  }`}
                  key={group.Room.id}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-[#4F46E5] to-[#805AD5] flex items-center justify-center text-white font-semibold">
                      {group.Room.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="ml-3 flex-1">
                      <p
                        className={`text-base font-medium ${
                          isActive ? "text-white" : "text-[#E9ECEF]"
                        }`}
                      >
                        {group.Room.name}
                      </p>
                      <p className="text-xs text-[#9CA3AF] flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Code: {group.Room.inviteCode}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="p-4 border-t border-[#30363D]">
        <button
          onClick={() => {
            navigate("/login");
            toast.success("Logout successful");
            localStorage.removeItem("access_token");
            localStorage.removeItem("userId");
          }}
          className="w-full py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414a1 1 0 00-.293-.707L11.414 2.414A1 1 0 0010.707 2H4a1 1 0 00-1 1zm0 2h7v5h5v7H3V5z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M11 10.414l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414L9 10.414V3a1 1 0 112 0v7.414z"
              clipRule="evenodd"
            />
          </svg>
          Logout
        </button>
      </div>

      {/* Modals for creating and joining groups - keep the existing modal code but update styling */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#20232A] rounded-xl shadow-2xl p-6 w-full max-w-md border border-[#30363D] transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#E9ECEF]">
                Create New Group
              </h2>
              <button
                onClick={closeDialog}
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

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-[#E9ECEF] text-sm font-medium mb-2"
                  htmlFor="groupName"
                >
                  Group Name
                </label>
                <input
                  id="groupName"
                  type="text"
                  placeholder="Enter a name for your group"
                  className="w-full p-3 rounded-lg bg-[#2C3036] text-[#E9ECEF] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] border border-[#30363D]"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="px-4 py-2 bg-[#374151] hover:bg-[#4B5563] text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-lg transition-colors"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Group dialog with similar styling */}
      {showJoinDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#20232A] rounded-xl shadow-2xl p-6 w-full max-w-md border border-[#30363D] transform transition-all">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#E9ECEF]">Join a Group</h2>
              <button
                onClick={closeJoinDialog}
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
            <form onSubmit={handleJoin}>
              <div className="mb-4">
                <label
                  className="block text-[#E9ECEF] text-sm font-medium mb-2"
                  htmlFor="groupCode"
                >
                  Invite Code
                </label>
                <input
                  id="groupCode"
                  type="text"
                  placeholder="Enter group invite code"
                  className="w-full p-3 rounded-lg bg-[#2C3036] text-[#E9ECEF] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#4F46E5] border border-[#30363D]"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  type="button"
                  onClick={closeJoinDialog}
                  className="px-4 py-2 bg-[#374151] hover:bg-[#4B5563] text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg transition-colors"
                >
                  Join Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
