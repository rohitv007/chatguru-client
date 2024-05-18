import { useEffect, useRef, useState } from "react";

const useWebSocket = () => {
  const [socket, setSocket] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const statusRef = useRef("connecting");

  const serverUrl = import.meta.env.APP_WS_SERVER_URL;
  console.log("URL -", serverUrl);

  useEffect(() => {
    const ws = new WebSocket(serverUrl);

    ws.addEventListener("open", () => {
      // console.log("open");
      statusRef.current = "open";
    }); // OPEN

    ws.addEventListener("error", () => {
      // console.log("error in ws client");
      statusRef.current = "error";
    }); //ERROR

    ws.addEventListener("close", () => {
      // console.log("close");
      statusRef.current = "close";
    }); // CLOSE

    ws.addEventListener("message", (e) => {
      // console.log("event data", e.data);
      setMessageData(e.data);
    }); // MESSAGE

    setSocket(ws);

    return () => {
      if (ws.readyState === 1) ws.close();
    };
  }, [serverUrl]);

  return { socket, messageData, status: statusRef.current };
};

export default useWebSocket;
