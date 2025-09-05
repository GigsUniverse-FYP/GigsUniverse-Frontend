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
  DollarSign,
  Clock,
  Star,
  Crown,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FilePreviewDialog } from "../../../components/freelancer_components/file-preview-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";

interface FileData {
  base64Data: string;
  fileName: string;
  contentType: string;
}

interface FreelancerProfile {
  freelancerProfileId: string;
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
  highestEducationLevel: string;
  hoursPerWeek: number;
  jobCategory: string;
  preferredJobTitle: string;
  skillTags: string;
  languageProficiency: string;
  preferredPayRate: number;
  openToWork: boolean;
  premiumStatus: boolean;

  averageRating: number;
  totalRatings: number;

  resumeFile?: FileData;
  portfolioFiles?: {
    fileName: string;
    contentType: string;
    base64Data: string;
  }[];
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

const defaultFreelancerProfile: FreelancerProfile = {
  freelancerProfileId: "",
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
  highestEducationLevel: "",
  hoursPerWeek: 0,
  jobCategory: "",
  preferredJobTitle: "",
  skillTags: "",
  languageProficiency: "",
  preferredPayRate: 0,
  openToWork: false,
  premiumStatus: false,
  averageRating: 0,
  totalRatings: 0,
  resumeFile: undefined,
  portfolioFiles: [],
  certificationFiles: [],
  jobExperiences: [],
  educations: [],
};

interface jobHistoryRecord {
  id: string;
  title: string;
  client: string;
  status: "completed" | "active" | "upcoming" | "cancelled";
  startDate: string;
  endDate: string | null;
  budget: number;
  rating: number | null;
  feedback: string | null;
  skills: string[];
  companyName: string;
  clientId: string;
  cancellationReason: string;
}

export const formatDate = (isoDate: string | undefined | null) => {
  if (!isoDate) return ""
  const date = new Date(isoDate)
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export default function FreelancerProfile() {
  const [formData, setFormData] = useState<FreelancerProfile>(
    defaultFreelancerProfile
  );
  const [jobHistory, setJobHistory] = useState<jobHistoryRecord[]>([]);
  const [activeTab, setActiveTab] = useState("profile");

  const userId = useSearchParams().get("userId");

  if (!userId) {
    console.error("User ID is required");
    return null;
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchJobHistory = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/api/profile/freelancer/view-job-history/${userId}`,
          {
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("Failed to fetch job history");

        const data: jobHistoryRecord[] = await res.json();
        setJobHistory(data);
        console.log(data);
      } catch (err: any) {
        console.error("Problem occurs when fetching job history");
      }
    };

    fetchJobHistory();
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/api/profile/freelancer/view-freelancer-profile/${userId}`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        console.log(data);
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

  const jobCategoriesSelected =
    formData?.jobCategory.split(",").filter(Boolean) || [];

  const preferredJobTitle = (formData?.preferredJobTitle || "")
    .split(",")
    .map((title) => title.trim())
    .filter(Boolean);

  const skillTagsSelected =
    formData?.skillTags.split(",").filter(Boolean) || [];

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

    const iconSize = "w-12 h-12"; // Larger icon

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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Completed",
      },
      active: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "Active",
      },
      upcoming: {
        bg: "bg-orange-100",
        text: "text-orange-800",
        label: "Upcoming",
      },
      cancelled: {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Cancelled",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.cancelled;

    return (
      <Badge className={`${config.bg} ${config.text} hover:${config.bg}`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="w-full sm:max-w-8xl mx-auto space-y-6 mb-5 sm:ml-0 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="text-center sm:text-left p-6 rounded-xl border border-transparent ml-20 mr-20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-2">
              Freelancer Profile
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

      {/* Add Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="ml-20 mr-20">
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
            Job History
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
                        {formData?.freelancerProfileId}
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
                            formData?.openToWork
                              ? "bg-green-500"
                              : "bg-gray-400"
                          )}
                        />
                        <span
                          className={cn(
                            "text-sm font-medium",
                            formData?.openToWork
                              ? "text-green-700"
                              : "text-gray-600"
                          )}
                        >
                          {formData?.openToWork
                            ? "Available for Work"
                            : "Not Available for Work"}
                        </span>
                      </div>
                    </div>
                  </div>
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

              {/* Work Preferences */}
              <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <Briefcase className="w-5 h-5" />
                    Work Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {formData?.highestEducationLevel}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {formData?.hoursPerWeek} hours/week
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        ${formData?.preferredPayRate}/hour
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

              {/* Skills & Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Categories */}
                <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-gray-900">
                      Open for Job Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {jobCategoriesSelected.map((category) => (
                        <Badge
                          key={category}
                          className="bg-gray-100 text-gray-800"
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Preferred Job Titles */}
                <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="text-gray-900">
                      Preferred Job Titles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {preferredJobTitle.map((title) => (
                        <Badge
                          key={title}
                          variant="outline"
                          className="border-gray-300"
                        >
                          {title}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Skills */}
              <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-gray-900">Skills</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {skillTagsSelected.map((skill) => (
                      <Badge key={skill} className="bg-black text-white">
                        {skill}
                      </Badge>
                    ))}
                  </div>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Resume */}
                <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="flex items-center gap-2 text-gray-9å00">
                      <FileText className="w-5 h-5" />
                      Resume
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {formData?.resumeFile ? (
                      <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="aspect-video bg-gray-50">
                          {getFilePreview(formData.resumeFile)}
                        </div>
                        <div className="p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-xs font-medium text-gray-900 truncate"
                                title={formData.resumeFile.fileName}
                              >
                                {formData.resumeFile.fileName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {formData.resumeFile.contentType}
                              </p>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => previewFile(formData.resumeFile)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-8">
                        No resume uploaded
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Portfolio */}
                <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Award className="w-5 h-5" />
                      Portfolio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {(formData?.portfolioFiles?.length ?? 0) > 0 ? (
                        formData?.portfolioFiles?.map((file, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg overflow-hidden"
                          >
                            <div className="aspect-video bg-gray-50">
                              {getFilePreview(file)}
                            </div>
                            <div className="p-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-900 truncate">
                                  {file.fileName}
                                </span>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => previewFile(file)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm text-center py-8">
                          No portfolio files
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Certifications */}
                <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <Award className="w-5 h-5" />
                      Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {(formData?.certificationFiles?.length ?? 0) > 0 ? (
                        formData?.certificationFiles?.map((file, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-lg overflow-hidden"
                          >
                            <div className="aspect-video bg-gray-50">
                              {getFilePreview(file)}
                            </div>
                            <div className="p-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-900 truncate">
                                  {file.fileName}
                                </span>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => previewFile(file)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm text-center py-8">
                          No certifications
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="job-history" className="mt-6 lg:min-w-[1000px]">
          <div className="space-y-6">
            {/* Job History Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {
                      jobHistory.filter(
                        (job: jobHistoryRecord) => job.status === "completed"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {
                      jobHistory.filter(
                        (job: jobHistoryRecord) => job.status === "active"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-gray-600">Active</div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {
                      jobHistory.filter(
                        (job: jobHistoryRecord) => job.status === "upcoming"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-gray-600">Upcoming</div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {
                      jobHistory.filter(
                        (job: jobHistoryRecord) => job.status === "cancelled"
                      ).length
                    }
                  </div>
                  <div className="text-sm text-gray-600">Cancelled</div>
                </CardContent>
              </Card>
            </div>

            {/* Job History List */}
            <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="text-gray-900">Job History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-100">
                  {jobHistory.map((job: jobHistoryRecord, index: number) => (
                    <div key={job.id} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {job.title}
                          </h3>
                          <p className="text-gray-600">ClientID: {job.clientId}</p>
                          <p className="text-gray-600">Client: {job.client}</p>
                          <p className="text-gray-600">Company Name: {job.companyName}</p>
                          <p className="text-sm text-gray-500">
                            {formatDate(job.startDate)} - {formatDate(job.endDate) || "Ongoing"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(job.status)}
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                              ${job.budget.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">Hourly Rate</div>
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills.map((skill: string) => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="border-gray-300 text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      {/* Rating and Feedback */}
                      {job.status === "completed" && job.rating && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {renderStars(job.rating)}
                            <span className="font-semibold text-gray-900">
                              {job.rating}/5
                            </span>
                          </div>
                          {job.feedback && (
                            <p className="text-gray-700 text-sm italic">
                              "{job.feedback}"
                            </p>
                          )}
                        </div>
                      )}

                      {job.status === "cancelled" && (
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700 text-sm italic">
                              "{job.cancellationReason}"
                            </p>
                        </div>
                      )}

                      {/* Feedback for non-completed jobs */}
                      {job.feedback && !job.rating && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 text-sm italic">
                            "{job.feedback}"
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                  {jobHistory.length === 0 && (
                  <div className="flex-1 p-10 h-full flex items-center justify-center bg-gray-50 rounded-xl border border-transparent">
                    <p className="text-sm text-gray-500 text-center">
                      &nbsp; No Job History is Found. &nbsp;
                    </p>
                </div>
                  )}
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
    </div>
  );
}

// Add missing Button component since it was removed from imports but still used
const Button = ({ 
  variant = "default", 
  size = "default", 
  className = "", 
  onClick, 
  children 
}: { 
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) => {
  return (
    <button 
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
        {
          "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
          "border border-input hover:bg-accent hover:text-accent-foreground": variant === "outline",
          "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
          "h-10 py-2 px-4": size === "default",
          "h-9 px-3 rounded-md": size === "sm",
          "h-11 px-8 rounded-md": size === "lg"
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};