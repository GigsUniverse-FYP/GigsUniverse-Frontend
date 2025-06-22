"use client";
import { motion } from "framer-motion";
import LandingAboutUs from "./landing_aboutus";
import LandingCarousel from "./landing_carousel";
import LandingChoose from "./landing_choice";
import LandingCTA from "./landing_cta";
import HowItWorksEmployers from "./landing_employer";
import LandingFooter from "./landing_footer";
import HowItWorksGigWorkers from "./landing_gigworker";
import LandingHeader from "./landing_header";
import LandingHero from "./landing_hero";
import LandingSubscription from "./landing_pricing";
import LandingSecurity from "./landing_security";
import LandingTestimonials from "./landing_testinomial";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <LandingHeader />

      {/* Hero Section */}
      <LandingHero />

      {/* Company Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <LandingCarousel />
      </motion.div>

      {/* Security Features */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <LandingSecurity />
      </motion.div>

      {/* About Us Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <LandingAboutUs />
      </motion.div>

      {/* How It Works - Gig Workers */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <HowItWorksGigWorkers />
      </motion.div>

      {/* How It Works - Employers */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <HowItWorksEmployers />
      </motion.div>

      {/* Testimonials Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <LandingTestimonials />
      </motion.div>

      {/* Pricing Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <LandingSubscription />
      </motion.div>

      {/* Why Choose Us Section */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <LandingChoose />
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <LandingCTA />
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.2 }}
      >
        <LandingFooter />
      </motion.div>
    </div>
  );
}
