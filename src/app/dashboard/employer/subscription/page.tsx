"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, HelpCircle, CreditCard, Shield, Clock, FileText, DollarSign, Calendar, CheckCircleIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "react-toastify"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"


  interface BillingHistoryItem {
    stripeProductName: string
    latestInvoiceId: string
    amountPaid: number
    currency: string
    createdAt: string 
    stripeSubscriptionId: string
    status: string
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  const employerPlans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Great for small projects and testing the platform",
      features: [
        "2 job postings per month",
        "Hire up to 3 candidates per job",
        "Standard job postings only",
        "Maximum 30 applications per job",
        "Basic profile customization",
      ],
      popular: false,
      buttonText: "Post Your First Job",
    },
    {
      name: "Premium Employer",
      price: "$25",
      period: "/month",
      description: "Ideal for businesses hiring remote talent regularly",
      features: [
        "5 job postings per month",
        "Hire up to 5 candidates per job",
        "Premium job postings feature",
        "Maximum 50 applications per job",
        "Full profile customization",
        "Premium profile badge",
        "Priority support",
      ],
      popular: true,
      buttonText: "Upgrade to Premium",
    },
  ]

export default function SubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState("Free")
  const [premium, setPremium] = useState<boolean | null>(null)
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [showBillingHistory, setShowBillingHistory] = useState(false)
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>([])
  const [loadingBillingHistory, setLoadingBillingHistory] = useState(false)


  const [showCancelSubscription, setShowCancelSubscription] = useState(false);

    useEffect(() => {
      if (showBillingHistory) {
        setLoadingBillingHistory(true);
        fetch(`${backendUrl}/api/employer/subscription/bill-data`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", 
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to fetch billing history");
            }
            return res.json();
          })
          .then((data: BillingHistoryItem[]) => {
            setBillingHistory(data);
          })
          .catch((err) => {
            console.error(err);
            setBillingHistory([]);
          })
          .finally(() => {
            setLoadingBillingHistory(false);
          });
      }
    }, [showBillingHistory]);
  
  const purchaseSubscription = async () => {
    const res = await fetch(`${backendUrl}/api/employer/subscription/purchase`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Purchase failed");

    const data = await res.json();
    window.location.href = data.url;
  };


  const cancelSubscription = async () => {
    const res = await fetch(`${backendUrl}/api/employer/subscription/cancel/immediate`, {
      method: "POST",
      credentials: "include",
    })
    if (!res.ok) {
      toast.error("Subscription Already Cancelled.");
      setTimeout(() => window.location.reload(), 3000);
    }else{
      toast.success("Subscription Terminated Successfully.");
    }
  }

  const handlePlanAction = async (planName: string) => {
    if (planName === "Premium Employer") {
      try {
        await purchaseSubscription()
      } catch (error) {
        console.error("Upgrade failed", error)
      }
    } else if (planName === "Free" && currentPlan === "Premium Employer") {
      try {
        setShowCancelSubscription(true);
      } catch (error) {
        console.error("Downgrade failed", error)
      }
    }
  }

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
          setPremium(data)
  
          // Map boolean to plan name
          setCurrentPlan(data ? "Premium Employer" : "Free")
        } catch (error) {
          console.error(error)
          setPremium(null)
          setCurrentPlan("Free")
        }
      }
  
      fetchPremiumStatus()
    }, [])
  

  const getButtonText = (planName: string) => {
    if (currentPlan === planName) {
      return "Current Plan"
    }
    if (planName === "Free") {
      return currentPlan === "Premium Employer" ? "Downgrade to Free" : "Get Started Free"
    }
    return "Upgrade to Premium"
  }

  const isCurrentPlan = (planName: string) => currentPlan === planName

  return (
    <div className="w-full sm:max-w-8xl mx-auto space-y-6 mb-5 -ml-10 sm:ml-0">
      {/* Subscription Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-4">Subscription Plans</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Freelancer Plans Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Employer Plans</h2>
            <p className="text-gray-600">
              Choose the right plan to find top talent and manage your hiring needs effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {employerPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative border-2 hover:shadow-lg transition-all duration-300 rounded-xl ${
                  plan.popular ? "border-black" : "border-gray-200"
                } ${isCurrentPlan(plan.name) ? "ring-2 ring-green-500 ring-offset-2" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-black text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                {isCurrentPlan(plan.name) && (
                  <div className="absolute -top-4 right-4">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Active</span>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-black mb-2">{plan.name}</h3>
                    <div className="mb-3">
                      <span className="text-3xl font-bold text-black">{plan.price}</span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{plan.description}</p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-black mr-3 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full transition-all duration-300 rounded-lg ${
                      isCurrentPlan(plan.name)
                        ? "bg-green-500 text-white cursor-default"
                        : plan.popular
                          ? "bg-black text-white hover:bg-gray-800"
                          : "bg-white text-black border border-black hover:bg-black hover:text-white"
                    }`}
                    size="lg"
                    disabled={isCurrentPlan(plan.name)}
                    onClick={() => handlePlanAction(plan.name)}
                  >
                    {getButtonText(plan.name)}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Current Plan Status */}
          <Card className="border border-gray-200 shadow-md bg-white rounded-xl md:mt-15">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black rounded-lg">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Current Plan</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="font-bold text-gray-900 mb-1">{currentPlan}</h3>
                <p className="text-sm text-gray-600">{currentPlan === "Free" ? "Free forever" : "Billed monthly"}</p>
              </div>
              {currentPlan === "Premium Freelancer" && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Next billing date:</span>
                    <span className="font-semibold text-gray-900">Jan 15, 2025</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold text-gray-900">$15.00</span>
                  </div>
                </div>
              )}
              <Button variant="outline" className="w-full border border-gray-200 bg-white hover:bg-gray-50 rounded-lg"
              onClick={()=> setShowBillingHistory(true)}
              >
                Manage Billing
              </Button>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <Card className="border border-gray-200 shadow-md bg-gray-50 rounded-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900">Why Upgrade?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-black rounded-lg">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Premium Badge</h4>
                  <p className="text-xs text-gray-600">Stand out with a premium profile badge</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-black rounded-lg">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Priority Support</h4>
                  <p className="text-xs text-gray-600">Get faster response times for support</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-black rounded-lg">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">Exclusive Jobs</h4>
                  <p className="text-xs text-gray-600">Access to premium job postings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>


      <AlertDialog open={showCancelSubscription} onOpenChange={setShowCancelSubscription}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to Cancel Freelancer Premium Subscription? Your Subscription will only End After Your Current Billing Cycle Ends.
              # For Testing Purpose, this is set as Immediate Terminating For Now.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelSubscription(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => cancelSubscription()} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
              Cancel Subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> 


      <Dialog open={showBillingHistory} onOpenChange={setShowBillingHistory}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Billing History
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            {loadingBillingHistory ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                <span className="ml-2 text-gray-600">Loading billing history...</span>
              </div>
            ) : billingHistory.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No billing history found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {billingHistory.map((item, index) => (
                  <Card key={index} className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="space-y-2 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">
                                {formatAmount(item.amountPaid, item.currency)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">Amount Paid</p>
                          </div>

                          <div className="space-y-2 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">
                                {formatDate(item.createdAt)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">Payment Date</p>
                          </div>

                          <div className="space-y-2 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Shield className="w-4 h-4 text-purple-600" />
                              <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">
                                {item.stripeProductName}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">Product</p>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 space-y-3">
                            <div className="space-y-1">
                              <div className="flex items-start gap-2">
                                <CheckCircleIcon className="w-3 h-3 text-orange-600 mt-2 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <span className="font-mono text-xs text-gray-900 break-all">
                                    {item.status}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 ml-5">Status</p>
                            </div>
                            
                          <div className="space-y-1">
                            <div className="flex items-start gap-2">
                              <FileText className="w-3 h-3 text-orange-600 mt-2 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <span className="font-mono text-xs text-gray-900 break-all">
                                  {item.latestInvoiceId}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 ml-5">Invoice ID</p>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-start gap-2">
                              <CreditCard className="w-3 h-3 text-indigo-600 mt-2 flex-shrink-0" />
                              <div className="min-w-0 flex-1">
                                <span className="font-mono text-xs text-gray-900 break-all">
                                  {item.stripeSubscriptionId}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 ml-5">Subscription ID</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
