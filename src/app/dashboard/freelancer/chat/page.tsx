"use client"

import type React from "react"
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
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
  Info,
  Flag,
  LogOut,
  Paperclip,
  Download,
  FileText,
  ImageIcon,
  File,
  Play,
  Music,
} from "lucide-react"
import { toast } from "react-toastify"

interface AvailableUser {
  id: string
  name: string
  username: string
  role: string
  avatar: string | null
}

function formatRelativeTime(timestamp: string | number | Date | undefined) {
  if (!timestamp) return ""

  const now = new Date()
  const date = new Date(timestamp)
  const diffMs = now.getTime() - date.getTime()

  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) return "just now"
  if (diffMinutes < 60) return `${diffMinutes} min ago`
  if (diffHours < 24) return `${diffHours} hr ago`
  if (diffDays < 7) return `${diffDays} days ago`

  return date.toLocaleDateString()
}

function makeInitials(text?: string | null): string {
  if (!text || text.trim().length === 0) return "??";
  const parts = text.trim().split(/\s+/);
  const first = parts[0].substring(0, 1).toUpperCase();
  const second = parts.length > 1 ? parts[1].substring(0, 1).toUpperCase() : "";
  return first + second;
}

export type ChatUserInfoDTO = {
  userId: string
  fullName?: string
  username?: string
  role?: string
  avatar?: string | null
  avatarMimeType?: string | null
  online?: boolean
}

export type LastMessageInfo = {
  messageId?: string
  senderId?: string
  contentPreview?: string
  timestamp?: string
}

export type ChatSessionDTO = {
  id: string
  participants: ChatUserInfoDTO[]
  lastMessage?: LastMessageInfo | null
  unreadCount?: Record<string, number> | null
  roles?: Record<string, string> | null
  groupChat: boolean
  groupName?: string | null
  createdAt?: string | null
  updatedAt?: string | null

  // server-computed UI fields:
  currentUserId?: string | null
  type?: "group" | "direct"
  displayName?: string | null
  otherUserId?: string | null
  displayAvatar?: string | null
  displayAvatarInitials?: string | null
  unreadForCurrentUser?: number | null
  otherUsername?: string | null
  otherIsOnline?: boolean | null
}

