"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Info } from "lucide-react"
import {
  Building2,
  Users,
  MapPin,
  Edit,
  Settings,
  UserPlus,
  Award,
  MoreVertical,
  Shield,
  UserMinus,
  User,
  Plus,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

export default function MyCompanyPage() {
  const [showAddEmployeeDialog, setShowAddEmployeeDialog] = useState(false)
  const [newEmployee, setNewEmployee] = useState({ name: "", email: "", role: "" })

  // Mock user data - in real app, this would come from authentication
  const currentUser = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    companyId: null, // Set to null to show empty state initially
    role: "creator", // creator, admin, employee
  }

  const userCompany = currentUser.companyId
    ? {
        id: 1,
        name: "TechCorp Solutions",
        logo: "/placeholder.svg?height=80&width=80",
        industry: "Technology",
        size: "50-100 employees",
        location: "Kuala Lumpur, Malaysia",
        founded: "2020",
        description: "Leading technology solutions provider",
        website: "https://techcorp.com",
        email: "contact@techcorp.com",
        phone: "+60 3-1234 5678",
        joinedDate: "2024-01-15",
        recentEmployees: [
          { name: "Alice Johnson", role: "Developer", avatar: "/placeholder.svg?height=32&width=32", id: 2 },
          { name: "Bob Smith", role: "Designer", avatar: "/placeholder.svg?height=32&width=32", id: 3 },
          { name: "Carol Davis", role: "Manager", avatar: "/placeholder.svg?height=32&width=32", id: 4 },
        ],
      }
    : null

  const isCreator = currentUser.role === "creator"
  const isAdmin = currentUser.role === "creator" || currentUser.role === "admin"

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.email && newEmployee.role) {
      console.log("Adding employee:", newEmployee)
      setNewEmployee({ name: "", email: "", role: "" })
      setShowAddEmployeeDialog(false)
    }
  }

  const handleEmployeeAction = (employeeId: number, action: string) => {
    console.log(`${action} employee with ID:`, employeeId)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard/employer/company">
            <Button variant="outline" className="mb-4 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Company Management
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Company</h1>
          <p className="text-gray-600">Manage your company profile and team</p>
        </div>

        {!userCompany ? (
          <Card className="border border-gray-200 bg-white rounded-xl">
            <CardContent className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No Company Joined</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  You haven't joined any company yet. Browse available companies or register your own to get started.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <Link href="/dashboard/employer/company/browse">
                  <Button className="bg-black hover:bg-gray-800 text-white rounded-lg px-6">Browse Companies</Button>
                </Link>
                <Link href="/dashboard/employer/company/register">
                  <Button variant="outline" className="border-gray-300 hover:bg-gray-50 rounded-lg px-6 bg-transparent">
                    <Plus className="w-4 h-4 mr-2" />
                    Register Company
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Company Header */}
            <Card className="border border-gray-200 bg-white rounded-xl">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                  <div className="flex items-start gap-6">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={userCompany.logo || "/placeholder.svg"} />
                      <AvatarFallback>{userCompany.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{userCompany.name}</h2>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {userCompany.industry}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {userCompany.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {userCompany.size}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="flex gap-3">
                      <Button variant="outline" className="border-gray-300 bg-transparent">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Company
                      </Button>
                      <Button variant="outline" className="border-gray-300 bg-transparent">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Company Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Information */}
              <Card className="border border-gray-200 bg-white rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Company Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Founded</p>
                      <p className="font-medium">{userCompany.founded}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Industry</p>
                      <p className="font-medium">{userCompany.industry}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Website</p>
                      <a href={userCompany.website} className="font-medium text-blue-600 hover:underline">
                        {userCompany.website}
                      </a>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-medium">{userCompany.email}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Description</p>
                    <p className="font-medium">{userCompany.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Your Role */}
              <Card className="border border-gray-200 bg-white rounded-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Your Role
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium capitalize">{currentUser.role}</p>
                      <p className="text-sm text-gray-600">
                        Joined{" "}
                        {Math.floor(
                          (new Date().getTime() - new Date(userCompany.joinedDate).getTime()) / (1000 * 60 * 60 * 24),
                        )}{" "}
                        days ago
                      </p>
                    </div>
                    <Button variant="outline" className="border-gray-300 hover:bg-gray-50 rounded-lg bg-transparent">
                      Leave Company
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {isCreator && (
                <Card className="border border-gray-200 bg-white rounded-xl md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        Employee Management
                      </span>
                      <Dialog open={showAddEmployeeDialog} onOpenChange={setShowAddEmployeeDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="bg-black hover:bg-gray-800 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Employee
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Employee</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="employee-name">Full Name</Label>
                              <Input
                                id="employee-name"
                                value={newEmployee.name}
                                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                                placeholder="Enter employee name"
                              />
                            </div>
                            <div>
                              <Label htmlFor="employee-email">Email Address</Label>
                              <Input
                                id="employee-email"
                                type="email"
                                value={newEmployee.email}
                                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                                placeholder="Enter email address"
                              />
                            </div>
                            <div>
                              <Label htmlFor="employee-role">Role</Label>
                              <Select
                                value={newEmployee.role}
                                onValueChange={(value) => setNewEmployee({ ...newEmployee, role: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="employee">Employee</SelectItem>
                                  <SelectItem value="admin">Administrator</SelectItem>
                                  <SelectItem value="manager">Manager</SelectItem>
                                  <SelectItem value="developer">Developer</SelectItem>
                                  <SelectItem value="designer">Designer</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex justify-end gap-3">
                              <Button variant="outline" onClick={() => setShowAddEmployeeDialog(false)}>
                                Cancel
                              </Button>
                              <Button
                                onClick={handleAddEmployee}
                                disabled={!newEmployee.name || !newEmployee.email || !newEmployee.role}
                              >
                                Add Employee
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {userCompany.recentEmployees?.map((employee, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">{employee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{employee.name}</p>
                              <p className="text-xs text-gray-600">{employee.role}</p>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreVertical className="w-3 h-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEmployeeAction(employee.id, "view-profile")}>
                                <User className="w-4 h-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEmployeeAction(employee.id, "set-admin")}>
                                <Shield className="w-4 h-4 mr-2" />
                                Set as Administrator
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEmployeeAction(employee.id, "remove")}
                                className="text-red-600"
                              >
                                <UserMinus className="w-4 h-4 mr-2" />
                                Remove from Company
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
