"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Upload,
  MessageCircle,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react"
import { useState } from "react"

const allTickets = [
  {
    id: "TK-001",
    subject: "Payment processing issue",
    status: "Open",
    priority: "High",
    created: "Dec 8, 2024",
    category: "Billing",
    description: "Unable to process payment for completed project. Error occurs during checkout.",
    lastUpdate: "Dec 8, 2024",
  },
  {
    id: "TK-002",
    subject: "Profile verification help",
    status: "In Progress",
    priority: "Medium",
    created: "Dec 6, 2024",
    category: "Account",
    description: "Need assistance with identity verification process for freelancer profile.",
    lastUpdate: "Dec 7, 2024",
  },
  {
    id: "TK-003",
    subject: "Job posting guidelines",
    status: "Resolved",
    priority: "Low",
    created: "Dec 4, 2024",
    category: "General",
    description: "Questions about job posting requirements and best practices.",
    lastUpdate: "Dec 5, 2024",
  },
  {
    id: "TK-004",
    subject: "Account suspension appeal",
    status: "Under Review",
    priority: "High",
    created: "Dec 2, 2024",
    category: "Account",
    description: "Requesting review of account suspension due to policy violation.",
    lastUpdate: "Dec 3, 2024",
  },
  {
    id: "TK-005",
    subject: "Feature request - Dark mode",
    status: "Open",
    priority: "Low",
    created: "Nov 30, 2024",
    category: "Feature Request",
    description: "Would like to request dark mode theme option for the platform.",
    lastUpdate: "Nov 30, 2024",
  },
  {
    id: "TK-006",
    subject: "Bug report - Chat notifications",
    status: "Resolved",
    priority: "Medium",
    created: "Nov 28, 2024",
    category: "Technical",
    description: "Chat notifications not working properly on mobile devices.",
    lastUpdate: "Nov 29, 2024",
  },
  {
    id: "TK-007",
    subject: "Refund request",
    status: "Closed",
    priority: "Medium",
    created: "Nov 25, 2024",
    category: "Billing",
    description: "Requesting refund for cancelled project due to client unavailability.",
    lastUpdate: "Nov 27, 2024",
  },
  {
    id: "TK-008",
    subject: "Portfolio upload issues",
    status: "Resolved",
    priority: "Low",
    created: "Nov 22, 2024",
    category: "Technical",
    description: "Unable to upload portfolio images. Files appear corrupted after upload.",
    lastUpdate: "Nov 23, 2024",
  },
]

export default function SupportTicketPage() {
  const [userType, setUserType] = useState("")
  const [priority, setPriority] = useState("")
  const [category, setCategory] = useState("")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [showAllTickets, setShowAllTickets] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Support ticket submitted")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800 border border-red-200"
      case "In Progress":
        return "bg-black text-white"
      case "Resolved":
        return "bg-green-100 text-green-800 border border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="max-w-8xl mx-auto sm:px-6 lg:px-8 space-y-6 sm:mr-0 mr-20 mb-5">
      {/* Support Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-4">Support Center</h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="group relative overflow-hidden border border-gray-200 bg-white hover:border-black transition-all duration-300 hover:shadow-lg rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Response Time</p>
                <p className="text-2xl font-bold text-gray-900">&lt; 24h</p>
              </div>
              <div className="p-2 bg-gray-100 group-hover:bg-black rounded-lg transition-all duration-300">
                <Clock className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border border-gray-200 bg-white hover:border-black transition-all duration-300 hover:shadow-lg rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Open Tickets</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <div className="p-2 bg-gray-100 group-hover:bg-black rounded-lg transition-all duration-300">
                <AlertCircle className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border border-gray-200 bg-white hover:border-black transition-all duration-300 hover:shadow-lg rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">15</p>
              </div>
              <div className="p-2 bg-gray-100 group-hover:bg-black rounded-lg transition-all duration-300">
                <CheckCircle className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group relative overflow-hidden border border-gray-200 bg-white hover:border-black transition-all duration-300 hover:shadow-lg rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900">98%</p>
              </div>
              <div className="p-2 bg-gray-100 group-hover:bg-black rounded-lg transition-all duration-300">
                <HelpCircle className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors duration-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit New Ticket */}
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
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    placeholder="Enter your email"
                    className="border border-gray-200 h-11 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="border border-gray-200 h-11 rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userType" className="text-sm font-semibold text-gray-700">
                    User Type *
                  </Label>
                  <Select value={userType} onValueChange={setUserType} required>
                    <SelectTrigger className="border border-gray-200 h-11 rounded-lg">
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

              {/* Ticket Details */}
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
                      <SelectItem value="medium">Medium - Affects functionality</SelectItem>
                      <SelectItem value="high">High - Urgent issue</SelectItem>
                      <SelectItem value="critical">Critical - System down</SelectItem>
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

              {/* File Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Attachments (Optional)</Label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 transition-colors">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white h-12 rounded-lg font-semibold"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Ticket
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
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
                  <p className="text-sm text-gray-600">
                    GigsUniverse Sdn. Bhd., Kuala Lumpur, Malaysia
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock className="h-4 w-4 text-gray-700" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Business Hours</p>
                  <p className="text-sm text-gray-600">
                    Mon-Fri: 9AM-6PM GMT+8
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Tickets */}
          <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900">Your Recent Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {allTickets.slice(0, 3).map((ticket) => (
                <div key={ticket.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 text-sm">{ticket.id}</span>
                    <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{ticket.subject}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{ticket.created}</span>
                    <Badge className={getPriorityColor(ticket.priority)} variant="outline">
                      {ticket.priority}
                    </Badge>
                  </div>
                </div>
              ))}
              <br/>
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
      {/* All Tickets Modal */}
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
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="space-y-4">
                {allTickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className="border border-gray-200 shadow-sm bg-white hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-gray-900">{ticket.id}</h3>
                                <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                                <Badge className={getPriorityColor(ticket.priority)} variant="outline">
                                  {ticket.priority}
                                </Badge>
                              </div>
                              <h4 className="text-md font-semibold text-gray-800 mb-1">{ticket.subject}</h4>
                              <p className="text-sm text-gray-600">{ticket.category}</p>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-4 leading-relaxed">{ticket.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Created: {ticket.created}</span>
                            <span>Last Update: {ticket.lastUpdate}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 lg:ml-4 lg:min-w-[140px]">
                          <Button
                            size="sm"
                            className="bg-black hover:bg-gray-800 text-white h-9 rounded-lg font-semibold"
                          >
                            View Details
                          </Button>
                          {ticket.status === "Open" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border border-gray-200 bg-white hover:bg-gray-50 h-9 rounded-lg font-semibold"
                            >
                              Add Reply
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-600">Showing {allTickets.length} tickets</p>
              <Button
                onClick={() => setShowAllTickets(false)}
                className="bg-black hover:bg-gray-800 text-white h-10 px-6 rounded-lg font-semibold"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
