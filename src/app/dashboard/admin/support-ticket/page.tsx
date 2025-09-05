"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Search,
  Filter,
  MessageSquare,
  UserCheck,
  Download,
  Eye,
  FileText,
  ImageIcon,
  File,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"
import { toast } from "react-toastify"
import Link from "next/link"

interface SupportTicket {
  supportTicketId: number
  ticketSubject: string
  ticketCategory: string
  ticketDescription: string
  ticketStatus: "open" | "in_progress" | "closed" | "resolved"
  ticketPriority: "low" | "medium" | "high" | "premium"
  ticketCreationDate: string
  ticketUpdateDate: string
  creatorId: string
  creatorType: string
  creatorName: string
  adminId?: string
  adminName?: string
}

interface FileData {
  fileName: string
  fileBase64: string
  contentType: string
}

interface TicketAttachment {
  id: string
  supportTicketId: number
  files: FileData[]
}

interface TicketWithAttachments {
  ticket: SupportTicket
  attachments: TicketAttachment[]
}

export default function AdminSupportTicketsPage() {
  const [tickets, setTickets] = useState<TicketWithAttachments[]>([])
  const [filteredTickets, setFilteredTickets] = useState<TicketWithAttachments[]>([])
  const [selectedTicket, setSelectedTicket] = useState<TicketWithAttachments | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [assignmentFilter, setAssignmentFilter] = useState<string>("all")
  const [messageDialogOpen, setMessageDialogOpen] = useState(false)
  const [messageContent, setMessageContent] = useState("")

  const [adminData, setAdminData] = useState<{ adminId: string; adminFullName: string } | null>(null)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/tickets/admin-info`, { credentials: "include" })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setAdminData(data)
        console.log("Admin info response:", data)
      } catch (err) {
        console.error("Failed to fetch tickets:", err)
      }
    }

    fetchAdminData()
  }, [])

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/tickets/all-tickets`, { credentials: "include" })
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setTickets(data)
        setFilteredTickets(data)
      } catch (err) {
        console.error("Failed to fetch tickets:", err)
      }
    }

    fetchTickets()
  }, [])

  useEffect(() => {
    const filtered = tickets.filter((item) => {
      const ticket = item.ticket
      const matchesSearch =
        ticket.ticketSubject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.creatorId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.adminName && ticket.adminName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ticket.adminId && ticket.adminId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        ticket.supportTicketId.toString().includes(searchTerm)

      const matchesStatus = statusFilter === "all" || ticket.ticketStatus === statusFilter
      const matchesPriority = priorityFilter === "all" || ticket.ticketPriority === priorityFilter

      let matchesAssignment = true
      if (assignmentFilter === "assigned") {
        matchesAssignment = !!ticket.adminId
      } else if (assignmentFilter === "unassigned") {
        matchesAssignment = !ticket.adminId
      } else if (assignmentFilter === "my_tickets") {
        matchesAssignment = ticket.adminId === adminData?.adminId
      }

      return matchesSearch && matchesStatus && matchesPriority && matchesAssignment
    })

    setFilteredTickets(filtered)
  }, [searchTerm, statusFilter, priorityFilter, assignmentFilter, tickets, adminData?.adminId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800 border-red-200"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "premium":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="h-4 w-4" />
      case "in_progress":
        return <Clock className="h-4 w-4" />
      case "resolved":
        return <CheckCircle className="h-4 w-4" />
      case "closed":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const handleAssignTicket = async (ticketId: number) => {
    try {
      const response = await fetch(`${backendUrl}/api/tickets/assign/${ticketId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId: adminData?.adminId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to assign ticket")
      }

      toast.success("Ticket assigned successfully.")

      setTickets((prev) =>
        prev.map((item) =>
          item.ticket.supportTicketId === ticketId
            ? {
                ...item,
                ticket: {
                  ...item.ticket,
                  adminId: adminData?.adminId,
                  adminName: adminData?.adminFullName,
                  ticketStatus: "in_progress",
                  ticketUpdateDate: new Date().toISOString(),
                },
              }
            : item,
        ),
      )
    } catch (error) {
      console.error("Failed to assign ticket:", error)
      toast.error("Failed to assign ticket.")
    }
  }

  const handleStatusChange = async (ticketId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/tickets/${ticketId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      setTickets((prev) =>
        prev.map((item) =>
          item.ticket.supportTicketId === ticketId
            ? {
                ...item,
                ticket: {
                  ...item.ticket,
                  ticketStatus: newStatus as any,
                  ticketUpdateDate: new Date().toISOString(),
                },
              }
            : item,
        ),
      )
    } catch (error) {
      console.error("Failed to update ticket status:", error)
    }
  }

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-blue-600" />
    if (contentType.includes("pdf")) return <FileText className="h-5 w-5 text-red-600" />
    if (contentType.includes("document") || contentType.includes("docx"))
      return <FileText className="h-5 w-5 text-blue-600" />
    return <File className="h-5 w-5 text-gray-600" />
  }

  const downloadFile = (fileName: string, fileBase64: string, contentType: string) => {
    const byteCharacters = atob(fileBase64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: contentType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="w-full sm:max-w-8xl min-w-md mx-auto space-y-6 mb-5 -ml-18 sm:ml-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage and respond to user support requests</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs sm:text-sm">
            Total: {tickets.length}
          </Badge>
          <Badge variant="outline" className="text-xs sm:text-sm">
            Unassigned: {tickets.filter((t) => !t.ticket.adminId).length}
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
            <div className="relative sm:col-span-2 lg:col-span-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tickets, users, IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Assignment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tickets</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                <SelectItem value="my_tickets">My Tickets</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setPriorityFilter("all")
                setAssignmentFilter("all")
              }}
              className="text-sm sm:col-span-2 lg:col-span-1"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Support Tickets ({filteredTickets.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTickets.map((item) => (
              <div
                key={item.ticket.supportTicketId}
                className="border rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <h3 className="font-semibold text-base sm:text-lg">TK-{item.ticket.supportTicketId}</h3>
                      <Badge className={`${getStatusColor(item.ticket.ticketStatus)} text-xs`}>
                        {getStatusIcon(item.ticket.ticketStatus)}
                        <span className="ml-1">{item.ticket.ticketStatus.replace("_", " ")}</span>
                      </Badge>
                      <Badge className={`${getPriorityColor(item.ticket.ticketPriority)} text-xs`} variant="outline">
                        {item.ticket.ticketPriority}
                      </Badge>
                    </div>

                    <h4 className="text-gray-900 font-medium text-sm sm:text-base break-words">
                      {item.ticket.ticketSubject}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">
                          Creator: {item.ticket.creatorName} ({item.ticket.creatorType})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="truncate">
                          Admin: {item.ticket.adminName ? `${item.ticket.adminName} (admin)` : "Unassigned"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span>Created: {new Date(item.ticket.ticketCreationDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-2 lg:ml-4 min-w-0">
                    {!item.ticket.adminId && (
                      <Button
                        size="sm"
                        onClick={() => handleAssignTicket(item.ticket.supportTicketId)}
                        className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm whitespace-nowrap"
                      >
                        <UserCheck className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Handle
                      </Button>
                    )}

                    <Link href={`/dashboard/admin/chat?userId=${item.ticket.creatorId}`} className="w-full sm:w-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs sm:text-sm whitespace-nowrap bg-transparent"
                        onClick={() => setSelectedTicket(item)}
                      >
                        <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Message
                      </Button>
                    </Link>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs sm:text-sm whitespace-nowrap bg-transparent"
                          onClick={() => setSelectedTicket(item)}
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
                        <DialogHeader>
                          <DialogTitle className="text-base sm:text-lg">
                            Ticket Details - TK-{selectedTicket?.ticket.supportTicketId}
                          </DialogTitle>
                        </DialogHeader>
                        {selectedTicket && (
                          <TicketDetailsModal
                            ticket={selectedTicket}
                            onStatusChange={handleStatusChange}
                            setTickets={setTickets}
                            onClose={() => setSelectedTicket(null)}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            ))}

            {filteredTickets.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm sm:text-base">
                No tickets found matching your criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="mx-4">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">Send Message to User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Recipient</Label>
              <p className="text-xs sm:text-sm text-gray-600">
                {selectedTicket?.ticket.creatorName} ({selectedTicket?.ticket.creatorId})
              </p>
            </div>
            <div>
              <Label htmlFor="message" className="text-sm">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                rows={4}
                className="text-sm"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button variant="outline" onClick={() => setMessageDialogOpen(false)} className="text-sm">
                Cancel
              </Button>
              <Button className="text-sm">Send Message</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Ticket Details Modal Component
function TicketDetailsModal({
  ticket,
  onStatusChange,
  setTickets,
  onClose,
}: {
  ticket: TicketWithAttachments
  onStatusChange: (ticketId: number, status: string) => void
  setTickets: React.Dispatch<React.SetStateAction<TicketWithAttachments[]>>
  onClose: () => void
}) {
  const [newStatus, setNewStatus] = useState(ticket.ticket.ticketStatus)
  const [previewFile, setPreviewFile] = useState<FileData | null>(null)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const handleStatusUpdate = async (ticketId: string, updatedStatus: string) => {
    try {
      const response = await fetch(`${backendUrl}/api/tickets/${ticketId}/status`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: updatedStatus }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.status}`)
      }

      onStatusChange(ticket.ticket.supportTicketId, updatedStatus)

      setTickets((prev) =>
        prev.map((item) =>
          item.ticket.supportTicketId === ticket.ticket.supportTicketId
            ? {
                ...item,
                ticket: {
                  ...item.ticket,
                  ticketStatus: updatedStatus as "open" | "in_progress" | "closed" | "resolved",
                  ticketUpdateDate: new Date().toISOString(),
                },
              }
            : item,
        ),
      )

      toast.success("Successfully updated ticket status.")
    } catch (err) {
      console.error("Error updating ticket status:", err)
      toast.error(`Failed to update ticket status: ${err instanceof Error ? err.message : "Unknown error"}`)
    }
  }

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith("image/")) return <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
    if (contentType.includes("pdf")) return <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
    if (contentType.includes("document") || contentType.includes("docx"))
      return <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
    return <File className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
  }

  const downloadFile = (fileName: string, fileBase64: string, contentType: string) => {
    const byteCharacters = atob(fileBase64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: contentType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const createPreviewUrl = (fileBase64: string, contentType: string) => {
    const byteCharacters = atob(fileBase64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: contentType })
    return URL.createObjectURL(blob)
  }

  const renderFilePreview = (file: FileData) => {
    if (file.contentType.startsWith("image/")) {
      return (
        <div className="mt-2">
          <img
            src={createPreviewUrl(file.fileBase64, file.contentType) || "/public/images/placeholder.jpg"}
            alt={file.fileName}
            className="max-w-full max-h-48 sm:max-h-64 rounded-lg border"
          />
        </div>
      )
    } else if (file.contentType.includes("pdf")) {
      return (
        <div className="mt-2">
          <iframe
            src={createPreviewUrl(file.fileBase64, file.contentType)}
            className="w-full h-48 sm:h-64 border rounded-lg"
            title={file.fileName}
          />
        </div>
      )
    } else if (file.contentType.includes("text/")) {
      const textContent = atob(file.fileBase64)
      return (
        <div className="mt-2 p-3 bg-gray-50 rounded-lg border max-h-32 overflow-y-auto">
          <pre className="text-xs sm:text-sm whitespace-pre-wrap">{textContent}</pre>
        </div>
      )
    }
    return (
      <div className="mt-2 p-3 bg-gray-50 rounded-lg border text-center text-gray-500 text-sm">
        Preview not available for this file type
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Ticket Details Section */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          Ticket Information
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 text-sm">
          <div>
            <Label className="font-medium text-gray-700 text-xs sm:text-sm">Subject</Label>
            <p className="mt-1 p-2 bg-gray-50 rounded text-xs sm:text-sm break-words">{ticket.ticket.ticketSubject}</p>
          </div>
          <div>
            <Label className="font-medium text-gray-700 text-xs sm:text-sm">Category</Label>
            <p className="mt-1 p-2 bg-gray-50 rounded text-xs sm:text-sm">{ticket.ticket.ticketCategory}</p>
          </div>
          <div>
            <Label className="font-medium text-gray-700 text-xs sm:text-sm">Creator</Label>
            <p className="mt-1 p-2 bg-gray-50 rounded text-xs sm:text-sm break-words">
              {ticket.ticket.creatorName} ({ticket.ticket.creatorType})
            </p>
          </div>
          <div>
            <Label className="font-medium text-gray-700 text-xs sm:text-sm">Admin Handler</Label>
            <p className="mt-1 p-2 bg-gray-50 rounded text-xs sm:text-sm break-words">
              {ticket.ticket.adminName ? `${ticket.ticket.adminName} (admin)` : "Unassigned"}
            </p>
          </div>
          <div>
            <Label className="font-medium text-gray-700 text-xs sm:text-sm">Created</Label>
            <p className="mt-1 p-2 bg-gray-50 rounded text-xs sm:text-sm">
              {new Date(ticket.ticket.ticketCreationDate).toLocaleString()}
            </p>
          </div>
          <div>
            <Label className="font-medium text-gray-700 text-xs sm:text-sm">Last Updated</Label>
            <p className="mt-1 p-2 bg-gray-50 rounded text-xs sm:text-sm">
              {new Date(ticket.ticket.ticketUpdateDate).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <Label className="font-medium text-gray-700 text-xs sm:text-sm">Description</Label>
          <p className="mt-1 p-3 bg-gray-50 rounded-md text-xs sm:text-sm leading-relaxed break-words">
            {ticket.ticket.ticketDescription}
          </p>
        </div>
      </div>

      {/* Attachments Section */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
          <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
          Attachments ({ticket.attachments.reduce((acc, att) => acc + att.files.length, 0)})
        </h3>
        {ticket.attachments.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {ticket.attachments.map((attachment) =>
              attachment.files.map((file, idx) => (
                <div key={idx} className="border rounded-lg p-3 sm:p-4 bg-white">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-3">
                    <div className="p-2 bg-gray-100 rounded-lg self-start">{getFileIcon(file.contentType)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm break-words">{file.fileName}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{file.contentType}</p>
                      <p className="text-xs text-gray-400">
                        Size: {Math.round((file.fileBase64.length * 3) / 4 / 1024)} KB
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(file.fileName, file.fileBase64, file.contentType)}
                        className="text-xs sm:text-sm"
                      >
                        <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPreviewFile(previewFile?.fileName === file.fileName ? null : file)}
                        className="text-xs sm:text-sm"
                      >
                        <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {previewFile?.fileName === file.fileName ? "Hide" : "Preview"}
                      </Button>
                    </div>
                  </div>

                  {previewFile?.fileName === file.fileName && (
                    <div className="border-t pt-3">
                      <Label className="font-medium text-gray-700 mb-2 block text-xs sm:text-sm">Preview:</Label>
                      {renderFilePreview(file)}
                    </div>
                  )}
                </div>
              )),
            )}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
            <FileText className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No attachments found</p>
          </div>
        )}
      </div>

      {/* Actions Section */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
          <UserCheck className="h-4 w-4 sm:h-5 sm:w-5" />
          Actions
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="status" className="font-medium text-gray-700 mb-2 block text-xs sm:text-sm">
              Update Status
            </Label>
            <Select
              value={newStatus}
              onValueChange={(value) => setNewStatus(value as "open" | "in_progress" | "closed" | "resolved")}
            >
              <SelectTrigger className="mt-1 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
            <Button
              onClick={() => handleStatusUpdate(ticket.ticket.supportTicketId.toString(), newStatus)}
              disabled={newStatus === ticket.ticket.ticketStatus}
              className="bg-black text-white hover:bg-white hover:text-black text-sm"
            >
              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Update Status
            </Button>
            <Button variant="outline" onClick={onClose} className="text-sm bg-transparent">
              <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
