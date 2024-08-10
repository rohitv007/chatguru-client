import { useEffect, useRef, useState, useContext } from "react";
import axios from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { setMessagesByDate, setMessageTimeFormat } from "../helpers/helpers";
import ChatHeader from "./ChatHeader";
import { ChatContext } from "../context/ChatContext";
import useSocket from "../hooks/useSocket";

// memoized 'SingleChat' component
const SingleChat = () => {
  const [messageContent, setMessageContent] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  // const [error, setError] = useState("");
  const divUnderMessages = useRef();
  const { user } = useAuth();
  const { currentChat } = useContext(ChatContext);
  const { socket, status } = useSocket();

  // console.log("SINGLE CHAT =>", currentChat);
  const chatId = currentChat?._id;

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(`/message/${chatId}`);
        // console.log(data);
        setMessages(data);
      } catch (error) {
        console.log(error);
        // setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {
    if (!socket || status !== "connected") return;

    socket.on("newMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket, status]);

  const sendMessage = async (e) => {
    e.preventDefault();

    if (messageContent.trim()) {
      try {
        const newMessage = {
          chatId,
          content: messageContent,
          file: selectedFile,
        };

        const { data } = await axios.post("/message", newMessage);
        // console.log(data);
        await socket.emit("sendMessage", data);
        setMessageContent("");
      } catch (error) {
        console.log(error);
      }
      console.log("New Message =>", messageContent);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    console.log("Selected file:", file);
  };

  return isLoading ? (
    <div className="h-full bg-slate-50 flex flex-grow justify-center items-center">
      <l-momentum color={"orange"}></l-momentum>
    </div>
  ) : (
    <div className="chat__section h-full bg-slate-50 flex flex-grow relative">
      <ChatHeader chat={currentChat} />
      <div className="contact__chats overflow-auto scrollbar-hide absolute top-16 left-0 right-0 bottom-16 flex flex-col flex-grow">
        {Object.entries(setMessagesByDate(messages)).map(
          ([date, messagesForDate]) => (
            <div key={date}>
              <div className="text-xs font-medium bg-orange-500 bg-clip-padding backdrop-filter backdrop-blur bg-opacity-60 shadow-lg w-max m-auto px-6 py-1 text-center text-white my-6 rounded-full">
                {date}
              </div>
              {messagesForDate.map((message) => (
                <div
                  key={message._id}
                  className={`flex mx-2 my-1 p-1 ${
                    user?.id === message?.sender?._id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={
                      "flex items-end justify-between max-w-full shadow-lg rounded text-gray-50 text-wrap break-words " +
                      (user?.id === message?.sender?._id
                        ? "bg-blue-400"
                        : "bg-gray-400")
                    }
                  >
                    <p className="max-w-96 inline-block p-2 pr-1 whitespace-pre-wrap break-words font-medium text-sm">
                      {message.content}
                    </p>
                    <p className="font-extralight text-[10px] p-1 pr-2 max-w-10">
                      {setMessageTimeFormat(
                        new Date(message.updatedAt).getHours()
                      )}
                      :
                      {setMessageTimeFormat(
                        new Date(message.updatedAt).getMinutes()
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
        <div ref={divUnderMessages}></div>
      </div>
      <div className="w-full absolute bottom-0">
        <form
          encType="multipart/form-data"
          id="messageBox"
          className="w-full flex items-center justify-center bg-gray-600 px-4 py-2"
          onSubmit={sendMessage}
        >
          <label
            htmlFor="fileInput"
            className="flex items-center justify-center mr-2 p-2 rounded-full cursor-not-allowed hover:bg-orange-400"
          >
            <input
              type="file"
              name="fileInput"
              id="fileInput"
              onChange={handleFileChange}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="white"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
              />
            </svg>
          </label>
          <textarea
            form="messageBox"
            className="hide-scrollbar flex-1 h-11 px-4 py-2 rounded-full resize-none text-gray-600 bg-blue-50 outline-none placeholder-gray-600"
            id="textInput"
            name="textInput"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
            autoComplete="off"
            placeholder="Type your message here"
            autoFocus
          />
          <button
            type="submit"
            className="ml-2 p-2 bg-orange-400 hover:bg-orange-500 rounded-full"
            aria-label="Submit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              className="w-6 h-6"
            >
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SingleChat;
