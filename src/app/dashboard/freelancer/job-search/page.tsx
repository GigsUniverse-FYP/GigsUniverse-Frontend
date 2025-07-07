"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Search, Filter, MapPin, Clock, DollarSign, Heart, ChevronDown, X } from "lucide-react"

const jobs = [
  {
    id: 1,
    title: "Senior React Developer",
    company: "TechCorp Inc.",
    location: "Remote",
    type: "Full-time",
    salary: "$80,000 - $120,000",
    posted: "2 days ago",
    description:
      "We're looking for an experienced React developer to join our growing team and help build scalable web applications...",
    skills: ["React", "TypeScript", "Node.js", "GraphQL"],
    saved: false,
    experience: "Senior",
    salaryRange: 100000,
  },
  {
    id: 2,
    title: "UI/UX Designer",
    company: "Creative Studio",
    location: "New York, NY",
    type: "Contract",
    salary: "$60 - $80/hour",
    posted: "1 day ago",
    description:
      "Join our creative team to design beautiful and intuitive user experiences for modern web applications...",
    skills: ["Figma", "Adobe Creative Suite", "Prototyping", "User Research"],
    saved: true,
    experience: "Mid-level",
    salaryRange: 70000,
  },
  {
    id: 3,
    title: "Full Stack Developer",
    company: "StartupXYZ",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$90,000 - $130,000",
    posted: "3 days ago",
    description:
      "Help us build the next generation of web applications using modern technologies and best practices...",
    skills: ["JavaScript", "Python", "AWS", "Docker"],
    saved: false,
    experience: "Senior",
    salaryRange: 110000,
  },
  {
    id: 4,
    title: "Mobile App Developer",
    company: "AppTech Solutions",
    location: "Remote",
    type: "Part-time",
    salary: "$50 - $70/hour",
    posted: "1 week ago",
    description:
      "Develop cross-platform mobile applications using React Native and modern mobile development practices...",
    skills: ["React Native", "iOS", "Android", "Firebase"],
    saved: false,
    experience: "Mid-level",
    salaryRange: 60000,
  },
]

