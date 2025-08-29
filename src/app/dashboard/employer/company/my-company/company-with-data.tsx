"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Building2,
  Users,
  MapPin,
  Edit,
  Save,
  X,
  Plus,
  ArrowLeftRight,
  Upload,
  Trash2,
  Info,
  Phone,
  Mail,
  Globe,
  Calendar,
  FileText,
  Hash,
  Search,
} from "lucide-react"
import { toast } from "react-toastify"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

interface AvailableEmployer{
  id: string;
  name: string;
  username: string;
  role: string;
  avatar: string | null;
}

interface CompanyData {
  companyId: number
  companyName: string
  businessRegistrationNumber: string
  registrationCountry: string
  registrationDate: string
  industryType: string
  companySize: string
  companyDescription: string
  registeredCompanyAddress: string
  businessPhoneNumber: string
  businessEmail: string
  officialWebsiteUrl: string
  taxNumber: string
  companyStatus: string
  creatorId: string
  employerInvolved: string[] 
}

interface Employee {
  id: string
  name: string
  email: string
  role: string
  avatar: string 
  isCreator?: boolean
}

interface FileData {
  fileName: string
  contentType: string
  fileBytes: string 
}

interface CompanyWithEmployeesDTO {
  company: CompanyData
  attachment?: { companyLogo?: FileData }
  image?: { companyImages?: FileData[] }
  video?: { companyVideo?: FileData }
  employees: Employee[]
}

interface CompanyWithDataProps {
  companyId: number
}


interface CompanyMedia {
  logo: string
  images: string[]
  video: string
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (err) => reject(err)
  })
}

