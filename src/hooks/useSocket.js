import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const useSocket = () => {
  const wsURL = import.meta.env.APP_HTTP_SERVER_URL;
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState("connecting");

  // console.log(wsURL);

  useEffect(() => {
    const ws = io(wsURL);

    ws.on("connect", () => {
      setStatus("connected");
      console.log(`Connected to server: ${ws.id}`);
    });

    setSocket(ws);

    return () => {
      ws.disconnect();
    };
  }, [wsURL]);

  return { socket, status };
};

export default useSocket;
