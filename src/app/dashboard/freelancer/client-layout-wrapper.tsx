"use client"

import { usePathname } from "next/navigation"
import HoverSidebar from "@/app/components/freelancer_components/freelancer_navigator"
import { useEffect } from "react"

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const hideSidebar =
    pathname.startsWith("/dashboard/freelancer/onboarding") ||
    pathname === "/dashboard/freelancer/banned"

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/^https?:\/\//, '')

  useEffect(() => {
    const socket = new WebSocket("wss://" + backendUrl + "/ws/online-status");
    let isConnected = false;

    const pingInterval = setInterval(() => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send("ping");
      }
    }, 10000);

    socket.onopen = () => {
      isConnected = true;
      console.log("WebSocket connected (freelancer)");
    };

    socket.onclose = () => {
      console.warn("WebSocket closed (freelancer)");
    };

    socket.onerror = (err) => {
      console.error("WebSocket error (freelancer)", err);
    };

    return () => {
      clearInterval(pingInterval);
      if (socket.readyState === 1) {
        socket.close();
      }
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {!hideSidebar && <HoverSidebar />}
      <div className={`flex-1 flex flex-col ${!hideSidebar ? "ml-20" : ""}`}>
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  )
}
