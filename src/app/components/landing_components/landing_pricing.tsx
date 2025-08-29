"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function LandingSubscription() {
  const [activeTab, setActiveTab] = useState("freelancers")

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

  const employerPlans = [
    {
      name: "Free",
      price: "$0",
      period: "/month",
      description: "Great for small projects and testing the platform",
      features: [
        "2 job postings per month",
        "Hire up to 5 candidates concurrently",
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
        "Hire up to 10 candidates concurrently",
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

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and upgrade when you're ready to unlock premium features
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 p-1 rounded-lg inline-flex animate-fade-in-up animation-delay-200">
            <button
              onClick={() => setActiveTab("freelancers")}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                activeTab === "freelancers"
                  ? "bg-black text-white shadow-lg"
                  : "text-gray-600 hover:text-black hover:bg-gray-200"
              }`}
            >
              Freelancers
            </button>
            <button
              onClick={() => setActiveTab("employers")}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                activeTab === "employers"
                  ? "bg-black text-white shadow-lg"
                  : "text-gray-600 hover:text-black hover:bg-gray-200"
              }`}
            >
              Employers
            </button>
            <button
              onClick={() => setActiveTab("company")}
              className={`px-6 py-3 rounded-md font-semibold transition-all duration-300 ${
                activeTab === "company"
                  ? "bg-black text-white shadow-lg"
                  : "text-gray-600 hover:text-black hover:bg-gray-200"
              }`}
            >
              Enterprise
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-4xl mx-auto">
          {activeTab === "freelancers" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
              {freelancerPlans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative border-2 hover:shadow-lg hover:scale-105 transition-all duration-300 ${
                    plan.popular ? "border-black" : "border-gray-200"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-black text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-black mb-2">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-black">{plan.price}</span>
                        <span className="text-gray-600">{plan.period}</span>
                      </div>
                      <p className="text-gray-600">{plan.description}</p>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-black mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                  <Link href="/register/freelancer">
                    <Button
                      className={`w-full cursor-pointer hover:scale-105 transition-all duration-300 ${
                        plan.popular
                          ? "bg-black text-white hover:bg-gray-800"
                          : "bg-white text-black border border-black hover:bg-black hover:text-white cursor-pointer"
                      }`}
                      size="lg"
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>

                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "employers" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
              {employerPlans.map((plan, index) => (
                <Card
                  key={index}
                  className={`relative border-2 hover:shadow-lg hover:scale-105 transition-all duration-300 ${
                    plan.popular ? "border-black" : "border-gray-200"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-black text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardContent className="p-8">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-black mb-2">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-4xl font-bold text-black">{plan.price}</span>
                        <span className="text-gray-600">{plan.period}</span>
                      </div>
                      <p className="text-gray-600">{plan.description}</p>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-black mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/register/employer">
                      <Button
                        className={`w-full cursor-pointer hover:scale-105 transition-all duration-300 ${
                          plan.popular
                            ? "bg-black text-white hover:bg-gray-800"
                            : "bg-white text-black border border-black hover:bg-black hover:text-white"
                        }`}
                        size="lg"
                      >
                        {plan.buttonText}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "company" && (
            <div className="flex justify-center animate-fade-in">
              <Card className="border-2 border-gray-200 max-w-md">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-black mb-4">Enterprise Solutions</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-black">Custom</span>
                  </div>
                  <p className="text-gray-600 mb-8">
                    Tailored solutions for large organizations with custom integrations, dedicated support, and
                    enterprise-grade security.
                  </p>
                  <Button className="w-full bg-gray-100 text-gray-500 cursor-not-allowed" size="lg" disabled>
                    Coming Soon
                  </Button>
                  <p className="text-sm text-gray-500 mt-4">
                    Enterprise features will be available in Q2 2026. Contact us for early access.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="text-center mt-12 animate-fade-in-up animation-delay-600">
          <p className="text-gray-600">
            All plans include our core features: verification system, payment protection, and ad-free experience.
          </p>
        </div>
      </div>
    </section>
  )
}
