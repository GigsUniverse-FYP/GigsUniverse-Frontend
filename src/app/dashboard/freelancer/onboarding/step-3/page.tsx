"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, DollarSign, ExternalLink, XCircle, ArrowRight, ArrowLeft } from "lucide-react"
import StepIndicator from "../step-indicator"
import useStripeWebSocket from "../../lib/useStripeWebsocket"

export default function Step3StripeExpress() {
  const router = useRouter()
  const [stripeStatus, setStripeStatus] = useState<"idle" | "loading" | "success" | "failed">("idle")
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [email, setUserEmail] = useState<string | null>(null)

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // check if user is verified
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/stripe/freelancer/status`, {
          credentials: "include",
          method: "GET",
        });
        const data = await res.json();

        if (data.email) {
          setUserEmail(data.email);
        }

        console.log("Fetched Stripe status", data);

        if (data.status === "success" && data.completedPayment === true) {
          setStripeStatus("success");
          setTimeout(() => {
            router.push("/dashboard/freelancer/onboarding/step-4");
          }, 3000); 
        }
      } catch (err) {
        console.error("Failed to fetch Stripe status", err);
      }
    };

    checkStatus();
  }, [router]);


  // start stripe connection
  const connectStripe = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/stripe/onboarding`, {
        credentials: "include",
        method: "POST",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to start Stripe onboarding.");
      }

      const data = await res.json();

      if (data.onboardingUrl) {
        window.open(data.onboardingUrl, "_blank");
        setStripeStatus("loading");
      } else {
        alert("Verifying Your Details. You may close this page and check back later.");
      }
    } catch (err) {
      console.error("Failed to start verification", err);
    }
  }

  // use Websocket to Connect and update Stripe Connection Status
 useStripeWebSocket(email ?? "", ({ stripeStatus, completedPaymentSetup, payoutsEnabled }) => {
  if (stripeStatus === "success" && completedPaymentSetup) {
    console.log("Stripe onboarding successful");
    setStripeStatus("success");
  } else if (stripeStatus === "failed") {
    console.log("Stripe onboarding failed");
    setStripeStatus("failed");
  } else {
    console.log("WebSocket status:", stripeStatus, completedPaymentSetup, payoutsEnabled);
  }
 });

  // to next step
  const handleNext = () => {
    router.push("/dashboard/freelancer/onboarding/step-4")
  }

  const renderStatusContent = () => {
    switch (stripeStatus) {
      case "idle":
        return (
          <>
            <div className="w-12 h-12 bg-black rounded-lg mx-auto mb-4 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect with Stripe Express</h3>
            <p className="text-gray-600 mb-6">
              Stripe Express allows you to receive payments securely, manage your earnings, and handle tax reporting
              automatically.
            </p>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">Secure payment processing</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">Automatic tax reporting</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">Fast payouts (2-7 business days)</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">Multi-currency support</span>
                </div>
              </div>
            </div>
            <Button className="w-full mt-6 bg-black hover:bg-gray-800 cursor-pointer" onClick={connectStripe}>
              Create Stripe Express Account
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </>
        )
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg font-medium text-gray-700">Creating Stripe Express account...</p>
            <p className="text-sm text-gray-500 mb-4">Please do not close this page.</p>
            <Button variant="outline" onClick={connectStripe} className="mt-4 cursor-pointer">
              Retry Connection
            </Button>
          </div>
        )
      case "success":
        return (
          <div className="flex flex-col items-center justify-center h-64 text-green-600">
            <CheckCircle className="w-20 h-20 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Stripe Express Connected!</h3>
            <p className="text-gray-600 mb-6">Your payment method is now set up successfully.</p>
            <Button onClick={handleNext} className="bg-black hover:bg-gray-800 cursor-pointer">
              Continue to Terms & Conditions
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )
      case "failed":
        return (
          <div className="flex flex-col items-center justify-center h-64 text-red-600">
            <XCircle className="w-20 h-20 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Connection Failed</h3>
            <p className="text-gray-600 mb-4">
              There was an issue creating your Stripe Express account. Please try again.
            </p>
            <Button className="bg-black hover:bg-gray-800 cursor-pointer" onClick={() => setStripeStatus("idle")}>
              Retry Connection
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to GigsUniverse</h1>
          <p className="text-gray-600">Complete your profile setup to start finding amazing opportunities</p>
        </div>

        <StepIndicator currentStep={3} completedSteps={completedSteps} />

        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Stripe Express</h2>
                <p className="text-gray-600">Connect your Stripe Express account to receive payments from clients</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 text-center">{renderStatusContent()}</div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
