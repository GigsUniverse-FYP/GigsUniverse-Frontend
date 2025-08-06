"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Send,
  Video,
  MoreHorizontal,
  Search,
  Plus,
  Users,
  X,
  UserPlus,
  MessageSquare,
  Trash2,
  Info,
} from "lucide-react"

export default function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState("sarah-johnson")
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddChatDialog, setShowAddChatDialog] = useState(false)
  const [showChatInfoDialog, setShowChatInfoDialog] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [newChatSearch, setNewChatSearch] = useState("")

  // Combined all chats into one array
  const allChats = [
    {
      id: "sarah-johnson",
      name: "Sarah Johnson",
      role: "UI/UX Designer",
      lastMessage: "Thanks for the feedback on the design! I'll implement the changes.",
      time: "2m ago",
      unread: 2,
      online: true,
      avatar: "SJ",
      type: "direct",
      members: ["Sarah Johnson"],
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
      type: "direct",
      members: ["Mike Chen"],
    },
    {
      id: "design-team",
      name: "Design Team",
      role: "Team Chat",
      lastMessage: "New mockups are ready for review",
      time: "5m ago",
      unread: 3,
      avatar: "DT",
      type: "group",
      members: [
        "Sarah Johnson",
        "Mike Chen",
        "Alex Rodriguez",
        "Emily Davis",
        "John Smith",
        "Lisa Wang",
        "David Brown",
        "Anna Taylor",
      ],
      color: "bg-blue-500",
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
      type: "direct",
      members: ["Alex Rodriguez"],
    },
    {
      id: "project-alpha",
      name: "Project Alpha",
      role: "Team Chat",
      lastMessage: "Sprint planning meeting tomorrow at 10 AM",
      time: "1h ago",
      unread: 0,
      avatar: "PA",
      type: "group",
      members: [
        "Emily Davis",
        "Mike Chen",
        "Sarah Johnson",
        "Alex Rodriguez",
        "John Smith",
        "Lisa Wang",
        "David Brown",
        "Anna Taylor",
        "Tom Wilson",
        "Rachel Green",
        "Mark Johnson",
        "Sophie Chen",
      ],
      color: "bg-green-500",
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
      type: "direct",
      members: ["Emily Davis"],
    },
    {
      id: "dev-team",
      name: "Development Team",
      role: "Team Chat",
      lastMessage: "Code review completed, ready to merge",
      time: "2h ago",
      unread: 1,
      avatar: "DV",
      type: "group",
      members: ["Alex Rodriguez", "Mike Chen", "John Smith", "Tom Wilson", "Rachel Green", "Mark Johnson"],
      color: "bg-purple-500",
    },
  ]

  // Available users for adding to chats
  const availableUsers = [
    { id: "sarah-johnson", name: "Sarah Johnson", role: "UI/UX Designer", avatar: "SJ" },
    { id: "mike-chen", name: "Mike Chen", role: "Project Manager", avatar: "MC" },
    { id: "alex-rodriguez", name: "Alex Rodriguez", role: "Backend Developer", avatar: "AR" },
    { id: "emily-davis", name: "Emily Davis", role: "Product Owner", avatar: "ED" },
    { id: "john-smith", name: "John Smith", role: "Frontend Developer", avatar: "JS" },
    { id: "lisa-wang", name: "Lisa Wang", role: "QA Engineer", avatar: "LW" },
    { id: "david-brown", name: "David Brown", role: "DevOps Engineer", avatar: "DB" },
    { id: "anna-taylor", name: "Anna Taylor", role: "Business Analyst", avatar: "AT" },
    { id: "tom-wilson", name: "Tom Wilson", role: "Full Stack Developer", avatar: "TW" },
    { id: "rachel-green", name: "Rachel Green", role: "Data Scientist", avatar: "RG" },
  ]

  // Replace the existing messages array with a messages object that maps chat IDs to their messages
  const [allMessages, setAllMessages] = useState<Record<string, any[]>>({
    "sarah-johnson": [
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
    ],
    "mike-chen": [
      {
        id: 1,
        sender: "Mike Chen",
        message: "The API integration is complete. Ready for testing.",
        time: "9:15 AM",
        isMe: false,
      },
      {
        id: 2,
        sender: "You",
        message: "Great! I'll start testing it now.",
        time: "9:16 AM",
        isMe: true,
      },
    ],
    "design-team": [
      {
        id: 1,
        sender: "Sarah Johnson",
        message: "New mockups are ready for review",
        time: "8:45 AM",
        isMe: false,
      },
      {
        id: 2,
        sender: "Mike Chen",
        message: "Looking good! The color scheme works well.",
        time: "8:50 AM",
        isMe: false,
      },
    ],
    // Some chats will have no messages (empty arrays or undefined)
  })

  // Get messages for current chat
  const currentMessages = allMessages[selectedChat] || []

  // Filter chats based on search query
  const filteredChats = allChats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter available users for new chat dialog
  const filteredUsers = availableUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(newChatSearch.toLowerCase()) ||
      user.role.toLowerCase().includes(newChatSearch.toLowerCase()) ||
      user.id.toLowerCase().includes(newChatSearch.toLowerCase()),
  )

  const currentChat = allChats.find((chat) => chat.id === selectedChat) || allChats[0]

  const handleAddUser = (userId: string) => {
    if (!selectedUsers.includes(userId)) {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((id) => id !== userId))
  }

  const handleCreateChat = () => {
    // Logic to create new chat would go here
    console.log("Creating chat with users:", selectedUsers)
    setSelectedUsers([])
    setNewChatSearch("")
    setShowAddChatDialog(false)
  }

  const handleClearChat = () => {
    console.log("Clearing chat:", selectedChat)
  }

  const handleDeleteChat = () => {
    console.log("Deleting chat:", selectedChat)
  }

  return (
    <div className="w-full sm:max-w-8xl mx-auto space-y-6 mb-5 -ml-10 sm:ml-0">
      {/* Chat Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-4">Chat</h1>
      </div>

      {/* Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-200px)]">
        {/* Chat Sidebar */}
        <Card className="lg:col-span-1 border border-gray-200 shadow-md bg-white rounded-xl">
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900">Messages</h3>
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg p-2"
                onClick={() => setShowAddChatDialog(true)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9 border border-gray-200 focus:border-black rounded-lg bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2 px-3 pb-3 h-[calc(100vh-300px)] overflow-y-auto">
              {filteredChats.map((chat) => (
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
                          selectedChat === chat.id
                            ? "bg-white/20 text-white"
                            : chat.type === "group"
                              ? `${chat.color} text-white`
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {chat.type === "group" && selectedChat !== chat.id ? (
                          <Users className="w-5 h-5" />
                        ) : (
                          chat.avatar
                        )}
                      </div>
                      {chat.type === "direct" && chat.online && (
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
                        {chat.type === "group" ? `${chat.members.length} members` : chat.role}
                      </p>
                      <p className={`text-xs truncate ${selectedChat === chat.id ? "text-white/90" : "text-gray-600"}`}>
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
          </CardContent>
        </Card>

        {/* Chat Content */}
        <Card className="lg:col-span-3 border border-gray-200 shadow-md bg-white rounded-xl flex flex-col">
          {/* Chat Header */}
          <CardHeader className="border-b border-gray-100 pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm ${
                    currentChat.type === "group" ? `${currentChat.color} text-white` : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {currentChat.type === "group" ? (
                    <Users className="w-5 h-5" />
                  ) : (
                    <span className="font-semibold text-sm">{currentChat.avatar}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{currentChat.name}</h3>
                  <div className="flex items-center gap-2">
                    {currentChat.type === "direct" ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <p className="text-sm text-gray-600 font-medium">Online now</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-600 font-medium">{currentChat.members.length} members</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg p-2"
                >
                  <Video className="w-4 h-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg p-2"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setShowChatInfoDialog(true)}>
                      <Info className="w-4 h-4 mr-2" />
                      View chat info
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleClearChat}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Clear chat
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDeleteChat} className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete chat
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4 h-[calc(100vh-400px)] overflow-y-auto">
              {currentMessages.length > 0 ? (
                currentMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                    <div className="flex items-end gap-2 max-w-xs lg:max-w-md">
                      {!msg.isMe && (
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                          <span className="text-xs font-semibold text-gray-700">{currentChat.avatar}</span>
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
                ))
              ) : (
                // Empty state when no messages
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No chat history found</h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                    {currentChat.type === "group"
                      ? "Start the conversation with your team members. Send a message to get things started!"
                      : `Start a conversation with ${currentChat.name}. Send a message to begin chatting!`}
                  </p>
                  <Button
                    className="mt-4 bg-black hover:bg-gray-800 text-white"
                    onClick={() => {
                      // Focus on the message input
                      const messageInput = document.querySelector(
                        'input[placeholder="Type your message..."]',
                      ) as HTMLInputElement
                      messageInput?.focus()
                    }}
                  >
                    Start Conversation
                  </Button>
                </div>
              )}
            </div>
          </CardContent>

          {/* Message Input */}
          <div className="border-t border-gray-100 p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Input
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="h-10 pr-4 border border-gray-200 focus:border-black rounded-lg bg-gray-50 focus:bg-white transition-colors"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      setMessage("")
                    }
                  }}
                />
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

      {/* Add Chat Dialog */}
      <Dialog open={showAddChatDialog} onOpenChange={setShowAddChatDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Start New Chat</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={newChatSearch}
                onChange={(e) => setNewChatSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Selected Users Tags */}
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((userId) => {
                  const user = availableUsers.find((u) => u.id === userId)
                  return user ? (
                    <div
                      key={userId}
                      className="flex items-center gap-1 bg-black text-white px-2 py-1 rounded-full text-sm"
                    >
                      <span>{user.name}</span>
                      <button onClick={() => handleRemoveUser(userId)}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : null
                })}
              </div>
            )}

            {/* Users List */}
            <div className="max-h-60 overflow-y-auto space-y-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleAddUser(user.id)}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedUsers.includes(user.id) ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-semibold text-gray-700">{user.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                    <p className="text-xs text-gray-400">@{user.id}</p>
                  </div>
                  {selectedUsers.includes(user.id) && (
                    <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddChatDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleCreateChat}
                disabled={selectedUsers.length === 0}
                className="flex-1 bg-black hover:bg-gray-800"
              >
                Create Chat
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat Info Dialog */}
      <Dialog open={showChatInfoDialog} onOpenChange={setShowChatInfoDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chat Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-sm ${
                  currentChat.type === "group" ? `${currentChat.color} text-white` : "bg-gray-100 text-gray-700"
                }`}
              >
                {currentChat.type === "group" ? (
                  <Users className="w-6 h-6" />
                ) : (
                  <span className="font-semibold">{currentChat.avatar}</span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{currentChat.name}</h3>
                <p className="text-sm text-gray-600">
                  {currentChat.type === "group" ? `${currentChat.members.length} members` : currentChat.role}
                </p>
              </div>
            </div>

            {currentChat.type === "group" && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Members</h4>
                  <Button size="sm" variant="outline">
                    <UserPlus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {currentChat.members.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-gray-700">
                            {member
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </span>
                        </div>
                        <span className="text-sm">{member}</span>
                      </div>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
