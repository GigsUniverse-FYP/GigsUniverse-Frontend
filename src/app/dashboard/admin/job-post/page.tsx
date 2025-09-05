"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  Filter,
  MapPin,
  Clock,
  DollarSign,
  ChevronDown,
  X,
  Eye,
  Send,
  Star,
  Calendar,
  Users,
  GraduationCap,
  Briefcase,
  Languages,
  ExternalLink,
} from "lucide-react";

import { jobField, languages } from "@/lib/data";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import CompanyDialog from "../../view-profile/company/page";

export interface Job {
  id: number;
  jobTitle: string;
  companyName: string;
  jobLocation: string[];
  jobCategory: string[];
  jobField: string;
  preferredPayrate: string;
  yearsOfJobExperience: string;
  jobExperience: string;
  hoursContributionPerWeek: number;
  highestEducationLevel: string[];
  jobStatus: string;
  isPremiumJob: boolean;
  languageProficiency: string[];
  duration: string;
  jobLocationHiringRequired: boolean;
  createdAt: string;
  jobExpirationDate: string;
  jobDescription: string;
  jobScope: string;
  skillTags: string[];
  employerId: string;
  saved: boolean;
}
interface ApiJob {
  jobPostId: number;
  jobTitle: string;
  companyName: string;
  jobLocation: string[] | string;
  jobCategory: string[] | string;
  jobField: string;
  preferredPayrate: string;
  yearsOfJobExperience: string;
  jobExperience: string;
  hoursContributionPerWeek: number;
  highestEducationLevel: string[] | string;
  jobStatus: string;
  isPremiumJob: boolean;
  languageProficiency: string[] | string;
  duration: string;
  jobLocationHiringRequired: boolean;
  createdAt: string;
  jobExpirationDate: string;
  jobDescription: string;
  jobScope: string;
  skillTags: string[] | string;
  employerId: string;
  saved: boolean;
}

