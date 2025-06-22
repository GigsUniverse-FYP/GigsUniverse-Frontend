import { Shield, Zap, Globe, CheckCircle } from "lucide-react"

export default function LandingChoose() {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Payments",
      description: "Protected transactions with escrow services and Stripe-powered payment options.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Fast Matching",
      description: "Our data-powered algorithm connects you with the most relevant opportunities in minutes, not days.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Reach",
      description: "Access opportunities from companies worldwide and work with clients across different time zones.",
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Quality Assurance",
      description: "Most profiles are verified and rated by real users to ensure high-quality matches.",
    },
  ]

  return (
    <section className="py-24 bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose GigsUniverse?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We're more than just a job board. We're your partner in building a successful remote career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center animate-fade-in-up hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white text-black rounded-lg mb-4 hover:rotate-12 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}