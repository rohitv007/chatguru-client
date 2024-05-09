import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import useWebSocket from "../hooks/useWebSocket";
import { useAuth } from "../hooks/useAuth";
import { uniqBy } from "lodash";
import axios from "../api/axios";

const UserChats = ({ currUserId, data }) => {
  const { user } = useAuth();
  const { socket } = useWebSocket(import.meta.env.VITE_SERVER_URL);
  const messageRef = useRef(null);
  const divUnderMessages = useRef();

  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    // console.log(data);
    const parsedMessage = JSON.parse(data);
    // console.log(parsedMessage);
    if (parsedMessage?.text) {
      setMessages((prev) => [...prev, { ...parsedMessage }]);
    }
  }, [data]);

  useEffect(() => {
    const div = divUnderMessages.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  useEffect(() => {
    const getSelectedUserMessages = async () => {
      const res = await axios.get(`/messages/${currUserId}`);
      // console.log(res.data);
      setMessages(res.data);
    };
    if (currUserId) {
      getSelectedUserMessages();
    }
  }, [currUserId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    console.log("submitting");

    if (messageRef.current.value.trim() !== "" || file !== null) {
      // creating newMessage object to be send
      let newMessage = {
        messagePayload: {
          recipient: currUserId,
          text: messageRef.current.value.trim(),
          file: file ? file.name : null,
        },
      };

      // console.log(newMessage);
      await socket?.send(JSON.stringify(newMessage));

      if (file) {
        const res = await axios.get(`/messages/${currUserId}`);
        setMessages(res.data);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: user?.id,
            recipient: currUserId,
            text: newMessage?.messagePayload?.text.trim(),
            _id: Date.now(),
          },
        ]);
      }
      console.log(`Message sent - ${JSON.stringify(newMessage)}`);
      messageRef.current.value = "";
      setFile(null);
    }
  };

  const uniqueMessages = uniqBy(messages, "_id");
  // console.log(uniqueMessages);

  return (
    <div className="chat__section relative h-full bg-slate-100 w-2/3 lg:w-3/4 xl:w-4/5">
      <div className="contact__chats overflow-auto scrollbar-hide absolute top-0 left-0 right-0 bottom-16 flex flex-col flex-grow">
        {/* chat-section of the selected user */}
        {uniqueMessages.map((message) => {
          // console.log(message);
          return (
            <div
              key={message._id}
              className={`mx-1 px-1 my-0.5 py-0.5 text-wrap break-words ${
                user?.id === message?.sender ? "text-right" : "text-left"
              }`}
            >
              <p
                className={
                  "max-w-96 inline-block p-2 rounded-md font-medium " +
                  (user?.id === message?.sender
                    ? "bg-blue-400 text-white"
                    : "bg-gray-400 text-white")
                }
              >
                {message.text}
              </p>
            </div>
          );
        })}
        <div ref={divUnderMessages}></div>
      </div>
      {/* input box to send message */}
      <div className="w-full absolute bottom-0">
        <form
          encType="multipart/form-data"
          id="messageBox"
          className="bg-gray-600 flex items-center justify-center"
          onSubmit={sendMessage}
        >
          {/* file input */}
          <label
            htmlFor="file"
            className="m-2 mr-0 py-2 px-4 w-auto bg-orange-400 hover:bg-orange-500 text-white rounded-sm cursor-pointer"
          >
            <input
              type="file"
              name="file"
              id="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
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
            className="w-full h-10 m-2 px-3 py-1.5 rounded-lg resize-none border-none outline-none align-middle items-center justify-center overflow-auto scrollbar-hide"
            id="msgInput"
            name="msgInput"
            ref={messageRef}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(e);
              }
            }}
            autoComplete="off"
            autoFocus
            placeholder="Type your message here..."
          />
          <button
            type="submit"
            className="m-2 ml-0 py-2 px-4 w-auto bg-orange-400 hover:bg-orange-500 text-white rounded-sm"
            aria-label="Submit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
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

export default UserChats;

UserChats.propTypes = {
  currUserId: PropTypes.node.isRequired,
  data: PropTypes.node,
};
