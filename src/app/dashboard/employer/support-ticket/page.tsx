"use client"

import type React from "react"
import { User, ChevronUp, ChevronDown, Download, Inbox, Loader, XCircle } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Upload,
  MessageCircle,
  CheckCircle,
  Info,
  X,
  Eye,
  ImageIcon,
  FileText,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { toast } from "react-toastify"


interface TicketAttachment {
  id: string;
  files: {
    fileName: string;
    fileBytes: string; 
    contentType: string;
  }[];
}

interface TicketData {
  ticket: {
    supportTicketId: number;
    ticketSubject: string;
    ticketCategory: string;
    ticketDescription: string;
    ticketStatus: string;
    ticketPriority: string;
    ticketCreationDate: string;
    ticketUpdateDate: string;
    creatorId: string;
    creatorType: string;
    adminId?: string;
  };
  attachments: TicketAttachment[];
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  file: File
  preview?: string
}

interface StatusCount {
  status: string;
  count: number;
}


export default function SupportTicketPage() {
  const [priority, setPriority] = useState("")
  const [category, setCategory] = useState("")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [showAllTickets, setShowAllTickets] = useState(false)
  const [email, setEmail] = useState("") // auto fill
  const [name, setName] = useState("") // auto fill
  const [phone, setPhone] = useState("") // auto fill
  const [userType, setUserType] = useState("") // auto fill


  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [expandedAttachments, setExpandedAttachments] = useState<{ [key: string]: boolean }>({})
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [tickets, setTickets] = useState<TicketData[]>([]);


  const [userInfo, setUserInfo] = useState<{
    fullName: string;
    email: string;
    phoneNumber: string;
    userRole: string;
    isPremium: boolean;
  } | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [statusCounts, setStatusCounts] = useState<StatusCount[]>([]);


  useEffect(() => {
      const fetchPremiumStatus = async () => {
        try {
          const res = await fetch(`${backendUrl}/api/employer/subscription/premium-status`, {
            method: "GET",
            credentials: "include", 
          })
  
          if (!res.ok) {
            throw new Error("Failed to fetch premium status")
          }
  
          const data: boolean = await res.json()

          if (data === true) {
            setUserInfo(prev => prev ? { ...prev, isPremium: true } : { 
              fullName: "",
              email: "",
              phoneNumber: "",
              userRole: "",
              isPremium: true
            });
          }


        } catch (error) {
          console.error(error)
        }
      }
    
        fetchPremiumStatus()
      }, [])

  const downloadFile = (fileName: string, fileBytes: string, contentType: string) => {
    // Convert base64 to bytes
    const byteCharacters = atob(fileBytes);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create blob and download
    const blob = new Blob([byteArray], { type: contentType });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  };

    useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/tickets/my-tickets`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: TicketData[] = await res.json();
        setTickets(data);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
      }
    };

    fetchTickets();
  }, [backendUrl]);

  useEffect(() => {
    const fetchStatusCounts = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/tickets/status-counts`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: StatusCount[] = await res.json();
        setStatusCounts(data);
      } catch (err) {
        console.error("Failed to fetch ticket status counts:", err);
      }
    };

    fetchStatusCounts();
  }, [backendUrl]);

  // function start here
  const fetchAndSetUserInfo = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/tickets/user-info`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();
      setEmail(data.email || "");
      setName(data.fullName || "");
      setPhone(data.phoneNumber || "");
      setUserType(data.userRole || "");
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  useEffect(() => {
    fetchAndSetUserInfo();
  }, []);


  const getTotalFileSize = () => {
    return uploadedFiles.reduce((total, file) => total + file.size, 0)
  }

  const isFileSizeValid = () => {
    const totalSize = getTotalFileSize()
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes
    return totalSize <= maxSize
  }

  const isFormValid =
    name.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim() !== "" &&
    userType !== "" &&
    category !== "" &&
    priority !== "" &&
    subject.trim() !== "" &&
    description.trim() !== "" &&
    isFileSizeValid()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("priority", priority);

    uploadedFiles.forEach((file) => {
      formData.append("attachments", file.file); 
    });

    try {
      const res = await fetch(`${backendUrl}/api/tickets/create`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit ticket");

      toast.success("Support ticket submitted successfully! Our Support Team will reach out to you within 24 hours!");

      setTimeout(() => {
        window.location.reload();
      }, 3000);

      setSubject("");
      setDescription("");
      setCategory("");
      setPriority("");
      setUploadedFiles([]);

      fetchAndSetUserInfo();

    } catch (err: any) {
      console.error(err);
      toast.error(`Error: ${err.message}`);
    }
  };

  const processFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = []
    let totalNewSize = 0

    files.forEach((file) => {
      const fileId = Math.random().toString(36).substr(2, 9)
      const newFile: UploadedFile = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
      }
      newFiles.push(newFile)
      totalNewSize += file.size
    })

    const currentTotalSize = getTotalFileSize()
    const maxSize = 10 * 1024 * 1024 // 10MB in bytes

    if (currentTotalSize + totalNewSize > maxSize) {
      toast.error(`File size limit exceeded 10MB Current total: ${formatFileSize(currentTotalSize + totalNewSize)}`)
    }

    newFiles.forEach((newFile) => {
      if (newFile.file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === newFile.id ? { ...f, preview: e.target?.result as string } : f)),
          )
        }
        reader.readAsDataURL(newFile.file)
      }

      setUploadedFiles((prev) => [...prev, newFile])
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    processFiles(files)

    if (event.target) {
      event.target.value = ""
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    return <FileText className="h-4 w-4" />
  }

  const handleViewDetails = (ticket: any) => {
    setSelectedTicket(ticket)
  }

  const toggleAttachments = (ticketId: string) => {
    setExpandedAttachments((prev) => ({
      ...prev,
      [ticketId]: !prev[ticketId],
    }))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800 border border-red-200"
      case "in_progress":
        return "bg-orange-800 text-white"
      case "resolved":
        return "bg-green-100 text-green-800 border border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "premium":
        return "bg-black-500 text-white-500"
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-green-100 text-green-800"
    }
  }

  return (
    <div className="w-full sm:max-w-8xl mx-auto space-y-6 mb-5 -ml-10 sm:ml-0">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-4">Support Center</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
              { label: "Closed Tickets", icon: XCircle, status: "closed" },
              { label: "Open Tickets", icon: Inbox, status: "open" },
              { label: "In Progress", icon: Loader, status: "in_progress" },
              { label: "Resolved", icon: CheckCircle, status: "resolved" },
            ].map((item) => {
              const countObj = statusCounts.find((s) => s.status === item.status);
              const count = countObj ? countObj.count : 0;

              return (
                <Card
                  key={item.status}
                  className="group relative overflow-hidden border border-gray-200 bg-white hover:border-black transition-all duration-300 hover:shadow-lg rounded-xl"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{item.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{count}</p>
                      </div>
                      <div className="p-2 bg-gray-100 group-hover:bg-black rounded-lg transition-all duration-300">
                        <item.icon className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-gray-200 shadow-md bg-white rounded-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Submit Support Ticket</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    readOnly
                    placeholder="Enter your full name"
                    className="border border-gray-200 h-11 rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    readOnly
                    placeholder="Enter your email"
                    className="border border-gray-200 h-11 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    readOnly
                    className="border border-gray-200 h-11 rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userType" className="text-sm font-semibold text-gray-700">
                    User Type *
                  </Label>
                  <Select value={userType} onValueChange={() => {}} required>
                    <SelectTrigger className="border border-gray-200 h-11 rounded-lg bg-gray-100 pointer-events-none">
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freelancer">Freelancer</SelectItem>
                      <SelectItem value="employer">Employer</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-sm font-semibold text-gray-700">
                    Category *
                  </Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger className="border border-gray-200 h-11 rounded-lg">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="account">Account Issues</SelectItem>
                      <SelectItem value="billing">Billing & Payments</SelectItem>
                      <SelectItem value="technical">Technical Support</SelectItem>
                      <SelectItem value="jobs">Job Posting/Applications</SelectItem>
                      <SelectItem value="profile">Profile & Verification</SelectItem>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="report">Report</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-sm font-semibold text-gray-700">
                    Priority *
                  </Label>
                  <Select value={priority} onValueChange={setPriority} required>
                    <SelectTrigger className="border border-gray-200 h-11 rounded-lg">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low - General question</SelectItem>
                      <SelectItem value="medium">Medium - Needs attention soon</SelectItem>
                      <SelectItem value="high">High - Urgent issue</SelectItem>
                          {userInfo?.isPremium && (
                            <SelectItem value="premium">
                              Premium - All issues receive priority support
                            </SelectItem>
                          )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-semibold text-gray-700">
                  Subject *
                </Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief description of your issue"
                  className="border border-gray-200 h-11 rounded-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please provide detailed information about your issue, including steps to reproduce if applicable..."
                  className="border border-gray-200 rounded-lg min-h-[120px] resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Attachments (Optional)</Label>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">Total size: {formatFileSize(getTotalFileSize())} / 10MB</p>
                  {!isFileSizeValid() && <p className="text-xs text-red-500 font-medium">File size limit exceeded!</p>}
                </div>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                    isDragOver
                      ? "border-black bg-gray-50"
                      : !isFileSizeValid()
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className={`h-8 w-8 mx-auto mb-2 ${!isFileSizeValid() ? "text-red-400" : "text-gray-400"}`} />
                  <p className={`text-sm mb-1 ${!isFileSizeValid() ? "text-red-600" : "text-gray-600"}`}>
                    {isDragOver ? "Drop files here" : "Click to upload or drag and drop"}
                  </p>
                  <p className={`text-xs ${!isFileSizeValid() ? "text-red-500" : "text-gray-500"}`}>
                    PNG, JPG, PDF up to 10MB total (Multiple files allowed)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <Label className="text-sm font-semibold text-gray-700">Uploaded Files</Label>
                    <div className="space-y-2">
                      {uploadedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          {file.preview ? (
                            <img
                              src={file.preview || "/public/images/placeholder.jpg"}
                              alt={file.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                              {getFileIcon(file.type)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={!isFormValid}
                className={`w-full h-12 rounded-lg font-semibold transition-all ${
                  isFormValid ? "bg-black hover:bg-gray-800 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Ticket
              </Button>
              {!isFormValid && (
                <p className="text-xs text-red-500 text-center">
                  {!isFileSizeValid()
                    ? "Total file size must not exceed 10MB"
                    : "Please fill in all required fields to submit your ticket"}
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black rounded-lg">
                  <Info className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Contact Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Mail className="h-4 w-4 text-gray-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Email Support</p>
                  <p className="text-sm text-gray-600">admin@gigsuniverse.studio</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Phone className="h-4 w-4 text-gray-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Phone Support</p>
                  <p className="text-sm text-gray-600">+60 11-2345 6789</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <MapPin className="h-4 w-4 text-gray-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Office Address</p>
                  <p className="text-sm text-gray-600">GigsUniverse Sdn. Bhd., Kuala Lumpur, Malaysia</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="h-4 w-4 text-gray-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Business Hours</p>
                  <p className="text-sm text-gray-600">Mon-Fri: 9AM-6PM GMT+8</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900">Your Recent Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tickets.slice(0, 3).map((t) => {
                const ticket = t.ticket; 
                return (
                  <div key={ticket.supportTicketId} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 text-sm">TK-{ticket.supportTicketId}</span>
                      <Badge className={getStatusColor(ticket.ticketStatus)}>{ticket.ticketStatus}</Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{ticket.ticketSubject}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{new Date(ticket.ticketCreationDate).toLocaleDateString()}</span>
                      <Badge className={getPriorityColor(ticket.ticketPriority)} variant="outline">
                        {ticket.ticketPriority}
                      </Badge>
                    </div>
                  </div>
                );
              })}
              <br />
              <Button
                variant="outline"
                className="w-full border border-gray-200 bg-white hover:bg-gray-50 h-10 rounded-lg font-semibold"
                onClick={() => setShowAllTickets(true)}
              >
                View All Tickets
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {showAllTickets && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">All Support Tickets</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllTickets(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] space-y-4">
              {tickets.map((t) => {
                const ticket = t.ticket;
                return (
                  <Card
                    key={ticket.supportTicketId}
                    className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-gray-900">
                                  TK-{ticket.supportTicketId}
                                </h3>
                                <Badge className={getStatusColor(ticket.ticketStatus)}>
                                  {ticket.ticketStatus}
                                </Badge>
                                <Badge
                                  className={getPriorityColor(ticket.ticketPriority)}
                                  variant="outline"
                                >
                                  {ticket.ticketPriority}
                                </Badge>
                              </div>
                              <h4 className="text-md font-semibold text-gray-800 mb-1">
                                {ticket.ticketSubject}
                              </h4>
                              <p className="text-sm text-gray-600">{ticket.ticketCategory}</p>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-4 leading-relaxed">
                            {ticket.ticketDescription}
                          </p>

                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <span>
                              Created: {new Date(ticket.ticketCreationDate).toLocaleDateString()}
                            </span>
                            <span>
                              Last Update: {new Date(ticket.ticketUpdateDate).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>Admin: {ticket.adminId || "Unassigned"}</span>
                            </div>
                          </div>

                          {t.attachments.length > 0 && (
                            <div className="mb-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleAttachments(ticket.supportTicketId.toString())}
                                className="text-gray-600 hover:text-gray-800 p-0 h-auto font-normal"
                              >
                                <div className="flex items-center gap-2">
                                  {expandedAttachments[ticket.supportTicketId] ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                  <span>
                                    {t.attachments.reduce(
                                      (acc, att) => acc + att.files.length,
                                      0
                                    )}{" "}
                                    attachment
                                    {t.attachments.reduce(
                                      (acc, att) => acc + att.files.length,
                                      0
                                    ) > 1
                                      ? "s"
                                      : ""}
                                  </span>
                                </div>
                              </Button>

                              {expandedAttachments[ticket.supportTicketId] && (
                                <div className="mt-2 space-y-2 pl-6">
                                  {t.attachments.map((att) =>
                                    att.files.map((f, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                                      >
                                        {getFileIcon(f.contentType)}
                                        <div className="flex-1">
                                          <p className="text-sm font-medium text-gray-900">
                                            {f.fileName}
                                          </p>
                                          <p className="text-xs text-gray-500">
                                            {(f.fileBytes.length / 1024).toFixed(2)} KB
                                          </p>
                                        </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-gray-500 hover:text-gray-700"
                                            onClick={() => downloadFile(f.fileName, f.fileBytes, f.contentType)}
                                          >
                                            <Download className="h-4 w-4" />
                                          </Button>
                                      </div>
                                    ))
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 lg:ml-4 lg:min-w-[140px]">
                          <Button
                            size="sm"
                            onClick={() => handleViewDetails(t)}
                            className="bg-black hover:bg-gray-800 text-white h-9 rounded-lg font-semibold"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}

    {selectedTicket && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                TK-{selectedTicket.ticket.supportTicketId}
              </h2>
              <p className="text-gray-600">{selectedTicket.ticket.ticketSubject}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTicket(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </Button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Badge className={getStatusColor(selectedTicket.ticket.ticketStatus)}>
                  {selectedTicket.ticket.ticketStatus}
                </Badge>
                <Badge
                  className={getPriorityColor(selectedTicket.ticket.ticketPriority)}
                  variant="outline"
                >
                  {selectedTicket.ticket.ticketPriority}
                </Badge>
                <span className="text-sm text-gray-500">
                  Category: {selectedTicket.ticket.ticketCategory}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedTicket.ticket.ticketDescription}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Admin Handler</h4>
                  <p className="text-gray-600">
                    {selectedTicket.ticket.adminId || "Unassigned"}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Timeline</h4>
                  <p className="text-sm text-gray-600">
                    Created: {new Date(selectedTicket.ticket.ticketCreationDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Last Update: {new Date(selectedTicket.ticket.ticketUpdateDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {selectedTicket.attachments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Attachments ({selectedTicket.attachments.reduce((acc: number, att: TicketAttachment) => acc + att.files.length, 0)})
                  </h3>
                  <div className="space-y-3">
                    {selectedTicket.attachments.map((att: TicketAttachment) =>
                      att.files.map((f, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="p-2 bg-white rounded-lg">{getFileIcon(f.contentType)}</div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{f.fileName}</p>
                            <p className="text-sm text-gray-500">{(f.fileBytes.length / 1024).toFixed(2)} KB</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-gray-600 hover:text-gray-800 bg-transparent"
                            onClick={() => downloadFile(f.fileName, f.fileBytes, f.contentType)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )}

    </div>
  )
}
