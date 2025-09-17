"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  Globe,
  Star,
  Crown,
  CheckCircle,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FilePreviewDialog } from "../../../components/employer_components/file-preview-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import CompanyDialog from "../company/page";

export const dynamic = "force-dynamic";

interface EmployerProfile {
  employerProfileId: string;
  fullName: string;
  username: string;
  gender: string;
  dob: string;
  email: string;
  phone: string;
  location: string;
  profilePicture: string;
  profilePictureMimeType?: string;
  selfDescription: string;
  languageProficiency: string;
  openToHire: boolean;
  premiumStatus: boolean;
  averageRating: number;
  totalRatings: number;
  certificationFiles?: {
    fileName: string;
    contentType: string;
    base64Data: string;
  }[];
  jobExperiences?: {
    jobTitle: string;
    fromDate: string;
    toDate: string;
    company: string;
    description: string;
    currentJob: boolean;
  }[];
  educations?: {
    institute: string;
    title: string;
    courseName: string;
    fromDate: string;
    toDate: string;
    currentStudying: boolean;
  }[];
}

const defaultEmployerProfile: EmployerProfile = {
  employerProfileId: "",
  fullName: "",
  username: "",
  gender: "",
  dob: "",
  email: "",
  phone: "",
  location: "",
  profilePicture: "",
  profilePictureMimeType: "",
  selfDescription: "",
  languageProficiency: "",
  openToHire: false,
  premiumStatus: false,
  certificationFiles: [],
  jobExperiences: [],
  educations: [],
  averageRating: 0,
  totalRatings: 0,
};

export interface FreelancerFeedbackDTO {
  freelancerId: string;
  freelancerName: string;
  rating: number;
  feedback: string | null;
  hourlyRate: number;
  contractStartDate: string | null;
  contractEndDate: string | null;
  jobId: string;
  jobTitle: string;
}

interface ProfileCompanyDTO {
  companyId: number;
  companyName: string;
  role: string;
}

