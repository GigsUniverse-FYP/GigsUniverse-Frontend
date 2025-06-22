"use client"

import { Briefcase, ChevronDown, ChevronUp, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isFAQOpen, setIsFAQOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  
  // Sample FAQs Shown at Dropdown
  const faqs = [
    {
      question: "How do I get started?",
      answer: "Simply create an account, complete your profile, and start browsing opportunities or posting jobs.",
    },
    {
      question: "Is GigsUniverse free to use?",
      answer: "Yes, basic features are free. We also offer premium plans with additional benefits.",
    },
    {
      question: "How secure are payments?",
      answer: "All payments are processed through Stripe with escrow protection for both parties.",
    },
    {
      question: "How does verification work?",
      answer: "We verify all users through ID verification, job experiences and portfolio reviews to ensure quality.",
    },
  ]

  return (
    <header className="border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 animate-fade-in-down">
          {/* Logo and App Name */}
          <div className="flex items-center space-x-0 animate-fade-in">
            <div className="w-18 h-18 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <img src="icons/landing-icon.png" className="w-18 h-18 text-white" />
            </div>
            <span className="text-xl font-bold text-black">GigsUniverse.</span>
          </div>

          {/* Desktop Navigator */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="#" className="text-gray-700 hover:text-black transition-colors duration-300 hover:scale-105">
              Home
            </Link>
            <Link
              href="#about"
              className="text-gray-700 hover:text-black transition-colors duration-300 hover:scale-105"
            >
              About
            </Link>
            <Link
              href="#how-it-works"
              className="text-gray-700 hover:text-black transition-colors duration-300 hover:scale-105"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-gray-700 hover:text-black transition-colors duration-300 hover:scale-105"
            >
              Pricing
            </Link>
            <div className="relative">
              <button
                onClick={() => setIsFAQOpen(!isFAQOpen)}
                className="flex items-center text-gray-700 hover:text-black transition-colors duration-300 hover:scale-105"
              >
                FAQ
                {isFAQOpen ? <ChevronUp className="ml-1 w-4 h-4" /> : <ChevronDown className="ml-1 w-4 h-4" />}
              </button>
              {isFAQOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-slide-down">
                  <div className="p-4 space-y-4">
                    {faqs.map((faq, index) => (
                      <div key={index} className="border-b border-gray-100 last:border-b-0 pb-3 last:pb-0">
                        <h4 className="font-semibold text-black text-sm mb-1">{faq.question}</h4>
                        <p className="text-gray-600 text-xs">{faq.answer}</p>
                      </div>
                    ))}
                    <Link href="/faq" className="block text-center text-black font-semibold text-sm hover:underline">
                      View All FAQs →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="relative">
              <Button
                variant="outline"
                className="bg-white cursor-pointer text-black border-black hover:bg-black hover:text-white transition-all duration-300 hover:scale-105"
              >
                <Link href="/login">Login</Link>
              </Button>
            </div>
            <div className="relative">
              <Button
                className="bg-black cursor-pointer text-white hover:bg-gray-800 transition-all duration-300 hover:scale-105"
              >
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button - Navigator */}
          <button
            className="lg:hidden p-2 hover:scale-110 transition-transform"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-slide-down">
            <nav className="flex flex-col space-y-4">
              <Link href="#" className="text-gray-700 hover:text-black transition-colors">
                Home
              </Link>
              <Link href="#about" className="text-gray-700 hover:text-black transition-colors">
                About
              </Link>
              <Link href="#how-it-works" className="text-gray-700 hover:text-black transition-colors">
                How It Works
              </Link>
              <Link href="#pricing" className="text-gray-700 hover:text-black transition-colors">
                Pricing
              </Link>
              <Link href="/faq" className="text-gray-700 hover:text-black transition-colors">
                FAQ
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer bg-white text-black border-black hover:bg-black hover:text-white text-center justify-center"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                </div>
                <div className="space-y-2 pt-2">
                  <Button className="w-full cursor-pointer bg-black text-white hover:bg-gray-800 text-center justify-center">
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}