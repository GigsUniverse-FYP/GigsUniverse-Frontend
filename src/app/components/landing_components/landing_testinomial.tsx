import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export default function LandingTestimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Graphic Designer",
      location: "New York, USA",
      content:
        "GigsUniverse has completely transformed my career. I've been able to work with amazing clients from around the world and build a sustainable freelance business.",
      rating: 5,
    },
    {
      name: "Miguel Rodriguez",
      role: "Web Developer",
      location: "Barcelona, Spain",
      content:
        "The quality of projects on GigsUniverse is outstanding. I've found long-term clients who value my work and pay fairly. It's been a game-changer for my remote career.",
      rating: 5,
    },
    {
      name: "Priya Patel",
      role: "Digital Marketer",
      location: "Mumbai, India",
      content:
        "As a recent graduate, GigsUniverse helped me land my first remote internship. The experience I gained led to a full-time remote position. Highly recommended!",
      rating: 5,
    },
    {
      name: "James Chen",
      role: "Content Writer",
      location: "Toronto, Canada",
      content:
        "The platform is user-friendly and the support team is incredibly helpful. I've been able to maintain a steady income stream through various gig projects.",
      rating: 5,
    },
    {
      name: "Emma Thompson",
      role: "UI/UX Designer",
      location: "London, UK",
      content:
        "GigsUniverse connects me with clients who appreciate good design. The payment system is secure and reliable. It's my go-to platform for freelance work.",
      rating: 5,
    },
    {
      name: "Alex Kim",
      role: "Data Analyst",
      location: "Seoul, South Korea",
      content:
        "I love the variety of projects available. From short-term gigs to long-term contracts, there's something for every skill level and schedule.",
      rating: 5,
    },
  ]

  return (
    <section id="testimonials" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">What Our Users Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our community of freelancers and companies have to say about
            their experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-black fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                <div className="border-t pt-4">
                  <div className="font-semibold text-black">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                  <div className="text-sm text-gray-500">{testimonial.location}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}