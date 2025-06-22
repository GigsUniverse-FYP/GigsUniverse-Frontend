export default function LandingAboutUs() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">About GigsUniverse</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing the way people work by connecting talented individuals with meaningful opportunities
              across the globe.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-left">
              <h3 className="text-2xl font-bold text-black mb-6">Our Mission</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                At GigsUniverse, we believe that work should be flexible, fulfilling and accessible to everyone,
                regardless of location. Our platform bridges the gap between talented professionals seeking flexible
                work arrangements and companies looking for skilled remote workers.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Founded in 2025, we've grown from a simple idea to a thriving community of over 50,000 freelancers and
                5,000 companies across 100+ countries. We're committed to creating a future where work is not bound by
                geographical limitations.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-black mb-2">Our Vision</h4>
                  <p className="text-gray-600 text-sm">
                    To become world's leading platform for remote work opportunities.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-black mb-2">Our Values</h4>
                  <p className="text-gray-600 text-sm">Transparency, flexibility, and empowerment for all our users.</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-8 animate-fade-in-right">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { number: "2025", label: "Founded" },
                  { number: "50K+", label: "Active Users" },
                  { number: "100+", label: "Countries" },
                  { number: "98%", label: "Satisfaction Rate" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-black mb-2 hover:scale-110 transition-transform duration-300">
                      {stat.number}
                    </div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}