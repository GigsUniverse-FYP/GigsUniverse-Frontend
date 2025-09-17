"use client";

// @ts-nocheck
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Phone, Mail, Globe, Calendar, Users } from "lucide-react";

type Company = {
  id: string;
  name: string;
  industry: string;
  logo?: string | null;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  founded?: string;
  employees?: string | number;
  description?: string;
  images?: string[];
  videos?: { src: string }[];
};

interface CompanyDialogProps {
  companyId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CompanyDialog({ companyId, open, onOpenChange }: CompanyDialogProps) {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (companyId && open) {
      setLoading(true);
      fetch(`${backendUrl}/api/company/get-company-info/${companyId}`, {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch company info");
          return res.json();
        })
        .then((dto) => {
          const c = dto.company;

          const mapped: Company = {
            id: c.companyId,
            name: c.companyName,
            logo: dto.attachment?.companyLogo
              ? `data:${dto.attachment.companyLogo.contentType};base64,${dto.attachment.companyLogo.fileBytes}`
              : null,
            industry: c.industryType,
            address: c.registeredCompanyAddress || "N/A",
            phone: c.businessPhoneNumber,
            email: c.businessEmail,
            website: c.officialWebsiteUrl || "",
            founded: c.registrationDate
              ? new Date(c.registrationDate).toISOString().split("T")[0]
              : "N/A",
            employees: c.companySize || "N/A",
            description: c.companyDescription,
            images:
              dto.image?.companyImages?.map(
                (img: any) =>
                  `data:${img.contentType};base64,${img.fileBytes}`
              ) || [],
            videos: dto.video?.companyVideo
              ? [
                  {
                    src: `data:${dto.video.companyVideo.contentType};base64,${dto.video.companyVideo.fileBytes}`,
                  },
                ]
              : [],
          };

          setCompany(mapped);
        })
        .catch((err) => {
          console.error("Error fetching company info:", err);
          setCompany(null);
        })
        .finally(() => setLoading(false));
    } else {
      setCompany(null);
    }
  }, [companyId, open, backendUrl]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {loading ? (
          <>
            <DialogHeader>
              <DialogTitle>Loading...</DialogTitle>
            </DialogHeader>
            <p className="text-center py-10">Loading...</p>
          </>
        ) : company ? (
          <>
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage
                      src={company.logo || "/images/placeholder.jpg"}
                    />
                    <AvatarFallback>
                      {company.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-2xl">
                      {company.name}
                    </DialogTitle>
                    <p className="text-gray-600">{company.industry}</p>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-6 mt-6">
              {/* Company Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Company Information</h3>
                  <div className="space-y-3 text-sm">
                    {company.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{company.address}</span>
                      </div>
                    )}
                    {company.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{company.phone}</span>
                      </div>
                    )}
                    {company.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{company.email}</span>
                      </div>
                    )}
                    {company.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <a
                          href={company.website}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {company.website}
                        </a>
                      </div>
                    )}
                    {company.founded && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>Founded in {company.founded}</span>
                      </div>
                    )}
                    {company.employees && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>{company.employees} employees</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">About</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {company.description}
                  </p>
                </div>
              </div>

              {/* Images */}
              {company.images && company.images.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Office Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {company.images.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-video bg-gray-100 rounded-lg overflow-hidden"
                      >
                        <img
                          src={image || "/images/placeholder.jpg"}
                          alt={`Office ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Videos */}
              {company.videos && company.videos.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Company Videos</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {company.videos.map((video, index) => (
                      <video key={index} controls className="w-full rounded-lg">
                        <source src={video.src} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>No company found</DialogTitle>
            </DialogHeader>
            <p className="text-center py-10">No company found.</p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
