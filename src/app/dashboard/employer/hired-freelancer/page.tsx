"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Star,
  MapPin,
  Clock,
  DollarSign,
  Plus,
  CheckCircle,
  XCircle,
  MessageCircle,
  Send,
  FileText,
} from "lucide-react"

const hiredFreelancers = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Senior React Developer",
    avatar: "SJ",
    location: "San Francisco, CA",
    hourlyRate: 85,
    rating: 4.9,
    totalEarned: 12450,
    projectsCompleted: 8,
    currentProject: {
      name: "E-commerce Platform",
      progress: 75,
      deadline: "Dec 20, 2024",
      budget: 15000,
      status: "In Progress",
    },
    pendingTasks: [
      {
        id: "T001",
        title: "Implement payment gateway",
        description: "Integrate Stripe payment system with checkout flow",
        status: "Submitted",
        submittedDate: "Dec 8, 2024",
        amount: 1200,
      },
      {
        id: "T002",
        title: "User authentication system",
        description: "Build secure login/signup with JWT tokens",
        status: "In Progress",
        dueDate: "Dec 15, 2024",
        amount: 800,
      },
    ],
    lastActive: "2 hours ago",
    responseTime: "Usually responds within 2 hours",
  },
  {
    id: 2,
    name: "Mike Chen",
    title: "Full Stack Engineer",
    avatar: "MC",
    location: "Remote",
    hourlyRate: 75,
    rating: 4.8,
    totalEarned: 8900,
    projectsCompleted: 5,
    currentProject: {
      name: "Mobile App Backend",
      progress: 45,
      deadline: "Dec 25, 2024",
      budget: 12000,
      status: "In Progress",
    },
    pendingTasks: [
      {
        id: "T003",
        title: "API development",
        description: "Create REST APIs for mobile app",
        status: "In Progress",
        dueDate: "Dec 18, 2024",
        amount: 1500,
      },
    ],
    lastActive: "1 day ago",
    responseTime: "Usually responds within 4 hours",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "UI/UX Designer",
    avatar: "ER",
    location: "New York, NY",
    hourlyRate: 65,
    rating: 4.7,
    totalEarned: 5600,
    projectsCompleted: 3,
    currentProject: {
      name: "Brand Redesign",
      progress: 90,
      deadline: "Dec 12, 2024",
      budget: 8000,
      status: "Review",
    },
    pendingTasks: [
      {
        id: "T004",
        title: "Final design mockups",
        description: "Complete high-fidelity mockups for all pages",
        status: "Submitted",
        submittedDate: "Dec 7, 2024",
        amount: 900,
      },
    ],
    lastActive: "Online now",
    responseTime: "Usually responds within 6 hours",
  },
]

