"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import * as XLSX from "xlsx"

type Subscription = {
  id: number
  userId: string
  userType: string
  stripeCustomerId: string
  stripeSubscriptionId: string
  stripeProductName: string
  status: string
  currentPeriodStart: string
  currentPeriodEnd: string
  amountPaid: number
  currency: string
  createdAt: string
}

type Transaction = {
  id: number
  employerUserId: string
  stripePaymentIntentId: string
  amount: number
  currency: string
  status: string
  paymentMethodType: string
  paymentType: string
  description: string
  createdAt: string
  stripeCheckoutSessionId: string
}

type TransferEvent = {
  id: number
  stripeEventId: string
  stripeTransferId: string
  eventType: string
  amount: number
  currency: string
  reversed: boolean
  destinationAccountId: string
  description: string
  taskId: string
  freelancerId: string
  employerId: string
  createdAt: string
}

export default function PaymentRecordsPage() {
  const [activeTab, setActiveTab] = useState("subscriptions")
  
  // Filters for each tab
  const [subscriptionSearch, setSubscriptionSearch] = useState("")
  const [subscriptionStatusFilter, setSubscriptionStatusFilter] = useState("all")
  
  const [transactionSearch, setTransactionSearch] = useState("")
  const [transactionStatusFilter, setTransactionStatusFilter] = useState("all")
  
  const [transferSearch, setTransferSearch] = useState("")
  const [transferDateFilter, setTransferDateFilter] = useState("all")

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [transferEvents, setTransferEvents] = useState<TransferEvent[]>([])

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/transactions-data/subscription-events`, {
          method: "GET",
          credentials: "include",
        })
        if (!res.ok) throw new Error("Failed to fetch subscriptions")
        const data = await res.json()
        const parsed = data.map((s: any) => ({
          ...s,
          id: s.subscriptionId,
          currentPeriodStart: new Date(s.currentPeriodStart).toISOString(),
          currentPeriodEnd: new Date(s.currentPeriodEnd).toISOString(),
          createdAt: new Date(s.createdAt).toISOString(),
        }))
        setSubscriptions(parsed)
      } catch (err) {
        console.error(err instanceof Error ? err.message : "Error fetching subscriptions")
      }
    }

    const fetchTransactions = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/transactions-data/transactions`, {
          method: "GET",
          credentials: "include",
        })
        if (!res.ok) throw new Error("Failed to fetch transactions")
        const data = await res.json()
        const parsed = data.map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt).toISOString(),
        }))
        setTransactions(parsed)
      } catch (err) {
        console.error(err instanceof Error ? err.message : "Error fetching transactions")
      }
    }

    const fetchTransferEvents = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/transactions-data/transfer-events`, {
          method: "GET",
          credentials: "include",
        })
        if (!res.ok) throw new Error("Failed to fetch transfer events")
        const data = await res.json()
        const parsed = data.map((tr: any) => ({
          ...tr,
          createdAt: new Date(tr.createdAt).toISOString(),
        }))
        setTransferEvents(parsed)
      } catch (err) {
        console.error(err instanceof Error ? err.message : "Error fetching transfer events")
      }
    }

    fetchSubscriptions()
    fetchTransactions()
    fetchTransferEvents()
  }, [backendUrl])

  // Filter functions
  const filterSubscriptions = () => {
    const search = (subscriptionSearch || "").toLowerCase();
    return subscriptions.filter(sub => {
      const matchesSearch = 
      (sub.userId || "").toLowerCase().includes(search) ||
      (sub.userType || "").toLowerCase().includes(search) ||
      (sub.stripeCustomerId || "").toLowerCase().includes(search) ||
      (sub.stripeSubscriptionId || "").toLowerCase().includes(search) ||
      (sub.stripeProductName || "").toLowerCase().includes(search);

      
      const matchesStatus = subscriptionStatusFilter === "all" || sub.status === subscriptionStatusFilter
      
      return matchesSearch && matchesStatus
    })
  }

  const filterTransactions = () => {
    const search = (transactionSearch || "").toLowerCase();
    return transactions.filter(trans => {
      const matchesSearch = 
        (trans.employerUserId || "").toLowerCase().includes(search) ||
        (trans.stripePaymentIntentId || "").toLowerCase().includes(search) ||
        (trans.stripeCheckoutSessionId || "").toLowerCase().includes(search) ||
        (trans.description || "").toLowerCase().includes(search);
      
      const matchesStatus = transactionStatusFilter === "all" || trans.status === transactionStatusFilter
      
      return matchesSearch && matchesStatus
    })
  }

  const filterTransfers = () => {
    const now = new Date()
    const search = (transferSearch || "").toLowerCase();
    return transferEvents.filter(transfer => {
      const matchesSearch = 
      (transfer.stripeEventId || "").toLowerCase().includes(search) ||
      (transfer.stripeTransferId || "").toLowerCase().includes(search) ||
      (transfer.destinationAccountId || "").toLowerCase().includes(search) ||
      (transfer.description || "").toLowerCase().includes(search) ||
      (transfer.taskId || "").toLowerCase().includes(search) ||
      (transfer.freelancerId || "").toLowerCase().includes(search) ||
      (transfer.employerId || "").toLowerCase().includes(search);
      
      const transferDate = new Date(transfer.createdAt)
      let matchesDate = true
      
      if (transferDateFilter !== "all") {
        const startOfDay = new Date(now)
        startOfDay.setHours(0, 0, 0, 0)
        
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        startOfWeek.setHours(0, 0, 0, 0)
        
        const startOfMonth = new Date(now)
        startOfMonth.setDate(1)
        startOfMonth.setHours(0, 0, 0, 0)
        
        if (transferDateFilter === "today") {
          matchesDate = transferDate >= startOfDay
        } else if (transferDateFilter === "week") {
          matchesDate = transferDate >= startOfWeek
        } else if (transferDateFilter === "month") {
          matchesDate = transferDate >= startOfMonth
        }
      }
      
      return matchesSearch && matchesDate
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      success: "default",
      pending: "secondary",
      failed: "destructive",
      canceled: "outline",
      reversed: "destructive",
      completed: "default",
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }

  // Export functions
  const exportToExcel = (data: any[], fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data")
    XLSX.writeFile(workbook, `${fileName}.xlsx`)
  }

  const handleExport = () => {
    switch (activeTab) {
      case "subscriptions":
        exportToExcel(filteredSubscriptions, "subscriptions")
        break
      case "transactions":
        exportToExcel(filteredTransactions, "transactions")
        break
      case "transfers":
        exportToExcel(filteredTransfers, "transfers")
        break
    }
  }

  // Get filtered data
  const filteredSubscriptions = filterSubscriptions()
  const filteredTransactions = filterTransactions()
  const filteredTransfers = filterTransfers()

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground text-balance">Payment Records</h1>
            <p className="text-muted-foreground mt-1">Manage and track all platform billing transactions</p>
          </div>
          <Button className="flex items-center gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="subscriptions" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="transfers">Transfer Events</TabsTrigger>
          </TabsList>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle>Subscription Management</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search subscriptions..."
                        value={subscriptionSearch}
                        onChange={(e) => setSubscriptionSearch(e.target.value)}
                        className="pl-10 w-full sm:w-64"
                      />
                    </div>
                    <Select value={subscriptionStatusFilter} onValueChange={setSubscriptionStatusFilter}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="incomplete">Incomplete</SelectItem>
                        <SelectItem value="incomplete_expired">Incomplete Expired</SelectItem>
                        <SelectItem value="trialing">Trialing</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="past_due">Past Due</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24">ID</TableHead>
                        <TableHead>User ID</TableHead>
                        <TableHead>User Type</TableHead>
                        <TableHead>Stripe Customer ID</TableHead>
                        <TableHead>Stripe Subscription ID</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Period Start</TableHead>
                        <TableHead>Period End</TableHead>
                        <TableHead>Amount Paid</TableHead>
                        <TableHead>Currency</TableHead>
                        <TableHead>Created At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubscriptions.map((subscription, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-sm" title={`ID: ${subscription.id}`}>
                            #{subscription.id}
                          </TableCell>
                          <TableCell className="font-medium" title={`User ID: ${subscription.userId}`}>
                            {subscription.userId}
                          </TableCell>
                          <TableCell title={`User Type: ${subscription.userType}`}>
                            <Badge variant="outline">{subscription.userType}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-xs" title={`Stripe Customer ID: ${subscription.stripeCustomerId}`}>
                            {subscription.stripeCustomerId}
                          </TableCell>
                          <TableCell className="font-mono text-xs" title={`Stripe Subscription ID: ${subscription.stripeSubscriptionId}`}>
                            {subscription.stripeSubscriptionId}
                          </TableCell>
                          <TableCell title={`Product Name: ${subscription.stripeProductName}`}>
                            {subscription.stripeProductName}
                          </TableCell>
                          <TableCell title={`Status: ${subscription.status}`}>
                            {getStatusBadge(subscription.status)}
                          </TableCell>
                          <TableCell title={`Period Start: ${formatDate(subscription.currentPeriodStart)}`}>
                            {formatDate(subscription.currentPeriodStart)}
                          </TableCell>
                          <TableCell title={`Period End: ${formatDate(subscription.currentPeriodEnd)}`}>
                            {formatDate(subscription.currentPeriodEnd)}
                          </TableCell>
                          <TableCell className="font-semibold" title={`Amount: ${formatCurrency(subscription.amountPaid, subscription.currency)}`}>
                            {formatCurrency(subscription.amountPaid, subscription.currency)}
                          </TableCell>
                          <TableCell className="uppercase" title={`Currency: ${subscription.currency}`}>
                            {subscription.currency}
                          </TableCell>
                          <TableCell title={`Created: ${formatDate(subscription.createdAt)}`}>
                            {formatDate(subscription.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle>Transaction History</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search transactions..."
                        value={transactionSearch}
                        onChange={(e) => setTransactionSearch(e.target.value)}
                        className="pl-10 w-full sm-w-64"
                      />
                    </div>
                    <Select value={transactionStatusFilter} onValueChange={setTransactionStatusFilter}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24">ID</TableHead>
                        <TableHead>Employer User ID</TableHead>
                        <TableHead>Stripe Payment Intent ID</TableHead>
                        <TableHead>Stripe Checkout Session ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Currency</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Payment Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Created At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-mono text-sm" title={`ID: ${transaction.id}`}>
                            #{transaction.id}
                          </TableCell>
                          <TableCell className="font-medium" title={`Employer User ID: ${transaction.employerUserId}`}>
                            {transaction.employerUserId}
                          </TableCell>
                          <TableCell className="font-mono text-xs" title={`Stripe Payment Intent ID: ${transaction.stripePaymentIntentId}`}>
                            {transaction.stripePaymentIntentId || "N/A"}
                          </TableCell>
                          <TableCell className="font-mono text-xs" title={`Stripe Checkout Session ID: ${transaction.stripeCheckoutSessionId}`}>
                            {transaction.stripeCheckoutSessionId || "N/A"}
                          </TableCell>
                          <TableCell
                            className={`font-semibold ${transaction.amount > 0 ? "text-primary" : "text-destructive"}`}
                            title={`Amount: ${formatCurrency(Math.abs(transaction.amount), transaction.currency)}`}
                          >
                            {transaction.amount > 0 ? "+" : ""}
                            {formatCurrency(Math.abs(transaction.amount), transaction.currency)}
                          </TableCell>
                          <TableCell className="uppercase" title={`Currency: ${transaction.currency}`}>
                            {transaction.currency}
                          </TableCell>
                          <TableCell title={`Status: ${transaction.status}`}>
                            {getStatusBadge(transaction.status)}
                          </TableCell>
                          <TableCell className="capitalize" title={`Payment Method: ${transaction.paymentMethodType}`}>
                            {transaction.paymentMethodType}
                          </TableCell>
                          <TableCell title={`Payment Type: ${transaction.paymentType}`}>
                            <Badge variant={transaction.amount > 0 ? "default" : "secondary"}>
                              {transaction.paymentType}
                            </Badge>
                          </TableCell>
                          <TableCell 
                            className="max-w-48 truncate" 
                            title={`Description: ${transaction.description}`}
                          >
                            {transaction.description}
                          </TableCell>
                          <TableCell title={`Created: ${formatDate(transaction.createdAt)}`}>
                            {formatDate(transaction.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transfer Events Tab */}
          <TabsContent value="transfers" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle>Transfer Events</CardTitle>
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search transfers..."
                        value={transferSearch}
                        onChange={(e) => setTransferSearch(e.target.value)}
                        className="pl-10 w-full sm:w-64"
                      />
                    </div>
                    <Select value={transferDateFilter} onValueChange={setTransferDateFilter}>
                      <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24">ID</TableHead>
                        <TableHead>Stripe Event ID</TableHead>
                        <TableHead>Stripe Transfer ID</TableHead>
                        <TableHead>Event Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Currency</TableHead>
                        <TableHead>Reversed</TableHead>
                        <TableHead>Destination Account</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Task ID</TableHead>
                        <TableHead>Freelancer ID</TableHead>
                        <TableHead>Employer ID</TableHead>
                        <TableHead>Created At</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransfers.map((transfer) => (
                        <TableRow key={transfer.id}>
                          <TableCell className="font-mono text-sm" title={`ID: ${transfer.id}`}>
                            #{transfer.id}
                          </TableCell>
                          <TableCell className="font-mono text-xs" title={`Stripe Event ID: ${transfer.stripeEventId}`}>
                            {transfer.stripeEventId}
                          </TableCell>
                          <TableCell className="font-mono text-xs" title={`Stripe Transfer ID: ${transfer.stripeTransferId}`}>
                            {transfer.stripeTransferId}
                          </TableCell>
                          <TableCell title={`Event Type: ${transfer.eventType}`}>
                            <Badge variant="outline">{transfer.eventType}</Badge>
                          </TableCell>
                          <TableCell 
                            className="font-semibold text-primary" 
                            title={`Amount: ${formatCurrency(transfer.amount, transfer.currency)}`}
                          >
                            {formatCurrency(transfer.amount, transfer.currency)}
                          </TableCell>
                          <TableCell className="uppercase" title={`Currency: ${transfer.currency}`}>
                            {transfer.currency}
                          </TableCell>
                          <TableCell title={`Reversed: ${transfer.reversed ? 'Yes' : 'No'}`}>
                            <Badge variant={transfer.reversed ? "destructive" : "default"}>
                              {transfer.reversed ? "Yes" : "No"}
                            </Badge>
                          </TableCell>
                          <TableCell 
                            className="font-mono text-xs" 
                            title={`Destination Account: ${transfer.destinationAccountId}`}
                          >
                            {transfer.destinationAccountId}
                          </TableCell>
                          <TableCell 
                            className="max-w-48 truncate" 
                            title={`Description: ${transfer.description}`}
                          >
                            {transfer.description}
                          </TableCell>
                          <TableCell 
                            className="font-mono text-sm" 
                            title={`Task ID: ${transfer.taskId}`}
                          >
                            {transfer.taskId}
                          </TableCell>
                          <TableCell 
                            className="font-medium" 
                            title={`Freelancer ID: ${transfer.freelancerId}`}
                          >
                            {transfer.freelancerId}
                          </TableCell>
                          <TableCell 
                            className="font-medium" 
                            title={`Employer ID: ${transfer.employerId}`}
                          >
                            {transfer.employerId}
                          </TableCell>
                          <TableCell title={`Created: ${formatDate(transfer.createdAt)}`}>
                            {formatDate(transfer.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}