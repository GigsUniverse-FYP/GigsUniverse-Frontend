"use client"

import { CheckCircle, Shield, Briefcase, DollarSign, ScrollText } from "lucide-react"
import { useRouter } from "next/navigation"

const steps = [
  {
    id: 1,
    title: "Identity Verification",
    description: "Verify your identity using Sumsub",
    icon: Shield,
    path: "/dashboard/freelancer/onboarding/step-1",
  },
  {
    id: 2,
    title: "Professional Profile",
    description: "Setup your freelancer profile",
    icon: Briefcase,
    path: "/dashboard/freelancer/onboarding/step-2",
  },
  {
    id: 3,
    title: "Stripe Express",
    description: "Connect your payment method",
    icon: DollarSign,
    path: "/dashboard/freelancer/onboarding/step-3",
  },
  {
    id: 4,
    title: "T&C Acceptance",
    description: "Review and accept our terms",
    icon: ScrollText,
    path: "/dashboard/freelancer/onboarding/step-4",
  },
]

interface StepIndicatorProps {
  currentStep: number
  completedSteps: number[]
}

export default function StepIndicator({ currentStep, completedSteps }: StepIndicatorProps) {
  const router = useRouter()

  const handleStepClick = (stepId: number, path: string) => {
    if (stepId === currentStep || completedSteps.includes(stepId)) {
      router.push(path)
    }
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-8">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <button
              onClick={() => handleStepClick(step.id, step.path)}
              className={`flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-200 mb-3 ${
                completedSteps.includes(step.id)
                  ? "bg-green-500 border-green-500 text-white shadow-lg cursor-pointer"
                  : step.id === currentStep
                    ? "border-blue-500 text-blue-500 bg-blue-50 shadow-md cursor-pointer"
                    : step.id > currentStep
                      ? "border-gray-300 text-gray-400 cursor-not-allowed"
                      : "border-gray-300 text-gray-400 cursor-not-allowed opacity-50"
              }`}
              disabled={step.id !== currentStep && !completedSteps.includes(step.id)}
            >
              {completedSteps.includes(step.id) ? (
                <CheckCircle className="w-7 h-7" />
              ) : (
                <span className="font-bold text-lg">{step.id}</span>
              )}
            </button>
            <div className="text-center max-w-32">
              <span className={`text-sm font-medium ${step.id === currentStep ? "text-blue-600" : "text-gray-600"}`}>
                {step.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
