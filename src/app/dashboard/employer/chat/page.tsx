"use client";

import type React from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  User,
  Check,
  Edit2,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

interface AvailableUser {
  id: string;
  name: string;
  username: string;
  role: string;
  avatar: string | null;
}

function formatRelativeTime(timestamp: string | number | Date | undefined) {
  if (!timestamp) return "";

  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString();
}

function makeInitials(text?: string | null): string {
  if (!text || text.trim().length === 0) return "";
  const parts = text.trim().split(/\s+/);
  const first = parts[0].substring(0, 1).toUpperCase();
  const second = parts.length > 1 ? parts[1].substring(0, 1).toUpperCase() : "";
  return first + second;
}

export type ChatUserInfoDTO = {
  userId: string;
  fullName?: string;
  username?: string;
  role?: string;
  avatar?: string | null;
  avatarMimeType?: string | null;
  online?: boolean;
};

export type LastMessageInfo = {
  messageId?: string;
  senderId?: string;
  contentPreview?: string;
  timestamp?: string;
};

export type ChatSessionDTO = {
  id: string;
  participants: ChatUserInfoDTO[];
  lastMessage?: LastMessageInfo | null;
  unreadCount?: Record<string, number> | null;
  roles?: Record<string, string> | null;
  groupChat: boolean;
  groupName?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;

  // server-computed UI fields:
  currentUserId?: string | null;
  type?: "group" | "direct";
  displayName?: string | null;
  otherUserId?: string | null;
  displayAvatar?: string | null;
  displayAvatarInitials?: string | null;
  unreadForCurrentUser?: number | null;
  otherUsername?: string | null;
  otherIsOnline?: boolean | null;
};

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

function sortChatSessions(
  sessions: ChatSessionDTO[],
  currentUserId?: string | null
) {
  return [...sessions].sort((a, b) => {
    const unreadA = currentUserId ? a.unreadCount?.[currentUserId] ?? 0 : 0;
    const unreadB = currentUserId ? b.unreadCount?.[currentUserId] ?? 0 : 0;

    if (unreadA > 0 && unreadB === 0) return -1;
    if (unreadB > 0 && unreadA === 0) return 1;

    const timeA = a.lastMessage?.timestamp
      ? new Date(a.lastMessage.timestamp).getTime()
      : 0;
    const timeB = b.lastMessage?.timestamp
      ? new Date(b.lastMessage.timestamp).getTime()
      : 0;

    return timeB - timeA;
  });
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
}

