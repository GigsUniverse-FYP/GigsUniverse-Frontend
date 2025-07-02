import { Button } from "@/components/ui/button"
import { Users, Briefcase, Target, Award } from "lucide-react"
import Link from "next/link"

export default function HowItWorksGigWorkers() {
  const steps = [
    {
      step: "01",
      title: "Create Your Profile",
      description:
        "Build a comprehensive profile showcasing your skills, experience, and portfolio to attract clients.",
      icon: <Users className="w-8 h-8" />,
    },
    {
      step: "02",
      title: "Browse & Apply",
      description: "Explore thousands of gig opportunities and submit compelling proposals to potential clients.",
      icon: <Briefcase className="w-8 h-8" />,
    },
    {
      step: "03",
      title: "Get Hired",
      description: "Connect with clients, discuss project details, and secure your next gig opportunity.",
      icon: <Target className="w-8 h-8" />,
    },
    {
      step: "04",
      title: "Deliver & Earn",
      description: "Complete projects with excellence, build your reputation, and earn consistent income.",
      icon: <Award className="w-8 h-8" />,
    },
  ]

  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">How It Works for Gig Workers</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start your freelance journey with these simple steps and begin earning from remote gig work.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="text-center animate-fade-in-up hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto mb-4 hover:rotate-12 transition-transform duration-300">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-2 border-black rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-black mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12 animate-fade-in-up animation-delay-400">
          <Link href="/register/freelancer">
            <Button
              size="lg"
              className="bg-black cursor-pointer text-white hover:bg-gray-800 px-8 py-3 hover:scale-105 transition-all duration-300"
            >
              Start as Freelancer
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