const validateFileSize = (file: File, maxSizeMB: number, fileType: string): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      alert(
        `${fileType} file size must not exceed ${maxSizeMB}MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      )
      return false
    }
    return true
}

  const validateTotalImageSize = (files: (File | null)[], newFile?: File, replaceIndex?: number): boolean => {
    let totalSize = 0
    files.forEach((file, index) => {
      if (file && index !== replaceIndex) {
        totalSize += file.size
      }
    })
    if (newFile) {
      totalSize += newFile.size
    }

    const maxTotalSizeMB = 10
    const maxTotalSizeBytes = maxTotalSizeMB * 1024 * 1024

    if (totalSize > maxTotalSizeBytes) {
      toast.error(
        `Total image files size must not exceed ${maxTotalSizeMB}MB. Current total: ${(totalSize / 1024 / 1024).toFixed(2)}MB`,
      )
      return false
    }
    return true
}


export default function CompanyWithData({ companyId }: CompanyWithDataProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<CompanyData | null>(null)
  const [editMedia, setEditMedia] = useState<CompanyMedia | null>(null)
  const [showAddEmployeeDialog, setShowAddEmployeeDialog] = useState(false)
  const [newEmployee, setNewEmployee] = useState({ name: "", email: "", role: "" })
  const [addEmployerSearch, setAddEmployerSearch] = useState('');
  const [availableEmployers, setAvailableEmployers] = useState<AvailableEmployer[]>([]);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [employersToAdd, setEmployersToAdd] = useState<string[]>([]);

  const [uploadedFiles, setUploadedFiles] = useState<{
    logo: File | null | undefined
    images: (File | null | undefined)[]
    video: File | null | undefined
  }>({
    logo: undefined,
    images: [null, null, null],
    video: undefined,
  })


  const [companyMedia, setCompanyMedia] = useState<CompanyMedia>({
    logo: "",
    images: [],
    video: "",
  })
  const [employees, setEmployees] = useState<Employee[]>([])
  const [companyData, setCompanyData] = useState<CompanyData>({
    companyId: 0,
    companyName: "",
    businessRegistrationNumber: "",
    registrationCountry: "",
    registrationDate: "",
    industryType: "",
    companySize: "",
    companyDescription: "",
    registeredCompanyAddress: "",
    businessPhoneNumber: "",
    businessEmail: "",
    officialWebsiteUrl: "",
    taxNumber: "",
    companyStatus: "verified",
    creatorId: "",
    employerInvolved: [],
  });

  const handleLeaveCompany = async () => {
    if (!companyData?.companyId) return;

    const response = await fetch(`${backendUrl}/api/company/${companyData.companyId}/leave`, {
      method: "PUT",
      credentials: "include",
    });

    if (response.ok) {
      toast.success("You left the company successfully.");
      window.location.reload();
    } else {
      toast.error("Failed to leave the company.");
    }
  };

  const cancelLeaveCompany = () =>{
    setShowLeaveCompanyConfirmation(false);
  }


  const [showLeaveCompanyConfirmation, setShowLeaveCompanyConfirmation] = useState(false);

  const [currentUserId, setCurrentUserId] = useState("")

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        setIsLoading(true)

        // Fetch current user
        const userRes = await fetch(`${backendUrl}/api/auth/me`, { credentials: "include" })
        const userData = await userRes.json()
        setCurrentUserId(userData.userId)

        // Fetch company info
        const res = await fetch(`${backendUrl}/api/company/${companyId}/company-info`, {
          credentials: "include",
        })
        if (!res.ok) throw new Error("Failed to fetch company data")

        const data: CompanyWithEmployeesDTO = await res.json()

        setCompanyData(data.company)
        setEmployees(
          data.employees.map((emp) => ({
            ...emp,
            isCreator: emp.id === data.company.creatorId, 
          })) || []
        )

        setCompanyMedia({
          logo: data.attachment?.companyLogo
            ? `data:${data.attachment.companyLogo.contentType};base64,${data.attachment.companyLogo.fileBytes}`
            : "", // fallback if no logo
          images: data.image?.companyImages?.map(
            (img) => `data:${img.contentType};base64,${img.fileBytes}`
          ) || [],
          video: data.video?.companyVideo
            ? `data:${data.video.companyVideo.contentType};base64,${data.video.companyVideo.fileBytes}`
            : "",
        });


        setEditData(data.company)
        setEditMedia({
          logo: data.attachment?.companyLogo
            ? `data:${data.attachment.companyLogo.contentType};base64,${data.attachment.companyLogo.fileBytes}`
            : "",
          images: data.image?.companyImages?.map(
            (img) => `data:${img.contentType};base64,${img.fileBytes}`
          ) || [],
          video: data.video?.companyVideo
            ? `data:${data.video.companyVideo.contentType};base64,${data.video.companyVideo.fileBytes}`
            : "",
        });
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompany()
  }, [companyId])

  useEffect(() => {
    if (showAddEmployeeDialog) {
      const fetchAvailableEmployers = async () => {
        try {
          const res = await fetch(`${backendUrl}/api/company/available-employers`, {
            credentials: "include",
          });
          if (!res.ok) throw new Error("Failed to fetch available employers");

          const data: AvailableEmployer[] = await res.json();
          setAvailableEmployers(data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchAvailableEmployers();
    }
  }, [showAddEmployeeDialog]);

  const isCreator = companyData?.creatorId === currentUserId
  const currentEmployee = employees.find((emp) => emp.id === currentUserId)

  const handleUpdateCompany = (updatedData: CompanyData) => {
    setCompanyData(updatedData)
    setEditData(updatedData)
    console.log("Company data updated:", updatedData)
  }

  const handleUpdateMedia = (updatedMedia: CompanyMedia) => {
    setCompanyMedia(updatedMedia) 
    setEditMedia(updatedMedia)   
    console.log("Media updated:", updatedMedia)
  }

  const handleCancel = () => {
    setEditData(companyData);
    setEditMedia(companyMedia);
    setUploadedFiles({
      logo: undefined,
      images: [null, null, null],
      video: undefined,
    });
    setIsEditing(false);
  };


  const handleAddEmployee = () => {
    const newEmployees = availableEmployers
      .filter(emp => employersToAdd.includes(emp.id))
      .map(emp => ({
        id: emp.id,
        name: emp.name,
        email: emp.username, 
        role: emp.role,
        avatar: emp.avatar || "",
      }));

    setEmployees(prev => [...prev, ...newEmployees]);

    setEditData(prev => prev ? {
      ...prev,
      employerInvolved: [...prev.employerInvolved, ...newEmployees.map(emp => emp.email)],
    } : prev);

    setCompanyData(prev => prev ? {
      ...prev,
      employerInvolved: [...prev.employerInvolved, ...newEmployees.map(emp => emp.email)],
    } : prev);

    setEmployersToAdd([]);
    setShowAddEmployeeDialog(false);
  };

  const handleRemoveEmployee = (employeeId: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));

    setEditData(prev =>
      prev
        ? {
            ...prev,
            employerInvolved: Array.isArray(prev.employerInvolved)
              ? prev.employerInvolved.filter(
                  email => email !== employees.find(e => e.id === employeeId)?.email
                )
              : [], // fallback if it's not an array
          }
        : prev
    );

    setCompanyData(prev =>
      prev
        ? {
            ...prev,
            employerInvolved: Array.isArray(prev.employerInvolved)
              ? prev.employerInvolved.filter(id => id !== employeeId)
              : [], // fallback if somehow not array
          }
        : prev
    );

    console.log("Employee removed:", employeeId);
  };

  const handleImageUpload = async (index: number, file: File) => {
    if (!validateFileSize(file, 5, "Image")) return;
    if (!validateTotalImageSize(uploadedFiles.images as (File | null)[], file, index)) return;

    const base64 = await fileToBase64(file);

    setEditMedia((prev) => {
      if (!prev) return { logo: "", images: [base64], video: "" };
      const newImages = [...prev.images];
      newImages[index] = base64;
      return { ...prev, images: newImages };
    });

    setUploadedFiles((prev) => {
      // explicitly type newImages so TS knows undefined is handled
      const newImages: (File | null | undefined)[] = [...prev.images];
      newImages[index] = file;
      return { ...prev, images: newImages };
    });

    console.log("Uploading image at index", index, file);
  };



  const handleVideoUpload = async (file: File) => {
    if (!validateFileSize(file, 12, "Video")) return

    const base64 = await fileToBase64(file)
    setEditMedia((prev) => (prev ? { ...prev, video: base64 } : { logo: "", images: [], video: base64 }))

    setUploadedFiles((prev) => ({ ...prev, video: file }))
  }

  const handleLogoUpload = async (file: File) => {
    if (!validateFileSize(file, 5, "Logo")) return

    const base64 = await fileToBase64(file)
    setEditMedia((prev) => (prev ? { ...prev, logo: base64 } : { logo: base64, images: [], video: "" }))

    setUploadedFiles((prev) => ({ ...prev, logo: file }))
  }

  const formatDateForInput = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleSave = async () => {
    if (editData && editMedia) {
      await handleSubmit()
      handleUpdateCompany(editData)
      handleUpdateMedia(editMedia)
      setIsEditing(false)
    }
  }

  const handleSubmit = async () => {
    if (!editData) return;

    // Always send IDs (not emails)
    const employerInvolvedToSend = employees
      .filter(emp => emp.id !== companyData.creatorId)
      .map(emp => emp.id)
      .join(',');

    try {
      const formData = new FormData();

      // --- Add company data (always) ---
      formData.append("companyId", editData.companyId.toString());
      formData.append("companyName", editData.companyName);
      formData.append("businessRegistrationNumber", editData.businessRegistrationNumber);
      formData.append("registrationCountry", editData.registrationCountry);
      formData.append("registrationDate", editData.registrationDate);
      formData.append("industryType", editData.industryType);
      formData.append("companySize", editData.companySize);
      formData.append("companyDescription", editData.companyDescription);
      formData.append("registeredCompanyAddress", editData.registeredCompanyAddress);
      formData.append("businessPhoneNumber", editData.businessPhoneNumber);
      formData.append("businessEmail", editData.businessEmail);
      formData.append("officialWebsiteUrl", editData.officialWebsiteUrl);
      formData.append("taxNumber", editData.taxNumber);
      formData.append("employerInvolved", employerInvolvedToSend);

      // --- Media handling ---
      // Logo
      if (uploadedFiles.logo instanceof File) {
        formData.append("companyLogo", uploadedFiles.logo);
      } else if (uploadedFiles.logo === null) {
        formData.append("removeLogo", "true");
      }

      // Images
      if (uploadedFiles.images.filter(f => f).length > 0) {
        uploadedFiles.images.forEach((file) => {
          if (file) formData.append("companyImage", file);  // <-- same key for all
        });
      } else if (editMedia?.images.every(img => !img)) {
        // user cleared all images
        formData.append("deleteImages", "true");
      }

      // Video
      // Add video file only if newly uploaded
      if (uploadedFiles.video instanceof File) {
        formData.append("companyVideo", uploadedFiles.video);
      } else if (uploadedFiles.video === null) {
        formData.append("deleteVideo", "true");
      }


      // --- Employees data (extra payload if backend needs it) ---
      formData.append("employees", JSON.stringify(employees));

      // Debugging output
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      console.log("Uploaded files state:", uploadedFiles.images);

      console.log("FormData prepared for submission:", {
        companyData: editData,
        hasLogo: uploadedFiles.logo instanceof File,
        removeLogo: uploadedFiles.logo === null,
        imageCount: uploadedFiles.images.filter((f) => f instanceof File).length,
        removedImages: uploadedFiles.images.filter((f) => f === null).length,
        hasVideo: uploadedFiles.video instanceof File,
        removeVideo: uploadedFiles.video === null,
        employeeCount: employees.length,
      });

      // --- API call ---
      const response = await fetch(`${backendUrl}/api/company/${companyId}/update`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        console.error("Error updating company:", await response.text());
      } else {
        toast.success("Company Information Updated Successfully.");
        // setTimeout(() => {
        //   window.location.reload();
        // }, 3000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error saving company data. Please try again.");
    }
  };


  if (isLoading || !companyData || !companyMedia) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading company data...</p>
        </div>
      </div>
    )
  }

  if (isEditing) {
    return (
      <div className="space-y-6 lg:min-w-5xl">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Company Information</h2>
            <p className="text-gray-600">Update your company details and media</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-black hover:bg-gray-800 text-white">
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Company Information Edit Form */}
        <Card className="border border-gray-200 bg-white rounded-xl">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName" className="mb-2">Company Name</Label>
                <Input
                  readOnly
                  id="companyName"
                  value={editData?.companyName || ""}
                  onChange={(e) => editData && setEditData({ ...editData, companyName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="businessRegistrationNumber" className="mb-2">Business Registration Number</Label>
                <Input
                  readOnly
                  id="businessRegistrationNumber"
                  value={editData?.businessRegistrationNumber || ""}
                  onChange={(e) => editData && setEditData({ ...editData, businessRegistrationNumber: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="registrationCountry" className="mb-2">Registration Country</Label>
                <Input
                  readOnly
                  id="registrationCountry"
                  value={editData?.registrationCountry || ""}
                  onChange={(e) => editData && setEditData({ ...editData, registrationCountry: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="registrationDate" className="mb-2">Registration Date</Label>
                <Input
                  readOnly
                  id="registrationDate"
                  type="date"
                  value={formatDateForInput(editData?.registrationDate) || ""}
                  onChange={(e) => editData && setEditData({ ...editData, registrationDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="industryType" className="mb-2">Industry Type</Label>
                <Input
                  id="industryType"
                  value={editData?.industryType || ""}
                  onChange={(e) => editData && setEditData({ ...editData, industryType: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="companySize" className="mb-2">Company Size</Label>
                  <Input
                    id="companySize"
                    type="text"
                    value={editData?.companySize || ""}
                    onChange={(e) =>
                      editData && setEditData({ ...editData, companySize: e.target.value })
                    }
                  />
              </div>
              <div>
                <Label htmlFor="businessPhoneNumber" className="mb-2">Business Phone</Label>
                <Input
                  id="businessPhoneNumber"
                  value={editData?.businessPhoneNumber || ""}
                  onChange={(e) => editData && setEditData({ ...editData, businessPhoneNumber: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="businessEmail" className="mb-2">Business Email</Label>
                <Input
                  id="businessEmail"
                  type="email"
                  value={editData?.businessEmail || ""}
                  onChange={(e) => editData && setEditData({ ...editData, businessEmail: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="officialWebsiteUrl" className="mb-2">Website URL</Label>
                <Input
                  id="officialWebsiteUrl"
                  value={editData?.officialWebsiteUrl || ""}
                  onChange={(e) => editData && setEditData({ ...editData, officialWebsiteUrl: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="taxNumber" className="mb-2">Tax Number</Label>
                <Input
                  id="taxNumber"
                  value={editData?.taxNumber || ""}
                  onChange={(e) => editData && setEditData({ ...editData, taxNumber: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="registeredCompanyAddress" className="mb-2">Registered Address</Label>
              <Textarea
                id="registeredCompanyAddress"
                value={editData?.registeredCompanyAddress || ""}
                onChange={(e) => editData && setEditData({ ...editData, registeredCompanyAddress: e.target.value })}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="companyDescription" className="mb-2">Company Description</Label>
              <Textarea
                id="companyDescription"
                value={editData?.companyDescription || ""}
                onChange={(e) => editData && setEditData({ ...editData, companyDescription: e.target.value })}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Media Management */}
        <Card className="border border-gray-200 bg-white rounded-xl">
          <CardHeader>
            <CardTitle>Company Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Upload */}
            <div>
              <Label>Company Logo</Label>
              <div className="flex items-center gap-4 mt-2">
                <img
                  src={editMedia?.logo || "/placeholder.svg"}
                  alt="Logo"
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => document.getElementById("logo-upload")?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Logo
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (editMedia) setEditMedia({ ...editMedia, logo: "" })
                      setUploadedFiles((prev) => ({ ...prev, logo: undefined }))
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])}
                />
              </div>
            </div>

            {/* Images Upload (3 max) */}
            <div>
              <Label>Company Images (Max 3)</Label>
              <div className="grid grid-cols-3 gap-4 mt-2">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {editMedia?.images[index] ? (
                      <div className="relative">
                        <img
                          src={editMedia.images[index] || "/public/images/placeholder.jpg"}
                          alt={`Company image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2 bg-white"
                          onClick={() => {
                            if (editMedia) {
                              const newImages = [...editMedia.images]
                              newImages[index] = ""
                              setEditMedia({ ...editMedia, images: newImages })
                            }
                            setUploadedFiles((prev) => {
                              const newImages = [...prev.images]
                              newImages[index] = null
                              return { ...prev, images: newImages }
                            })
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="cursor-pointer"
                        onClick={() => document.getElementById(`image-upload-${index}`)?.click()}
                      >
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Upload Image</p>
                      </div>
                    )}
                    <input
                      id={`image-upload-${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(index, e.target.files[0])}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Video Upload */}
            <div>
              <Label>Company Video</Label>
              <div className="flex items-center gap-4 mt-2">
                {editMedia?.video && (
                  <video
                    src={editMedia.video}
                    className="w-32 h-20 object-cover rounded-lg"
                    controls
                  />
                )}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => document.getElementById("video-upload")?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Video
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (editMedia) setEditMedia({ ...editMedia, video: "" });
                      setUploadedFiles((prev) => ({ ...prev, video: undefined }));
                      
                      // Reset file input
                      const input = document.getElementById("video-upload") as HTMLInputElement;
                      if (input) input.value = "";
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleVideoUpload(e.target.files[0])}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Management (Creator Only) */}
        {isCreator && (
          <Card className="border border-gray-200 bg-white rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management
                </span>
                <Dialog open={showAddEmployeeDialog} onOpenChange={setShowAddEmployeeDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-black hover:bg-gray-800 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                      <div className="space-y-4">
                        {/* Search Input */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Search employers..."
                            value={addEmployerSearch}
                            onChange={(e) => setAddEmployerSearch(e.target.value)}
                            className="pl-10"
                          />
                        </div>

                        {/* Selected Users */}
                        {employersToAdd.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {employersToAdd.map(userId => {
                              const user = availableEmployers.find(u => u.id === userId);
                              return user ? (
                                <div
                                  key={userId}
                                  className="flex items-center gap-1 bg-black text-white px-2 py-1 rounded-full text-sm"
                                >
                                  <span>{user.name}</span>
                                  <button
                                    onClick={() => {
                                      console.log("Removing user from selection:", userId);
                                      setEmployersToAdd(prev => {
                                        const newState = prev.filter(id => id !== userId);
                                        console.log("employersToAdd after remove:", newState);
                                        return newState;
                                      });
                                    }}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : null;
                            })}
                          </div>
                        )}

                        {/* Available Employers List */}
                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {availableEmployers
                              .filter(employer =>
                                (employer.name?.toLowerCase().includes(addEmployerSearch.toLowerCase()) ||
                                employer.username?.toLowerCase().includes(addEmployerSearch.toLowerCase()) ||
                                employer.id.toLowerCase().includes(addEmployerSearch.toLowerCase()))
                              )
                            .map(employer => (
                              <div
                                key={employer.id}
                                onClick={() => {
                                  if (!employersToAdd.includes(employer.id)) {
                                    setEmployersToAdd(prev => {
                                      const newState = [...prev, employer.id];
                                      return newState;
                                    });
                                  }
                                }}
                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                                  employersToAdd.includes(employer.id)
                                    ? 'bg-gray-50 border border-gray-300'
                                    : 'hover:bg-gray-50'
                                }`}
                              >
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                  {employer.avatar ? (
                                    <img
                                      src={employer.avatar}
                                      alt={`${employer.name} avatar`}
                                      className="w-full h-full object-cover rounded-full"
                                    />
                                  ) : (
                                    <span className="text-xs font-semibold text-gray-700">
                                      {employer.name ? employer.name.charAt(0).toUpperCase() : '?'}
                                    </span>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-sm truncate">
                                    {employer.name}
                                    <span className="text-gray-500 text-xs ml-1">@{employer.username}</span>
                                  </p>
                                  <p className="text-xs text-gray-500">Id: {employer.id}</p>
                                </div>
                                {employersToAdd.includes(employer.id) && (
                                  <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs">✓</span>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowAddEmployeeDialog(false);
                            }}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              console.log("Add Users button clicked. Final employersToAdd:", employersToAdd);
                              handleAddEmployee();
                            }}
                            disabled={employersToAdd.length === 0}
                            className="flex-1 bg-black hover:bg-black"
                          >
                            Add Users
                          </Button>
                        </div>
                      </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={employee.avatar || "/public/images/placeholder.jpg"} />
                        <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-gray-600">{employee.email}</p>
                        <p className="text-xs text-gray-500 capitalize">{employee.role}</p>
                      </div>
                      {employee.id === companyData.creatorId && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Creator</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {employee.id !== companyData.creatorId && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveEmployee(employee.id)}
                            className="text-red-600 hover:text-red-700"
                            title="Remove User"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }
  // View Mode
  return (
    <div className="space-y-6 lg:min-w-5xl">
      {/* Company Header */}
      <Card className="border border-gray-200 bg-white rounded-xl ">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
            <div className="flex items-start gap-6">
              <Avatar className="w-20 h-20">
                <AvatarImage src={companyMedia.logo || "/public/images/placeholder.jpg"} />
                <AvatarFallback>{companyData?.companyName?.charAt(0) || "C"}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{companyData?.companyName}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {companyData?.industryType}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {companyData?.registrationCountry}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {companyData?.companySize}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      companyData?.companyStatus === "verified"
                        ? "bg-green-100 text-green-800"
                        : companyData?.companyStatus === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                  {companyData?.companyStatus
                    ? companyData.companyStatus.charAt(0).toUpperCase() + companyData.companyStatus.slice(1)
                    : ""}
                  </span>
                </div>
              </div>
            </div>

            {isCreator && (
              <Button onClick={() => setIsEditing(true)} className="bg-black hover:bg-gray-800 text-white">
                <Edit className="w-4 h-4 mr-2" />
                Edit Company
              </Button>
            )}
            {!isCreator && (
                <Button variant="outline" className="border-gray-300 hover:bg-gray-50 rounded-lg bg-transparent"
                  onClick={() => setShowLeaveCompanyConfirmation(true)}
                >
                  Leave Company
                </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Company Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Company Information */}
        <Card className="border border-gray-200 bg-white rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-600">Registration Number</p>
                  <p className="font-medium">{companyData?.businessRegistrationNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-600">Registration Date</p>
                  <p className="font-medium">
                    {companyData?.registrationDate
                      ? new Date(companyData.registrationDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-600">Website</p>
                  <a href={companyData?.officialWebsiteUrl} className="font-medium text-blue-600 hover:underline">
                    {companyData?.officialWebsiteUrl}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-600">Business Email</p>
                  <p className="font-medium">{companyData?.businessEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-medium">{companyData?.businessPhoneNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-gray-600">Tax Number</p>
                  <p className="font-medium">{companyData?.taxNumber}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-2">Description</p>
              <p className="font-medium">{companyData?.companyDescription}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-2">Registered Address</p>
              <p className="font-medium">{companyData?.registeredCompanyAddress}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Company Media */}
      {companyMedia && (companyMedia.images?.some((img) => img) || companyMedia.video) && (
        <Card className="border border-gray-200 bg-white rounded-xl">
          <CardHeader>
            <CardTitle>Company Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {companyMedia.images?.some((img) => img) && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Company Images</p>
                  <div className="grid grid-cols-3 gap-4">
                    {companyMedia.images
                      .filter((img) => img)
                      .map((image, index) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`Company image ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                  </div>
                </div>
              )}
              {companyMedia.video && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Company Video</p>
                  <video src={companyMedia.video} className="w-full max-w-md h-48 object-cover rounded-lg" controls />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Members */}
      <Card className="border border-gray-200 bg-white rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Members ({employees.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {employees.map((employee) => (
              <div key={employee.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={employee.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-xs text-gray-500"># {employee.email}</p>
                  <p className="text-xs text-gray-600 capitalize">{employee.role}</p>
                </div>
                {employee.id === companyData?.creatorId && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Creator</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

        <AlertDialog open={showLeaveCompanyConfirmation} onOpenChange={setShowLeaveCompanyConfirmation}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Leave Company</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to leave{" "}
                <span className="font-medium">{companyData.companyName || companyData.companyId || "this company"}</span>?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelLeaveCompany}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLeaveCompany} className="bg-red-600 hover:bg-red-700 focus:ring-red-600">
                Leave Company
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog> 

    </div>
  )
}
