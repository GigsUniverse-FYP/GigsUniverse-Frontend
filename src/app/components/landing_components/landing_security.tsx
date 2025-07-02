import { UserCheck, Shield, CreditCard, Ban } from "lucide-react"

export default function LandingSecurity() {
  const features = [
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "Identity Verification",
      description: "Users in the platform are required to verify their real identity",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Less Scam",
      description: "Advanced fraud detection and user verification reduce scam risks",
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Payment Protection",
      description: "Secure payments powered by Stripe with escrow protection",
    },
    {
      icon: <Ban className="w-6 h-6" />,
      title: "No Ads",
      description: "Clean, ad-free experience focused on connecting talent with opportunities",
    },
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-black mb-4">Secure & Trusted Platform</h2>
          <p className="text-gray-600">Your safety and security are our top priorities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-white rounded-lg mb-4 hover:rotate-12 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-black mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
