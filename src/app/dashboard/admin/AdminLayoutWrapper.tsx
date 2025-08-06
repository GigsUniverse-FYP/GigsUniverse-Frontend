"use client"

// import HoverSidebar from "@/app/components/freelancer_components/admin_navigator"
import { useEffect } from "react"

export default function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {

  const backEndUrl = process.env.NEXT_PUBLIC_BACKEND_URL 

  useEffect(() => {
    const socket = new WebSocket("wss://" + backEndUrl + "/ws/online-status")

    socket.onopen = () => {
      socket.send("ping")
    }

    socket.onclose = () => {
      console.log("WebSocket disconnected (admin)")
    }

    return () => {
      socket.close()
    }
  }, [])

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* <HoverSidebar /> */}
      <div className={`flex-1 flex flex-col ml-20`}>
        <div className="max-w-7xl mx-auto">{children}</div>
      </div>
    </div>
  )
}
