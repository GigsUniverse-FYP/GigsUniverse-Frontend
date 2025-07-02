"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Briefcase, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const faqCategories = [
    {
      category: "Getting Started",
      faqs: [
        {
          question: "How do I create an account on GigsUniverse?",
          answer:
            "Simply click the 'Register' button, fill in your details, verify your email and identity then construct your professional profile. This process might take around 10-15 minutes.",
        },
        {
          question: "Is GigsUniverse free to use?",
          answer:
            "Yes, basic features are completely free. We also offer premium plans with additional benefits like extended amount of applications, priority support, and advanced features.",
        },
        {
          question: "What types of work are available?",
          answer:
            "We offer gig work, part-time positions, and remote internships across various fields including design, development, marketing, writing, data analysis, and more.",
        },
        {
          question: "How do I get verified?",
          answer:
            "Complete your profile, upload a government-issued ID or any relevant documents while ensure it is not expired. Our team reviews applications within 24-48 hours.",
        },
        {
          question: "How do I reset my password?",
          answer:
            "Click 'Forgot Password' on the login page, enter your email, and follow the instructions in the password reset email. If you don't receive it, check your spam folder or contact support.",
        },
        {
          question: "Can I create multiple accounts in GigsUniverse?",
          answer:
            "No, creating multiple accounts is against our terms of service. Each user should have only one account for each role to maintain the integrity of the platform. This means that a user can create a freelancer profile and employer profile with similar email only.",
        },
        {
          question: "How does the verification work?",
          answer: 
            "The verification will be handled by our third party organization 'Sumsub'. It includes process like KYC for Freelancer and Employer and KYB for Company profile."
        },
        {
          question: "What will happen if I unable to verify my identity?",
          answer:
            "If you are unable to verify your identity, you will not be able to access the platform. You can contact our support team for assistance as facing any issues in verification. This is to ensure a secure and trustworthy environment.",
        },
        {
          question: "What will happen if I break the T&C of GigsUniverse?",
          answer:
            "If you break the terms and conditions of GigsUniverse, your account may be suspended or permanently banned. We take violations seriously to maintain a safe and professional community.",
        },
        {
          question: "What currency does the platform support?",
          answer:
            "GigsUniverse support USD as the main and standard currency. Other currencies or cryptocurrencies may be supported in the future based on user demand. All transactions are processed in USD to ensure consistency.",
        },
        {
          question: "What platform do the freelancers and employers use in payment?",
          answer:
            "GigsUniverse uses Stripe as the payment processor. While users will be required to create a Stripe Express Account to receive payouts in the dashboard.",
        }
      ],
    },
    {
      category: "For Freelancers",
      faqs: [
        {
          question: "How do I find suitable gigs?",
          answer:
            "Use our advanced search filters and job recommendation engine to find projects matching your skills, budget preferences, and timeline. You can also set up job alerts to get notified of new opportunities.",
        },
        {
          question: "How do I acquire gig jobs from GigsUniverse?",
          answer:
            "Review job posts, find your ideal jobs, and submit your resume and proposal. Wait for the employer to review your application. If selected, you may discuss project details and negotiate terms.",
        },
        {
          question: "When and how do I get paid?",
          answer:
            "Payments are processed through Stripe with escrow protection. You'll receive payment upon project completion and client approval, typically within 3-5 business days.",
        },
        {
          question: "Can I work with international clients?",
          answer:
            "GigsUniverse connects talent globally. We support multiple currencies and handle international payment processing seamlessly.",
        },
      ],
    },
    {
      category: "For Employers",
      faqs: [
        {
          question: "How do I post a job?",
          answer:
            "Click 'Post a Job', describe your project requirements, set your budget and timeline, and publish. You'll start receiving proposals within hours.",
        },
        {
          question: "How do I choose the right freelancer?",
          answer:
            "Review portfolios, check ratings and reviews, conduct interviews, and consider their proposal quality. Our verification system helps ensure you're working with qualified professionals.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit cards and bank transfers through our secure Stripe integration. All payments are protected by escrow.",
        },
        {
          question: "Can I hire multiple freelancers for a project?",
          answer:
            "Yes, you can hire multiple freelancers for different aspects of your project or create team-based projects with our collaboration tools.",
        },
        {
          question: "How do I create a Company Profile?",
          answer:
            "To create a company profile, head to company tab and click on 'Create Company Profile'. Fill in your company details, upload your logo, and provide a brief description. As the verification process is completed, you may add relevant team members into the company profile.",
        }
      ],
    },
    {
      category: "Security & Trust",
      faqs: [
        {
          question: "How do you prevent scams?",
          answer:
            "We use government-issued ID verification and escrow protection system to minimize frauds. Users are mandated to pass our verification process before accessing the platform.",
        },
        {
          question: "Is my payment information secure?",
          answer:
            "Yes, all payment processing is handled by Stripe, a PCI-compliant payment processor. We never store your payment information on our servers.",
        },
        {
          question: "What if I have a dispute with a client/freelancer?",
          answer:
            "Our dispute resolution team mediates conflicts fairly. We provide escrow protection and have clear policies to protect both parties' interests.",
        },
        {
          question: "How do you verify user identities?",
          answer:
            "We require government-issued ID, passport or any relevant legal documents. Some users also might undergo video verification.",
        },
        {
          question: "What happens if I notice suspicious activity?",
          answer:
            "If you notice any suspicious activity, please report it immediately to our support team via support ticket. We take security seriously and will investigate any reports of fraud or abuse.",
        }
      ],
    },
    {
      category: "Pricing & Fees",
      faqs: [
        {
          question: "What are your platform fees?",
          answer:
            "GigsUniverse will charge a commision fee of 8% on each completed tasks during payments or transactions made.",
        },
        {
          question: "Are there any hidden costs?",
          answer:
            "No hidden costs. All fees are clearly displayed before you commit to any transaction. What you see is what you pay.",
        },
        {
          question: "Can I cancel my premium subscription?",
          answer:
            "Yes, you can cancel anytime. Your premium features will remain active until the end of your current billing period.",
        },
        {
          question: "Do you offer refunds?",
          answer:
            "We offer refunds for unused premium subscriptions within 30 days of purchase. Project payments are handled through our escrow system with dispute resolution.",
        },
      ],
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-0 animate-fade-in">
              <div className="w-18 h-18  rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <img src="icons/landing-icon.png" className="w-18 h-18 text-white" />
              </div>
              <span className="text-xl font-bold text-black">GigsUniverse</span>
            </div>
            <Link href="/">
              <Button
                variant="outline"
                className="bg-white text-black border-black hover:bg-black hover:text-white hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* FAQ Content */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h1 className="text-4xl font-bold text-black mb-4">Frequently Asked Questions</h1>
              <p className="text-xl text-gray-600">
                Find answers to common questions about GigsUniverse. Can't find what you're looking for? Contact our
                support team.
              </p>
            </div>

            {faqCategories.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="mb-12 animate-fade-in-up"
                style={{ animationDelay: `${categoryIndex * 100}ms` }}
              >
                <h2 className="text-2xl font-bold text-black mb-6 border-b border-gray-200 pb-2">
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.faqs.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex
                    return (
                      <Card
                        key={faqIndex}
                        className="border border-gray-200 hover:shadow-lg transition-all duration-300"
                      >
                        <CardContent className="p-0">
                          <button
                            onClick={() => toggleFAQ(globalIndex)}
                            className="w-full text-left p-6 flex justify-between items-center hover:bg-gray-50 transition-colors duration-300"
                          >
                            <h3 className="font-semibold text-black pr-4">{faq.question}</h3>
                            {openFAQ === globalIndex ? (
                              <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300" />
                            )}
                          </button>
                          {openFAQ === globalIndex && (
                            <div className="px-6 pb-6 animate-slide-down">
                              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Contact Information Section */}
            <div className="text-center mt-16 p-8 bg-gray-50 rounded-lg animate-fade-in-up">
              <h3 className="text-xl font-bold text-black mb-4">Still have questions?</h3>
              <p className="text-gray-600 mb-6">
                Get in touch with our team directly. We're here to help you succeed on GigsUniverse.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-6">
                <div className="flex items-center justify-center space-x-3 p-4 bg-white rounded-lg hover:scale-105 transition-transform duration-300">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">📧</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-black">Email Support</p>
                    <p className="text-gray-600 text-sm">admin@gigsuniverse.studio</p>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-3 p-4 bg-white rounded-lg hover:scale-105 transition-transform duration-300">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">📞</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-black">Phone Support</p>
                    <p className="text-gray-600 text-sm">+60 11-2345 6789</p>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-3 p-4 bg-white rounded-lg hover:scale-105 transition-transform duration-300">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">📍</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-black">Office Address</p>
                    <p className="text-gray-600 text-sm">Kuala Lumpur, Malaysia</p>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-3 p-4 bg-white rounded-lg hover:scale-105 transition-transform duration-300">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">🕒</span>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-black">Business Hours</p>
                    <p className="text-gray-600 text-sm">Mon-Fri: 9AM-6PM GMT+8</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-500 text-sm">
                We typically respond to all inquiries within 24 hours during business days.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}