export default function JobSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobType, setJobType] = useState("all");
  const [savedJobs, setSavedJobs] = useState<number[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [ showRemoveJob, setShowRemoveJob ] = useState(false);
  const [ removalReason, setRemovalReason ] = useState("");
  const [ removeJob, setRemoveJob ] = useState<number | null>(null);

  const searchParams = useSearchParams()
  const jobIdFromQuery = searchParams.get("id")

  useEffect(() => {
    if (jobIdFromQuery) {
      setSearchQuery(jobIdFromQuery)
    }
  }, [jobIdFromQuery])

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/api/job-posts/freelancer/job-search`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data: ApiJob[] = await res.json();

        const formattedJobs: Job[] = data.map((job) => ({
          id: job.jobPostId, // Map API jobPostId to Job.id
          jobTitle: job.jobTitle,
          companyName: job.companyName,
          jobLocation:
            typeof job.jobLocation === "string"
              ? (job.jobLocation as string)
                  .split(",")
                  .map((loc: string) => loc.trim())
              : job.jobLocation,
          jobCategory:
            typeof job.jobCategory === "string"
              ? (job.jobCategory as string)
                  .split(",")
                  .map((cat: string) => cat.trim())
              : job.jobCategory,
          jobField: job.jobField,
          preferredPayrate: job.preferredPayrate,
          yearsOfJobExperience: job.yearsOfJobExperience,
          jobExperience: job.jobExperience,
          hoursContributionPerWeek: job.hoursContributionPerWeek,
          highestEducationLevel:
            typeof job.highestEducationLevel === "string"
              ? (job.highestEducationLevel as string)
                  .split(",")
                  .map((edu: string) => edu.trim())
              : job.highestEducationLevel,
          jobStatus: job.jobStatus,
          isPremiumJob: job.isPremiumJob,
          languageProficiency:
            typeof job.languageProficiency === "string"
              ? (job.languageProficiency as string)
                  .split(",")
                  .map((lang: string) => lang.trim())
              : job.languageProficiency,
          duration: job.duration,
          jobLocationHiringRequired: job.jobLocationHiringRequired,
          createdAt: job.createdAt,
          jobExpirationDate: job.jobExpirationDate,
          jobDescription: job.jobDescription,
          jobScope: job.jobScope,
          skillTags:
            typeof job.skillTags === "string"
              ? (job.skillTags as string)
                  .split(",")
                  .map((tag: string) => tag.trim())
              : job.skillTags,
          employerId: job.employerId,
          saved: job.saved,
        }));
        setJobs(formattedJobs);
        setSavedJobs(
          formattedJobs.filter((job) => job.saved).map((job) => job.id)
        );
        console.log(formattedJobs);
      } catch (err: any) {
        console.error("Error Occurred While Fetching Jobs:", err);
      }
    };

    fetchJobs();
  }, []);


  const handleRemoveJob = async (removeJob: number) => {
    try {
      const res = await fetch(
        `${backendUrl}/api/job-posts/remove-job/${removeJob}`,
        {
          method: "POST", 
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason: removalReason }),
        }
      );

      if (!res.ok) throw new Error("Failed to remove job");
      setJobs((prev) => prev.filter((job) => job.id !== removeJob));

      toast.success("Job removed successfully");

    } catch (err: any) {
      console.error("Error Occurred While Removing Job:", err);
    }
  };


  const [filters, setFilters] = useState({
    jobField: "all",
    jobExperience: [] as string[],
    yearsOfExperience: "all",
    educationLevel: [] as string[],
    languageProficiency: "all",
    hoursPerWeek: [0, 50] as [number, number],
    payRate: [0, 200] as [number, number],
    premiumOnly: false,
    nonPremiumOnly: false,
    jobStatus: "all",
    duration: "all",
    favouriteJob: false,
  });

  const toggleArrayFilter = (
    filterKey: keyof typeof filters,
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: Array.isArray(prev[filterKey])
        ? (prev[filterKey] as string[]).includes(value)
          ? (prev[filterKey] as string[]).filter((item) => item !== value)
          : [...(prev[filterKey] as string[]), value]
        : [value],
    }));
  };

  const clearFilters = () => {
    setSearchQuery("");
    setLocationFilter("");
    setJobType("all");
    setFilters({
      jobField: "all",
      jobExperience: [],
      yearsOfExperience: "all",
      educationLevel: [],
      languageProficiency: "all",
      hoursPerWeek: [0, 50],
      payRate: [0, 200],
      premiumOnly: false,
      nonPremiumOnly: false,
      jobStatus: "all",
      duration: "all",
      favouriteJob: false,
    });
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.id.toString().includes(searchQuery) ||
      job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.jobDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.jobScope.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skillTags.includes(searchQuery.toLowerCase());

    const matchesLocation =
      !locationFilter ||
      job.jobLocation.some((loc) =>
        loc.toLowerCase().includes(locationFilter.toLowerCase())
      );

    const matchesType = jobType === "all" || job.jobCategory.includes(jobType); // Updated to check array
    const matchesField =
      filters.jobField === "all" || job.jobField === filters.jobField;
    const matchesExperience =
      filters.jobExperience.length === 0 ||
      filters.jobExperience.includes(job.jobExperience);
    const matchesYearsExp =
      filters.yearsOfExperience === "all" ||
      job.yearsOfJobExperience === filters.yearsOfExperience;
    const matchesEducation =
      filters.educationLevel.length === 0 ||
      filters.educationLevel.some((level) =>
        job.highestEducationLevel.includes(level)
      );
    const matchesLanguage =
      filters.languageProficiency === "all" ||
      job.languageProficiency
        .map((lang: string) => lang.toLowerCase())
        .includes(filters.languageProficiency.toLowerCase());
    const matchesHours =
      job.hoursContributionPerWeek >= filters.hoursPerWeek[0] &&
      job.hoursContributionPerWeek <= filters.hoursPerWeek[1];
    const [minPay, maxPay] = job.preferredPayrate.split("-").map(Number);
    const matchesPayRate =
      maxPay >= filters.payRate[0] && minPay <= filters.payRate[1];
    const matchesPremium = !filters.premiumOnly || job.isPremiumJob;
    const matchesNonPremium = !filters.nonPremiumOnly || !job.isPremiumJob;
    const matchesStatus =
      filters.jobStatus === "all" || job.jobStatus === filters.jobStatus;
    const matchesFavourite = !filters.favouriteJob || job.saved;

    return (
      matchesSearch &&
      matchesLocation &&
      matchesType &&
      matchesField &&
      matchesExperience &&
      matchesYearsExp &&
      matchesEducation &&
      matchesLanguage &&
      matchesHours &&
      matchesPayRate &&
      matchesPremium &&
      matchesNonPremium &&
      matchesStatus &&
      matchesFavourite
    );
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Active: { color: "bg-green-100 text-green-800 border-green-200" },
      Expired: { color: "bg-red-100 text-red-800 border-red-200" },
      Full: { color: "bg-orange-100 text-orange-800 border-orange-200" },
    };
    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.Active;
    return (
      <Badge className={`${config.color} border font-medium`}>{status}</Badge>
    );
  };

  const activeFiltersCount = [
    searchQuery,
    locationFilter,
    jobType !== "all",
    filters.jobField !== "all",
    filters.jobExperience.length > 0,
    filters.yearsOfExperience !== "all",
    filters.educationLevel.length > 0,
    filters.languageProficiency !== "all",
    filters.hoursPerWeek[0] > 0 || filters.hoursPerWeek[1] < 50,
    filters.payRate[0] > 0 || filters.payRate[1] < 200,
    filters.premiumOnly,
    filters.nonPremiumOnly,
    filters.jobStatus !== "all",
    filters.duration !== "all",
    filters.favouriteJob,
  ].filter(Boolean).length;

  const [visibleCount, setVisibleCount] = useState(3);

  const visibleJobs = filteredJobs.slice(0, visibleCount);

  // lazy loading
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 500 &&
        visibleCount < filteredJobs.length
      ) {
        setVisibleCount((prev) => prev + 10);
        console.log("Loaded more jobs");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, filteredJobs.length]);

  return (
    <div className="w-full sm:max-w-8xl mx-auto space-y-6 mb-5 -ml-10 sm:ml-0">
      {/* Job Search Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-4">
          Job Search
        </h1>
      </div>

      {/* Search and Filters */}
      <Card className="border border-gray-200 shadow-md bg-white rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900">
            Find Your Next Opportunity
          </CardTitle>
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
                <SelectItem value="Part Time">Part Time</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
                <SelectItem value="Gig Internship">Gig Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-wrap gap-3">
            <Collapsible
              open={showAdvancedFilters}
              onOpenChange={setShowAdvancedFilters}
            >
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
                  <CardContent className="p-4 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {/* Job Field */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          Job Field
                        </Label>
                        <Select
                          value={filters.jobField}
                          onValueChange={(value) =>
                            setFilters((prev) => ({ ...prev, jobField: value }))
                          }
                        >
                          <SelectTrigger className="border border-gray-200 h-9 rounded-lg">
                            <SelectValue placeholder="Select field" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Fields</SelectItem>
                            {jobField.map((field) => (
                              <SelectItem key={field} value={field}>
                                {field}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Years of Experience */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Years of Experience
                        </Label>
                        <Select
                          value={filters.yearsOfExperience}
                          onValueChange={(value) =>
                            setFilters((prev) => ({
                              ...prev,
                              yearsOfExperience: value,
                            }))
                          }
                        >
                          <SelectTrigger className="border border-gray-200 h-9 rounded-lg">
                            <SelectValue placeholder="Select years" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any Experience</SelectItem>
                            <SelectItem value="0-1">0-1 years</SelectItem>
                            <SelectItem value="2-4">2-4 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                            <SelectItem value="5-8">5-8 years</SelectItem>
                            <SelectItem value="5-10">5-10 years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Language */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <Languages className="h-4 w-4" />
                          Language
                        </Label>
                        <Select
                          value={filters.languageProficiency}
                          onValueChange={(value) =>
                            setFilters((prev) => ({
                              ...prev,
                              languageProficiency: value,
                            }))
                          }
                        >
                          <SelectTrigger className="border border-gray-200 h-9 rounded-lg">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any Language</SelectItem>
                            {languages.map((lang) => (
                              <SelectItem key={lang} value={lang.toLowerCase()}>
                                {lang}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Job Status */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Job Status
                        </Label>
                        <Select
                          value={filters.jobStatus}
                          onValueChange={(value) =>
                            setFilters((prev) => ({
                              ...prev,
                              jobStatus: value,
                            }))
                          }
                        >
                          <SelectTrigger className="border border-gray-200 h-9 rounded-lg">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Expired">Expired</SelectItem>
                            <SelectItem value="Full">Full</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4 border-t border-gray-200">
                      {/* Experience Level */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Experience Level
                        </Label>
                        <div className="space-y-2">
                          {["Entry Level", "Mid Level", "Senior Level"].map(
                            (level) => (
                              <div
                                key={level}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={level}
                                  checked={filters.jobExperience.includes(
                                    level
                                  )}
                                  onCheckedChange={() =>
                                    toggleArrayFilter("jobExperience", level)
                                  }
                                />
                                <Label
                                  htmlFor={level}
                                  className="text-sm text-gray-700"
                                >
                                  {level}
                                </Label>
                              </div>
                            )
                          )}
                        </div>
                      </div>

                      {/* Education Level */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Education Level
                        </Label>
                        <div className="space-y-2">
                          {[
                            "High School",
                            "Certificate",
                            "Diploma",
                            "Associate Degree",
                            "Bachelor's Degree",
                            "Master's Degree",
                            "Doctorate (PhD)",
                            "Professional Certification",
                          ].map((level) => (
                            <div
                              key={level}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={level}
                                checked={filters.educationLevel.includes(level)}
                                onCheckedChange={() =>
                                  toggleArrayFilter("educationLevel", level)
                                }
                              />
                              <Label
                                htmlFor={level}
                                className="text-sm text-gray-700"
                              >
                                {level}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Premium Jobs Toggle */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          Premium Options
                        </Label>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="premium"
                            checked={filters.premiumOnly}
                            onCheckedChange={(checked) =>
                              setFilters((prev) => ({
                                ...prev,
                                premiumOnly: checked === true,
                                nonPremiumOnly:
                                  checked === true
                                    ? false
                                    : prev.nonPremiumOnly,
                              }))
                            }
                          />
                          <Label
                            htmlFor="premium"
                            className="text-sm text-gray-700 flex items-center gap-2"
                          >
                            Premium Jobs Only
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="non-premium"
                            checked={filters.nonPremiumOnly}
                            onCheckedChange={(checked) =>
                              setFilters((prev) => ({
                                ...prev,
                                nonPremiumOnly: checked === true,
                                premiumOnly:
                                  checked === true ? false : prev.premiumOnly,
                              }))
                            }
                          />
                          <Label
                            htmlFor="non-premium"
                            className="text-sm text-gray-700 flex items-center gap-2"
                          >
                            No Premium Jobs
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                      {/* Hours per Week */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Hours per Week: {filters.hoursPerWeek[0]} -{" "}
                          {filters.hoursPerWeek[1]}
                        </Label>
                        <Slider
                          value={filters.hoursPerWeek}
                          onValueChange={(value) =>
                            setFilters((prev) => ({
                              ...prev,
                              hoursPerWeek: value as [number, number],
                            }))
                          }
                          max={50}
                          min={0}
                          step={5}
                          className="w-full"
                        />
                      </div>

                      {/* Pay Rate */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Pay Rate ($/hour): {filters.payRate[0]} -{" "}
                          {filters.payRate[1]}
                        </Label>
                        <Slider
                          value={filters.payRate}
                          onValueChange={(value) =>
                            setFilters((prev) => ({
                              ...prev,
                              payRate: value as [number, number],
                            }))
                          }
                          max={200}
                          min={0}
                          step={10}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
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
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-gray-600">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {filteredJobs.length}
          </span>{" "}
          jobs
        </p>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {visibleJobs.length > 0 ? (
          visibleJobs.map((job) => (
            <Card
              key={job.id}
              className="border border-gray-200 shadow-md bg-white hover:shadow-lg transition-all duration-200 rounded-xl"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {job.jobTitle}
                          </h3>
                          {job.isPremiumJob && (
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              Premium
                            </Badge>
                          )}
                          {getStatusBadge(job.jobStatus)}
                        </div>
                        <p className="text-gray-600 font-semibold text-lg">
                          {job.companyName}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span className="font-medium truncate w-60">
                          {job.jobLocation.length === 1
                            ? job.jobLocation[0].toLowerCase() === "global"
                              ? "Global"
                              : job.jobLocation[0]
                            : job.jobLocation.join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <div className="flex flex-wrap gap-1">
                          {job.jobCategory
                            .slice(0, 2)
                            .map((category, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs px-2 py-0.5"
                              >
                                {category}
                              </Badge>
                            ))}
                          {job.jobCategory.length > 2 && (
                            <Badge
                              variant="secondary"
                              className="text-xs px-2 py-0.5"
                            >
                              +{job.jobCategory.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">
                          {job.preferredPayrate}/hr
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">
                          {job.hoursContributionPerWeek}h/week
                        </span>
                      </div>
                    </div>

                    {job.jobLocationHiringRequired && (
                      <div className="mb-4">
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1 w-fit">
                          <MapPin className="h-3 w-3" />
                          Location-specific hiring
                        </Badge>
                      </div>
                    )}

                    <p className="text-gray-700 mb-4 leading-relaxed line-clamp-2">
                      {job.jobDescription}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skillTags.slice(0, 4).map((skill, index) => (
                        <Badge
                          key={index}
                          className="bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 px-3 py-1 rounded-lg"
                        >
                          {skill.trim()}
                        </Badge>
                      ))}
                      {job.skillTags.length > 4 && (
                        <Badge className="bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1 rounded-lg">
                          +{job.skillTags.length - 4} more
                        </Badge>
                      )}
                    </div>

                    <div className="text-sm text-gray-500">
                      <span className="mr-1">
                        Required Job Experience: {job.yearsOfJobExperience}{" "}
                        years
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 lg:ml-6 lg:min-w-[140px]">
                    <Button onClick={() => {
                      setShowRemoveJob(true)
                      setRemoveJob(job.id)
                      }}
                      className={`h-11 bg-white border cursor-pointer border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-500 hover:text-white`}>
                      Remove Job
                    </Button>

                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          className="border border-gray-200 bg-white hover:bg-gray-50 h-11 rounded-lg font-semibold"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="sm:max-w-2xl overflow-y-auto overflow-x-hidden bg-white">
                        {" "}
                        {/* drawer section */}
                        <SheetHeader className="border-b border-gray-200 pb-6">
                          <SheetTitle className="text-left">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <h2 className="text-2xl font-bold text-gray-900">
                                    {job.jobTitle}
                                  </h2>
                                  {job.isPremiumJob && (
                                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
                                      <Star className="h-3 w-3" />
                                      Premium
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-lg text-gray-600 font-medium mb-3">
                                  {job.companyName === "Personal Profile" ? (
                                    <Link
                                      href={`/dashboard/view-profile/employer?userId=${job.employerId}`}
                                      target="_blank"
                                      className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
                                    >
                                      {job.companyName}
                                      <ExternalLink className="w-4 h-4 ml-1" />
                                    </Link>
                                  ) : (
                                    <div className="space-y-1">
                                      <div
                                        className="text-black"
                                      >
                                        {job.companyName}
                                      </div>
                                      <Link
                                        href={`/dashboard/view-profile/employer?userId=${job.employerId}`}
                                        target="_blank"
                                        className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 mt-1 hover:underline"
                                      >
                                        View Employer Profile
                                        <ExternalLink className="w-4 h-4 ml-1" />
                                      </Link>
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {getStatusBadge(job.jobStatus)}
                                  {job.jobLocationHiringRequired && (
                                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      Location-specific
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </SheetTitle>
                        </SheetHeader>
                        <div className="mt-6 space-y-8">
                          {" "}
                          {/* Status Alert */}
                          {job.jobStatus !== "Active" && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                              <p className="text-sm text-red-800 font-medium">
                                ⚠️ This job is no longer accepting applications.
                              </p>
                            </div>
                          )}
                          <Card className="border border-gray-200 ml-2">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Briefcase className="h-5 w-5" />
                                Job Overview
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="space-y-1">
                                  <Label className="font-medium text-gray-500">
                                    Location
                                  </Label>
                                  <p className="text-gray-900 font-medium">
                                    {job.jobLocation.length === 1
                                      ? job.jobLocation[0].toLowerCase() ===
                                        "global"
                                        ? "Global"
                                        : job.jobLocation[0]
                                      : job.jobLocation.join(", ")}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <Label className="font-medium text-gray-500">
                                    Job Types
                                  </Label>
                                  <div className="flex flex-wrap gap-1">
                                    {job.jobCategory.map((category, index) => (
                                      <Badge
                                        key={index}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {category}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <Label className="font-medium text-gray-500">
                                    Field
                                  </Label>
                                  <p className="text-gray-900 font-medium">
                                    {job.jobField}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <Label className="font-medium text-gray-500">
                                    Experience Level
                                  </Label>
                                  <p className="text-gray-900 font-medium">
                                    {job.jobExperience?.replace(/,/g, ", ")}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <Label className="font-medium text-gray-500">
                                    Pay Rate
                                  </Label>
                                  <p className="text-gray-900 font-medium">
                                    ${job.preferredPayrate}/hour
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <Label className="font-medium text-gray-500">
                                    Hours/Week
                                  </Label>
                                  <p className="text-gray-900 font-medium">
                                    {job.hoursContributionPerWeek} hours
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <Label className="font-medium text-gray-500">
                                    Duration
                                  </Label>
                                  <p className="text-gray-900 font-medium">
                                    {job.duration}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <Label className="font-medium text-gray-500">
                                    Languages
                                  </Label>
                                  <p className="text-gray-900 font-medium">
                                    {job.languageProficiency.length === 1
                                      ? job.languageProficiency[0]
                                      : job.languageProficiency.join(", ")}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="border border-gray-200 ml-2">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <GraduationCap className="h-5 w-5" />
                                Requirements
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div>
                                <Label className="font-medium text-gray-500 mb-2 block">
                                  Education Requirements
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                  {job.highestEducationLevel.map(
                                    (edu, index) => (
                                      <Badge
                                        key={index}
                                        className="bg-blue-100 text-blue-800 border-blue-200"
                                      >
                                        {edu.trim()}
                                      </Badge>
                                    )
                                  )}
                                </div>
                              </div>

                              <div>
                                <Label className="font-medium text-gray-500 mb-2 block">
                                  Required Skills
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                  {job.skillTags.map((skill, index) => (
                                    <Badge
                                      key={index}
                                      className="bg-gray-100 text-gray-700 border border-gray-200"
                                    >
                                      {skill.trim()}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <Label className="font-medium text-gray-500 mb-2 block">
                                  Required Years of Experience
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                  <Badge className="bg-gray-100 text-gray-700 border border-gray-200">
                                    {job.yearsOfJobExperience} years
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="border border-gray-200 ml-2">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Eye className="h-5 w-5" />
                                Job Description
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-700 leading-relaxed">
                                {job.jobDescription}
                              </p>
                            </CardContent>
                          </Card>
                          <Card className="border border-gray-200 ml-2">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Job Scopes
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-700 leading-relaxed">
                                {job.jobScope}
                              </p>
                            </CardContent>
                          </Card>
                          <Card className="border border-gray-200 ml-2 mb-5">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Timeline
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Posted:</span>
                                <span className="text-gray-900 font-medium">
                                  {new Date(job.createdAt).toLocaleString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Expires:</span>
                                <span className="text-gray-900 font-medium">
                                  {new Date(
                                    job.jobExpirationDate
                                  ).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card
            key="none"
            className="border border-gray-200 shadow-md xl:min-w-7xl bg-white rounded-xl"
          >
            <CardContent className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  No jobs found
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  We couldn't find any jobs matching your current search
                  criteria. Try adjusting your filters or search terms.
                </p>
                <Button
                  onClick={clearFilters}
                  className="bg-black hover:bg-gray-800 text-white h-11 rounded-lg font-semibold"
                >
                  Clear All Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {showRemoveJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Remove Job</h3>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Please provide a valid reason to remove this job posting.
                </p>
                <div>
                  <Label htmlFor="removal-reason" className="mb-2">Reason for Removal *</Label>
                  <Textarea
                    id="removal-reason"
                    value={removalReason}
                    onChange={(e) => setRemovalReason(e.target.value)}
                    placeholder="Please explain why you want to remove this job posting..."
                    rows={4}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRemoveJob(false)
                    setRemovalReason("")
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (removeJob !== null) {
                      handleRemoveJob(removeJob)
                    }
                    setShowRemoveJob(false)
                    setRemovalReason("")
                  }}
                  disabled={!removalReason.trim()}
                  className="flex-1"
                >
                  Remove Job
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