function getFileIcon(fileType: string) {
  if (fileType.startsWith("image/")) return <ImageIcon className="w-4 h-4" />;
  if (fileType.startsWith("video/")) return <Play className="w-4 h-4" />;
  if (fileType.startsWith("audio/")) return <Music className="w-4 h-4" />;
  if (
    fileType.includes("pdf") ||
    fileType.includes("document") ||
    fileType.includes("text") ||
    fileType === "application/msword" ||
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return <FileText className="w-4 h-4" />;
  return <File className="w-4 h-4" />;
}

function canPreviewFile(fileType: string): boolean {
  return (
    fileType.startsWith("image/") ||
    fileType === "application/pdf" ||
    fileType.startsWith("text/")
  );
}

export default function ChatInterface() {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddChatDialog, setShowAddChatDialog] = useState(false);
  const [showChatInfoDialog, setShowChatInfoDialog] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [newChatSearch, setNewChatSearch] = useState("");
  const [allChats, setAllChats] = useState<ChatSessionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
  const [allMessages, setAllMessages] = useState<Record<string, ChatMessage[]>>(
    {}
  );

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const [showLeaveChatConfirmation, setShowLeaveChatConfirmation] =
    useState(false);

  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [userToRemove, setUserToRemove] = useState<{
    userId: string;
    fullName?: string;
    username?: string;
  } | null>(null);

  const [userToAdmin, setUserToAdmin] = useState<{
    userId: string;
    fullName?: string;
    username?: string;
  } | null>(null);

  const [showMakeAdminConfirmation, setShowMakeAdminConfirmation] =
    useState(false);

  const [showAddUserDialog, setShowAddUserDialog] = useState(false);
  const [usersToAdd, setUsersToAdd] = useState<string[]>([]);
  const [addUserSearch, setAddUserSearch] = useState("");

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");

  const searchParams = useSearchParams()
  const chatIdFromQuery = searchParams.get("userId")
    
  useEffect(() => {
    if (chatIdFromQuery) {
      setShowAddChatDialog(true)
      setNewChatSearch(chatIdFromQuery)
    }
  }, [chatIdFromQuery])
  
  const handleReport = () => {
    window.open("/dashboard/freelancer/support-ticket", "_blank");
  };

  const handleEditName = () => {
    setIsEditingName(true);
    setEditedName(currentChat?.displayName || currentChat?.groupName || "");
  };

  const saveGroupName = async (chatId: string, newName: string) => {
    const res = await fetch(`${backendUrl}/api/chat/${chatId}/rename`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });

    if (!res.ok) throw new Error("Failed to rename group");

    const updatedChat = await res.json();
    return updatedChat;
  };

  const handleSaveName = async () => {
    if (!currentChat || !editedName.trim()) return;

    try {
      const updatedChat = await saveGroupName(
        currentChat.id,
        editedName.trim()
      );

      // Merge only the new groupName/displayName
      const mergedChat = {
        ...currentChat,
        groupName: updatedChat.groupName, // backend only returns updated name
        displayName: updatedChat.displayName, // optional if you use displayName
        updatedAt: updatedChat.updatedAt,
      };

      // Update state
      setAllChats((prev) =>
        prev.map((c) => (c.id === mergedChat.id ? mergedChat : c))
      );
      setCurrentChat(mergedChat);

      setIsEditingName(false);
      toast.success("Group name updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update group name");
    }
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
  };

  const handleAddUsersToGroup = async () => {
    if (!selectedChat || usersToAdd.length === 0) return;

    try {
      const res = await fetch(
        `${backendUrl}/api/chat/${selectedChat}/participants`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userIds: usersToAdd }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add users to group");
      }

      // Backend returns the full updated chat, if not, fetch full chat next
      let updatedChat: ChatSessionDTO;
      try {
        updatedChat = await res.json();
      } catch {
        // fallback: fetch full chat if backend only returns success
        const chatRes = await fetch(`${backendUrl}/api/chat/${selectedChat}`, {
          credentials: "include",
        });
        updatedChat = await chatRes.json();
      }

      // Update frontend state with **full participants + roles**
      setAllChats((prev) =>
        prev.map((c) => (c.id === selectedChat ? updatedChat : c))
      );
      setCurrentChat(updatedChat);

      setShowAddUserDialog(false);
      setUsersToAdd([]);
      setAddUserSearch("");

      toast.success("Users added to group successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add users to group");
    }
  };

  const confirmMakeAdmin = async () => {
    if (!selectedChat || !userToAdmin) return;

    try {
      const res = await fetch(
        `${backendUrl}/api/chat/${selectedChat}/participants/${userToAdmin.userId}/make-admin`,
        { method: "PATCH", credentials: "include" }
      );

      if (res.ok) {
        toast.success(
          `${
            userToAdmin.fullName || userToAdmin.username || userToAdmin.userId
          } is now an admin`
        );
      } else if (res.status === 400) {
        const data = await res.json();
        toast.error(data.error || "User is already an admin");
      } else {
        throw new Error("Failed to promote user");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to promote user");
    } finally {
      setUserToAdmin(null);
      setShowMakeAdminConfirmation(false);
    }
  };

  const cancelMakeAdmin = () => {
    setShowMakeAdminConfirmation(false);
  };

  const cancelLeaveChat = () => {
    setShowLeaveChatConfirmation(false);
  };

  const cancelAddUsers = () => {
    setShowAddUserDialog(false);
    setSelectedUsers([]);
    setSearchQuery("");
  };

  const handleLeaveChat = async () => {
    if (!selectedChat || !currentUserId) return;

    try {
      const res = await fetch(
        `${backendUrl}/api/chat/${selectedChat}/participants/${currentUserId}`,
        { method: "DELETE", credentials: "include" }
      );

      if (res.ok) {
        setAllChats((prev) => prev.filter((chat) => chat.id !== selectedChat));
        setSelectedChat(null);
        setShowLeaveChatConfirmation(false);
        setShowChatInfoDialog(false);
        toast.success("Successfully left the group");
      } else {
        throw new Error("Failed to leave group");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to leave group");
    }
  };

  const confirmRemoveUser = async () => {
    if (!selectedChat || !userToRemove) return;

    try {
      const res = await fetch(
        `${backendUrl}/api/chat/${selectedChat}/participants/${userToRemove.userId}`,
        { method: "DELETE", credentials: "include" }
      );

      if (res.ok) {
        setAllChats((prev) =>
          prev.map((chat) =>
            chat.id === selectedChat
              ? {
                  ...chat,
                  participants: chat.participants.filter(
                    (p) => p.userId !== userToRemove.userId
                  ),
                  roles: chat.roles
                    ? Object.fromEntries(
                        Object.entries(chat.roles).filter(
                          ([key]) => key !== userToRemove.userId
                        )
                      )
                    : chat.roles,
                }
              : chat
          )
        );

        setUserToRemove(null);
        setShowRemoveConfirmation(false);
        toast.success(
          `${
            userToRemove.fullName ||
            userToRemove.username ||
            userToRemove.userId
          } removed from the group`
        );
      } else {
        throw new Error("Failed to remove user from group");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove user from group");
    }
  };

  const cancelRemoveUser = () => {
    setShowRemoveConfirmation(false);
  };

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const client = stompRef.current;
    if (!selectedChat || !client || !isConnected) return;

    console.log(
      "Marking chat as read:",
      selectedChat,
      "Current user:",
      currentUserId
    );

    client.publish({
      destination: `/app/chat/${selectedChat}/read`,
      body: JSON.stringify({}),
      headers: { "content-type": "application/json" },
    });

    // Also update local state immediately
    setAllChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChat ? { ...chat, unreadForCurrentUser: 0 } : chat
      )
    );
  }, [selectedChat, isConnected]);

  const stompRef = useRef<Client | null>(null);
  const selectedChatRef = useRef(selectedChat);
  const currentUserIdRef = useRef(currentUserId);

  useEffect(() => {
    selectedChatRef.current = selectedChat;
    currentUserIdRef.current = currentUserId;
  }, [selectedChat, currentUserId]);

  // Incoming message handler
  const handleIncomingMessage = useCallback((newMessage: any) => {
    const client = stompRef.current;

    setAllMessages((prev) => {
      const chatId = newMessage.chatId;
      const existingMessages = prev[chatId] || [];

      // Prevent duplicate
      if (existingMessages.some((msg) => msg.id === newMessage.id)) return prev;

      const formatted: ChatMessage = {
        id: newMessage.id,
        sender: newMessage.senderId || "",
        receiver: newMessage.receiverId || "",
        message: newMessage.textContent || "",
        time: newMessage.timestamp,
        files:
          newMessage.fileName?.map((name: string, i: number) => ({
            name,
            size: newMessage.fileSizes?.[i] || 0,
            type: newMessage.fileType?.[i] || "application/octet-stream",
            url: `data:${
              newMessage.fileType?.[i] || "application/octet-stream"
            };base64,${newMessage.fileContent?.[i] || ""}`,
          })) || [],
      };

      const updated = {
        ...prev,
        [chatId]: [...existingMessages, formatted],
      };

      // Scroll to bottom if the message belongs to current chat
      if (chatId === selectedChatRef.current && messagesContainerRef.current) {
        setTimeout(() => {
          messagesContainerRef.current?.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }, 50);
      }

      return updated;
    });

    // Auto-mark as read
    if (
      selectedChatRef.current === newMessage.chatId &&
      currentUserIdRef.current !== newMessage.senderId &&
      client
    ) {
      client.publish({
        destination: `/app/chat/${newMessage.chatId}/read`,
        body: JSON.stringify({}),
        headers: { "content-type": "application/json" },
      });
    }
  }, []);

  const handleChatUpdate = useCallback((updatedChat: ChatSessionDTO) => {
    console.log("handleChatUpdate called:", updatedChat);

    setAllChats((prev) =>
      prev.map((chat) =>
        chat.id === updatedChat.id
          ? {
              ...updatedChat,
              unreadForCurrentUser: updatedChat.unreadForCurrentUser,
            }
          : chat
      )
    );
  }, []);

  const handleChatSessionUpdate = useCallback(
    (updatedChat: ChatSessionDTO) => {
      console.log("🔄 handleChatSessionUpdate called:", updatedChat);

      setAllChats((prev) => {
        const exists = prev.find((chat) => chat.id === updatedChat.id);

        const unreadMap = updatedChat.unreadCount || {};
        const keys = Object.keys(unreadMap);

        const unreadForCurrentUser = currentUserId
          ? unreadMap[currentUserId] ?? 0
          : 0;

        console.log("📬 Session update debug", {
          chatId: updatedChat.id,
          currentUserId,
          unreadMap,
          keys,
          computedUnreadForCurrentUser: unreadForCurrentUser,
        });

        if (exists) {
          return prev.map((chat) =>
            chat.id === updatedChat.id
              ? {
                  ...chat,
                  ...updatedChat,
                  unreadCount: { ...unreadMap },
                  unreadForCurrentUser,
                }
              : chat
          );
        } else {
          return [
            ...prev,
            {
              ...updatedChat,
              unreadCount: { ...unreadMap },
              unreadForCurrentUser,
            },
          ];
        }
      });
    },
    [currentUserId]
  );

  useEffect(() => {
    if (!currentUserId || !backendUrl) return;

    const socketUrl = `${backendUrl}/ws/chat`;

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(socketUrl, null, { withCredentials: true } as any),
      debug: (str) => console.log("[STOMP DEBUG]", str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log("STOMP connected");
        stompRef.current = client;
        setIsConnected(true);

        client.subscribe(`/user/queue/messages`, (msg) => {
          const newMessage = JSON.parse(msg.body);
          handleIncomingMessage(newMessage);
        });

        client.subscribe(`/user/queue/chat-updates`, (update) => {
          const parsedUpdate = JSON.parse(update.body);
          console.log("Received chat update:", parsedUpdate);
          handleChatUpdate(parsedUpdate);
        });

        client.subscribe(`/user/queue/session-updates`, (update) => {
          const parsedUpdate = JSON.parse(update.body);

          // 🔧 Normalize unreadCount keys
          if (parsedUpdate.unreadCount) {
            const normalizedUnread: Record<string, number> = {};
            Object.entries(parsedUpdate.unreadCount).forEach(([k, v]) => {
              const normalizedKey = k.replace(/．/g, "."); // full-width dot → ASCII dot
              normalizedUnread[normalizedKey] = v as number;
            });
            parsedUpdate.unreadCount = normalizedUnread;
          }

          console.log("Received session update (normalized):", parsedUpdate);
          handleChatSessionUpdate(parsedUpdate);
        });
      },
      onStompError: (frame) => {
        console.error("Broker error:", frame.headers["message"], frame.body);
      },
      onDisconnect: () => {
        console.log("STOMP disconnected");
        setIsConnected(false);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
      stompRef.current = null;
      setIsConnected(false);
    };
  }, [currentUserId, backendUrl]);

  // Derive messages for selected chat
  const messagesForSelectedChat = useMemo(
    () => (selectedChat ? allMessages[selectedChat] || [] : []),
    [allMessages, selectedChat]
  );

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
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const currentTotalSize = selectedFiles.reduce(
        (total, file) => total + file.size,
        0
      );
      const newFilesTotalSize = files.reduce(
        (total, file) => total + file.size,
        0
      );
      const maxSize = 12 * 1024 * 1024; // 12MB in bytes

      if (currentTotalSize + newFilesTotalSize > maxSize) {
        toast.error(
          `Total file size would exceed 12MB limit. Current: ${formatFileSize(
            currentTotalSize
          )}, Adding: ${formatFileSize(newFilesTotalSize)}`
        );
        return;
      }

      setSelectedFiles((prev) => [...prev, ...files]);
      // Create preview for supported file types
      files.forEach((file) => {
        if (canPreviewFile(file.type)) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setFilePreviews((prev) => [...prev, e.target?.result as string]);
          };
          reader.readAsDataURL(file);
        } else {
          setFilePreviews((prev) => [...prev, ""]);
        }
      });
      // Reset input
      e.target.value = "";
    }
  };

  const clearFileSelection = () => {
    setSelectedFiles([]);
    setFilePreviews([]);
  };

  const handleFileDownload = (file: { name: string; url: string }) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // fetching add user dialogue data
  useEffect(() => {
    if (showAddChatDialog || showAddUserDialog) {
      const fetchUsers = async () => {
        try {
          const res = await fetch(`${backendUrl}/api/chat/users`, {
            credentials: "include",
            method: "GET",
          });
          const data = await res.json();

          interface BackendUser {
            userId?: string;
            username: string;
            fullName?: string;
            role: string;
            profileImageBase64?: string;
            profileMimeType?: string;
          }

          const users: AvailableUser[] = (data as BackendUser[]).map(
            (user) => ({
              id: user.userId ?? "",
              name: user.fullName ?? "",
              username: user.username,
              role: user.role,
              avatar: user.profileImageBase64
                ? `data:${user.profileMimeType};base64,${user.profileImageBase64}`
                : null,
            })
          );

          console.log(
            "Fetched users IDs:",
            users.map((u) => u.id)
          );

          setAvailableUsers(users);
        } catch (err) {
          console.error("Failed to fetch chat users:", err);
        }
      };

      fetchUsers();
    }
  }, [showAddChatDialog, showAddUserDialog, backendUrl]);

  // Fetch chat sessions
  useEffect(() => {
    let mounted = true;
    async function fetchChats() {
      try {
        const res = await fetch(`${backendUrl}/api/chat/mychat`, {
          credentials: "include",
          method: "GET",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const sessions: ChatSessionDTO[] = await res.json();
        console.log("Fetched chat sessions:", sessions);

        if (mounted) {
          const sorted = sortChatSessions(sessions, currentUserId);
          setAllChats(sorted);

          // Auto-select first chat if available
          if (sorted.length > 0) {
            setSelectedChat(sorted[0].id);
          }
        }
      } catch (err) {
        console.error("Error fetching chats", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchChats();
    return () => {
      mounted = false;
    };
  }, [backendUrl, currentUserId]);

  const fetchMessages = async (chatId: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/chat/messages/${chatId}`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch messages");

      const messages: any[] = await res.json();

      const formattedMessages: ChatMessage[] = messages.map((msg) => {
        const files =
          msg.fileName?.map((name: string, index: number) => ({
            name,
            size: msg.fileSizes[index],
            type: msg.fileType[index],
            url: `data:${msg.fileType[index]};base64,${msg.fileContent[index]}`,
          })) || [];

        return {
          id: msg.id,
          sender: msg.senderId || "",
          receiver: msg.receiverId || "", // NEW FIELD
          message: msg.textContent || "",
          time: msg.timestamp,
          files,
        };
      });

      setAllMessages((prev) => ({
        ...prev,
        [chatId]: formattedMessages,
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
    if (!selectedChat || (!message.trim() && selectedFiles.length === 0))
      return;

    const tempId = `temp-${Date.now()}`;
    const now = new Date().toISOString();

    const newMessage: ChatMessage = {
      id: tempId,
      sender: currentUserId || "",
      receiver: "",
      message: message,
      time: now,
      files: selectedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      })),
    };

    setAllMessages((prev) => {
      const existingMessages = prev[selectedChat] || [];
      return {
        ...prev,
        [selectedChat]: [...existingMessages, newMessage],
      };
    });

    setAllChats((prev) => {
      const updated = prev.map((chat) =>
        chat.id === selectedChat
          ? {
              ...chat,
              lastMessage: {
                messageId: tempId,
                senderId: currentUserId || "",
                contentPreview:
                  message.trim() || (selectedFiles.length > 0 ? "[File]" : ""),
                timestamp: now,
              },
              updatedAt: now,

              unreadCount: {
                ...(chat.unreadCount || {}),
                [currentUserId || ""]: 0,
              },
              unreadForCurrentUser: 0,
            }
          : chat
      );

      return updated.sort(
        (a, b) =>
          new Date(b.lastMessage?.timestamp || b.updatedAt || 0).getTime() -
          new Date(a.lastMessage?.timestamp || a.updatedAt || 0).getTime()
      );
    });

    const filesToSend = [...selectedFiles];
    const messageText = message.trim();
    setMessage("");
    clearFileSelection();

    try {
      if (stompClient && isConnected) {
        const filesWithContent = await Promise.all(
          filesToSend.map(
            (file) =>
              new Promise<any>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                  const result = reader.result as string;
                  const base64 = result.split(",")[1] || result;
                  resolve({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    content: base64,
                  });
                };
                reader.readAsDataURL(file);
              })
          )
        );

        const payload = {
          textContent: messageText || null,
          files: filesWithContent,
        };

        console.log("Sending message via WebSocket:", payload);

        if (stompRef.current && isConnected) {
          stompRef.current.publish({
            destination: `/app/chat/${selectedChat}/send`,
            body: JSON.stringify(payload),
            headers: { "content-type": "application/json" },
          });
        } else {
          console.log("WebSocket not ready, fallback to HTTP");
        }
      } else {
        console.log("Executing HTTP Request");
        const formData = new FormData();
        formData.append("chatId", selectedChat);
        if (messageText) formData.append("textContent", messageText);
        filesToSend.forEach((file) => formData.append("files", file));

        const res = await fetch(`${backendUrl}/api/chat/send`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        if (!res.ok) throw new Error("Failed to send message");

        const savedMessage = await res.json();

        setAllMessages((prev) => {
          const updatedMessages = [...(prev[selectedChat] || [])];
          const tempIndex = updatedMessages.findIndex((m) => m.id === tempId);
          if (tempIndex !== -1) {
            updatedMessages[tempIndex] = {
              id: savedMessage.id,
              sender: savedMessage.senderId || "",
              receiver: savedMessage.receiverId || "",
              message: savedMessage.textContent || "",
              time: savedMessage.timestamp,
              files:
                savedMessage.fileName?.map((name: string, index: number) => ({
                  name,
                  size: savedMessage.fileSizes[index],
                  type: savedMessage.fileType[index],
                  url: `data:${savedMessage.fileType[index]};base64,${savedMessage.fileContent[index]}`,
                })) || [],
            };
          }
          return {
            ...prev,
            [selectedChat]: updatedMessages,
          };
        });
      }
    } catch (err) {
      console.error("Send message error:", err);

      setAllMessages((prev) => ({
        ...prev,
        [selectedChat]: (prev[selectedChat] || []).filter(
          (m) => m.id !== tempId
        ),
      }));

      toast.error("Failed to send message");
    }
  };

  const [currentChat, setCurrentChat] = useState<ChatSessionDTO | null>(null);

  useEffect(() => {
    const chat = allChats.find((c) => c.id === selectedChat) ?? null;
    setCurrentChat(chat);
  }, [allChats, selectedChat]);

  const currentMessages = (selectedChat && allMessages[selectedChat]) || [];

  // Filter chats based on search query
  const filteredChats = allChats.filter((chat) => {
    const query = searchQuery.toLowerCase();
    return (
      chat.displayName?.toLowerCase().includes(query) ||
      chat.groupName?.toLowerCase().includes(query) ||
      chat.lastMessage?.contentPreview?.toLowerCase().includes(query)
    );
  });

  // Filter available users for new chat dialog
  const filteredUsers = availableUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(newChatSearch.toLowerCase()) ||
      user.role.toLowerCase().includes(newChatSearch.toLowerCase()) ||
      user.id.toLowerCase().includes(newChatSearch.toLowerCase()) ||
      user.username.toLowerCase().includes(newChatSearch.toLowerCase())
  );

  const handleAddUser = (userId: string) => {
    if (!selectedUsers.includes(userId)) {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((id) => id !== userId));
  };

  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) return;

    try {
      // For private chat only
      if (selectedUsers.length === 1) {
        const existingChat = allChats.find(
          (chat) =>
            !chat.groupChat &&
            chat.participants.some((p) => p.userId === selectedUsers[0])
        );

        if (existingChat) {
          setSelectedChat(existingChat.id);
          setSelectedUsers([]);
          setNewChatSearch("");
          setShowAddChatDialog(false);
          return;
        }
      }

      // Otherwise, create new chat
      const payload = {
        participants: selectedUsers,
        groupChat: selectedUsers.length > 1,
        groupName: selectedUsers.length > 1 ? "New Group Chat" : null,
      };

      const res = await fetch(`${backendUrl}/api/chat/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create chat session");
      const createdChat = await res.json();

      // Refresh chat list
      const chatListRes = await fetch(`${backendUrl}/api/chat/mychat`, {
        method: "GET",
        credentials: "include",
      });
      if (!chatListRes.ok) throw new Error("Failed to fetch chat list");
      const updatedChats = await chatListRes.json();

      setAllChats(updatedChats);
      setSelectedChat(createdChat.id);

      setSelectedUsers([]);
      setNewChatSearch("");
      setShowAddChatDialog(false);
      toast.success("Chat session created successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create chat session.");
    }
  };

  const participantAvatarMap = useMemo(() => {
    const map = new Map<string, string>();
    if (currentChat) {
      currentChat.participants.forEach((participant) => {
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
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-4">
          Chat
        </h1>
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
                  <div className="p-2 ml-14 mr-14 text-gray-500 text-sm text-center">
                    Fetching your chat messages.
                  </div>
                </div>
              ) : filteredChats.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="p-2 ml-14 mr-14 text-gray-500 text-sm text-center">
                    No chats has been found
                  </div>
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
                        {!chat.groupChat &&
                          chat.participants?.find(
                            (p) => p.userId === chat.otherUserId
                          )?.online && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p
                            className={`font-semibold truncate w-25 text-sm ${
                              selectedChat === chat.id
                                ? "text-white"
                                : "text-gray-900"
                            }`}
                          >
                            {chat.displayName ||
                              chat.groupName ||
                              "Unnamed Chat"}
                          </p>
                          <span
                            className={` text-xs ${
                              selectedChat === chat.id
                                ? "text-white-80"
                                : "text-gray-500"
                            }`}
                          >
                            {chat.lastMessage?.timestamp
                              ? formatRelativeTime(chat.lastMessage.timestamp)
                              : ""}
                          </span>
                        </div>
                        <p
                          className={`text-xs mb-1 ${
                            selectedChat === chat.id
                              ? "text-white-80"
                              : "text-gray-500"
                          }`}
                        >
                          {chat.groupChat
                            ? `${chat.participants?.length || 0} members`
                            : chat.participants?.find(
                                (p) => p.userId === chat.otherUserId
                              )?.userId || "member"}
                        </p>
                        <p
                          className={`text-xs truncate ${
                            selectedChat === chat.id
                              ? "text-white/90"
                              : "text-gray-600"
                          }`}
                        >
                          {chat.lastMessage?.contentPreview ||
                            "No messages are sent in this chat..."}
                        </p>
                      </div>
                      <Badge
                        className={`bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full font-semibold
                            ${
                              Number(chat.unreadForCurrentUser) > 0
                                ? "opacity-100"
                                : "opacity-0 pointer-events-none"
                            }
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
                        currentChat.groupChat
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700"
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
                        <span className="font-semibold text-sm">
                          {currentChat.displayAvatarInitials || "?"}
                        </span>
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
                                currentChat.otherIsOnline
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                            />
                            <p
                              className={`text-sm font-medium ${
                                currentChat.otherIsOnline
                                  ? "text-gray-600"
                                  : "text-gray-400"
                              }`}
                            >
                              {currentChat.otherIsOnline
                                ? "Online now"
                                : "Offline"}
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
                      className="text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg p-2 opacity-0"
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
                        <DropdownMenuItem
                          onClick={() => setShowChatInfoDialog(true)}
                        >
                          <Info className="w-4 h-4 mr-2" />
                          View chat info
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleReport}>
                          <Flag className="w-4 h-4 mr-2" />
                          Report
                        </DropdownMenuItem>
                        {currentChat.groupChat && (
                          <DropdownMenuItem
                            onClick={() => setShowLeaveChatConfirmation(true)}
                            className="text-red-600"
                          >
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
                <div
                  className="space-y-4 h-[calc(100vh-400px)] overflow-y-auto"
                  ref={messagesContainerRef}
                >
                  {messagesForSelectedChat.length > 0 ? (
                    messagesForSelectedChat.map((msg) => {
                      const isMe = currentUserId === msg.sender;
                      const isPrivateChat =
                        currentChat && !currentChat.groupChat;

                      const participant = currentChat?.participants?.find(
                        (p) => p.userId === msg.sender
                      );

                      // For group chats, get sender info
                      const senderInfo = currentChat.groupChat
                        ? participant
                        : null;

                      return (
                        <div
                          key={msg.id}
                          className={`flex ${
                            isMe ? "justify-end" : "justify-start"
                          }`}
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
                              <div
                                className={`px-4 py-3 rounded-lg shadow-sm transition-all duration-200 ${
                                  isMe
                                    ? "bg-black text-white rounded-br-sm"
                                    : "bg-gray-100 text-gray-900 rounded-bl-sm border border-gray-200"
                                }`}
                              >
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
                                              onClick={() =>
                                                window.open(file.url, "_blank")
                                              }
                                            />
                                          </div>
                                        )}

                                        {/* File info */}
                                        <div
                                          className={`flex items-center gap-2 p-2 rounded-lg ${
                                            isMe ? "bg-white/10" : "bg-white"
                                          }`}
                                        >
                                          <div
                                            className={`p-1 rounded ${
                                              isMe
                                                ? "bg-white/20"
                                                : "bg-gray-100"
                                            }`}
                                          >
                                            {getFileIcon(file.type)}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p
                                              className={`text-sm font-medium truncate ${
                                                isMe
                                                  ? "text-white"
                                                  : "text-gray-900"
                                              }`}
                                            >
                                              {file.name}
                                            </p>
                                            <p
                                              className={`text-xs ${
                                                isMe
                                                  ? "text-white/70"
                                                  : "text-gray-500"
                                              }`}
                                            >
                                              {formatFileSize(file.size)}
                                            </p>
                                          </div>
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className={`p-1 h-auto ${
                                              isMe
                                                ? "text-white/70 hover:text-white hover:bg-white/10"
                                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                            }`}
                                            onClick={() =>
                                              handleFileDownload(file)
                                            }
                                          >
                                            <Download className="w-4 h-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {/* Message text */}
                                {msg.message && (
                                  <p className="text-sm leading-relaxed">
                                    {msg.message}
                                  </p>
                                )}
                              </div>

                              <p
                                className={`text-xs mt-1 px-1 ${
                                  isMe
                                    ? "text-right text-gray-400"
                                    : "text-left text-gray-500"
                                }`}
                              >
                                {formatRelativeTime(msg.time)}
                                {isPrivateChat && !isMe && (
                                  <span className="ml-1">• Seen</span>
                                )}
                                {currentChat.groupChat && !isMe && (
                                  <span className="ml-1">
                                    •{" "}
                                    {senderInfo
                                      ? `${senderInfo.fullName} @${
                                          senderInfo.username ||
                                          senderInfo.userId
                                        }`
                                      : "Removed User"}
                                  </span>
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
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No chat history found
                      </h3>
                      <p className="text-sm text-gray-500 max-w-sm">
                        {currentChat.groupChat
                          ? "Start the conversation with your team members. Send a message to get things started!"
                          : `Start a conversation with ${
                              currentChat.displayName || "this user"
                            }. Send a message to begin chatting!`}
                      </p>
                      <Button
                        className="mt-4 bg-black hover:bg-gray-800 text-white"
                        onClick={() => {
                          // Focus on the message input
                          const messageInput = document.querySelector(
                            'input[placeholder="Type your message..."]'
                          ) as HTMLInputElement;
                          messageInput?.focus();
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
                          {selectedFiles.length} file
                          {selectedFiles.length > 1 ? "s" : ""} selected
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          Total:{" "}
                          {formatFileSize(
                            selectedFiles.reduce(
                              (total, file) => total + file.size,
                              0
                            )
                          )}{" "}
                          / 12MB
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
                          {filePreviews[index] &&
                            file.type.startsWith("image/") && (
                              <div className="rounded-lg overflow-hidden max-w-xs">
                                <img
                                  src={
                                    filePreviews[index] || "/placeholder.svg"
                                  }
                                  alt="Preview"
                                  className="w-full h-auto max-h-32 object-cover"
                                />
                              </div>
                            )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(file.size)}
                            </p>
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
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />

                    <label
                      htmlFor="file-upload"
                      className="absolute right-2 cursor-pointer text-gray-500 hover:text-black"
                    >
                      <Paperclip className="w-5 h-5" />
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                    />
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No chat selected
                </h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  Select a chat from the list to view messages or start a new
                  conversation.
                </p>
                <Button
                  onClick={() => setShowAddChatDialog(true)}
                  className="bg-black hover:bg-gray-800 text-white"
                >
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
                  const user = availableUsers.find((u) => u.id === userId);
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
                  ) : null;
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
                    selectedUsers.includes(user.id)
                      ? "bg-gray-100"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    {user.avatar ? (
                      <img
                        src={user.avatar || "/public/images/placeholder.jpg"}
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
                      <span className="text-gray-500 text-xs ml-1">
                        @{user.username}
                      </span>
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
              <Button
                variant="outline"
                onClick={() => setShowAddChatDialog(false)}
                className="flex-1"
              >
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
            {currentChat ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-sm overflow-hidden ${
                      currentChat.groupChat
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {currentChat.displayAvatar ? (
                      <img
                        src={
                          currentChat.displayAvatar ||
                          "/public/images/placeholder.jpg"
                        }
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : currentChat.groupChat ? (
                      <Users className="w-6 h-6" />
                    ) : (
                      <span className="font-semibold">
                        {currentChat.displayAvatarInitials || "?"}
                      </span>
                    )}
                  </div>

                  <div className="flex-1">
                    {currentChat.groupChat &&
                    currentChat.roles?.[currentUserId!] === "admin" ? (
                      <div className="flex items-center gap-2">
                        {isEditingName ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="text"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveName();
                                if (e.key === "Escape") handleCancelEdit();
                              }}
                              className="flex-1 px-2 py-1 text-lg font-semibold border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter group name"
                              autoFocus
                            />
                            <Button
                              size="sm"
                              onClick={handleSaveName}
                              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelEdit}
                              className="px-2 py-1 bg-transparent"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          // DISPLAY MODE: Shows group name with edit button for admins
                          <div className="flex items-center gap-2 flex-1">
                            <h3 className="font-semibold text-lg flex-1">
                              {currentChat.displayName ||
                                currentChat.groupName ||
                                "Unnamed Chat"}
                            </h3>
                            {/* EDIT BUTTON: Click this to modify group name */}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleEditName}
                              className="hover:bg-blue-50 text-blue-600 p-1"
                              title="Edit group name"
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <h3 className="font-semibold text-lg">
                        {currentChat.displayName ||
                          currentChat.groupName ||
                          "Unnamed Chat"}
                      </h3>
                    )}
                    <p className="text-sm text-gray-600">
                      {currentChat.groupChat
                        ? `${currentChat.participants?.length || 0} members`
                        : currentChat.roles?.[currentChat.otherUserId || ""] ||
                          "member"}
                    </p>
                  </div>
                </div>

                {/* Group Members */}
                {currentChat.groupChat && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Members</h4>
                      {currentChat.roles?.[currentUserId!] === "admin" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowAddUserDialog(true)}
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>

                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {currentChat.participants?.map((participant, index) => {
                        const isAdmin =
                          currentUserId &&
                          currentChat?.roles?.[currentUserId] === "admin";

                        const isCurrentUser =
                          participant.userId === currentUserId;

                        return (
                          <div
                            key={`${participant.userId}-${index}`}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 border border-gray-100"
                          >
                            {/* Participant Info */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                {participant.avatar ? (
                                  <img
                                    src={participant.avatar}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-full"
                                  />
                                ) : (
                                  <User className="w-4 h-4 text-gray-600" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col">
                                  {participant.fullName && (
                                    <span className="text-sm font-medium text-gray-900 truncate">
                                      {participant.fullName}
                                    </span>
                                  )}
                                  {participant.username && (
                                    <span className="text-xs text-gray-600 truncate">
                                      @{participant.username}
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-500 truncate">
                                    ID: {participant.userId}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Admin / Remove Buttons */}
                            {isAdmin && !isCurrentUser && (
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="hover:bg-red-50 w-6 h-6 p-0"
                                  onClick={() => {
                                    setUserToAdmin({
                                      userId: participant.userId,
                                      fullName: participant.fullName,
                                      username: participant.username,
                                    });
                                    setShowMakeAdminConfirmation(true);
                                  }}
                                >
                                  <User className="w-4 h-4 text-gray-500" />
                                </Button>

                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 w-6 h-6 p-0"
                                  onClick={() => {
                                    setUserToRemove({
                                      userId: participant.userId,
                                      fullName: participant.fullName,
                                      username: participant.username,
                                    });
                                    setShowRemoveConfirmation(true);
                                  }}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500">No chat selected</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={showLeaveChatConfirmation}
        onOpenChange={setShowLeaveChatConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Chat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave{" "}
              <span className="font-medium">
                {currentChat?.groupName ||
                  currentChat?.displayName ||
                  "this chat"}
              </span>
              ? You will no longer receive messages from this group and will
              need to be re-added to participate again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelLeaveChat}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLeaveChat}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Leave Chat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showRemoveConfirmation}
        onOpenChange={setShowRemoveConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-medium">
                {userToRemove?.fullName ? `${userToRemove.fullName} ` : ""}
                {userToRemove?.username ? `(${userToRemove.username}) ` : ""}
                {userToRemove?.userId ? `- ${userToRemove.userId}` : ""}
              </span>{" "}
              from this group chat? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelRemoveUser}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRemoveUser}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Remove User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showMakeAdminConfirmation}
        onOpenChange={setShowMakeAdminConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Make Admin</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to make{" "}
              <span className="font-medium">
                {userToAdmin?.fullName ? `${userToAdmin.fullName} ` : ""}
                {userToAdmin?.username ? `(${userToAdmin.username}) ` : ""}
                {userToAdmin?.userId ? `- ${userToAdmin.userId}` : ""}
              </span>{" "}
              an admin of this group chat? They will be able to add/remove
              members and manage other users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelMakeAdmin}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmMakeAdmin}
              className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-600"
            >
              Make Admin
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Users to Group</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search users..."
                value={addUserSearch}
                onChange={(e) => setAddUserSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Selected Users */}
            {usersToAdd.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {usersToAdd.map((userId) => {
                  const user = availableUsers.find((u) => u.id === userId);
                  return user ? (
                    <div
                      key={userId}
                      className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                    >
                      <span>{user.name}</span>
                      <button
                        onClick={() => {
                          console.log("Removing user from selection:", userId);
                          setUsersToAdd((prev) => {
                            const newState = prev.filter((id) => id !== userId);
                            console.log("usersToAdd after remove:", newState);
                            return newState;
                          });
                        }}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            )}

            {/* Available Users List */}
            <div className="max-h-60 overflow-y-auto space-y-2">
              {availableUsers
                .filter(
                  (user) =>
                    !currentChat?.participants?.some(
                      (p) => p.userId === user.id
                    ) &&
                    (user.name
                      .toLowerCase()
                      .includes(addUserSearch.toLowerCase()) ||
                      user.username
                        .toLowerCase()
                        .includes(addUserSearch.toLowerCase()) ||
                      user.id
                        .toLowerCase()
                        .includes(addUserSearch.toLowerCase()))
                )
                .map((user) => (
                  <div
                    key={user.id}
                    onClick={() => {
                      console.log("Clicked user:", user);
                      console.log("usersToAdd before add:", usersToAdd);
                      if (!usersToAdd.includes(user.id)) {
                        setUsersToAdd((prev) => {
                          const newState = [...prev, user.id];
                          console.log("usersToAdd after add:", newState);
                          return newState;
                        });
                      }
                    }}
                    className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                      usersToAdd.includes(user.id)
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={`${user.name} avatar`}
                          className="w-full h-full object-cover rounded-full"
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
                        <span className="text-gray-500 text-xs ml-1">
                          @{user.username}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                    {usersToAdd.includes(user.id) && (
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  console.log("Cancel clicked. Resetting selection.");
                  cancelAddUsers();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  console.log(
                    "Add Users button clicked. Final usersToAdd:",
                    usersToAdd
                  );
                  handleAddUsersToGroup();
                }}
                disabled={usersToAdd.length === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Add Users
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
