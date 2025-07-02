import { Button } from "@/components/ui/button"
import { Briefcase, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
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

      {/* Terms Content */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h1 className="text-4xl font-bold text-black mb-4">Terms of Service</h1>
              <p className="text-xl text-gray-600">Last updated: 20 June 2025</p>
            </div>

            <div className="prose prose-lg max-w-none animate-fade-in-up animation-delay-200">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">1. Acceptance of Terms</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    By accessing and using GigsUniverse ("the Platform"), you accept and agree to be bound by the terms
                    and provision of this agreement. If you do not agree to abide by the above, please do not use this
                    service.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    These Terms of Service ("Terms") govern your use of our website located at gigsuniverse.com (the
                    "Service") operated by GigsUniverse Inc. ("us", "we", or "our").
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">2. Description of Service</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    GigsUniverse is a platform that connects freelancers with employers for remote work opportunities,
                    including gig work, part-time positions, and internships. Our service includes:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>Job posting and application services</li>
                    <li>User verification and authentication</li>
                    <li>Payment processing and escrow services</li>
                    <li>Communication tools between users</li>
                    <li>Dispute resolution services</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">3. User Accounts</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    To access certain features of the Service, you must register for an account. When you register for
                    an account, you may be required to provide certain information about yourself.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    You agree that the information you provide to us is accurate and that you will keep it accurate and
                    up-to-date at all times. You are responsible for safeguarding your password and all activities under
                    your account.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    All users must complete our verification process, which includes ID verification and skill
                    assessments, before accessing premium features of the platform.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">4. User Conduct</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">You agree not to use the Service to:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2 ml-4">
                    <li>Post false, inaccurate, misleading, defamatory, or libelous content</li>
                    <li>Impersonate any person or entity or falsely state your affiliation</li>
                    <li>Engage in any fraudulent activities or scams</li>
                    <li>Violate any applicable local, state, national, or international law</li>
                    <li>Transmit any material that contains viruses or other harmful code</li>
                    <li>Spam or send unsolicited communications to other users</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">5. Payment Terms</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    All payments are processed through Stripe, our secure payment processor. We offer escrow protection
                    for all transactions to ensure both parties are protected.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Platform fees apply to completed projects as outlined in our pricing structure. Premium subscribers
                    may receive reduced fees or fee-free transactions as specified in their subscription plan.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Refunds are handled according to our refund policy and dispute resolution procedures.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">6. Intellectual Property</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    The Service and its original content, features, and functionality are and will remain the exclusive
                    property of GigsUniverse Inc. and its licensors. The Service is protected by copyright, trademark,
                    and other laws.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Users retain ownership of content they create and post on the platform, but grant GigsUniverse a
                    license to use such content for platform operations and marketing purposes.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">7. Privacy and Data Protection</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Your privacy is important to us. Please review our Privacy Policy, which also governs your use of
                    the Service, to understand our practices.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    We implement appropriate security measures to protect your personal information and comply with
                    applicable data protection regulations.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">8. Termination</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We may terminate or suspend your account and bar access to the Service immediately, without prior
                    notice or liability, under our sole discretion, for any reason whatsoever, including but not limited
                    to a breach of the Terms.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    If you wish to terminate your account, you may simply discontinue using the Service and contact our
                    support team.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">9. Limitation of Liability</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    In no event shall GigsUniverse Inc., nor its directors, employees, partners, agents, suppliers, or
                    affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages,
                    including without limitation, loss of profits, data, use, goodwill, or other intangible losses,
                    resulting from your use of the Service.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">10. Governing Law</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    These Terms shall be interpreted and governed by the laws of the Federal Territory of Kuala Lumpur, Malaysia,
                    without regard to its conflict of law provisions.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Our failure to enforce any right or provision of these Terms will not be considered a waiver of
                    those rights.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">11. Changes to Terms</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                    revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    What constitutes a material change will be determined at our sole discretion. By continuing to
                    access or use our Service after any revisions become effective, you agree to be bound by the revised
                    terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-black mb-4">12. Contact Information</h2>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    If you have any questions about these Terms of Service, please contact us:
                  </p>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <p className="text-gray-600 mb-2">
                      <strong>Email:</strong> admin@gigsuniverse.studio
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
