"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Phone, Video, MoreHorizontal, Search, Paperclip, Smile, Plus, Star, Users } from "lucide-react"

export default function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState("sarah-johnson")
  const [message, setMessage] = useState("")

  const directChats = [
    {
      id: "sarah-johnson",
      name: "Sarah Johnson",
      role: "UI/UX Designer",
      lastMessage: "Thanks for the feedback on the design! I'll implement the changes.",
      time: "2m ago",
      unread: 2,
      online: true,
      avatar: "SJ",
    },
    {
      id: "mike-chen",
      name: "Mike Chen",
      role: "Project Manager",
      lastMessage: "The API integration is complete. Ready for testing.",
      time: "1h ago",
      unread: 0,
      online: true,
      avatar: "MC",
    },
    {
      id: "alex-rodriguez",
      name: "Alex Rodriguez",
      role: "Backend Developer",
      lastMessage: "Can we schedule a call tomorrow to discuss the database schema?",
      time: "3h ago",
      unread: 1,
      online: false,
      avatar: "AR",
    },
    {
      id: "emily-davis",
      name: "Emily Davis",
      role: "Product Owner",
      lastMessage: "Project files uploaded to the shared drive. Please review.",
      time: "1d ago",
      unread: 0,
      online: false,
      avatar: "ED",
    },
  ]

  const groupChats = [
    {
      id: "design-team",
      name: "Design Team",
      members: ["Sarah Johnson", "Mike Chen", "Alex Rodriguez"],
      memberCount: 8,
      lastMessage: "New mockups are ready for review",
      time: "5m ago",
      unread: 3,
      avatar: "DT",
      color: "bg-blue-500",
    },
    {
      id: "project-alpha",
      name: "Project Alpha",
      members: ["Emily Davis", "Mike Chen", "Sarah Johnson"],
      memberCount: 12,
      lastMessage: "Sprint planning meeting tomorrow at 10 AM",
      time: "1h ago",
      unread: 0,
      avatar: "PA",
      color: "bg-green-500",
    },
    {
      id: "dev-team",
      name: "Development Team",
      members: ["Alex Rodriguez", "Mike Chen"],
      memberCount: 6,
      lastMessage: "Code review completed, ready to merge",
      time: "2h ago",
      unread: 1,
      avatar: "DV",
      color: "bg-purple-500",
    },
    {
      id: "client-updates",
      name: "Client Updates",
      members: ["Emily Davis", "Sarah Johnson"],
      memberCount: 4,
      lastMessage: "Weekly progress report sent to client",
      time: "1d ago",
      unread: 0,
      avatar: "CU",
      color: "bg-orange-500",
    },
  ]

  const messages = [
    {
      id: 1,
      sender: "Sarah Johnson",
      message: "Hi! I've completed the initial wireframes for the project. The user flow looks much cleaner now.",
      time: "10:30 AM",
      isMe: false,
    },
    {
      id: 2,
      sender: "You",
      message: "Excellent work! The layout is much more intuitive. I especially like the navigation structure.",
      time: "10:32 AM",
      isMe: true,
    },
    {
      id: 3,
      sender: "Sarah Johnson",
      message:
        "Thanks! I've also prepared some alternative color schemes. Would you like to review them before I proceed?",
      time: "10:35 AM",
      isMe: false,
    },
    {
      id: 4,
      sender: "You",
      message: "Please share them when you're ready. I'm excited to see the options.",
      time: "10:36 AM",
      isMe: true,
    },
    {
      id: 5,
      sender: "Sarah Johnson",
      message:
        "Perfect! I'll upload them to the project folder in the next few minutes. Also attaching the style guide.",
      time: "10:38 AM",
      isMe: false,
    },
  ]

  const currentChat = directChats.find((chat) => chat.id === selectedChat) || directChats[0]

  return (
    <div className="max-w-8xl mx-auto sm:px-6 lg:px-8 space-y-6 sm:mr-0 mr-20">
      {/* Chat Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-4">Chat</h1>
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-200px)]">
        {/* Chat Sidebar */}
        <Card className="lg:col-span-1 border border-gray-200 shadow-md bg-white rounded-xl">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Messages</h3>
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg p-2"
                >
                  <Search className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg p-2"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="direct" className="w-full">
              <TabsList className="grid w-full grid-cols-2 xl:ml-1 xl:w-70 my-2 h-9 bg-gray-100 rounded-lg">
                <TabsTrigger value="direct" className="font-semibold rounded-md text-sm">
                  Direct
                </TabsTrigger>
                <TabsTrigger value="groups" className="font-semibold rounded-md text-sm">
                  Teams
                </TabsTrigger>
              </TabsList>

              <TabsContent value="direct" className="mt-0">
                <div className="space-y-2 px-3 pb-3 h-[calc(100vh-315px)] overflow-y-auto">
                  {directChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => setSelectedChat(chat.id)}
                      className={`group p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedChat === chat.id
                          ? "bg-black text-white shadow-md"
                          : "hover:bg-gray-50 border border-transparent hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm shadow-sm ${
                              selectedChat === chat.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {chat.avatar}
                          </div>
                          {chat.online && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p
                              className={`font-semibold truncate text-sm ${
                                selectedChat === chat.id ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {chat.name}
                            </p>
                            <span className={`text-xs ${selectedChat === chat.id ? "text-white/80" : "text-gray-500"}`}>
                              {chat.time}
                            </span>
                          </div>
                          <p className={`text-xs mb-1 ${selectedChat === chat.id ? "text-white/80" : "text-gray-500"}`}>
                            {chat.role}
                          </p>
                          <p
                            className={`text-xs truncate ${
                              selectedChat === chat.id ? "text-white/90" : "text-gray-600"
                            }`}
                          >
                            {chat.lastMessage}
                          </p>
                        </div>
                        {chat.unread > 0 && (
                          <Badge className="bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full font-semibold">
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="groups" className="mt-0">
                <div className="space-y-2 px-3 pb-3 h-[calc(100vh-380px)] overflow-y-auto">
                  {groupChats.map((group) => (
                    <div
                      key={group.id}
                      onClick={() => setSelectedChat(group.id)}
                      className={`group p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedChat === group.id
                          ? "bg-black text-white shadow-md"
                          : "hover:bg-gray-50 border border-transparent hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm text-white shadow-sm ${
                              selectedChat === group.id ? "bg-white/20" : group.color
                            }`}
                          >
                            {selectedChat === group.id ? group.avatar : <Users className="w-5 h-5" />}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p
                              className={`font-semibold truncate text-sm ${
                                selectedChat === group.id ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {group.name}
                            </p>
                            <span
                              className={`text-xs ${selectedChat === group.id ? "text-white/80" : "text-gray-500"}`}
                            >
                              {group.time}
                            </span>
                          </div>
                          <p
                            className={`text-xs mb-1 ${selectedChat === group.id ? "text-white/80" : "text-gray-500"}`}
                          >
                            {group.memberCount} members
                          </p>
                          <p
                            className={`text-xs truncate ${
                              selectedChat === group.id ? "text-white/90" : "text-gray-600"
                            }`}
                          >
                            {group.lastMessage}
                          </p>
                        </div>
                        {group.unread > 0 && (
                          <Badge className="bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full font-semibold">
                            {group.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Chat Content */}
        <Card className="lg:col-span-3 border border-gray-200 shadow-md bg-white rounded-xl flex flex-col">
          {/* Chat Header */}
          <CardHeader className="border-b border-gray-100 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="font-semibold text-gray-700 text-sm">{currentChat.avatar}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{currentChat.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <p className="text-sm text-gray-600 font-medium">Online now</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg p-2"
                >
                  <Phone className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg p-2"
                >
                  <Video className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg p-2"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4 h-[calc(100vh-400px)] overflow-y-auto">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                  <div className="flex items-end gap-2 max-w-xs lg:max-w-md">
                    {!msg.isMe && (
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-xs font-semibold text-gray-700">SJ</span>
                      </div>
                    )}
                    <div className="group">
                      <div
                        className={`px-4 py-3 rounded-lg shadow-sm transition-all duration-200 ${
                          msg.isMe
                            ? "bg-black text-white rounded-br-sm"
                            : "bg-gray-100 text-gray-900 rounded-bl-sm border border-gray-200"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                      </div>
                      <p
                        className={`text-xs mt-1 px-1 ${
                          msg.isMe ? "text-right text-gray-400" : "text-left text-gray-500"
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          {/* Message Input */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg p-2"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="h-10 pr-12 border border-gray-200 focus:border-black rounded-lg bg-gray-50 focus:bg-white transition-colors"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      setMessage("")
                    }
                  }}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 rounded-md p-1"
                >
                  <Smile className="w-4 h-4" />
                </Button>
              </div>
              <Button
                className="h-10 px-6 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                onClick={() => setMessage("")}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
