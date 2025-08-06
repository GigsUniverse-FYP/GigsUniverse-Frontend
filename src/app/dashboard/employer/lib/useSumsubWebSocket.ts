import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";

const useSumsubWebSocket = (
  jwtToken: string, 
  onStatusUpdate: (payload: { status: string; isDuplicate: boolean }) => void
) => {
  useEffect(() => {
    if (!jwtToken) return;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const socket = new SockJS(`${backendUrl}/ws/sumsub`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${jwtToken}`, 
      },
      onConnect: () => {
        console.log("Connected to WebSocket");

        stompClient.subscribe("/user/queue/sumsub-status", (message: IMessage) => {
          const payload = JSON.parse(message.body);
          console.log("WebSocket: Sumsub status update", payload);
          if (payload.status) {
            onStatusUpdate(payload);
          }
        });
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [jwtToken, onStatusUpdate]);
};

export default useSumsubWebSocket;
