import { Button } from "@/components/ui/button";
import { ArrowRight, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export default function LandingCTA() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have found their perfect gig work through GigsUniverse.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-black cursor-pointer text-white hover:bg-gray-800 px-8 py-3 text-lg hover:scale-105 transition-all duration-300"
              >
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/faq">
              <Button
                size="lg"
                variant="outline"
                className="bg-white cursor-pointer text-black border-black hover:bg-black hover:text-white px-8 py-3 text-lg hover:scale-105 transition-all duration-300"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}