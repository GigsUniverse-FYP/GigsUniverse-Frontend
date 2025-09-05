"use client"

import { useState, useEffect } from "react"
import { Search, MoreHorizontal, Eye, Trash2, UserX, MessageCircle, Filter, Crown, Info, UserCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { toast } from "react-toastify"

interface User {
  id: string
  fullName: string
  username: string
  email: string
  role: "admin" | "employer" | "freelancer"
  phoneNumber: string
  profilePicture: string
  createdAt: string
  isPremium: boolean
  isOnline: boolean
  isSuspended: boolean
  suspensionReason: string | null
  suspensionEndDate: string | null
}

export default function UserRecords() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [users, setUsers] = useState<User[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [suspensionInfoDialogOpen, setSuspensionInfoDialogOpen] = useState(false)
  const [unsuspendDialogOpen, setUnsuspendDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [suspensionReason, setSuspensionReason] = useState("")
  const [suspensionEndDate, setSuspensionEndDate] = useState("")

  useEffect(() => {
    fetchUserRecords()
  }, [])

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fetchUserRecords = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/user-records/get-records`,
        {
            credentials: "include",
            method: "GET"
        }
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      const transformedUsers = data.map((user: any) => ({
        id: user.userId,
        fullName: user.fullName || "Unknown",
        username: user.username || "unknown",
        email: user.email,
        role: user.role,
        phoneNumber: user.phone || "Not provided",
        profilePicture: user.profilePictureBase64 && user.profilePictureMimeType
          ? `data:${user.profilePictureMimeType};base64,${user.profilePictureBase64}`
          : "/public/images/placeholder.jpg",
        createdAt: user.accountCreationDate || "Unknown",
        isPremium: user.premiumStatus || false,
        isOnline: user.onlineStatus || false,
        isSuspended: user.accountBannedStatus || false,
        suspensionReason: user.bannedReason,
        suspensionEndDate: user.unbanDate
      }))
      
      setUsers(transformedUsers)

      console.log(transformedUsers)
    } catch (err) {

      console.error("Failed to fetch user records:", err)
    } 
  }

  // filter users based on search term and role
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter

    return matchesSearch && matchesRole
  })

  const handleSuspendUser = async () => {
    if (!selectedUser || !suspensionReason || !suspensionEndDate) return

    try {
      const response = await fetch(`${backendUrl}/api/user-records/suspend`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          role: selectedUser.role,
          reason: suspensionReason,
          endDate: suspensionEndDate,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to suspend user: ${response.status}`)
      }

      setUsers(
        users.map((user) =>
          user.id === selectedUser.id
            ? { ...user, isSuspended: true, suspensionReason, suspensionEndDate }
            : user,
        ),
      )

      toast.success("User Suspended Successfully");

      setSuspendDialogOpen(false)
      setSelectedUser(null)
      setSuspensionReason("")
      setSuspensionEndDate("")
    } catch (error) {
      console.error("Failed to suspend user:", error)
      toast.error("Failed to Suspend User");
    }
  }

  const handleUnsuspendUser = async () => {
    if (!selectedUser) return
    
    try {
      const response = await fetch(`${backendUrl}/api/user-records/unsuspend`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          role: selectedUser.role,
          reason: suspensionReason,
          endDate: suspensionEndDate,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to unsuspend user: ${response.status}`)
      }

      setUsers(
        users.map((user) =>
          user.id === selectedUser.id
            ? { ...user, isSuspended: false, suspensionReason: null, suspensionEndDate: null }
            : user,
        ),
      )
      toast.success("User Unsuspended Successfully");
      setUnsuspendDialogOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error("Failed to unsuspend user:", error)
      toast.error("Failed to Unsuspend User");
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default"
      case "employer":
        return "secondary"
      case "freelancer":
        return "outline"
      default:
        return "outline"
    }
  }

  const canSuspend = (role: string) => {
    return role === "employer" || role === "freelancer"
  }

  // function to format creation date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return "Invalid date"
    }
  }

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // set true if you want AM/PM
      })
    } catch {
      return "Invalid date"
    }
  }


  return (
    <div className="w-full sm:max-w-8xl mx-auto space-y-6 mb-5 -ml-10 sm:ml-0">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-foreground">User Records</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-5">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="employer">Employer</SelectItem>
                <SelectItem value="freelancer">Freelancer</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by email, name, username, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {filteredUsers.length} of {users.length} users
          {roleFilter !== "all" && ` (filtered by ${roleFilter})`}
        </div>
      </div>

      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="relative">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage src={user.profilePicture} alt={user.fullName} />
                      <AvatarFallback>
                        {user.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background ${
                        user.isOnline ? "bg-green-500" : "bg-gray-400"
                      }`}
                      title={user.isOnline ? "Online" : "Offline"}
                    />
                  </div>

                  <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground truncate">{user.fullName}</p>
                        {user.isPremium && (user.role === "employer" || user.role === "freelancer") && (
                          <Crown className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">@{user.username}</p>
                    </div>

                    <div className="space-y-1 w-65 truncate text-wrap">
                      <p className="text-sm font-medium text-foreground truncate">{user.id}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                          {user.role}
                        </Badge>
                        {user.isSuspended && (
                          <Badge variant="destructive" className="text-xs">
                            Suspended
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.phoneNumber}</p>
                    </div>
                    {(user.role === "employer" || user.role === "freelancer") && (
                        <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">Created</p>
                        <p className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</p>
                        </div>
                    )}
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <Link
                        href={
                        user.role === "admin"
                            ? `/dashboard/view-profile/admin?userId=${user.id}`
                            : user.role === "employer"
                            ? `/dashboard/view-profile/employer?userId=${user.id}`
                            : `/dashboard/view-profile/freelancer?userId=${user.id}`
                        }
                        className="w-full h-full block"
                        target="_blank"
                    >
                        <DropdownMenuItem className="cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                        </DropdownMenuItem>
                    </Link>

                    <Link
                      href={`/dashboard/admin/chat?userId=${user.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                        <DropdownMenuItem className="cursor-pointer">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Chat with User
                        </DropdownMenuItem>
                    </Link>

                    {user.isSuspended ? (
                      <>
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={() => {
                            setSelectedUser(user)
                            setSuspensionInfoDialogOpen(true)
                          }}
                        >
                          <Info className="mr-2 h-4 w-4" />
                          View Suspension Info
                        </DropdownMenuItem>
                        {canSuspend(user.role) && (
                          <DropdownMenuItem
                            className="cursor-pointer text-green-600 focus:text-green-600"
                            onClick={() => {
                              setSelectedUser(user)
                              setUnsuspendDialogOpen(true)
                            }}
                          >
                            <UserCheck className="mr-2 h-4 w-4 text-green-600 focus:text-green-600" />
                            Unsuspend Account
                          </DropdownMenuItem>
                        )}
                      </>
                    ) : (
                      canSuspend(user.role) && (
                        <DropdownMenuItem
                          className="cursor-pointer text-red-600 focus:text-red-600"
                          onClick={() => {
                            setSelectedUser(user)
                            setSuspendDialogOpen(true)
                          }}
                        >
                          <UserX className="mr-2 h-4 w-4 text-red-600 focus:text-red-600" />
                          Suspend Account
                        </DropdownMenuItem>
                      )
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

        {filteredUsers.length === 0 && (
            <div className="flex-1 p-15 h-full/2 flex items-center justify-center bg-gray-50 rounded-xl border border-transparent">
                <p className="text-sm text-gray-500 text-center">
                  &nbsp; No User Records are Found! Please Try Again Later &nbsp;
                </p>
            </div>
        )}

      <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Suspend User Account</DialogTitle>
            <DialogDescription>
              Suspend {selectedUser?.fullName}'s account. Please provide a reason and end date.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Suspension Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter the reason for suspension..."
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                className="min-h-20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Suspension End Date</Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={suspensionEndDate}
                onChange={(e) => setSuspensionEndDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSuspendUser}
              disabled={!suspensionReason || !suspensionEndDate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Suspend Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={suspensionInfoDialogOpen} onOpenChange={setSuspensionInfoDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Suspension Information</DialogTitle>
            <DialogDescription>Details about {selectedUser?.fullName}'s account suspension.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Suspension Reason</Label>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm">{selectedUser?.suspensionReason || "No reason provided"}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Suspension End Date</Label>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm">
                  {selectedUser?.suspensionEndDate ? formatDateTime(selectedUser.suspensionEndDate) : "Not specified"}
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspensionInfoDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={unsuspendDialogOpen} onOpenChange={setUnsuspendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsuspend User Account</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unsuspend {selectedUser?.fullName}'s account? They will regain full access to
              their account immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUnsuspendUser} className="bg-green-600 text-white hover:bg-green-700">
              Unsuspend Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}