interface ChatMessage {
  id: number | string;
  sender: string;
  message: string;
  receiver?: string; 
  time: string;
  files?: {   
    name: string;
    size: number;
    type: string;
    url: string;
  }[];
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

function getFileIcon(fileType: string) {
  if (fileType.startsWith("image/")) return <ImageIcon className="w-4 h-4" />
  if (fileType.startsWith("video/")) return <Play className="w-4 h-4" />
  if (fileType.startsWith("audio/")) return <Music className="w-4 h-4" />
  if (
    fileType.includes("pdf") ||
    fileType.includes("document") ||
    fileType.includes("text") ||
    fileType === "application/msword" || 
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
  )
    return <FileText className="w-4 h-4" />
  return <File className="w-4 h-4" />
}

function canPreviewFile(fileType: string): boolean {
  return fileType.startsWith("image/") || fileType === "application/pdf" || fileType.startsWith("text/")
}

export default function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddChatDialog, setShowAddChatDialog] = useState(false)
  const [showChatInfoDialog, setShowChatInfoDialog] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [newChatSearch, setNewChatSearch] = useState("")
  const [allChats, setAllChats] = useState<ChatSessionDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([])
  const [allMessages, setAllMessages] = useState<Record<string, ChatMessage[]>>({})

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [filePreviews, setFilePreviews] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    if (!selectedChat || !stompClient || !isConnected) return;
    
    stompClient.publish({
      destination: `/app/chat/${selectedChat}/read`,
      body: JSON.stringify({}),
      headers: { 'content-type': 'application/json' }
    });
    
    // Reset unread count for this chat
    setAllChats(prev => prev.map(chat => 
      chat.id === selectedChat ? {...chat, unreadForCurrentUser: 0} : chat
    ));
  }, [selectedChat, stompClient, isConnected]);


  const stompRef = useRef<Client | null>(null);

  const handleIncomingMessage = useCallback((newMessage: any) => {
    setAllMessages(prev => {
      const chatId = newMessage.chatId;
      const existingMessages = prev[chatId] || [];

      // Check if message already exists
      if (existingMessages.some(msg => msg.id === newMessage.id)) {
        return prev;
      }

      // Format the new message
      const formattedMessage: ChatMessage = {
        id: newMessage.id,
        sender: newMessage.senderId || '',
        receiver: newMessage.receiverId || '',
        message: newMessage.textContent || "",
        time: newMessage.timestamp,
        files: newMessage.fileName?.map((name: string, i: number) => ({
          name,
          size: newMessage.fileSizes[i],
          type: newMessage.fileType[i],
          url: `data:${newMessage.fileType[i]};base64,${newMessage.fileContent[i]}`
        })) || []
      };

      return {
        ...prev,
        [chatId]: [...existingMessages, formattedMessage]
      };
    });

    // Mark as read if in current chat and not the sender
    if (selectedChat === newMessage.chatId && currentUserId !== newMessage.senderId) {
      stompRef.current?.publish({
        destination: `/app/chat/${selectedChat}/read`,
        body: JSON.stringify({ userId: currentUserId })
      });
    }
  }, [selectedChat, currentUserId]);


  // Handle chat updates (unread counts, etc)
  const handleChatUpdate = useCallback((updatedChat: ChatSessionDTO) => {
    setAllChats(prevChats => prevChats.map(chat => 
      chat.id === updatedChat.id ? updatedChat : chat
    ));
  }, []);


  useEffect(() => {
    if (!currentUserId || !backendUrl) return;

    const socketUrl = `${backendUrl}/ws/chat`;
    const client = new Client({
      webSocketFactory: () => {
        const sock = new SockJS(socketUrl, null, { withCredentials: true } as any);
        return sock;
      },
      debug: (str) => console.debug(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('Chat WebSocket connected');
        setIsConnected(true);

        client.subscribe(`/user/queue/messages`, (message) => {
          const newMessage = JSON.parse(message.body);
          handleIncomingMessage(newMessage);
        });

        client.subscribe(`/user/queue/chat-updates`, (update) => {
          const updatedChat = JSON.parse(update.body);
          handleChatUpdate(updatedChat);
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
      },
    });

    stompRef.current = client; 
    client.activate();

    return () => {
      client.deactivate();
      stompRef.current = null;
    };
  }, [currentUserId, backendUrl, handleIncomingMessage, handleChatUpdate]);


  useEffect(() => {
    const fetchCurrentUser = async () => {
    const res = await fetch(`${backendUrl}/api/chat/me`, {
      method: "GET",        
      credentials: "include", 
    });
      const user = await res.json();
      setCurrentUserId(user.id); 
      setCurrentUserEmail(user.email);
      console.log(`userid = ${user.id}`);
    };
    fetchCurrentUser();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      const currentTotalSize = selectedFiles.reduce((total, file) => total + file.size, 0)
      const newFilesTotalSize = files.reduce((total, file) => total + file.size, 0)
      const maxSize = 12 * 1024 * 1024 // 12MB in bytes

      if (currentTotalSize + newFilesTotalSize > maxSize) {
        toast.error(
          `Total file size would exceed 12MB limit. Current: ${formatFileSize(currentTotalSize)}, Adding: ${formatFileSize(newFilesTotalSize)}`,
        )
        return
      }

      setSelectedFiles((prev) => [...prev, ...files])
      // Create preview for supported file types
      files.forEach((file) => {
        if (canPreviewFile(file.type)) {
          const reader = new FileReader()
          reader.onload = (e) => {
            setFilePreviews((prev) => [...prev, e.target?.result as string])
          }
          reader.readAsDataURL(file)
        } else {
          setFilePreviews((prev) => [...prev, ""])
        }
      })
      // Reset input
      e.target.value = ""
    }
  }

  const clearFileSelection = () => {
    setSelectedFiles([])
    setFilePreviews([])
  }

  const handleFileDownload = (file: { name: string; url: string }) => {
    const link = document.createElement("a")
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // fetching add user dialogue data
  useEffect(() => {
    if (showAddChatDialog) {
      const fetchUsers = async () => {
        try {
          const res = await fetch(`${backendUrl}/api/chat/users`, {
            credentials: "include",
            method: "GET",
          })
          const data = await res.json()

          interface BackendUser {
            userId?: string
            username: string
            fullName?: string
            role: string
            profileImageBase64?: string
            profileMimeType?: string
          }

          const users: AvailableUser[] = (data as BackendUser[]).map((user) => ({
            id: user.userId ?? "",
            name: user.fullName ?? "",
            username: user.username,
            role: user.role,
            avatar: user.profileImageBase64 ? `data:${user.profileMimeType};base64,${user.profileImageBase64}` : null,
          }))

          console.log(
            "Fetched users IDs:",
            users.map((u) => u.id),
          )

          setAvailableUsers(users)
        } catch (err) {
          console.error("Failed to fetch chat users:", err)
        }
      }

      fetchUsers()
    }
  }, [showAddChatDialog, backendUrl])

  // Fetch chat sessions
  useEffect(() => {
    let mounted = true
    async function fetchChats() {
      try {
        const res = await fetch(`${backendUrl}/api/chat/mychat`, {
          credentials: "include",
          method: "GET",
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const sessions: ChatSessionDTO[] = await res.json()
        console.log("Fetched chat sessions:", sessions)

        if (mounted) {
          setAllChats(sessions)
          // Auto-select first chat if available
          if (sessions.length > 0) {
            setSelectedChat(sessions[0].id)
          }
        }
      } catch (err) {
        console.error("Error fetching chats", err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchChats()
    return () => {
      mounted = false
    }
  }, [backendUrl])

  const fetchMessages = async (chatId: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/chat/messages/${chatId}`, {
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to fetch messages");
      
      const messages: any[] = await res.json();
      
      const formattedMessages: ChatMessage[] = messages.map(msg => {
        const files = msg.fileName?.map((name: string, index: number) => ({
          name,
          size: msg.fileSizes[index],
          type: msg.fileType[index],
          url: `data:${msg.fileType[index]};base64,${msg.fileContent[index]}`
        })) || [];
        
        return {
          id: msg.id,
          sender: msg.senderId || '',
          receiver: msg.receiverId || '', // NEW FIELD
          message: msg.textContent || "",
          time: msg.timestamp,
          files
        };
      });
      
      setAllMessages(prev => ({
        ...prev,
        [chatId]: formattedMessages
      }));
    } catch (err) {
      console.error("Failed to load messages:", err);
      toast.error("Failed to load messages");
    }
  };

  // Fetch messages when chat selection changes
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat);
    } else {
      setAllMessages({});
    }
  }, [selectedChat]);


  const sendMessage = async () => {
    if (!selectedChat || (!message.trim() && selectedFiles.length === 0)) return;

    const tempId = `temp-${Date.now()}`;
    const newMessage: ChatMessage = {
      id: tempId,
      sender: currentUserId || '',
      receiver: '', // optional, set if you know receiver
      message: message,
      time: new Date().toISOString(),
      files: selectedFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }))
    };

    setAllMessages(prev => {
      const existingMessages = prev[selectedChat] || [];
      return {
        ...prev,
        [selectedChat]: [...existingMessages, newMessage]
      };
    });

    const filesToSend = [...selectedFiles];
    setMessage("");
    clearFileSelection();

    const payload = {
      textContent: message.trim() || null,
      files: filesToSend.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        content: "" // Backend will handle actual content
      }))
    };

    try {
      if (stompClient && isConnected) {
        stompClient.publish({
          destination: `/app/chat/${selectedChat}/send`,
          body: JSON.stringify(payload),
          headers: { 'content-type': 'application/json' }
        });
      } else {
        const formData = new FormData();
        formData.append("chatId", selectedChat);
        if (message.trim()) formData.append("textContent", message);
        filesToSend.forEach(file => formData.append("files", file));

        const res = await fetch(`${backendUrl}/api/chat/send`, {
          method: "POST",
          credentials: "include",
          body: formData
        });

        if (!res.ok) throw new Error("Failed to send message");

        const savedMessage = await res.json();

        setAllMessages(prev => {
          const updatedMessages = [...(prev[selectedChat] || [])];
          const tempIndex = updatedMessages.findIndex(m => m.id === tempId);
          if (tempIndex !== -1) {
            updatedMessages[tempIndex] = {
              id: savedMessage.id,
              sender: savedMessage.senderId || '',
              receiver: savedMessage.receiverId || '',
              message: savedMessage.textContent || "",
              time: savedMessage.timestamp,
              files: savedMessage.fileName?.map((name: string, index: number) => ({
                name,
                size: savedMessage.fileSizes[index],
                type: savedMessage.fileType[index],
                url: `data:${savedMessage.fileType[index]};base64,${savedMessage.fileContent[index]}`
              })) || []
            };
          }
          return {
            ...prev,
            [selectedChat]: updatedMessages
          };
        });
      }

      // Refresh chat list
      const chatRes = await fetch(`${backendUrl}/api/chat/mychat`, {
        credentials: "include",
      });
      if (chatRes.ok) {
        const updatedChats = await chatRes.json();
        setAllChats(updatedChats);
      }
    } catch (err) {
      console.error("Send message error:", err);

      // Remove temporary message on error
      setAllMessages(prev => ({
        ...prev,
        [selectedChat]: (prev[selectedChat] || []).filter(m => m.id !== tempId)
      }));

      toast.error("Failed to send message");
    }
  };


  

  // Get current chat details
  const currentChat = allChats.find((chat) => chat.id === selectedChat) ?? null

  const currentMessages = (selectedChat && allMessages[selectedChat]) || [];

  // Filter chats based on search query
  const filteredChats = allChats.filter((chat) => {
    const query = searchQuery.toLowerCase()
    return (
      chat.displayName?.toLowerCase().includes(query) ||
      chat.groupName?.toLowerCase().includes(query) ||
      chat.lastMessage?.contentPreview?.toLowerCase().includes(query)
    )
  })

  // Filter available users for new chat dialog
  const filteredUsers = availableUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(newChatSearch.toLowerCase()) ||
      user.role.toLowerCase().includes(newChatSearch.toLowerCase()) ||
      user.id.toLowerCase().includes(newChatSearch.toLowerCase()) ||
      user.username.toLowerCase().includes(newChatSearch.toLowerCase()),
  )

  const handleAddUser = (userId: string) => {
    if (!selectedUsers.includes(userId)) {
      setSelectedUsers([...selectedUsers, userId])
    }
  }

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((id) => id !== userId))
  }

  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) return

    try {
      // For private chat only
      if (selectedUsers.length === 1) {
        const existingChat = allChats.find(
          (chat) => !chat.groupChat && chat.participants.some((p) => p.userId === selectedUsers[0]),
        )

        if (existingChat) {
          setSelectedChat(existingChat.id)
          setSelectedUsers([])
          setNewChatSearch("")
          setShowAddChatDialog(false)
          return
        }
      }

      // Otherwise, create new chat
      const payload = {
        participants: selectedUsers,
        groupChat: selectedUsers.length > 1,
        groupName: selectedUsers.length > 1 ? "New Group Chat" : null,
      }

      const res = await fetch(`${backendUrl}/api/chat/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to create chat session")
      const createdChat = await res.json()

      // Refresh chat list
      const chatListRes = await fetch(`${backendUrl}/api/chat/mychat`, {
        method: "GET",
        credentials: "include",
      })
      if (!chatListRes.ok) throw new Error("Failed to fetch chat list")
      const updatedChats = await chatListRes.json()

      setAllChats(updatedChats)
      setSelectedChat(createdChat.id)

      setSelectedUsers([])
      setNewChatSearch("")
      setShowAddChatDialog(false)
      toast.success("Chat session created successfully!")
    } catch (error) {
      console.error(error)
      toast.error("Failed to create chat session.")
    }
  }

  const handleLeaveChat = () => {
    console.log("Deleting chat:", selectedChat)
  }
  

  const participantAvatarMap = useMemo(() => {
    const map = new Map<string, string>();
    if (currentChat) {
      currentChat.participants.forEach(participant => {
        map.set(
          participant.userId, 
          participant.avatar || makeInitials(participant.fullName)
        );
      });
    }
    return map;
  }, [currentChat]);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, selectedChat, scrollToBottom]);

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
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="p-2 ml-14 mr-14 text-gray-500 text-sm text-center">Fetching your chat messages.</div>
                </div>
              ) : filteredChats.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="p-2 ml-14 mr-14 text-gray-500 text-sm text-center">No chats has been found</div>
                </div>
              ) : (
                filteredChats.map((chat) => (
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
                          className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm shadow-sm overflow-hidden ${
                            selectedChat === chat.id
                              ? "bg-white/20 text-white"
                              : chat.groupChat
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {chat.displayAvatar ? (
                            <img
                              src={chat.displayAvatar || "/placeholder.svg"}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          ) : chat.groupChat ? (
                            <Users className="w-5 h-5" />
                          ) : (
                            <span>{chat.displayAvatarInitials || "?"}</span>
                          )}
                        </div>
                        {!chat.groupChat && chat.participants?.find((p) => p.userId === chat.otherUserId)?.online && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p
                            className={`font-semibold truncate w-25 text-sm ${
                              selectedChat === chat.id ? "text-white" : "text-gray-900"
                            }`}
                          >
                            {chat.displayName || chat.groupName || "Unnamed Chat"}
                          </p>
                          <span className={` text-xs ${selectedChat === chat.id ? "text-white-80" : "text-gray-500"}`}>
                            {chat.lastMessage?.timestamp ? formatRelativeTime(chat.lastMessage.timestamp) : ""}
                          </span>
                        </div>
                        <p className={`text-xs mb-1 ${selectedChat === chat.id ? "text-white-80" : "text-gray-500"}`}>
                          {chat.groupChat
                            ? `${chat.participants?.length || 0} members`
                            : chat.participants?.find((p) => p.userId === chat.otherUserId)?.userId || "member"}
                        </p>
                        <p
                          className={`text-xs truncate ${selectedChat === chat.id ? "text-white/90" : "text-gray-600"}`}
                        >
                          {chat.lastMessage?.contentPreview || "No messages are sent in this chat..."}
                        </p>
                      </div>
                      <Badge
                        className={`bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full font-semibold
                            ${Number(chat.unreadForCurrentUser) > 0 ? "opacity-100" : "opacity-0 pointer-events-none"}
                          `}
                      >
                        {chat.unreadForCurrentUser}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Content */}
        <Card className="lg:col-span-3 border border-gray-200 shadow-md bg-white rounded-xl flex flex-col">
          {currentChat ? (
            <>
              {/* Chat Header */}
              <CardHeader className="border-b border-gray-100 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-sm overflow-hidden ${
                        currentChat.groupChat ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {currentChat.displayAvatar ? (
                        <img
                          src={currentChat.displayAvatar || "/placeholder.svg"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : currentChat.groupChat ? (
                        <Users className="w-5 h-5" />
                      ) : (
                        <span className="font-semibold text-sm">{currentChat.displayAvatarInitials || "?"}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {currentChat.groupChat
                          ? currentChat.groupName || "Unnamed Chat"
                          : `${currentChat.displayName} (@${currentChat.otherUsername})`}
                      </h3>
                      <div className="flex items-center gap-2">
                        {currentChat.groupChat ? (
                          <p className="text-sm text-gray-600 font-medium">
                            {currentChat.participants?.length || 0} members
                          </p>
                        ) : (
                          <>
                            <div
                              className={`w-2 h-2 rounded-full ${
                                currentChat.otherIsOnline ? "bg-green-500" : "bg-gray-400"
                              }`}
                            />
                            <p
                              className={`text-sm font-medium ${
                                currentChat.otherIsOnline ? "text-gray-600" : "text-gray-400"
                              }`}
                            >
                              {currentChat.otherIsOnline ? "Online now" : "Offline"}
                            </p>
                          </>
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
                      <Video className="w-4 h-4 cursor-not-allowed" />
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
                        <DropdownMenuItem onClick={() => setShowChatInfoDialog(true)}>
                          <Flag className="w-4 h-4 mr-2" />
                          Report
                        </DropdownMenuItem>
                        {currentChat.groupChat && (
                          <DropdownMenuItem onClick={handleLeaveChat} className="text-red-600">
                            <LogOut className="w-4 h-4 mr-2 text-red-600" />
                            Leave chat
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
            <CardContent className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4 h-[calc(100vh-400px)] overflow-y-auto"  ref={messagesContainerRef}>
                {currentMessages.length > 0 ? (
                  currentMessages.map((msg) => {
                    const isMe = currentUserId === msg.sender;
                    const isPrivateChat = currentChat && !currentChat.groupChat;

                    const participant = currentChat?.participants?.find(p => p.userId === msg.sender);
                    
                    // For group chats, get sender info
                    const senderInfo = currentChat.groupChat 
                      ? participant
                      : null;

                    return (
                      <div 
                        key={msg.id} 
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div className="flex items-end gap-2 max-w-xs lg:max-w-md">
                          {!isMe && currentChat.groupChat && (
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                              {senderInfo?.avatar ? (
                                <img
                                  src={senderInfo.avatar}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-xs font-semibold text-gray-700">
                                  {makeInitials(senderInfo?.fullName)}
                                </span>
                              )}
                            </div>
                          )}
                          
                          {!isMe && !currentChat.groupChat && (
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden">
                              {currentChat.displayAvatar ? (
                                <img
                                  src={currentChat.displayAvatar}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-xs font-semibold text-gray-700">
                                  {currentChat.displayAvatarInitials || "?"}
                                </span>
                              )}
                            </div>
                          )}
                          
                          <div className="group">
                            <div className={`px-4 py-3 rounded-lg shadow-sm transition-all duration-200 ${
                              isMe
                                ? "bg-black text-white rounded-br-sm"
                                : "bg-gray-100 text-gray-900 rounded-bl-sm border border-gray-200"
                            }`}>
                              {/* Render files if any */}
                              {msg.files && msg.files.length > 0 && (
                                <div className="space-y-2 mb-2">
                                  {msg.files.map((file, index) => (
                                    <div key={index}>
                                      {/* File preview for images */}
                                      {file.type.startsWith("image/") && (
                                        <div className="rounded-lg overflow-hidden max-w-xs mb-2">
                                          <img
                                            src={file.url}
                                            alt={file.name}
                                            className="w-full h-auto max-h-48 object-cover cursor-pointer"
                                            onClick={() => window.open(file.url, "_blank")}
                                          />
                                        </div>
                                      )}

                                      {/* File info */}
                                      <div className={`flex items-center gap-2 p-2 rounded-lg ${isMe ? 'bg-white/10' : 'bg-white'}`}>
                                        <div className={`p-1 rounded ${isMe ? 'bg-white/20' : 'bg-gray-100'}`}>
                                          {getFileIcon(file.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className={`text-sm font-medium truncate ${isMe ? 'text-white' : 'text-gray-900'}`}>
                                            {file.name}
                                          </p>
                                          <p className={`text-xs ${isMe ? 'text-white/70' : 'text-gray-500'}`}>
                                            {formatFileSize(file.size)}
                                          </p>
                                        </div>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className={`p-1 h-auto ${isMe ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                                          onClick={() => handleFileDownload(file)}
                                        >
                                          <Download className="w-4 h-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Message text */}
                              {msg.message && <p className="text-sm leading-relaxed">{msg.message}</p>}
                            </div>
                            
                            <p className={`text-xs mt-1 px-1 ${isMe ? 'text-right text-gray-400' : 'text-left text-gray-500'}`}>
                              {formatRelativeTime(msg.time)}
                              {isPrivateChat && !isMe && (
                                <span className="ml-1">• Seen</span>
                              )}
                              {currentChat.groupChat && !isMe && senderInfo && (
                                <span className="ml-1">• {senderInfo.fullName + ' @' + senderInfo.username || senderInfo.userId}</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                  ) : (
                    // Empty state when no messages
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <MessageSquare className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No chat history found</h3>
                      <p className="text-sm text-gray-500 max-w-sm">
                        {currentChat.groupChat
                          ? "Start the conversation with your team members. Send a message to get things started!"
                          : `Start a conversation with ${currentChat.displayName || "this user"}. Send a message to begin chatting!`}
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
                {selectedFiles.length > 0 && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""} selected
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          Total: {formatFileSize(selectedFiles.reduce((total, file) => total + file.size, 0))} / 12MB
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={clearFileSelection}
                        className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {filePreviews[index] && file.type.startsWith("image/") && (
                            <div className="rounded-lg overflow-hidden max-w-xs">
                              <img
                                src={filePreviews[index] || "/placeholder.svg"}
                                alt="Preview"
                                className="w-full h-auto max-h-32 object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="flex-1 relative flex items-center gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="h-10 pr-10 border border-gray-200 focus:border-black rounded-lg bg-gray-50 focus:bg-white transition-colors"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          sendMessage()
                        }
                      }}
                    />

                    <label
                      htmlFor="file-upload"
                      className="absolute right-2 cursor-pointer text-gray-500 hover:text-black"
                    >
                      <Paperclip className="w-5 h-5" />
                    </label>
                    <input id="file-upload" type="file" multiple className="hidden" onChange={handleFileSelect} />
                  </div>
                  <Button
                    className="h-10 px-6 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={sendMessage}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            // Placeholder when no chat is selected
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No chat selected</h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  Select a chat from the list to view messages or start a new conversation.
                </p>
                <Button onClick={() => setShowAddChatDialog(true)} className="bg-black hover:bg-gray-800 text-white">
                  Start New Chat
                </Button>
              </div>
            </div>
          )}
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
                    {user.avatar ? (
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={`${user.name} avatar`}
                        className="w-8 h-8 object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-xs font-semibold text-gray-700">
                        {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium text-sm truncate">
                      {user.name}
                      <span className="text-gray-500 text-xs ml-1">@{user.username}</span>
                    </p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                    <p className="text-xs text-gray-400">User Id: {user.id}</p>
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
            {currentChat && (
              <>
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-sm overflow-hidden ${
                      currentChat.groupChat ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {currentChat.displayAvatar ? (
                      <img
                        src={currentChat.displayAvatar || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : currentChat.groupChat ? (
                      <Users className="w-6 h-6" />
                    ) : (
                      <span className="font-semibold">{currentChat.displayAvatarInitials || "?"}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {currentChat.displayName || currentChat.groupName || "Unnamed Chat"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {currentChat.groupChat
                        ? `${currentChat.participants?.length || 0} members`
                        : currentChat.roles?.[currentChat.otherUserId || ""] || "member"}
                    </p>
                  </div>
                </div>

                {currentChat.groupChat && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Members</h4>
                      <Button size="sm" variant="outline">
                        <UserPlus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {currentChat.participants?.map((participant, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                              <span className="text-xs font-semibold text-gray-700">
                                {participant.fullName
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("") || "?"}
                              </span>
                            </div>
                            <span className="text-sm">{participant.fullName || participant.userId}</span>
                          </div>
                          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}