export default function HiredFreelancersPage() {
  const [selectedFreelancer, setSelectedFreelancer] = useState<number | null>(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [taskAction, setTaskAction] = useState<"assign" | "accept" | "reject" | null>(null)
  const [selectedTask, setSelectedTask] = useState<any>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-100 text-blue-800 border border-blue-200"
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200"
      case "Completed":
        return "bg-green-100 text-green-800 border border-green-200"
      case "Review":
        return "bg-purple-100 text-purple-800 border border-purple-200"
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200"
    }
  }

  const handleTaskAction = (action: "assign" | "accept" | "reject", task?: any) => {
    setTaskAction(action)
    setSelectedTask(task || null)
    setShowTaskModal(true)
  }

  const handlePayment = (freelancer: any) => {
    setSelectedFreelancer(freelancer.id)
    setShowPaymentModal(true)
  }

  return (
    <div className="w-full sm:max-w-8xl mx-auto space-y-6 mb-5 -ml-10 sm:ml-0">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-4">Hired Freelancers</h1>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Freelancers</p>
                <p className="text-2xl font-bold text-black">{hiredFreelancers.length}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Users className="h-4 w-4 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-bold text-black">
                  {hiredFreelancers.reduce((acc, f) => acc + f.pendingTasks.length, 0)}
                </p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <FileText className="h-4 w-4 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-black">
                  ${hiredFreelancers.reduce((acc, f) => acc + f.totalEarned, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-black">
                  {(hiredFreelancers.reduce((acc, f) => acc + f.rating, 0) / hiredFreelancers.length).toFixed(1)}
                </p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Star className="h-4 w-4 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Freelancers List */}
      <div className="space-y-6">
        {hiredFreelancers.map((freelancer) => (
          <Card key={freelancer.id} className="border border-gray-200 shadow-md bg-white rounded-xl">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Freelancer Info */}
                <div className="lg:col-span-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center shadow-sm">
                      <span className="font-bold text-gray-700 text-lg">{freelancer.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{freelancer.name}</h3>
                      <p className="text-gray-600 font-medium mb-2">{freelancer.title}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-4 w-4 text-black fill-current" />
                        <span className="font-bold text-gray-900">{freelancer.rating}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-600">{freelancer.projectsCompleted} projects</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{freelancer.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>${freelancer.hourlyRate}/hour</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>{freelancer.lastActive}</span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Button
                      onClick={() => handlePayment(freelancer)}
                      className="w-full bg-black hover:bg-gray-800 text-white h-10 rounded-lg"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Make Payment
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border border-gray-200 bg-white hover:bg-gray-50 h-10 rounded-lg"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>

                {/* Current Project */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-bold text-gray-900 mb-3">Current Project</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-gray-900">{freelancer.currentProject.name}</p>
                        <Badge className={getStatusColor(freelancer.currentProject.status)}>
                          {freelancer.currentProject.status}
                        </Badge>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-semibold text-gray-900">{freelancer.currentProject.progress}%</span>
                        </div>
                        <Progress value={freelancer.currentProject.progress} className="h-2" />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-600">Budget</p>
                          <p className="font-semibold text-gray-900">
                            ${freelancer.currentProject.budget.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Deadline</p>
                          <p className="font-semibold text-gray-900">{freelancer.currentProject.deadline}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                <div className="lg:col-span-1">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-900">Tasks</h4>
                    <Button
                      size="sm"
                      onClick={() => handleTaskAction("assign")}
                      className="bg-black hover:bg-gray-800 text-white h-8 rounded-lg"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      Assign
                    </Button>
                  </div>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {freelancer.pendingTasks.map((task) => (
                      <div key={task.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm">{task.title}</p>
                            <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                            <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>${task.amount}</span>
                          <span>
                            {task.submittedDate ? `Submitted: ${task.submittedDate}` : `Due: ${task.dueDate}`}
                          </span>
                        </div>
                        {task.status === "Submitted" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleTaskAction("accept", task)}
                              className="bg-green-600 hover:bg-green-700 text-white h-7 rounded-md text-xs flex-1"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleTaskAction("reject", task)}
                              className="border border-red-200 text-red-600 hover:bg-red-50 h-7 rounded-md text-xs flex-1"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {taskAction === "assign" && "Assign New Task"}
                {taskAction === "accept" && "Accept Task"}
                {taskAction === "reject" && "Reject Task"}
              </h3>

              {taskAction === "assign" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="task-title">Task Title</Label>
                    <Input id="task-title" placeholder="Enter task title" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="task-description">Description</Label>
                    <Textarea id="task-description" placeholder="Describe the task..." className="mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="task-amount">Amount ($)</Label>
                      <Input id="task-amount" type="number" placeholder="0" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="task-deadline">Deadline</Label>
                      <Input id="task-deadline" type="date" className="mt-1" />
                    </div>
                  </div>
                </div>
              )}

              {taskAction === "accept" && selectedTask && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-900">{selectedTask.title}</h4>
                    <p className="text-sm text-green-700 mt-1">{selectedTask.description}</p>
                    <p className="text-sm font-semibold text-green-900 mt-2">Amount: ${selectedTask.amount}</p>
                  </div>
                  <div>
                    <Label htmlFor="accept-feedback">Feedback (Optional)</Label>
                    <Textarea
                      id="accept-feedback"
                      placeholder="Great work! The implementation looks perfect..."
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {taskAction === "reject" && selectedTask && (
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-900">{selectedTask.title}</h4>
                    <p className="text-sm text-red-700 mt-1">{selectedTask.description}</p>
                  </div>
                  <div>
                    <Label htmlFor="reject-reason">Reason for Rejection *</Label>
                    <Textarea
                      id="reject-reason"
                      placeholder="Please explain what needs to be changed..."
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowTaskModal(false)}
                  className="flex-1 border border-gray-200 bg-white hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button className="flex-1 bg-black hover:bg-gray-800 text-white">
                  {taskAction === "assign" && "Assign Task"}
                  {taskAction === "accept" && "Accept & Pay"}
                  {taskAction === "reject" && "Send Feedback"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Make Payment</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="payment-amount">Amount ($)</Label>
                  <Input id="payment-amount" type="number" placeholder="0.00" className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="payment-description">Description</Label>
                  <Textarea id="payment-description" placeholder="Payment for completed work..." className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="account-credit">Account Credit</SelectItem>
                      <SelectItem value="credit-card">Credit Card</SelectItem>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 border border-gray-200 bg-white hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button className="flex-1 bg-black hover:bg-gray-800 text-white">
                  <Send className="w-4 h-4 mr-2" />
                  Send Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
