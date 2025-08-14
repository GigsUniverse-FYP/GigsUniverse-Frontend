"use client"

import { usePathname } from "next/navigation"
import HoverSidebar from "@/app/components/employer_components/employer_navigator"
import { useEffect } from "react"
import { ToastContainer } from "react-toastify"

export default function EmployerLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const hideSidebar =
    pathname.startsWith("/dashboard/employer/onboarding") ||
    pathname === "/dashboard/employer/banned"

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
      console.log("WebSocket connected (employer)");
    };

    socket.onclose = () => {
      console.warn("WebSocket closed (employer)");
    };

    socket.onerror = (err) => {
      console.error("WebSocket error (employer)", err);
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
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  )
}
