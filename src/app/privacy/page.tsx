import { Button } from "@/components/ui/button"
import { Briefcase, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-0 animate-fade-in">
              <div className="w-18 h-18 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300">
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

      {/* Privacy Content */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h1 className="text-4xl font-bold text-black mb-4">Privacy Policy</h1>
              <p className="text-xl text-gray-600">Last updated: 20 June 2025</p>
            </div>

            <div className="prose prose-lg max-w-none animate-fade-in-up animation-delay-200">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">1. Introduction</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    GigsUniverse Inc. ("we," "our," or "us") is committed to protecting your privacy. This Privacy
                    Policy explains how we collect, use, disclose, and safeguard your information when you use our
                    platform.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy
                    Policy, please do not access or use our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">2. Information We Collect</h2>
                  <h3 className="text-xl font-semibold text-black mb-3">Personal Information</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4 mb-4">
                    <li>Register for an account</li>
                    <li>Complete your profile</li>
                    <li>Post jobs or apply for positions</li>
                    <li>Make payments or receive payments</li>
                    <li>Contact our support team</li>
                    <li>Participate in verification processes</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-black mb-3">Automatically Collected Information</h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We automatically collect certain information when you visit, use, or navigate our platform:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>Device and usage information</li>
                    <li>IP address and location data</li>
                    <li>Browser and operating system information</li>
                    <li>Referring URLs and clickstream data</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">3. How We Use Your Information</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We use the information we collect for various purposes, including:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>Providing and maintaining our services</li>
                    <li>Processing transactions and payments</li>
                    <li>Verifying user identities and preventing fraud</li>
                    <li>Communicating with you about your account</li>
                    <li>Improving our platform and user experience</li>
                    <li>Complying with legal obligations</li>
                    <li>Marketing and promotional communications (with consent)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">4. Information Sharing and Disclosure</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We may share your information in the following situations:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>
                      <strong>With other users:</strong> Profile information is visible to facilitate connections
                    </li>
                    <li>
                      <strong>Service providers:</strong> Third-party companies that help us operate our platform
                    </li>
                    <li>
                      <strong>Payment processors:</strong> Stripe and other payment services for transaction processing
                    </li>
                    <li>
                      <strong>Legal compliance:</strong> When required by law or to protect our rights
                    </li>
                    <li>
                      <strong>Business transfers:</strong> In connection with mergers, acquisitions, or asset sales
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">5. Data Security</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We implement appropriate technical and organizational security measures to protect your personal
                    information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4">Our security measures include:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security audits and assessments</li>
                    <li>Access controls and authentication measures</li>
                    <li>Secure payment processing through Stripe</li>
                    <li>Employee training on data protection</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">6. Data Retention</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We retain your personal information only for as long as necessary to fulfill the purposes outlined
                    in this Privacy Policy, unless a longer retention period is required or permitted by law.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    When we no longer need your personal information, we will securely delete or anonymize it.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">7. Your Privacy Rights</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Depending on your location, you may have the following rights regarding your personal information:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>
                      <strong>Access:</strong> Request access to your personal information
                    </li>
                    <li>
                      <strong>Correction:</strong> Request correction of inaccurate information
                    </li>
                    <li>
                      <strong>Deletion:</strong> Request deletion of your personal information
                    </li>
                    <li>
                      <strong>Portability:</strong> Request transfer of your data to another service
                    </li>
                    <li>
                      <strong>Objection:</strong> Object to certain processing of your information
                    </li>
                    <li>
                      <strong>Restriction:</strong> Request restriction of processing
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">8. Cookies and Tracking Technologies</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We use cookies and similar tracking technologies to enhance your experience on our platform. These
                    technologies help us:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>Remember your preferences and settings</li>
                    <li>Analyze platform usage and performance</li>
                    <li>Provide personalized content and recommendations</li>
                    <li>Ensure platform security and prevent fraud</li>
                  </ul>
                  <p className="text-gray-600 leading-relaxed mt-4">
                    You can control cookie settings through your browser preferences. Please see our Cookie Policy for
                    more details.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">9. International Data Transfers</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Your information may be transferred to and processed in countries other than your own. We ensure
                    that such transfers comply with applicable data protection laws and implement appropriate
                    safeguards.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">10. Children's Privacy</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Our services are not intended for individuals under the age of 18. We do not knowingly collect
                    personal information from children under 18. If we become aware that we have collected such
                    information, we will take steps to delete it promptly.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">11. Changes to This Privacy Policy</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We may update this Privacy Policy from time to time. We will notify you of any material changes by
                    posting the new Privacy Policy on this page and updating the "Last updated" date.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    We encourage you to review this Privacy Policy periodically for any changes.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">12. Contact Us</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    If you have any questions about this Privacy Policy or our privacy practices, please contact us:
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
