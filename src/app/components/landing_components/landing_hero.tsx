import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

export default function LandingHero() {
  return (
    <section className="relative bg-black text-white overflow-hidden">

      {/* Background Video and Fades */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black opacity-90" />
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <video
            className="w-full h-full object-cover"
            src="videos/landing.mp4"
            autoPlay
            muted
            loop
            playsInline
          />

          {/* Left fade */}
          <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />

          {/* Right fade */}
          <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />
        </div>
      </div>

      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in-up">
            Your Gateway to
            <span className="block text-gray-300 animate-fade-in-up animation-delay-200">
              Remote Gig Work
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
            Connect with opportunities in gig work, part-time positions, and
            remote internships. Build your career on your terms, anywhere in the
            world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up animation-delay-600">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg hover:scale-105 transition-all duration-300"
            >
              Find Your Next Gig
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white hover:text-black px-8 py-3 text-lg hover:scale-105 transition-all duration-300"
            >
              Post a Job
            </Button>
          </div>
        </div>
      </div>

      {/* Curved Design Elements - Made with Online Compiler */}
      <div className="absolute lg:-bottom-2.5 -bottom-3 left-0 w-full z-10 overflow-visible">
        <svg
          className="w-full h-52 text-white animate-float"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,120 C150,80 350,40 600,60 C850,80 1050,100 1200,80 L1200,120 Z"
            fill="currentColor"
            opacity="0.9"
          />
          <path
            d="M0,120 C200,90 400,50 600,70 C800,90 1000,110 1200,90 L1200,120 Z"
            fill="currentColor"
            opacity="1"
          />
        </svg>
      </div>
    </section>
  );
}