export default function EmployerProfile() {
  const [formData, setFormData] = useState<EmployerProfile>(
    defaultEmployerProfile
  );
  const [activeTab, setActiveTab] = useState("profile");
  const [company, setCompany] = useState<ProfileCompanyDTO | null>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [jobs, setJobs] = useState<FreelancerFeedbackDTO[]>([]);

  const userId = useSearchParams().get("userId");

  if (!userId) {
    console.error("User ID is required");
    return null;
  }

  const [open, setOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );

  const handleOpen = (id: string) => {
    setSelectedCompanyId(id);
    setOpen(true);
  };

  useEffect(() => {
    const fetchJobHistory = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/api/profile/employer/view-employer-feedback/${userId}`,
          {
            credentials: "include",
            method: "GET",
          }
        );
        if (!res.ok) throw new Error("Failed to fetch employer feedback data");
        const data: FreelancerFeedbackDTO[] = await res.json();
        setJobs(data);
      } catch (err: any) {
        console.error(err);
      }
    };

    fetchJobHistory();
  }, []);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/api/company/view-user-company/${userId}`,
          {
            credentials: "include",
          }
        );
        if (res.status === 204) {
          setCompany(null);
        } else if (res.ok) {
          const data: ProfileCompanyDTO = await res.json();
          setCompany(data);
        } else {
          console.error("Failed to fetch company:", res.statusText);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCompany();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/api/profile/employer/view-employer-profile/${userId}`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        setFormData(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  }, []);

  const [previewDialog, setPreviewDialog] = useState<{
    open: boolean;
    file: any;
  }>({
    open: false,
    file: null,
  });

  const languageProficiency = JSON.parse(formData?.languageProficiency || "[]");

  const previewFile = (file: any) => {
    const dataUrl = file.base64Data.startsWith("data:")
      ? file.base64Data
      : `data:${file.contentType};base64,${file.base64Data}`;

    setPreviewDialog({
      open: true,
      file: { ...file, url: dataUrl },
    });
  };

  const getFilePreview = (file: any) => {
    if (!file || !file.base64Data || !file.contentType) return null;

    const dataUrl = file.base64Data.startsWith("data:")
      ? file.base64Data
      : `data:${file.contentType};base64,${file.base64Data}`;

    const iconSize = "w-12 h-12";

    if (file.contentType.startsWith("image/")) {
      return (
        <img
          src={dataUrl}
          alt={file.fileName}
          className="w-full h-full object-cover rounded"
        />
      );
    } else if (file.contentType === "application/pdf") {
      return (
        <div
          className="w-full h-full bg-red-50 flex items-center justify-center"
          onClick={() => previewFile({ ...file, url: dataUrl })}
        >
          <FileText className={`${iconSize} text-red-600`} />
        </div>
      );
    } else if (
      file.contentType === "application/msword" ||
      file.contentType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return (
        <div
          className="w-full h-full bg-blue-50 flex items-center justify-center"
          onClick={() => {
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = file.fileName || "document.docx";
            link.click();
          }}
        >
          <FileText className={`${iconSize} text-blue-600`} />
        </div>
      );
    } else {
      return (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
          <FileText className={`${iconSize} text-gray-500`} />
        </div>
      );
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full sm:max-w-8xl mx-auto space-y-6 mb-5 sm:ml-0 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="text-center sm:text-left p-6 rounded-xl border border-transparent mr-20 ml-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-2">
              Employer Profile
            </h1>
            <p className="text-gray-600">View your professional profile</p>
          </div>
          <div className="flex items-center justify-center sm:justify-end gap-4">
            {formData?.premiumStatus === true ? (
              <Badge className="bg-black text-white px-3 py-1 hover:bg-gray-800">
                <Crown className="w-4 h-4 mr-1" />
                Premium
              </Badge>
            ) : (
              <Badge variant="outline" className="px-3 py-1 border-gray-300">
                <Star className="w-4 h-4 mr-1" />
                Default
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="mr-20 ml-20"
      >
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-black data-[state=active]:text-white"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="job-history"
            className="data-[state=active]:bg-black data-[state=active]:text-white"
          >
            Feedback & Ratings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Basic Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="relative inline-block mb-4">
                      <Avatar className="w-32 h-32 mx-auto border-4 border-white shadow-lg">
                        <AvatarImage
                          src={
                            formData?.profilePicture &&
                            typeof formData?.profilePicture === "string" &&
                            formData?.profilePictureMimeType
                              ? `data:${formData.profilePictureMimeType};base64,${formData.profilePicture}`
                              : "/images/placeholder.jpg"
                          }
                          alt={formData?.fullName}
                        />
                        <AvatarFallback className="text-2xl bg-gray-100 text-gray-600">
                          {formData?.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {formData?.fullName}
                      </h2>
                      <p className="text-gray-600">@{formData?.username}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {formData?.employerProfileId}
                      </p>

                      {/* Rating Display */}
                      <div className="flex items-center justify-center gap-2 mt-3">
                        {renderStars(formData.averageRating)}
                        <span className="text-lg font-semibold text-gray-900">
                          {formData.averageRating}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({formData.totalRatings} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Availability Status */}
                    <div className="mt-6">
                      <div className="inline-flex items-center px-4 py-2 rounded-full border-2 border-gray-200 bg-white">
                        <div
                          className={cn(
                            "w-3 h-3 rounded-full mr-3",
                            formData?.openToHire
                              ? "bg-green-500"
                              : "bg-gray-400"
                          )}
                        />
                        <span
                          className={cn(
                            "text-sm font-medium",
                            formData?.openToHire
                              ? "text-green-700"
                              : "text-gray-600"
                          )}
                        >
                          {formData?.openToHire
                            ? "Available to Hire"
                            : "Not Available to Hire"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {company && (
                    <div className="mt-3 pt-4">
                      <div className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-blue-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">
                          Official{" "}
                          <span className="capitalize">
                            {company.role} in{" "}
                            <span className="text-blue-600 font-medium hover:text-blue-700 underline cursor-pointer"
                                onClick={() => handleOpen(company.companyId.toString())}
                            >
                              {company.companyName}
                            </span>
                          </span>
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <User className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {formData?.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {formData?.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {formData?.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {formData?.dob
                          ? new Date(formData.dob).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Detailed Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-gray-900">About Me</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-700 leading-relaxed">
                    {formData?.selfDescription}
                  </p>
                </CardContent>
              </Card>

              {/* Languages */}
              <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Globe className="w-5 h-5" />
                    Languages
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {languageProficiency.map((lp: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="font-medium text-gray-900">
                          {lp.language}
                        </span>
                        <Badge variant="outline" className="border-gray-300">
                          {lp.proficiency}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Education */}
              <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <GraduationCap className="w-5 h-5" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {formData?.educations?.map((edu, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-black pl-4 py-2"
                      >
                        <h4 className="font-semibold text-gray-900">
                          {edu.title} in {edu.courseName}
                        </h4>
                        <p className="text-gray-600">{edu.institute}</p>
                        <p className="text-sm text-gray-500">
                          {edu.fromDate} -{" "}
                          {edu.currentStudying ? "Present" : edu.toDate}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Work Experience */}
              <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Briefcase className="w-5 h-5" />
                    Work Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-6">
                    {formData?.jobExperiences?.map((exp, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-black pl-4 py-2"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {exp.jobTitle}
                            </h4>
                            <p className="text-gray-600">{exp.company}</p>
                            <p className="text-sm text-gray-500">
                              {exp.fromDate} -{" "}
                              {exp.currentJob ? "Present" : exp.toDate}
                            </p>
                          </div>
                          {exp.currentJob && (
                            <Badge className="bg-black text-white">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-700 mt-2 whitespace-pre-line">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Files */}
              <div className="grid grid-cols-1 gap-12">
                {/* Certifications */}
                <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Award className="w-5 h-5" />
                      Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="w-full">
                      {(formData?.certificationFiles?.length ?? 0) > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {formData?.certificationFiles?.map((file, index) => (
                            <div
                              key={index}
                              className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm"
                            >
                              <div className="aspect-video bg-gray-50 flex items-center justify-center">
                                {getFilePreview(file)}
                              </div>
                              <div className="p-2 bg-white">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-medium text-gray-900 truncate flex-1">
                                    {file.fileName}
                                  </span>
                                  <div className="flex gap-1 flex-shrink-0">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => previewFile(file)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Eye className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                          <div className="text-center">
                            <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">
                              No certifications uploaded
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="job-history" className="mt-6">
          <div className="space-y-6">
            {/* Freelancer Feedback List */}
            <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-gray-900">
                  Freelancer Feedback
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {jobs.length === 0 && (
                    <div className="flex-1 p-10 ml-10 mr-10 h-full flex items-center justify-center bg-gray-50 rounded-xl border border-transparent">
                      <p className="text-sm text-gray-500 text-center">
                        &nbsp; No Feedback Record is Found for this Employer.
                        &nbsp;
                      </p>
                    </div>
                  )}

                  {/* Group feedback by job */}
                  {Object.entries(
                    jobs.reduce(
                      (
                        acc: Record<string, FreelancerFeedbackDTO[]>,
                        feedback
                      ) => {
                        if (!acc[feedback.jobId]) acc[feedback.jobId] = [];
                        acc[feedback.jobId].push(feedback);
                        return acc;
                      },
                      {}
                    )
                  ).map(([jobId, feedbacks]) => {
                    const jobTitle = feedbacks[0].jobTitle;
                    return (
                      <div key={jobId} className="p-6">
                        {/* Job Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {jobTitle}
                            </h3>
                          </div>
                        </div>

                        {/* Freelancer Feedback */}
                        {feedbacks
                          .filter((f) => f.rating > 0 || f.feedback)
                          .map((f) => (
                            <div
                              key={f.freelancerId + "-" + f.contractStartDate}
                              className="bg-gray-50 rounded-lg p-4 mb-2"
                            >
                              <p className="font-semibold text-gray-800">
                                {f.freelancerName}
                              </p>
                              <p className="font-sm text-gray-500 mb-2">
                                {f.freelancerId}
                              </p>

                              {f.rating > 0 && (
                                <div className="flex items-center gap-2 mb-1">
                                  {renderStars(f.rating)}
                                  <span className="text-gray-900 font-medium">
                                    {f.rating}/5.0
                                  </span>
                                </div>
                              )}

                              {f.feedback && (
                                <p className="text-gray-700 text-sm italic mt-1">
                                  "{f.feedback}"
                                </p>
                              )}

                              <div className="text-sm text-gray-500 mt-1">
                                <p>Hourly Rate: ${f.hourlyRate}</p>
                                <p>
                                  Contract: {f.contractStartDate} -{" "}
                                  {f.contractEndDate || "Ongoing"}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <FilePreviewDialog
        open={previewDialog.open}
        onOpenChange={(open) => setPreviewDialog((prev) => ({ ...prev, open }))}
        file={previewDialog.file}
      />

      <CompanyDialog
        companyId={selectedCompanyId}
        open={open}
        onOpenChange={setOpen}
      />
    </div>
  );
}
