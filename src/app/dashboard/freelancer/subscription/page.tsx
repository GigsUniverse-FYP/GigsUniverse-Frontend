"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, HelpCircle, CreditCard, Shield, Clock } from "lucide-react"
import { useState } from "react"

const freelancerPlans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for getting started with freelancing",
    features: [
      "Up to 2 active gigs",
      "Basic profile customization",
      "2 portfolio showcase slots",
      "3 certificate showcase slots",
      "Access to basic job listings",
    ],
    popular: false,
    buttonText: "Get Started Free",
  },
  {
    name: "Premium Freelancer",
    price: "$15",
    period: "/month",
    description: "Perfect for serious freelancers looking to grow",
    features: [
      "Up to 5 active gigs",
      "Full profile customization",
      "5 portfolio showcase slots",
      "7 certificate showcase slots",
      "Access to exclusive job listings",
      "Premium profile badge",
      "Priority support",
    ],
    popular: true,
    buttonText: "Upgrade to Premium",
  },
]

export default function SubscriptionPage() {
  // Simulate current user plan - you can replace this with actual user data
  const [currentPlan, setCurrentPlan] = useState("Free") // or "Premium Freelancer"

  const getButtonText = (planName: string) => {
    if (currentPlan === planName) {
      return "Current Plan"
    }
    if (planName === "Free") {
      return currentPlan === "Premium Freelancer" ? "Downgrade to Free" : "Get Started Free"
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
            <h2 className="text-xl font-bold text-gray-900 mb-2">Freelancer Plans</h2>
            <p className="text-gray-600">
              Choose the perfect plan to showcase your skills and grow your freelance business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {freelancerPlans.map((plan, index) => (
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
              <Button variant="outline" className="w-full border border-gray-200 bg-white hover:bg-gray-50 rounded-lg">
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
                  <p className="text-xs text-gray-600">Access to premium job listings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