export default function JobSearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [jobType, setJobType] = useState("all")
  const [savedJobs, setSavedJobs] = useState<number[]>([2])
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [experienceLevel, setExperienceLevel] = useState<string[]>([])
  const [salaryRange, setSalaryRange] = useState("all")
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [sortBy, setSortBy] = useState("recent")

  const toggleSaveJob = (jobId: number) => {
    setSavedJobs((prev) => (prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId]))
  }

  const toggleExperienceLevel = (level: string) => {
    setExperienceLevel((prev) => (prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]))
  }

  const clearFilters = () => {
    setSearchQuery("")
    setLocationFilter("")
    setJobType("all")
    setExperienceLevel([])
    setSalaryRange("all")
    setRemoteOnly(false)
  }

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase())
    const matchesType = jobType === "all" || job.type === jobType
    const matchesExperience = experienceLevel.length === 0 || experienceLevel.includes(job.experience)
    const matchesSalary =
      salaryRange === "all" ||
      (salaryRange === "50k" && job.salaryRange >= 50000) ||
      (salaryRange === "80k" && job.salaryRange >= 80000) ||
      (salaryRange === "100k" && job.salaryRange >= 100000)
    const matchesRemote = !remoteOnly || job.location === "Remote"

    return matchesSearch && matchesLocation && matchesType && matchesExperience && matchesSalary && matchesRemote
  })

  const activeFiltersCount = [
    searchQuery,
    locationFilter,
    jobType !== "all",
    experienceLevel.length > 0,
    salaryRange !== "all",
    remoteOnly,
  ].filter(Boolean).length

  return (
    <div className="max-w-8xl mx-auto sm:px-6 lg:px-8 space-y-6 sm:mr-0 mr-20 mb-5">
      {/* Job Search Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-4">Job Search</h1>
      </div>

      {/* Search and Filters */}
      <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900">Find Your Next Opportunity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search jobs, companies, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border border-gray-200 h-11 rounded-lg"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-10 border border-gray-200 h-11 rounded-lg"
              />
            </div>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger className="border border-gray-200 h-11 rounded-lg">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-3">
            <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="border border-gray-200 bg-white hover:bg-gray-50 h-9 rounded-lg"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-2 bg-black text-white rounded-full h-5 w-5 text-xs p-0 flex items-center justify-center">
                      {activeFiltersCount}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <Card className="border border-gray-200 bg-gray-50 rounded-lg">
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Experience Level */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-900">Experience Level</Label>
                        <div className="space-y-2">
                          {["Entry-level", "Mid-level", "Senior"].map((level) => (
                            <div key={level} className="flex items-center space-x-2">
                              <Checkbox
                                id={level}
                                checked={experienceLevel.includes(level)}
                                onCheckedChange={() => toggleExperienceLevel(level)}
                              />
                              <Label htmlFor={level} className="text-sm text-gray-700">
                                {level}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Salary Range */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-900">Minimum Salary</Label>
                        <Select value={salaryRange} onValueChange={setSalaryRange}>
                          <SelectTrigger className="border border-gray-200 h-9 rounded-lg">
                            <SelectValue placeholder="Select range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any Salary</SelectItem>
                            <SelectItem value="50k">$50,000+</SelectItem>
                            <SelectItem value="80k">$80,000+</SelectItem>
                            <SelectItem value="100k">$100,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Additional Filters */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-900">Additional Options</Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="remote"
                              checked={remoteOnly}
                              onCheckedChange={(checked) => setRemoteOnly(checked === true)}
                            />
                            <Label htmlFor="remote" className="text-sm text-gray-700">
                              Remote Only
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        className="border border-gray-200 bg-white hover:bg-gray-50 h-9 rounded-lg"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear All
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setShowAdvancedFilters(false)}
                        className="bg-black hover:bg-gray-800 text-white h-9 rounded-lg"
                      >
                        Apply Filters
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>

            <Button
              variant="outline"
              size="sm"
              className={`border border-gray-200 h-9 rounded-lg ${
                remoteOnly ? "bg-black text-white" : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => setRemoteOnly(!remoteOnly)}
            >
              Remote Only
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`border border-gray-200 h-9 rounded-lg ${
                salaryRange === "80k" ? "bg-black text-white" : "bg-white hover:bg-gray-50"
              }`}
              onClick={() => setSalaryRange(salaryRange === "80k" ? "all" : "80k")}
            >
              $80k+
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredJobs.length}</span> jobs
        </p>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48 border border-gray-200 h-10 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="relevant">Most Relevant</SelectItem>
            <SelectItem value="salary-high">Salary: High to Low</SelectItem>
            <SelectItem value="salary-low">Salary: Low to High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <Card
              key={job.id}
              className="border border-gray-200 shadow-md bg-white hover:shadow-lg transition-all duration-200 rounded-xl"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                        <p className="text-gray-600 font-semibold text-lg">{job.company}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSaveJob(job.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Heart
                          className={`h-5 w-5 ${savedJobs.includes(job.id) ? "fill-black text-black" : "text-gray-400"}`}
                        />
                      </Button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">{job.salary}</span>
                      </div>
                      <span className="text-gray-500">Posted {job.posted}</span>
                    </div>

                    <p className="text-gray-700 mb-4 leading-relaxed">{job.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          className="bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 px-3 py-1 rounded-lg"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:ml-6 lg:min-w-[140px]">
                    <Button className="bg-black hover:bg-gray-800 text-white h-11 rounded-lg font-semibold">
                      Apply Now
                    </Button>
                    <Button
                      variant="outline"
                      className="border border-gray-200 bg-white hover:bg-gray-50 h-11 rounded-lg font-semibold"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
            <CardContent className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">No jobs found</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  We couldn't find any jobs matching your current search criteria. Try adjusting your filters or search
                  terms.
                </p>
                <div className="space-y-3">
                  <div className="text-sm text-gray-500 mb-4">
                    <p className="font-medium mb-2">Try these suggestions:</p>
                    <ul className="text-left space-y-1 max-w-xs mx-auto">
                      <li>• Remove some filters to see more results</li>
                      <li>• Try different keywords or job titles</li>
                      <li>• Expand your location search</li>
                      <li>• Check for spelling mistakes</li>
                    </ul>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                      onClick={clearFilters}
                      className="bg-black hover:bg-gray-800 text-white h-11 rounded-lg font-semibold"
                    >
                      Clear All Filters
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("")
                        setLocationFilter("")
                      }}
                      className="border border-gray-200 bg-white hover:bg-gray-50 h-11 rounded-lg font-semibold"
                    >
                      Reset Search
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Load More - Only show when there are results */}
      {filteredJobs.length > 0 && (
        <div className="text-center">
          <Button
            variant="outline"
            className="border border-gray-200 bg-white hover:bg-gray-50 h-11 px-8 rounded-lg font-semibold"
          >
            Load More Jobs
          </Button>
        </div>
      )}
    </div>
  )
}
