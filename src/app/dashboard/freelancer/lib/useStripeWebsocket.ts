import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Client, IMessage } from "@stomp/stompjs";

const useStripeWebSocket = (
  jwtToken: string, 
  onStatusUpdate: (payload: { stripeStatus: string; completedPaymentSetup : boolean; payoutsEnabled: boolean }) => void
) => {
  useEffect(() => {
    if (!jwtToken) return;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const socket = new SockJS(`${backendUrl}/ws/stripe`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${jwtToken}`, 
      },
      onConnect: () => {
        console.log("Connected to WebSocket");

        stompClient.subscribe("/user/queue/stripe-status", (message: IMessage) => {
          const payload = JSON.parse(message.body);
          console.log("WebSocket: Stripe status update", payload);
          onStatusUpdate(payload);
        });
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [jwtToken, onStatusUpdate]);
};

export default useStripeWebSocket;
