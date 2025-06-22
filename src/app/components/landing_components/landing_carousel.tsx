export default function LandingCarousel() {
  const companies = [
    { name: "Microsoft", logo: "images/company1.png" },
    { name: "Amazon", logo: "images/company2.png" },
    { name: "Apple", logo: "images/company3.png" },
    { name: "GitHub", logo: "images/company4.png" },
    { name: "Meta", logo: "images/company5.png" },
    { name: "Vercel", logo: "images/company6.png"},
    { name: "APU", logo: "images/company7.png" },
    { name: "DMU", logo: "images/company8.png" },

  ]

  return (
    <section className="py-16 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-black mb-4">Trusted by Leading Companies</h2>
          <p className="text-gray-600">Join thousands of companies already using GigsUniverse to find top talents</p>
        </div>

        {/* Company Logos Carousel */}
        <div className="relative overflow-display">
          <div className="flex animate-scroll space-x-12 items-center">
            {/* First set of companies */}
            {companies.map((company, index) => (
              <div key={index} className="flex-shrink-0 flex items-center justify-center">
                <div className="w-55 h-15 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 hover:border-black hover:scale-110 transition-all duration-300 hover:shadow-md">
                  <img className="w-55 h-15 rounded-lg" src={company.logo}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats below carousel */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto mt-12">
          {[
            { number: "10K+", label: "Active Gigs" },
            { number: "5K+", label: "Companies" },
            { number: "50K+", label: "Freelancers" },
            { number: "100+", label: "Countries" },
          ].map((stat, index) => (
            <div key={index} className="text-center animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="text-3xl font-bold text-black mb-2 hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}