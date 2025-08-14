"use client"

import { useEffect } from "react"
import { ToastContainer } from "react-toastify"
import HoverSidebar from "@/app/components/admin_components/admin_navigator"
import { usePathname } from "next/navigation"


export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/^https?:\/\//, '')

  const hideSidebar =
    pathname.startsWith("/dashboard/admin/profile-setup")

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
        console.log("WebSocket connected (admin)");
      };

      socket.onclose = () => {
        console.warn("WebSocket closed (admin)");
      };

      socket.onerror = (err) => {
        console.error("WebSocket error (admin)", err);
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
