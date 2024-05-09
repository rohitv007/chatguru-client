import { useEffect, useRef, useState } from "react";

const useWebSocket = (url) => {
  const [socket, setSocket] = useState(null);
  const [messageData, setMessageData] = useState(null);
  const statusRef = useRef("connecting");

  // console.log(window.location.protocol);
  const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
  // console.log(wsProtocol);

  const domain = url.split("://")[1];

  const serverUrl = `${wsProtocol}://${domain}`;
  // console.log("URL -", serverUrl);

  useEffect(() => {
    const ws = new WebSocket(serverUrl);

    ws.addEventListener("open", () => (statusRef.current = "open")); // OPEN

    ws.addEventListener("error", () => (statusRef.current = "error")); //ERROR

    ws.addEventListener("close", () => (statusRef.current = "close")); // CLOSE

    ws.addEventListener("message", (e) => {
      // console.log(e);
      setMessageData(e.data);
    }); // MESSAGE

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [serverUrl]);

  return { socket, messageData, status: statusRef.current };
};

export default useWebSocket;
