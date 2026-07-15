import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

interface SocketContextProps {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextProps>({ socket: null, isConnected: false });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Only connect socket if user is logged in
    if (!isAuthenticated) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const socketUrl =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const socketInstance = io(socketUrl, {
  auth: { token: localStorage.getItem("token") },
  transports: ["websocket", "polling"],
  autoConnect: true,
});

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Socket.IO Connected to Server');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket.IO Disconnected from Server');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
