import { Briefcase } from "lucide-react";
import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer id="contact" className="bg-black text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 animate-fade-in-up">
            <div className="flex items-center space-x-0 mb-1">
              <div className="w-18 h-18 bg-black rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <img src="icons/landing-icon.png" className="w-18 h-18 filter brightness-0 invert" />
              </div>
              <span className="text-xl font-bold">GigsUniverse.</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Connecting talent with opportunities worldwide. Your gateway to remote gig work, part-time positions, and
              internships that fit your lifestyle.
            </p>

            {/* Social Media Links */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 hover:scale-110"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 hover:scale-110"
                  aria-label="Twitter/X"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M7.75 2A5.75 5.75 0 0 0 2 7.75v8.5A5.75 5.75 0 0 0 7.75 22h8.5A5.75 5.75 0 0 0 22 16.25v-8.5A5.75 5.75 0 0 0 16.25 2h-8.5Zm0 1.5h8.5A4.25 4.25 0 0 1 20.5 7.75v8.5A4.25 4.25 0 0 1 16.25 20.5h-8.5A4.25 4.25 0 0 1 3.5 16.25v-8.5A4.25 4.25 0 0 1 7.75 3.5ZM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 1.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Zm5.25-.25a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                  />
                </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 hover:scale-110"
                  aria-label="Reddit"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300 hover:scale-110"
                  aria-label="Discord"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg mb-4">Contact Information</h3>
              <div className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
                <div className="w-5 h-5 bg-gray-600 rounded flex items-center justify-center">
                  <span className="text-xs">📧</span>
                </div>
                <span className="text-gray-300">admin@gigsuniverse.studio</span>
              </div>
              <div className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
                <div className="w-5 h-5 bg-gray-600 rounded flex items-center justify-center">
                  <span className="text-xs">📞</span>
                </div>
                <span className="text-gray-300">+60 11-2345 6789</span>
              </div>
              <div className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
                <div className="w-5 h-5 bg-gray-600 rounded flex items-center justify-center">
                  <span className="text-xs">📍</span>
                </div>
                <span className="text-gray-300">GigsUniverse Sdn. Bhd., Kuala Lumpur, Malaysia</span>
              </div>
              <div className="flex items-center space-x-3 hover:scale-105 transition-transform duration-300">
                <div className="w-5 h-5 bg-gray-600 rounded flex items-center justify-center">
                  <span className="text-xs">🕒</span>
                </div>
                <span className="text-gray-300">Mon-Fri: 9AM-6PM GMT+8</span>
              </div>
            </div>
          </div>

          {/* For Freelancers */}
          <div className="animate-fade-in-up animation-delay-200">
            <h3 className="font-semibold text-lg mb-4">For Freelancers</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link href="#contact" className="hover:text-white transition-colors duration-300 hover:scale-105 inline-block">
                  Find Gigs
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white transition-colors duration-300 hover:scale-105 inline-block">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white transition-colors duration-300 hover:scale-105 inline-block">
                  Internships
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white transition-colors duration-300 hover:scale-105 inline-block">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white transition-colors duration-300 hover:scale-105 inline-block">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* For Companies */}
          <div className="animate-fade-in-up animation-delay-400">
            <h3 className="font-semibold text-lg mb-4">For Companies</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link href="#contact" className="hover:text-white transition-colors duration-300 hover:scale-105 inline-block">
                  Post Jobs
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white transition-colors duration-300 hover:scale-105 inline-block">
                  Find Talent
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white transition-colors duration-300 hover:scale-105 inline-block">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white transition-colors duration-300 hover:scale-105 inline-block">
                  Enterprise
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white transition-colors duration-300 hover:scale-105 inline-block">
                  API Access
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 animate-fade-in-up animation-delay-600">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              <p>&copy; {new Date().getFullYear()} GigsUniverse. All rights reserved.</p>
            </div>
            <div className="flex space-x-6 text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors duration-300 hover:scale-105">
                Privacy Policy
              </Link>
              <Link href="/term" className="hover:text-white transition-colors duration-300 hover:scale-105">
                Terms of Service
              </Link>
              <Link href="/cookie" className="hover:text-white transition-colors duration-300 hover:scale-105">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
