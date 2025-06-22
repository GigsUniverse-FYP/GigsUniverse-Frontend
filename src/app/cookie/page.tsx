import { Button } from "@/components/ui/button"
import { Briefcase, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CookiesPage() {
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

      {/* Cookie Policy Content */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h1 className="text-4xl font-bold text-black mb-4">Cookie Policy</h1>
              <p className="text-xl text-gray-600">Last updated: 20 June 2025</p>
            </div>

            <div className="prose prose-lg max-w-none animate-fade-in-up animation-delay-200">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">1. What Are Cookies</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Cookies are small text files that are placed on your computer or mobile device when you visit a
                    website. They are widely used to make websites work more efficiently and provide information to
                    website owners.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    GigsUniverse uses cookies and similar tracking technologies to enhance your experience on our
                    platform, analyze usage patterns, and provide personalized services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">2. Types of Cookies We Use</h2>

                  <h3 className="text-xl font-semibold text-black mb-3">Essential Cookies</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    These cookies are necessary for the website to function properly. They enable core functionality
                    such as security, network management, and accessibility.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-6">
                    <li>Authentication and login status</li>
                    <li>Security and fraud prevention</li>
                    <li>Load balancing and performance</li>
                    <li>User preferences and settings</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3">Analytics Cookies</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    These cookies help us understand how visitors interact with our website by collecting and reporting
                    information anonymously.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-6">
                    <li>Page views and user journeys</li>
                    <li>Time spent on pages</li>
                    <li>Click-through rates</li>
                    <li>Error tracking and debugging</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3">Functional Cookies</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    These cookies enable enhanced functionality and personalization, such as remembering your
                    preferences and choices.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-6">
                    <li>Language and region preferences</li>
                    <li>Customized user interface</li>
                    <li>Recently viewed items</li>
                    <li>Search history and filters</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3">Marketing Cookies</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    These cookies are used to deliver relevant advertisements and track the effectiveness of our
                    marketing campaigns.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>Targeted advertising</li>
                    <li>Social media integration</li>
                    <li>Campaign performance tracking</li>
                    <li>Cross-platform user identification</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">3. Third-Party Cookies</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We work with trusted third-party service providers who may also set cookies on your device. These
                    include:
                  </p>

                  <div className="bg-gray-50 p-6 rounded-lg mb-4">
                    <h4 className="font-semibold text-black mb-2">Payment Processing</h4>
                    <p className="text-gray-600 text-sm mb-2">
                      <strong>Stripe:</strong> Processes payments securely and prevents fraud
                    </p>
                    <p className="text-gray-600 text-sm">
                      Purpose: Transaction processing, fraud detection, compliance
                    </p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg mb-4">
                    <h4 className="font-semibold text-black mb-2">Analytics</h4>
                    <p className="text-gray-600 text-sm mb-2">
                      <strong>Google Analytics:</strong> Provides insights into website usage
                    </p>
                    <p className="text-gray-600 text-sm">
                      Purpose: Traffic analysis, user behavior tracking, performance optimization
                    </p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-semibold text-black mb-2">Communication</h4>
                    <p className="text-gray-600 text-sm mb-2">
                      <strong>Customer Support Tools:</strong> Enable live chat and support features
                    </p>
                    <p className="text-gray-600 text-sm">Purpose: Customer service, user support, communication</p>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">4. How Long Do Cookies Last</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Cookies can be either "session" cookies or "persistent" cookies:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-black mb-2">Session Cookies</h4>
                      <p className="text-gray-600 text-sm">
                        Temporary cookies that are deleted when you close your browser. Used for essential functions
                        like maintaining your login session.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h4 className="font-semibold text-black mb-2">Persistent Cookies</h4>
                      <p className="text-gray-600 text-sm">
                        Remain on your device for a set period (typically 30 days to 2 years) or until you delete them.
                        Used for preferences and analytics.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">5. Managing Your Cookie Preferences</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">You have several options for managing cookies:</p>

                  <h3 className="text-xl font-semibold text-black mb-3">Browser Settings</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Most web browsers allow you to control cookies through their settings. You can:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-6">
                    <li>Block all cookies</li>
                    <li>Block third-party cookies only</li>
                    <li>Delete existing cookies</li>
                    <li>Set up notifications when cookies are being sent</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3">Platform Settings</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    When you first visit GigsUniverse, you'll see a cookie consent banner where you can:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>Accept all cookies</li>
                    <li>Customize your preferences by cookie type</li>
                    <li>Reject non-essential cookies</li>
                    <li>Change your preferences at any time through your account settings</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">6. Impact of Disabling Cookies</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    While you can disable cookies, please note that doing so may affect your experience on our platform:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>You may need to log in repeatedly</li>
                    <li>Your preferences and settings may not be saved</li>
                    <li>Some features may not work properly</li>
                    <li>You may see less relevant content and advertisements</li>
                    <li>Performance and security features may be reduced</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">7. Updates to This Cookie Policy</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We may update this Cookie Policy from time to time to reflect changes in our practices or for other
                    operational, legal, or regulatory reasons.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    We will notify you of any material changes by posting the updated policy on our website and updating
                    the "Last updated" date at the top of this page.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">8. Contact Us</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    If you have any questions about our use of cookies or this Cookie Policy, please contact us:
                  </p>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-600 mb-2">
                      <strong>Email:</strong> admin@gigsuniverse.com
                    </p>
                    <p className="text-gray-600 mb-2">
                      <strong>Phone:</strong> +60 11-2345 6789
                    </p>
                    <p className="text-gray-600">
                      <strong>Address:</strong> GigsUniverse Sdn. Bhd., Kuala Lumpur, Malaysia
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}