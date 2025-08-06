"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Shield, ExternalLink, XCircle, Info, ArrowRight } from "lucide-react"
import StepIndicator from "../step-indicator"
import useSumsubWebSocket from "../../lib/useSumsubWebSocket"


export default function Step1SumsubVerification() {
  const router = useRouter();
  const [sumsubStatus, setSumsubStatus] = useState<"idle" | "loading" | "success" | "failed" | "duplicated">("idle");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [email, setUserEmail] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  // check if user is verified
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/sumsub/employer/status`, {
          credentials: "include",
          method: "GET",
        });
        const data = await res.json();

        if (data.email) {
          setUserEmail(data.email);
        }

        console.log("Fetched Sumsub status", data);

        if (data.status === "success" && data.completedIdentity === true) {
          setSumsubStatus("success");
          setTimeout(() => {
            router.push("/dashboard/employer/onboarding/step-2");
          }, 3000); 
        }
      } catch (err) {
        console.error("Failed to fetch Sumsub status", err);
      }
    };

    checkStatus();
  }, [router]);


  const startVerification = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/sumsub/employer/permalink`, {
        credentials: "include",
      });

      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
        setSumsubStatus("loading");
      } else {
        alert("Verifying Your Details. Please Wait...");
      }
    } catch (err) {
      console.error("Failed to start verification", err);
    }
  };

  useSumsubWebSocket(email ?? "", ({ status, isDuplicate }) => {
    if (isDuplicate) {
      console.log("WebSocket: Duplicated identity detected");
      setSumsubStatus("duplicated");
    } else if (status === "GREEN") {
      console.log("WebSocket: Identity verified successfully");
      setSumsubStatus("success");
    } else if (status === "RED" || status === "YELLOW" || status === "ERROR") {
      console.log("WebSocket: Identity verification failed");
      setSumsubStatus("failed");
    } else {
      console.log("WebSocket status:", status);
    }
  });


    const handleNext = async () => {
      router.push("/dashboard/employer/onboarding/step-2");
    };


  const renderStatusContent = () => {
    switch (sumsubStatus) {
      case "idle":
        return (
          <>
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sumsub Identity Verification</h3>
            <p className="text-gray-600 mb-6">
              We use Sumsub, a trusted identity verification service, to ensure the security and authenticity of all
              freelancers on our platform.
            </p>
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">Government ID verification</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">Facial recognition check</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium">Liveness check</span>
                </div>
              </div>
            </div>
            <Button className="w-full bg-black hover:bg-gray-800 cursor-pointer" onClick={startVerification}>
              Start Verification with Sumsub
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </>
        )
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-lg font-medium text-gray-700">Verifying your identity...</p>
            <p className="text-sm text-gray-500 mb-4">Please do not close this page.</p>
            <Button variant="outline" onClick={() => startVerification()} className="mt-4 cursor-pointer">
              Retry Verification
            </Button>
          </div>
        )
      case "success":
        return (
          <div className="flex flex-col items-center justify-center h-64 text-green-600">
            <CheckCircle className="w-20 h-20 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Identity Verified Successfully!</h3>
            <p className="text-gray-600 mb-6">You can now proceed to the next step.</p>
            <Button onClick={handleNext} className="bg-black hover:bg-gray-800 cursor-pointer">
              Continue to Profile Creation
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )
      case "failed":
        return (
          <div className="flex flex-col items-center justify-center h-64 text-red-600">
            <XCircle className="w-20 h-20 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Verification Failed</h3>
            <p className="text-gray-600 mb-4">There was an issue verifying your identity. Please try again.</p>
            <Button className="bg-black hover:bg-gray-800 cursor-pointer" onClick={() => setSumsubStatus("idle")}>
              Retry Verification
            </Button>
          </div>
        )
      case "duplicated":
        return (
          <div className="flex flex-col items-center justify-center h-64 text-yellow-600">
            <Info className="w-20 h-20 mb-4" />
            <h3 className="text-2xl font-bold mb-2">Duplicated Account Detected</h3>
            <p className="text-gray-600 mb-4">
              It looks like an account with these details already exists. Please contact support if you believe this is
              an error.
            </p>
            <a href="mailto:admin@gigsuniverse.studio">
              <Button className="bg-black hover:bg-gray-800 cursor-pointer" onClick={() => alert("Contact support functionality would be here.")}>
                Contact Support
              </Button>
            </a>
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

        <StepIndicator currentStep={1} completedSteps={completedSteps} />

        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Identity Verification</h2>
                <p className="text-gray-600">Complete identity verification using Sumsub to build trust with clients</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 text-center">{renderStatusContent()}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
