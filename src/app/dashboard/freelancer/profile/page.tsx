"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Edit3,
  Save,
  X,
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
  Plus,
  Minus,
  XCircle,
  Eye,
  Upload,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfirmationDialog } from "../../../components/freelancer_components/confirmation-dialog";
import { FilePreviewDialog } from "../../../components/freelancer_components/file-preview-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRef } from "react";
import {
  locationData,
  proficiencyLevels,
  languages,
  jobCategories,
  jobTitles,
  skillTags,
  educationLevels,
} from "@/lib/data";
import { toast } from "react-toastify";

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

const formatDate = (isoDate: string | undefined | null) => {
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
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FreelancerProfile>(
    defaultFreelancerProfile
  );
  const [jobHistory, setJobHistory] = useState<jobHistoryRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // inside your component
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchJobHistory = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/api/profile/freelancer/job-history`,
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
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/api/profile/freelancer/my-profile`,
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

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const [previewDialog, setPreviewDialog] = useState<{
    open: boolean;
    file: any;
  }>({
    open: false,
    file: null,
  });

  // Add this useEffect after the existing state declarations
  useEffect(() => {
    if (activeTab === "job-history" && isEditing) {
      setIsEditing(false);
    }
  }, [activeTab, isEditing]);

  // Parse JSON strings
  const jobCategoriesSelected =
    formData?.jobCategory.split(",").filter(Boolean) || [];

  const preferredJobTitle = (formData?.preferredJobTitle || "")
    .split(",")
    .map((title) => title.trim())
    .filter(Boolean);

  const skillTagsSelected =
    formData?.skillTags.split(",").filter(Boolean) || [];

  const languageProficiency = JSON.parse(formData?.languageProficiency || "[]");

  const handleInputChange = <K extends keyof FreelancerProfile>(
    field: K,
    value: FreelancerProfile[K]
  ) => {
    setFormData((prev) => ({
      ...prev!,
      [field]: value,
    }));
  };

  const handleArrayStringChange = (
    field: keyof FreelancerProfile,
    items: string[]
  ) => {
    setFormData((prev) => ({ ...prev!, [field]: items.join(",") }));
  };

  const addJobCategory = (category: string) => {
    const current = jobCategoriesSelected;
    if (current.length < 3 && !current.includes(category)) {
      handleArrayStringChange("jobCategory", [...current, category]);
    }
  };

  const removeJobCategory = (category: string) => {
    handleArrayStringChange(
      "jobCategory",
      jobCategoriesSelected.filter((c) => c !== category)
    );
  };

  const addJobTitle = (title: string) => {
    const current = preferredJobTitle;
    if (current.length < 5 && !current.includes(title)) {
      handleArrayStringChange("preferredJobTitle", [...current, title]);
    }
  };

  const removeJobTitle = (title: string) => {
    handleArrayStringChange(
      "preferredJobTitle",
      preferredJobTitle.filter((t) => t !== title)
    );
  };

  const addSkillTag = (skill: string) => {
    const current = skillTagsSelected;
    if (current.length < 10 && !current.includes(skill)) {
      handleArrayStringChange("skillTags", [...current, skill]);
    }
  };

  const removeSkillTag = (skill: string) => {
    handleArrayStringChange(
      "skillTags",
      skillTagsSelected.filter((s) => s !== skill)
    );
  };

  const addLanguage = () => {
    const updated = [...languageProficiency, { language: "", proficiency: "" }];
    handleInputChange("languageProficiency", JSON.stringify(updated));
  };

  const updateLanguage = (index: number, field: string, value: string) => {
    const updated = [...languageProficiency];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange("languageProficiency", JSON.stringify(updated));
  };

  const removeLanguage = (index: number) => {
    const updated = [...languageProficiency];
    updated.splice(index, 1);
    handleInputChange("languageProficiency", JSON.stringify(updated));
  };

  const addJobExperience = () => {
    const updated = [
      ...(formData?.jobExperiences ?? []), // use empty array if undefined
      {
        jobTitle: "",
        fromDate: "",
        toDate: "",
        company: "",
        description: "",
        currentJob: false,
      },
    ];
    handleInputChange("jobExperiences", updated);
  };

  const updateJobExperience = (index: number, field: string, value: any) => {
    const updated = [...(formData?.jobExperiences ?? [])];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange("jobExperiences", updated);
  };

  const confirmRemoveJobExperience = (index: number) => {
    const experience = (formData?.jobExperiences ?? [])[index];
    setConfirmDialog({
      open: true,
      title: "Delete Job Experience",
      description: `Are you sure you want to delete the job experience "${experience?.jobTitle}" at "${experience?.company}"? This action cannot be undone.`,
      onConfirm: () => {
        const updated = [...(formData?.jobExperiences ?? [])];
        updated.splice(index, 1);
        handleInputChange("jobExperiences", updated);
      },
    });
  };

  const addEducation = () => {
    const updated = [
      ...(formData?.educations ?? []),
      {
        institute: "",
        title: "",
        courseName: "",
        fromDate: "",
        toDate: "",
        currentStudying: false,
      },
    ];
    handleInputChange("educations", updated);
  };

  const updateEducation = (index: number, field: string, value: any) => {
    const updated = [...(formData?.educations ?? [])];
    updated[index] = { ...updated[index], [field]: value };
    handleInputChange("educations", updated);
  };

  const confirmRemoveEducation = (index: number) => {
    const education = (formData?.educations ?? [])[index];

    setConfirmDialog({
      open: true,
      title: "Delete Education",
      description: `Are you sure you want to delete the education "${education?.title}" from "${education?.institute}"? This action cannot be undone.`,
      onConfirm: () => {
        const updated = [...(formData?.educations ?? [])];
        updated.splice(index, 1);
        handleInputChange("educations", updated);
      },
    });
  };

  const handleFileUpload = (
    field: string,
    e: React.ChangeEvent<HTMLInputElement>,
    multiple?: boolean
  ) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files).filter(
      (file) => file.size <= 10 * 1024 * 1024 // Max 10MB
    );

    // Adjust upload limits based on premiumStatus
    const maxLimits: { [key: string]: number } = {
      portfolioFiles: formData.premiumStatus ? 5 : 2,
      certificationFiles: formData.premiumStatus ? 7 : 3,
    };

    // 1. Profile Picture (single)
    if (field === "profilePicture") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result?.toString();
          if (!result) return;

          const base64Data = result.split(",")[1] || result;

          setFormData((prev) => ({
            ...prev,
            profilePicture: base64Data,
            profilePictureMimeType: file.type,
          }));
        };
        reader.readAsDataURL(file);
      }
    }

    // 2. Resume (single)
    else if (field === "resumeFile") {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result?.toString();
          if (!result) return;

          const base64Data = result.split(",")[1] || result;

          setFormData((prev) => ({
            ...prev,
            resumeFile: {
              fileName: file.name,
              contentType: file.type,
              base64Data: base64Data,
            },
          }));
        };
        reader.readAsDataURL(file);
      }
    }

    // 3. Multi-file fields (portfolioFiles, certificationFiles)
    else if (multiple) {
      const currentFiles = (formData as any)[field] || [];

      const maxFiles = maxLimits[field] || 1;
      const availableSlots = maxFiles - currentFiles.length;

      if (availableSlots <= 0) return;

      const filesToRead = files.slice(0, availableSlots);

      Promise.all(
        filesToRead.map(
          (file) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const result = reader.result?.toString();
                if (!result) return resolve(null);

                const base64Data = result.split(",")[1] || result;

                resolve({
                  fileName: file.name,
                  contentType: file.type,
                  base64Data: base64Data,
                });
              };
              reader.readAsDataURL(file);
            })
        )
      ).then((newFiles) => {
        const validFiles = newFiles.filter(Boolean);
        handleInputChange(field as keyof FreelancerProfile, [
          ...currentFiles,
          ...validFiles,
        ]);
      });
    }

    // Reset the file input to allow re-selecting the same file
    e.target.value = "";
  };
  const confirmDeleteFile = (field: string, index?: number) => {
    const isArray = Array.isArray((formData as any)[field]);
    const fileName = isArray
      ? (formData as any)[field][index!].fileName
      : (formData as any)[field]?.fileName;

    setConfirmDialog({
      open: true,
      title: "Delete File",
      description: `Are you sure you want to delete "${fileName}"?`,
      onConfirm: () => {
        if (isArray && index !== undefined) {
          const currentFiles = [...(formData as any)[field]];
          currentFiles.splice(index, 1);
          handleInputChange(field as keyof FreelancerProfile, currentFiles);
        } else {
          handleInputChange(field as keyof FreelancerProfile, undefined);
        }
      },
    });
  };

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

  function base64ImageToFile(
    base64: string,
    filename: string,
    mimeType: string
  ): File {
    // Handle both prefixed and raw base64 strings
    const base64Data = base64.includes(",") ? base64.split(",")[1] : base64;

    const byteString = atob(base64Data);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new File([ab], filename, { type: mimeType });
  }

  function base64ToFile(
    base64String: string,
    fileName: string,
    contentType: string
  ): File {
    const byteString = atob(base64String.split(",")[1] || base64String);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new File([ab], fileName, { type: contentType });
  }

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      if (
        formData &&
        !formData.premiumStatus &&
        (formData.portfolioFiles?.length ?? 0) > 2
      ) {
        toast.error("Free users can only upload up to 2 portfolio items.");
        return;
      }

      if (
        formData &&
        !formData.premiumStatus &&
        (formData.certificationFiles?.length ?? 0) > 3
      ) {
        toast.error("Free users can only upload up to 3 certification items.");
        return;
      }

      const formDataToSend = new FormData();

      const nonFileData: Record<string, any> = {};
      Object.entries(formData).forEach(([key, value]) => {
        if (
          key === "profilePicture" ||
          key === "resumeFile" ||
          key === "portfolioFiles" ||
          key === "certificationFiles" ||
          key === "email"
        ) {
          return;
        }
        nonFileData[key] = value;
      });

      if (typeof nonFileData.jobCategory === "string") {
        nonFileData.jobCategory = nonFileData.jobCategory
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      if (typeof nonFileData.preferredJobTitle === "string") {
        nonFileData.preferredJobTitle = nonFileData.preferredJobTitle
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      if (typeof nonFileData.skillTags === "string") {
        nonFileData.skillTags = nonFileData.skillTags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      if (typeof nonFileData.languageProficiency === "string") {
        try {
          nonFileData.languageProficiency = JSON.parse(
            nonFileData.languageProficiency
          );
        } catch (e) {
          console.error("Invalid JSON in languageProficiency", e);
        }
      }

      formDataToSend.append("data", JSON.stringify(nonFileData));

      if (formData.profilePicture && formData.profilePictureMimeType) {
        try {
          // Use correct filename with extension based on MIME type
          const extension = formData.profilePictureMimeType.split("/")[1];
          const filename = `profile-picture.${extension}`;

          const file = base64ImageToFile(
            formData.profilePicture,
            filename,
            formData.profilePictureMimeType
          );
          formDataToSend.append("profilePicture", file);
        } catch (e) {
          console.error("❌ Error converting profile picture to file", e);
        }
      }

      if (
        formData.resumeFile &&
        !(formData.resumeFile instanceof File) &&
        typeof formData.resumeFile === "object" &&
        "base64Data" in formData.resumeFile
      ) {
        const file = base64ToFile(
          formData.resumeFile.base64Data,
          formData.resumeFile.fileName,
          formData.resumeFile.contentType
        );
        formDataToSend.append("resumeFile", file);
      }

      formData.portfolioFiles?.forEach((file) => {
        formDataToSend.append(
          "portfolioFiles",
          base64ToFile(file.base64Data, file.fileName, file.contentType) as File
        );
      });

      formData.certificationFiles?.forEach((file) => {
        formDataToSend.append(
          "certificationFiles",
          base64ToFile(file.base64Data, file.fileName, file.contentType) as File
        );
      });

      // Send to backend
      const response = await fetch(
        `${backendUrl}/api/profile/freelancer/save`,
        {
          method: "POST",
          body: formDataToSend,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend error:", response.status, errorText);
      }

      toast.success("Profile saved successfully!");

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/api/profile/freelancer/my-profile`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        setFormData(data);
        setIsEditing(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchProfile();
  };

  const wordCount = formData?.selfDescription
    .split(/\s+/)
    .filter(Boolean).length;

  const isFormValid = () => {
    const payRate = Number.parseFloat(
      (formData?.preferredPayRate ?? "").toString()
    );
    return (
      formData?.fullName &&
      formData?.username &&
      formData?.gender &&
      formData?.dob &&
      formData?.phone &&
      formData?.location &&
      (wordCount ?? 0) >= 50 &&
      formData?.highestEducationLevel &&
      formData?.hoursPerWeek >= 1 &&
      formData?.hoursPerWeek <= 40 &&
      jobCategoriesSelected.length > 0 &&
      preferredJobTitle.length > 0 &&
      skillTagsSelected.length > 0 &&
      languageProficiency.length > 0 &&
      languageProficiency.every((lp: any) => lp.language && lp.proficiency) &&
      payRate >= 1 &&
      payRate <= 150
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
    <div className="w-full sm:max-w-8xl mx-auto space-y-6 mb-5 -ml-10 sm:ml-0 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="text-center sm:text-left p-6 rounded-xl border border-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-4 mb-2">
              Freelancer Profile
            </h1>
            <p className="text-gray-600">Manage your professional profile</p>
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

            {activeTab === "profile" && (
              <>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      disabled={!isFormValid() || isSubmitting}
                      className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
                    >
                      <Save className="w-4 h-4" />
                      {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="border-gray-300"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Add Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
              {/* Profile Card - Update to include rating and user ID */}
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

                    {isEditing && (
                      <div className="mb-4">
                        <Label
                          htmlFor="profilePicture"
                          className="cursor-pointer"
                        >
                          <div className="flex items-center justify-center gap-2 p-2 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Upload className="w-4 h-4" />
                            <span className="text-sm">Upload New Photo</span>
                          </div>
                        </Label>
                        <Input
                          id="profilePicture"
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleFileUpload("profilePicture", e)
                          }
                          className="hidden"
                        />
                      </div>
                    )}

                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label
                            htmlFor="fullName"
                            className="text-left block text-gray-700"
                          >
                            Full Name *
                          </Label>
                          <Input
                            id="fullName"
                            value={formData?.fullName}
                            onChange={(e) =>
                              handleInputChange("fullName", e.target.value)
                            }
                            className="mt-1 border-gray-300"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="username"
                            className="text-left block text-gray-700"
                          >
                            Username *
                          </Label>
                          <Input
                            id="username"
                            value={formData?.username}
                            onChange={(e) =>
                              handleInputChange("username", e.target.value)
                            }
                            className="mt-1 border-gray-300"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {formData?.fullName}
                        </h2>
                        <p className="text-gray-600">@{formData?.username}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formData?.freelancerProfileId}
                        </p>

                        {/* Rating Display -- need changes*/}
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
                    )}

                    {/* Availability Status */}
                    <div className="mt-6">
                      {isEditing ? (
                        <div className="flex items-center justify-center space-x-2">
                          <Switch
                            id="openToWork"
                            checked={formData?.openToWork}
                            onCheckedChange={(checked) =>
                              handleInputChange("openToWork", checked)
                            }
                          />
                          <Label htmlFor="openToWork" className="text-gray-700">
                            Open to Work
                          </Label>
                        </div>
                      ) : (
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
                      )}
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
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email" className="text-gray-700">
                          Email
                        </Label>
                        <Input
                          id="email"
                          value={formData?.email}
                          disabled
                          className="mt-1 bg-gray-50 border-gray-300"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-gray-700">
                          Phone *
                        </Label>
                        <Input
                          id="phone"
                          value={formData?.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className="mt-1 border-gray-300"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location" className="text-gray-700">
                          Location *
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            handleInputChange("location", value)
                          }
                          value={formData?.location}
                        >
                          <SelectTrigger className="mt-1 border-gray-300">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {locationData.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="gender" className="text-gray-700">
                          Gender *
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            handleInputChange("gender", value)
                          }
                          value={formData?.gender}
                        >
                          <SelectTrigger className="mt-1 border-gray-300">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="dob" className="text-gray-700">
                          Date of Birth *
                        </Label>
                        <Input
                          id="dob"
                          type="date"
                          value={formData?.dob}
                          onChange={(e) =>
                            handleInputChange("dob", e.target.value)
                          }
                          className="mt-1 border-gray-300"
                        />
                      </div>
                    </div>
                  ) : (
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
                  )}
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
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="highestEducationLevel"
                          className="text-gray-700"
                        >
                          Highest Education Level *
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            handleInputChange("highestEducationLevel", value)
                          }
                          value={formData?.highestEducationLevel}
                        >
                          <SelectTrigger className="mt-1 border-gray-300">
                            <SelectValue placeholder="Select education level" />
                          </SelectTrigger>
                          <SelectContent>
                            {educationLevels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="hoursPerWeek" className="text-gray-700">
                          Hours Per Week * (1-40)
                        </Label>
                        <Input
                          id="hoursPerWeek"
                          type="number"
                          min={1}
                          max={40}
                          value={formData?.hoursPerWeek}
                          onChange={(e) =>
                            handleInputChange(
                              "hoursPerWeek",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="mt-1 border-gray-300"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="preferredPayrate"
                          className="text-gray-700"
                        >
                          Preferred Pay Rate * ($1-$150/hour)
                        </Label>
                        <Input
                          id="preferredPayrate"
                          type="number"
                          min={1}
                          max={150}
                          value={formData?.preferredPayRate}
                          onChange={(e) =>
                            handleInputChange(
                              "preferredPayRate",
                              parseInt(e.target.value) || 0
                            )
                          }
                          className="mt-1 border-gray-300"
                        />
                      </div>
                    </div>
                  ) : (
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
                  )}
                </CardContent>
              </Card>

              {/* Work Preferences */}
            </div>

            {/* Right Column - Detailed Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* About */}
              <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-gray-900">About Me</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {isEditing ? (
                    <div>
                      <Textarea
                        value={formData?.selfDescription}
                        onChange={(e) =>
                          handleInputChange("selfDescription", e.target.value)
                        }
                        rows={6}
                        placeholder="Tell clients about your experience, expertise, and what makes you unique..."
                        className="border-gray-300"
                      />
                      <p
                        className={cn(
                          "text-sm mt-2",
                          (wordCount ?? 0) < 50
                            ? "text-red-500"
                            : "text-gray-500"
                        )}
                      >
                        {wordCount} words (min 50)
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      {formData?.selfDescription}
                    </p>
                  )}
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
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-gray-700">
                            Add Category (Max 3)
                          </Label>
                          <Select
                            onValueChange={addJobCategory}
                            disabled={jobCategoriesSelected.length >= 3}
                          >
                            <SelectTrigger className="border-gray-300 w-full mt-3">
                              <SelectValue placeholder="Select job categories" />
                            </SelectTrigger>
                            <SelectContent>
                              {jobCategories
                                .filter(
                                  (category) =>
                                    !jobCategoriesSelected.includes(category)
                                )
                                .map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {jobCategoriesSelected.map((category) => (
                            <Badge
                              key={category}
                              className="flex items-center gap-1 bg-gray-100 text-gray-800 hover:bg-gray-200"
                            >
                              {category}
                              <button
                                onClick={() => removeJobCategory(category)}
                              >
                                <XCircle className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
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
                    )}
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
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <Label className="text-gray-700">
                            Add Title (Max 5)
                          </Label>
                          <Select
                            onValueChange={addJobTitle}
                            disabled={preferredJobTitle.length >= 5}
                          >
                            <SelectTrigger className="border-gray-300 w-full mt-3">
                              <SelectValue placeholder="Select job titles" />
                            </SelectTrigger>
                            <SelectContent>
                              {jobTitles
                                .filter(
                                  (title) => !preferredJobTitle.includes(title)
                                )
                                .map((title) => (
                                  <SelectItem key={title} value={title}>
                                    {title}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {preferredJobTitle.map((title) => (
                            <Badge
                              key={title}
                              variant="outline"
                              className="flex items-center gap-1 border-gray-300"
                            >
                              {title}
                              <button onClick={() => removeJobTitle(title)}>
                                <XCircle className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ) : (
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
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Skills */}
              <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
                <CardHeader className="border-b border-gray-100">
                  <CardTitle className="text-gray-900">Skills</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <Label className="text-gray-700">
                          Add Skill (Max 10)
                        </Label>
                        <Select
                          onValueChange={addSkillTag}
                          disabled={skillTagsSelected.length >= 10}
                        >
                          <SelectTrigger className="border-gray-300 w-full mt-3">
                            <SelectValue placeholder="Select skills" />
                          </SelectTrigger>
                          <SelectContent>
                            {skillTags
                              .filter(
                                (skill) => !skillTagsSelected.includes(skill)
                              )
                              .map((skill) => (
                                <SelectItem key={skill} value={skill}>
                                  {skill}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skillTagsSelected.map((skill) => (
                          <Badge
                            key={skill}
                            className="flex items-center gap-1 bg-black text-white hover:bg-gray-800"
                          >
                            {skill}
                            <button onClick={() => removeSkillTag(skill)}>
                              <XCircle className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {skillTagsSelected.map((skill) => (
                        <Badge key={skill} className="bg-black text-white">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
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
                  {isEditing ? (
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        onClick={addLanguage}
                        className="flex items-center gap-2 border-gray-300"
                      >
                        <Plus className="w-4 h-4" />
                        Add Language
                      </Button>
                      {languageProficiency.map((lp: any, index: number) => (
                        <div
                          key={index}
                          className="grid grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg relative"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLanguage(index)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <div>
                            <Label className="text-gray-700">Language</Label>
                            <Select
                              onValueChange={(value) =>
                                updateLanguage(index, "language", value)
                              }
                              value={lp.language}
                            >
                              <SelectTrigger className="mt-1 border-gray-300">
                                <SelectValue placeholder="Select language" />
                              </SelectTrigger>
                              <SelectContent>
                                {languages.map((lang) => (
                                  <SelectItem key={lang} value={lang}>
                                    {lang}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-gray-700">Proficiency</Label>
                            <Select
                              onValueChange={(value) =>
                                updateLanguage(index, "proficiency", value)
                              }
                              value={lp.proficiency}
                            >
                              <SelectTrigger className="mt-1 border-gray-300">
                                <SelectValue placeholder="Select proficiency" />
                              </SelectTrigger>
                              <SelectContent>
                                {proficiencyLevels.map((level) => (
                                  <SelectItem key={level} value={level}>
                                    {level}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
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
                  )}
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
                  {isEditing ? (
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        onClick={addEducation}
                        className="flex items-center gap-2 border-gray-300"
                      >
                        <Plus className="w-4 h-4" />
                        Add Education
                      </Button>
                      {formData?.educations?.map((edu, index) => (
                        <div
                          key={index}
                          className="space-y-4 p-4 border border-gray-200 rounded-lg relative"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmRemoveEducation(index)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-gray-700">Institute</Label>
                              <Input
                                value={edu.institute}
                                onChange={(e) =>
                                  updateEducation(
                                    index,
                                    "institute",
                                    e.target.value
                                  )
                                }
                                className="mt-1 border-gray-300"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-700">
                                Degree/Title
                              </Label>
                              <Select
                                onValueChange={(value) =>
                                  updateEducation(index, "title", value)
                                }
                                value={edu.title}
                              >
                                <SelectTrigger className="mt-1 border-gray-300">
                                  <SelectValue placeholder="Select degree" />
                                </SelectTrigger>
                                <SelectContent>
                                  {educationLevels.map((level) => (
                                    <SelectItem key={level} value={level}>
                                      {level}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label className="text-gray-700">Course Name</Label>
                            <Input
                              value={edu.courseName}
                              onChange={(e) =>
                                updateEducation(
                                  index,
                                  "courseName",
                                  e.target.value
                                )
                              }
                              className="mt-1 border-gray-300"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-gray-700">From Date</Label>
                              <Input
                                type="date"
                                value={edu.fromDate}
                                onChange={(e) =>
                                  updateEducation(
                                    index,
                                    "fromDate",
                                    e.target.value
                                  )
                                }
                                className="mt-1 border-gray-300"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-700">To Date</Label>
                              <Input
                                type="date"
                                value={edu.toDate}
                                onChange={(e) =>
                                  updateEducation(
                                    index,
                                    "toDate",
                                    e.target.value
                                  )
                                }
                                disabled={edu.currentStudying}
                                className="mt-1 border-gray-300"
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={edu.currentStudying}
                              onCheckedChange={(checked) =>
                                updateEducation(
                                  index,
                                  "currentStudying",
                                  checked
                                )
                              }
                            />
                            <Label className="text-gray-700">
                              Currently Studying
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
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
                  )}
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
                  {isEditing ? (
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        onClick={addJobExperience}
                        className="flex items-center gap-2 border-gray-300"
                      >
                        <Plus className="w-4 h-4" />
                        Add Experience
                      </Button>
                      {formData?.jobExperiences?.map((exp, index) => (
                        <div
                          key={index}
                          className="space-y-4 p-4 border border-gray-200 rounded-lg relative"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmRemoveJobExperience(index)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-gray-700">Job Title</Label>
                              <Input
                                value={exp.jobTitle}
                                onChange={(e) =>
                                  updateJobExperience(
                                    index,
                                    "jobTitle",
                                    e.target.value
                                  )
                                }
                                className="mt-1 border-gray-300"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-700">Company</Label>
                              <Input
                                value={exp.company}
                                onChange={(e) =>
                                  updateJobExperience(
                                    index,
                                    "company",
                                    e.target.value
                                  )
                                }
                                className="mt-1 border-gray-300"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-gray-700">From Date</Label>
                              <Input
                                type="date"
                                value={exp.fromDate}
                                onChange={(e) =>
                                  updateJobExperience(
                                    index,
                                    "fromDate",
                                    e.target.value
                                  )
                                }
                                className="mt-1 border-gray-300"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-700">To Date</Label>
                              <Input
                                type="date"
                                value={exp.toDate}
                                onChange={(e) =>
                                  updateJobExperience(
                                    index,
                                    "toDate",
                                    e.target.value
                                  )
                                }
                                disabled={exp.currentJob}
                                className="mt-1 border-gray-300"
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={exp.currentJob}
                              onCheckedChange={(checked) =>
                                updateJobExperience(
                                  index,
                                  "currentJob",
                                  checked
                                )
                              }
                            />
                            <Label className="text-gray-700">Current Job</Label>
                          </div>
                          <div>
                            <Label className="text-gray-700">Description</Label>
                            <Textarea
                              value={exp.description}
                              onChange={(e) =>
                                updateJobExperience(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                              rows={3}
                              className="mt-1 border-gray-300"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
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
                  )}
                </CardContent>
              </Card>

              {/* Files */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Resume */}
                <Card className="border border-gray-200 shadow-sm bg-white rounded-xl">
                  <CardHeader className="border-b border-gray-100">
                    <CardTitle className="flex items-center gap-2 text-gray-900">
                      <FileText className="w-5 h-5" />
                      Resume
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {isEditing && (
                      <div className="mb-4">
                        <Label
                          htmlFor="resumeUpload"
                          className="cursor-pointer"
                        >
                          <div className="flex items-center justify-center gap-2 p-3 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            <Upload className="w-4 h-4" />
                            <span className="text-sm">Upload Resume</span>
                          </div>
                        </Label>
                        <Input
                          id="resumeUpload"
                          type="file"
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload("resumeFile", e)}
                          ref={resumeInputRef}
                          className="hidden"
                        />
                      </div>
                    )}
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
                              {isEditing && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    confirmDeleteFile("resumeFile")
                                  }
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
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
                    {isEditing &&
                      (formData?.portfolioFiles?.length ?? 0) <
                        (formData?.premiumStatus ? 5 : 2) && (
                        <div className="mb-4">
                          <Label
                            htmlFor="portfolioUpload"
                            className="cursor-pointer"
                          >
                            <div className="flex items-center justify-center gap-2 p-3 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                              <Upload className="w-4 h-4" />
                              <span className="text-sm">
                                Upload Portfolio (
                                {formData?.portfolioFiles?.length ?? 0}/
                                {formData?.premiumStatus ? 5 : 2})
                              </span>
                            </div>
                          </Label>
                          <Input
                            id="portfolioUpload"
                            type="file"
                            multiple
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={(e) =>
                              handleFileUpload("portfolioFiles", e, true)
                            }
                            className="hidden"
                          />
                        </div>
                      )}

                    {/* Soft-block Warning for Free Users */}
                    {!formData?.premiumStatus &&
                      (formData?.portfolioFiles?.length ?? 0) > 2 && (
                        <p className="text-red-500 text-sm mb-4">
                          You have exceeded the free limit of 2 portfolio items.
                          Please remove extra files to save your changes.
                        </p>
                      )}

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
                                    <Eye className="w-3 h-3" />
                                  </Button>
                                  {isEditing && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        confirmDeleteFile(
                                          "portfolioFiles",
                                          index
                                        )
                                      }
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  )}
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
                    {isEditing &&
                      (formData?.certificationFiles?.length ?? 0) <
                        (formData?.premiumStatus ? 7 : 3) && (
                        <div className="mb-4">
                          <Label
                            htmlFor="certificationUpload"
                            className="cursor-pointer"
                          >
                            <div className="flex items-center justify-center gap-2 p-3 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                              <Upload className="w-4 h-4" />
                              <span className="text-sm">
                                Upload Cert (
                                {formData?.certificationFiles?.length ?? 0}/
                                {formData?.premiumStatus ? 7 : 3})
                              </span>
                            </div>
                          </Label>
                          <Input
                            id="certificationUpload"
                            type="file"
                            multiple
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={(e) =>
                              handleFileUpload("certificationFiles", e, true)
                            }
                            className="hidden"
                          />
                        </div>
                      )}

                    {/* Soft-block Warning for Free Users */}
                    {!formData?.premiumStatus &&
                      (formData?.certificationFiles?.length ?? 0) > 3 && (
                        <p className="text-red-500 text-sm mb-4">
                          You have exceeded the free limit of 3 certification
                          items. Please remove extra files to save your changes.
                        </p>
                      )}

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
                                    <Eye className="w-3 h-3" />
                                  </Button>
                                  {isEditing && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        confirmDeleteFile(
                                          "certificationFiles",
                                          index
                                        )
                                      }
                                      className="text-red-500 hover:text-red-700"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  )}
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

      {/* Dialogs - keep existing */}
      <ConfirmationDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.onConfirm}
      />

      <FilePreviewDialog
        open={previewDialog.open}
        onOpenChange={(open) => setPreviewDialog((prev) => ({ ...prev, open }))}
        file={previewDialog.file}
      />
    </div>
  );
}
