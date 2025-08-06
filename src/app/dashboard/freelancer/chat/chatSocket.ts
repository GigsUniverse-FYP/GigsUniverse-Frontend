// lib/chatSocket.ts
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";


const backendUrl = process.env.REACT_APP_BACKEND_URL;

const SOCKET_URL = backendUrl + "/ws/chat"; // connection to the stomp private chat section

let stompClient: Client | null = null;

export function connectStomp(chatId: string, onMessage: (msg: any) => void) {
  stompClient = new Client({
    webSocketFactory: () => new SockJS(SOCKET_URL),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("Connected to WebSocket");
      stompClient?.subscribe(`/topic/${chatId}`, (message) => {
        onMessage(JSON.parse(message.body));
      });
    },
    onStompError: (frame) => {
      console.error("STOMP error", frame);
    },
  });

  stompClient.activate();
}

export function sendMessage(message: any) {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/chat-send",
      body: JSON.stringify(message),
    });
  }
}

export function disconnectStomp() {
  stompClient?.deactivate();
}
