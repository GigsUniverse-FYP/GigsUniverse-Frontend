"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  CreditCard,
  Wallet,
  DollarSign,
  Plus,
  History,
  Shield,
  Zap,
  ArrowUpRight,
  Calendar,
  CheckCircle,
} from "lucide-react"
import { toast } from "react-toastify"

const quickAmounts = [50, 100, 500, 1000, 2500, 5000]

// mock sample data
// const transactionHistory = [
//   {
//     id: "TXN-001",
//     type: "Top-up",
//     amount: 500,
//     method: "Credit Card",
//     status: "Completed",
//     date: "Dec 8, 2024",
//     description: "Account credit top-up",
//     currency: "usd"
//   },
//   {
//     id: "TXN-002",
//     type: "Payment",
//     amount: -1200,
//     method: "Account Credit",
//     status: "Completed",
//     date: "Dec 7, 2024",
//     description: "Payment to Sarah Johnson - React Developer",
//     currency: "usd"
//   },
// ]

interface Transaction {
  id: string
  type: string
  amount: number
  method: string
  status: string
  date: string
  description: string
  currency: string
}

export default function TopUpPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")

  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([])
  const [displayedTransactions, setDisplayedTransactions] = useState(5)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const [currentBalance, setCurrentBalance] = useState<number>(0)

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await fetch(`${backendUrl}/api/transactions/available-credits`, {
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to fetch balance")
      const amountInCents = await res.json()
      setCurrentBalance(amountInCents / 100) // convert cents → dollars
    }

    fetchBalance()
  }, [])

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      const res = await fetch(`${backendUrl}/api/transactions/history`, {
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to fetch transaction history")
      const data = await res.json()

      setTransactionHistory(data)
    }

    fetchTransactionHistory()
  }, [])

  const handleTopUp = async () => {
    const amount = getFinalAmount()
    if (amount <= 0 || !paymentMethod) return

    try {
      const res = await fetch(`${backendUrl}/api/transactions/topup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          amount: amount * 100,
          method: paymentMethod,
        }),
      })

      if (!res.ok) throw new Error("Failed to initiate top-up")

      const data = await res.json()

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      }
    } catch (err) {
      console.error(err)
      toast.error("Something went wrong while processing your payment")
    }
  }

  const handleQuickAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount(amount.toString())
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setSelectedAmount(null)
  }

  const getFinalAmount = () => {
    if (selectedAmount) return selectedAmount
    if (customAmount) return Number.parseFloat(customAmount)
    return 0
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 border border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200"
      case "failed":
        return "bg-red-100 text-red-800 border border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200"
    }
  }

  const getTransactionMethodLabel = (method: string) => {
    switch (method) {
      case "us_bank_account":
        return "Bank Transfer"
      case "card":
        return "Credit / Debit Card"
      default:
        return "Other"
    }
  }

  const handleLoadMore = () => {
    setDisplayedTransactions((prev) => prev + 5)
  }

  const visibleTransactions = transactionHistory.slice(0, displayedTransactions)
  const hasMoreTransactions = displayedTransactions < transactionHistory.length

  return (
    <div className="w-full sm:max-w-8xl mx-auto space-y-6 mb-5 -ml-10 sm:ml-0">
      {/* Top-up Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-4">Account Top-up</h1>
      </div>

      {/* Current Balance */}
      <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-black rounded-xl">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Current Balance</p>
                <p className="text-3xl font-bold text-gray-900">${currentBalance.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Available for projects</p>
              <Badge className="bg-green-100 text-green-800 border border-green-200">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top-up Form */}
        <Card className="lg:col-span-2 border border-gray-200 shadow-md bg-white rounded-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-lg">
                <Plus className="w-4 h-4 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">Add Funds</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Amount Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Select Amount</Label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {quickAmounts.map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    className={`h-12 rounded-lg font-semibold transition-all duration-200 ${
                      selectedAmount === amount
                        ? "bg-black text-white border-black"
                        : "border-gray-200 bg-white hover:bg-gray-50 hover:border-black"
                    }`}
                    onClick={() => handleQuickAmountSelect(amount)}
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="space-y-3">
              <Label htmlFor="custom-amount" className="text-sm font-semibold text-gray-700">
                Or Enter Custom Amount
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="custom-amount"
                  type="number"
                  placeholder="0.00"
                  value={customAmount}
                  onChange={(e) => handleCustomAmountChange(e.target.value)}
                  className="pl-10 border border-gray-200 h-12 rounded-lg text-lg"
                  min="10"
                  max="10000"
                />
              </div>
              <p className="text-xs text-gray-500">Minimum: $10 • Maximum: $10,000</p>
            </div>

            <Separator />

            {/* Payment Method */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="border border-gray-200 h-12 rounded-lg">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit / Debit Card</SelectItem>
                  <SelectItem value="us_bank_account">Bank Transfer (ACH / Wire)</SelectItem>
                  <SelectItem value="apple_pay">Apple Pay</SelectItem>
                  <SelectItem value="google_pay">Google Pay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Summary */}
            {getFinalAmount() > 0 && (
              <Card className="bg-gray-50 border border-gray-200 rounded-lg">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Amount to add:</span>
                      <span className="font-semibold text-gray-900">${getFinalAmount().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Processing fee:</span>
                      <span className="font-semibold text-gray-900">$0.00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="font-bold text-gray-900 text-lg">${getFinalAmount().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">New balance:</span>
                      <span className="font-semibold text-gray-900">
                        ${(currentBalance + getFinalAmount()).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <Button
              className="w-full bg-black hover:bg-gray-800 text-white h-12 rounded-lg font-semibold cursor-pointer"
              disabled={getFinalAmount() === 0 || !paymentMethod}
              onClick={handleTopUp}
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Add ${getFinalAmount().toLocaleString()} to Account
            </Button>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Benefits */}
          <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black rounded-lg">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Why Top-up?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-black rounded-lg">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Secure Payments</h4>
                  <p className="text-xs text-gray-600">Your funds are protected with bank-level security</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-black rounded-lg">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Instant Availability</h4>
                  <p className="text-xs text-gray-600">Funds are available immediately after top-up</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-black rounded-lg">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">No Hidden Fees</h4>
                  <p className="text-xs text-gray-600">What you see is what you pay</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card className="border border-gray-200 shadow-md bg-gray-50 rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900">Accepted Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Credit & Debit Cards</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                <Wallet className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Bank Transfers</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                <DollarSign className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">E-Wallets</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Transaction History */}
      <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black rounded-lg">
              <History className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-xl font-bold text-gray-900">Transaction History</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {visibleTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 hover:border-black transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                    {transaction.amount > 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-white" />
                    ) : (
                      <DollarSign className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900 text-sm">{transaction.description}</p>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {transaction.date}
                      </span>
                      <span>{getTransactionMethodLabel(transaction.method)}</span>
                      <span>TXN-{transaction.id}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-lg ${transaction.amount > 0 ? "text-green-600" : "text-gray-900"}`}>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: transaction.currency.toUpperCase(),
                    }).format(transaction.amount / 100)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {hasMoreTransactions && (
            <div className="mt-6 text-center">
              <Button
                variant="outline"
                className="border border-gray-200 bg-white hover:bg-gray-50 h-11 px-8 rounded-lg font-semibold"
                onClick={handleLoadMore}
              >
                Load More Transactions
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
