import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
const SOCKET_URL = import.meta.env.APP_SERVER_URL;

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState('connecting');

  useEffect(() => {
    const ws = io(SOCKET_URL, {
      withCredentials: true,
    });

    ws.on('connect', () => {
      setStatus('connected');
      // console.log(`Connected to server: ${ws.id}`);
    });

    ws.on('disconnect', () => {
      setStatus('disconnected');
      // console.log('Disconnected from server');
    });

    ws.on('connect_error', (err) => {
      setStatus('error');
      console.error('Connection error:', err);
    });

    setSocket(ws);

    return () => {
      ['connect', 'disconnect', 'connect_error'].forEach((event) =>
        ws.off(event),
      );
      ws.disconnect();
    };
  }, []);

  return { socket, status };
};

export default useSocket;
