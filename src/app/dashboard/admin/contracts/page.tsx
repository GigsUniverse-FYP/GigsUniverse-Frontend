"use client"

import { useState, useMemo, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { MessageCircle, UserCheck, UserX, Calendar, DollarSign, Clock, AlertTriangle, Search } from "lucide-react"
import Link from "next/link"
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
import { toast } from "react-toastify"

export interface Contract {
  contractId: number
  agreedPayRatePerHour: number 
  contractStatus: "rejected" | "pending" | "upcoming" | "active" | "completed" | "cancelled"
  cancellationReason?: string | null
  approveEarlyCancellation?: "approved" | "rejected" | null
  hourPerWeek: string
  contractCreationDate: Date
  contractStartDate: Date
  contractEndDate: Date
  freelancerFeedback: boolean
  jobTitle: string
  jobId: string
  companyName: string
  employerId: string
  employerName: string
  freelancerId: string
  freelancerName: string
  freelancerEmail: string
}

export default function ContractsPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const [contracts, setContracts] = useState<Contract[]>([])
  const [showApproveCancelDialog, setShowApproveCancelDialog] = useState(false)
  const [showRejectCancelDialog, setShowRejectCancelDialog] = useState(false)
  const [selectedContractId, setSelectedContractId] = useState<number | null>(null)

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/contracts/admin-details`, {
          credentials: "include",
          method: "GET",
        })
        if (!response.ok) throw new Error("Failed to fetch contracts")
        const data: Contract[] = await response.json()

        const parsedData = data.map((c) => ({
          ...c,
          contractCreationDate: new Date(c.contractCreationDate),
          contractStartDate: new Date(c.contractStartDate),
          contractEndDate: new Date(c.contractEndDate),
        }))

        setContracts(parsedData)
        console.log(parsedData)
      } catch (err) {
        console.error(err instanceof Error ? err.message : "An error occurred")
      }
    }

    fetchContracts()
  }, [])

  const filteredContracts = useMemo(() => {
    let filtered = contracts

    if (statusFilter !== "all") {
      filtered = filtered.filter((contract) => contract.contractStatus === statusFilter)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((contract) => {
        return (
          contract.freelancerName.toLowerCase().includes(query) ||
          contract.employerName.toLowerCase().includes(query) ||
          contract.jobTitle.toLowerCase().includes(query) ||
          contract.jobId.toLowerCase().includes(query) ||
          contract.employerId.toLowerCase().includes(query) ||
          contract.freelancerId.toLowerCase().includes(query) ||
          contract.contractId.toString().includes(query)
        )
      })
    }

    return filtered
  }, [contracts, statusFilter, searchQuery])

  const handleApproveCancellation = async (contractId: number) => {
    try {
      const res = await fetch(`${backendUrl}/api/contracts/${contractId}/approve-cancellation`, {
        method: "PUT",
        credentials: "include",
      })

      if (!res.ok) throw new Error("Failed to approve cancellation")

      const updatedContract: Contract = await res.json()

      setContracts((prev) =>
        prev.map((c) =>
          c.contractId === contractId
            ? { ...c, contractStatus: "cancelled", approveEarlyCancellation: "approved" }
            : c
        )
      )

      toast.success("Approved Contract Early Cancellation.")
      setShowApproveCancelDialog(false)
      setSelectedContractId(null)
    } catch (err) {
      console.error("Error approving cancellation:", err)
      toast.error("Failed to approve Contract Early Cancellation.")
    }
  }

  const handleRejectCancellation = async (contractId: number) => {
    try {
      const res = await fetch(`${backendUrl}/api/contracts/${contractId}/reject-cancellation`, {
        method: "PUT",
        credentials: "include",
      })

      if (!res.ok) throw new Error("Failed to reject cancellation")

      const updatedContract: Contract = await res.json()

      setContracts((prev) =>
        prev.map((c) =>
          c.contractId === contractId
            ? { ...c, approveEarlyCancellation: "rejected" }
            : c
        )
      )
      toast.success("Rejected Contract Early Cancellation.")
      setShowRejectCancelDialog(false)
      setSelectedContractId(null)
    } catch (err) {
      console.error("Error rejecting cancellation:", err)
      toast.error("Failed to reject Contract Early Cancellation.")
    }
  }


  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-black text-white border-black"
      case "pending":
        return "bg-gray-600 text-white border-gray-600"
      case "upcoming":
        return "bg-gray-800 text-white border-gray-800"
      case "completed":
        return "bg-gray-400 text-white border-gray-400"
      case "cancelled":
        return "bg-gray-900 text-white border-gray-900"
      case "rejected":
        return "bg-gray-700 text-white border-gray-700"
      default:
        return "bg-gray-500 text-white border-gray-500"
    }
  }

    const formatDate = (date: Date) => {
    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // months are 0-based
    const year = d.getFullYear();

    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}`;
    };


  const ContractFilters = () => (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search by freelancer name, employer name, job title, or IDs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gray-300 focus:border-black focus:ring-black"
          />
        </div>
      </div>
      <div className="w-full sm:w-48">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="border-gray-300 focus:border-black focus:ring-black">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-300">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const ContractCard = ({ contract }: { contract: Contract }) => {
    const showCancellationApproval =
      (contract.contractStatus === "active") &&
      contract.cancellationReason &&
      !contract.approveEarlyCancellation

    const showCancellationStatus =
      contract.contractStatus === "cancelled" && contract.cancellationReason && contract.approveEarlyCancellation

    return (
      <Card className="w-full max-w-sm border-gray-300 hover:shadow-lg transition-shadow duration-200 hover:border-black">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="font-semibold text-black text-balance leading-tight">{contract.jobTitle}</h3>
              <p className="text-sm text-gray-600">Contract #{contract.contractId}</p>
            </div>
            <Badge className={`${getStatusColor(contract.contractStatus)} font-medium`}>
              {contract.contractStatus}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Contract Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <UserCheck className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Employer:</span>
              <span className="font-medium text-black">{contract.employerName}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <UserX className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Freelancer:</span>
              <span className="font-medium text-black">{contract.freelancerName}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Rate:</span>
              <span className="font-medium text-black">${contract.agreedPayRatePerHour}/hr</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Hours:</span>
              <span className="font-medium text-black">{contract.hourPerWeek}h/week</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium text-black text-balance">
                {formatDate(contract.contractStartDate)} - {formatDate(contract.contractEndDate)}
              </span>
            </div>
          </div>

          {/* Cancellation Request - Pending Approval */}
          {showCancellationApproval && (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 space-y-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-gray-700 mt-0.5 flex-shrink-0" />
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium text-black">Cancellation Request</p>
                  <p className="text-sm text-gray-700 text-pretty">{contract.cancellationReason}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-black text-black hover:bg-black hover:text-white bg-white"
                  onClick={() => {
                    setSelectedContractId(contract.contractId)
                    setShowApproveCancelDialog(true)
                  }}
                >
                  <UserCheck className="h-3 w-3 mr-1" />
                  Approve Cancellation
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white bg-white"
                  onClick={() => {
                    setSelectedContractId(contract.contractId)
                    setShowRejectCancelDialog(true)
                  }}
                >
                  <UserX className="h-3 w-3 mr-1" />
                  Reject Cancellation
                </Button>
              </div>
            </div>
          )}

          {showCancellationStatus && (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 space-y-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-gray-700 mt-0.5 flex-shrink-0" />
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-medium text-black">Cancellation Reason</p>
                  <p className="text-sm text-gray-700 text-pretty">{contract.cancellationReason}</p>
                </div>
              </div>

              <div className="pt-1">
                <Badge
                  className={`${
                    contract.approveEarlyCancellation === "approved"
                      ? "bg-black text-white border-black"
                      : "bg-gray-600 text-white border-gray-600"
                  } font-medium`}
                >
                  {contract.approveEarlyCancellation === "approved" ? "Approved" : "Rejected"}
                </Badge>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
          <Link href={`/dashboard/admin/chat/${contract.employerId}`}>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-white border-gray-300 text-black hover:bg-black hover:text-white"
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              Message Employer
            </Button>
            </Link>
            <Link href={`/dashboard/admin/chat/${contract.freelancerId}`}>
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-white border-gray-300 text-black hover:bg-black hover:text-white mt-3"
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              Message Freelancer
            </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen -ml-10 sm:ml-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance mb-2 text-black">Contract Management</h1>
        <p className="text-gray-600 text-pretty">
          View and manage all contracts across different statuses.
        </p>
      </div>

      <ContractFilters />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredContracts.map((contract) => (
          <ContractCard key={contract.contractId} contract={contract} />
        ))}
      </div>

      {filteredContracts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No contracts found matching your criteria.</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search query.</p>
        </div>
      )}

    <AlertDialog
      open={showApproveCancelDialog}
      onOpenChange={setShowApproveCancelDialog}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Cancellation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to approve the cancellation of this contract?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowApproveCancelDialog(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleApproveCancellation(selectedContractId!)}
            className="bg-black text-white cursor-pointer hover:bg-gray-900 focus:ring-black"
          >
            Approve
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <AlertDialog
      open={showRejectCancelDialog}
      onOpenChange={setShowRejectCancelDialog}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reject Cancellation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to reject the cancellation of this contract?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowRejectCancelDialog(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleRejectCancellation(selectedContractId!)}
            className="bg-black text-white cursor-pointer hover:bg-gray-900 focus:ring-black"
          >
            Reject
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
            
    </div>
  )
}
