"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation"; 
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LayoutDashboard,
  MessageCircle,
  Search,
  Star,
  Briefcase,
  FileText,
  Menu,
  ArrowLeft,
  LogOut,
  Settings,
  CreditCard,
  LifeBuoy,
  ChevronRight,
  User,
  Crown,
  Shield,
  ExternalLink,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "/dashboard/freelancer",
  },
  {
    icon: MessageCircle,
    label: "Messages",
    href: "/dashboard/freelancer/chat",
  },
  {
    icon: Search,
    label: "Job Search",
    href: "/dashboard/freelancer/job-search",
  },
  {
    icon: Star,
    label: "Recommended",
    href: "/dashboard/freelancer/job-recommend",
  },
  {
    icon: Briefcase,
    label: "My Jobs",
    href: "/dashboard/freelancer/my-job",
  },
  {
    icon: FileText,
    label: "Applications",
    href: "/dashboard/freelancer/my-application",
  },
  {
    icon: LifeBuoy,
    label: "Support Ticket",
    href: "/dashboard/freelancer/support-ticket",
  },
];

interface HoverSidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

function LogoutDialog({
  children,
  onConfirm,
}: {
  children: React.ReactNode;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to log out? You will be redirected to the
            login page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Logout</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface FreelancerNavInfo {
  userId: string;
  email: string;
  username: string;
  isPremium: boolean;
  profilePicture?: string;
  profilePictureMimeType?: string;
}

export default function HoverSidebar({
  isMobileOpen = false,
  onMobileClose,
}: HoverSidebarProps) {
  const router = useRouter(); // Added router
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(isMobileOpen);
  const [showMoreSettings, setShowMoreSettings] = useState(false);
  const [formData, setFormData] = useState<FreelancerNavInfo | null>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/auth/freelancer/nav-info`, {
          credentials: "include",
        })
        if (!res.ok) {
          return
        }
        const data = await res.json()
        setFormData(data)
      } catch (err) {
        console.error("Error fetching profile:", err)
      }
    }
    fetchProfile()
  }, [backendUrl])

  let userPlan = "default";

  if(formData?.isPremium) {
    userPlan = "premium";
  }else{
    userPlan = "default";
  }

  const handleMobileToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMobileClose = () => {
    setMobileOpen(false);
    onMobileClose?.();
  };

  const toggleMoreSettings = () => {
    setShowMoreSettings(!showMoreSettings);
  };

  const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleLogout = async () => {
    try {
      await fetch(`${backendURL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/login/freelancer";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleStripeExpressClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch(`${backendUrl}/api/stripe/express-login`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to get Stripe login URL");

      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
      } else {
        console.error("No login URL returned");
      }
    } catch (err) {
      console.error("Error fetching Stripe login link:", err);
    }
  };

  const settingsMenuItems = [
    {
      icon: User,
      label: "My Profile",
      href: "/dashboard/freelancer/profile",
    },
    {
      icon: CreditCard,
      label: "Subscription",
      href: "/dashboard/freelancer/subscription",
    },
    {
      icon: ExternalLink,
      label: "Stripe Express",
      onClick: handleStripeExpressClick,
    },
  ];

  return (
    <TooltipProvider>
      {/* Mobile Menu Trigger - Only visible on mobile/tablet */}
      <Button
        onClick={handleMobileToggle}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 shadow-lg rounded-xl p-3"
        size="icon"
      >
        <Menu className="w-5 h-5" />
      </Button>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleMobileClose}
      />
      <div
        className={`fixed left-0 top-0 h-full bg-white border-r-2 border-gray-100 shadow-2xl transition-all duration-300 ease-in-out z-50 flex flex-col
          ${isHovered ? "w-72" : "w-20"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 hidden md:flex`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b-2 border-gray-100 h-18 flex items-center">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 bg-white flex items-center justify-center flex-shrink-0 -ml-2">
              <img src="/icons/nav-icon.png" className="w-12 h-9 text-white" />
            </div>
            <div
              className={`transition-all duration-300 overflow-hidden ${
                isHovered || mobileOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
              }`}
            >
              <h2 className="font-black text-gray-900 text-lg whitespace-nowrap">
                GigsUniverse
              </h2>
              <div className="flex items-center gap-2">
                <Badge className="bg-gray-100 text-gray-700 border-gray-300 text-xs font-medium rounded-lg">
                  Freelancer
                </Badge>
                <div className="flex items-center gap-1">
                  <Badge className="bg-black text-white text-xs font-medium rounded-lg border-0 flex items-center gap-1">
                    {userPlan === "premium" ? (
                      <>
                        <Crown className="w-3 h-3" />
                        Premium
                      </>
                    ) : (
                      <>
                        <Shield className="w-3 h-3" />
                        Default
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Navigation Menu */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const MenuItem = (
              <Button
                asChild
                variant="ghost"
                className={`group relative w-full h-12 rounded-2xl transition-all duration-300 hover:scale-105 ${
                  isActive
                    ? "bg-black text-white shadow-lg"
                    : "text-gray-600 hover:text-black hover:bg-gray-100"
                } ${
                  isHovered || mobileOpen
                    ? "justify-start px-4"
                    : "justify-center px-2"
                }`}
              >
                <a
                  href={item.href}
                  className="flex items-center gap-4 min-w-0"
                  onClick={handleMobileClose}
                >
                  <div
                    className={`ml-3 p-2 rounded-xl transition-all duration-300 flex-shrink-0 ${
                      isActive
                        ? isHovered || mobileOpen
                          ? "bg-white/20"
                          : "bg-black/90"
                        : "bg-transparent group-hover:bg-gray-200"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${
                        isActive
                          ? "text-white"
                          : "text-gray-600 group-hover:text-black"
                      }`}
                    />
                  </div>
                  <div
                    className={`flex items-center gap-2 transition-all duration-300 overflow-hidden ${
                      isHovered || mobileOpen
                        ? "opacity-100 w-auto"
                        : "opacity-0 w-0"
                    }`}
                  >
                    <span className="font-semibold whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>
                </a>
              </Button>
            );
            if (!isHovered && !mobileOpen) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{MenuItem}</TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-black text-white rounded-xl"
                  >
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            }
            return <div key={item.href}>{MenuItem}</div>;
          })}
        </div>
        {/* User Profile Section */}
        <div className="mt-auto border-t border-gray-100">
          {/* For collapsed state */}
          {!isHovered && (
            <div className="p-4 flex flex-col items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                      {formData?.profilePicture && formData?.profilePictureMimeType ? (
                        <img
                          src={`data:${formData.profilePictureMimeType};base64,${formData.profilePicture}`}
                          alt="Profile"
                          className="w-full h-full object-cover"
                          style={{ borderRadius: "50%" }}
                        />
                      ) : (
                        <img
                          src="/public/images/placeholder.jpg"
                          alt="Profile"
                          className="w-full h-full object-cover"
                          style={{ borderRadius: "50%" }}
                        />
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-black text-white rounded-xl"
                >
                  <p>{formData?.username}</p>
                </TooltipContent>
              </Tooltip>
              <div className="mt-2 flex flex-col gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-8 h-8 rounded-xl"
                    >
                      <Settings className="w-4 h-4 text-gray-600" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="right"
                    className="bg-black text-white rounded-xl"
                  >
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>

                <LogoutDialog onConfirm={handleLogout}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="w-8 h-8 rounded-xl"
                      >
                        <LogOut className="w-4 h-4 text-gray-600" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="bg-black text-white rounded-xl"
                    >
                      <p>Logout</p>
                    </TooltipContent>
                  </Tooltip>
                </LogoutDialog>
              </div>
            </div>
          )}
          {/* For expanded state */}
          <div
            className={`p-4 transition-all duration-300 overflow-hidden ${
              isHovered ? "opacity-100 max-h-96" : "opacity-0 max-h-0 hidden"
            }`}
          >
            <div className="flex items-center gap-3 p-2">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                    {formData?.profilePicture && formData?.profilePictureMimeType ? (
                      <img
                        src={`data:${formData.profilePictureMimeType};base64,${formData.profilePicture}`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        style={{ borderRadius: "50%" }}
                      />
                    ) : (
                      <img
                        src="/public/images/placeholder.jpg"
                        alt="Profile"
                        className="w-full h-full object-cover"
                        style={{ borderRadius: "50%" }}
                      />
                    )}
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 truncate">
                  {formData?.username}
                </h4>
                <p className="text-xs text-gray-500 truncate">
                 {formData?.email}
                </p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <div className="relative">
                <Button
                  variant="ghost"
                  className="w-full justify-between text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl h-9"
                  onClick={toggleMoreSettings}
                >
                  <div className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    <span className="text-sm">More Settings</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      showMoreSettings ? "rotate-90" : ""
                    }`}
                  />
                </Button>
                {/* Dropdown menu */}
                <div
                  className={`mt-1 pl-6 space-y-1 overflow-hidden transition-all duration-200 ${
                    showMoreSettings
                      ? "max-h-40 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {settingsMenuItems.map((item) => {
                    // Handle Stripe Express differently
                    if (item.label === "Stripe Express") {
                      return (
                        <Button
                          key={item.label}
                          variant="ghost"
                          className="w-full justify-start rounded-xl h-8 text-sm text-gray-600 hover:text-black hover:bg-gray-100"
                          onClick={(e) => {
                            handleMobileClose?.();
                            item.onClick?.(e);
                          }}
                        >
                          <item.icon className="w-3.5 h-3.5 mr-2" />
                          <span>{item.label}</span>
                        </Button>
                      );
                    }
                    
                    // Handle other menu items normally
                    const isActive = pathname === item.href;
                    return (
                      <Button
                        key={item.href}
                        asChild
                        variant="ghost"
                        className={`w-full justify-start rounded-xl h-8 text-sm ${
                          isActive
                            ? "bg-black text-white"
                            : "text-gray-600 hover:text-black hover:bg-gray-100"
                        }`}
                      >
                        <a href={item.href} onClick={handleMobileClose}>
                          <item.icon
                            className={`w-3.5 h-3.5 mr-2 ${
                              isActive ? "text-white" : ""
                            }`}
                          />
                          <span>{item.label}</span>
                        </a>
                      </Button>
                    );
                  })}
                </div>
              </div>
              <LogoutDialog onConfirm={handleLogout}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl h-9"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="text-sm">Logout</span>
                </Button>
              </LogoutDialog>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Drawer - Only visible on mobile/tablet */}
      <div
        className={`fixed left-0 top-0 h-full bg-white border-r-2 border-gray-100 shadow-2xl transition-all duration-300 ease-in-out z-50 w-72 md:hidden flex flex-col
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Mobile Drawer Header with Close Button */}
        <div className="p-6 border-b-2 border-gray-100 h-18 flex items-center justify-between relative">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 bg-white flex items-center justify-center flex-shrink-0 -ml-2">
              <img
                src="/icons/nav-icon.png"
                className="w-12 h-9 text-white"
                alt="Navigation Icon"
              />
            </div>
            <div>
              <h2 className="font-black text-gray-900 text-lg whitespace-nowrap">
                GigsUniverse
              </h2>
              <div className="flex items-center gap-2">
                <Badge className="bg-gray-100 text-gray-700 border-gray-300 text-xs font-medium rounded-lg">
                  Freelancer
                </Badge>
                <div className="flex items-center gap-1">
                  <Badge className="bg-black text-white text-xs font-medium rounded-lg border-0 flex items-center gap-1">
                    {userPlan === "premium" ? (
                      <>
                        <Crown className="w-3 h-3" />
                        Premium
                      </>
                    ) : (
                      <>
                        <Shield className="w-3 h-3" />
                        Default
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
          {/* Close Button - Circular and extending to the right - Only show when open */}
          {mobileOpen && (
            <div className="absolute -right-5 top-1/2 transform -translate-y-1/2">
              <Button
                onClick={handleMobileClose}
                size="icon"
                className="w-10 h-10 rounded-full bg-white border-2 text-gray-700 hover:bg-gray-50 shadow-xl transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
        {/* Mobile Navigation Menu */}
        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.href}
                asChild
                variant="ghost"
                className={`group relative w-full h-12 rounded-2xl transition-all duration-300 hover:scale-105 justify-start px-4 ${
                  isActive
                    ? "bg-black text-white shadow-lg"
                    : "text-gray-600 hover:text-black hover:bg-gray-100"
                }`}
              >
                <a
                  href={item.href}
                  className="flex items-center gap-4 min-w-0"
                  onClick={handleMobileClose}
                >
                  <div
                    className={`ml-3 p-2 rounded-xl transition-all duration-300 flex-shrink-0 ${
                      isActive
                        ? "bg-white/20"
                        : "bg-transparent group-hover:bg-gray-200"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${
                        isActive
                          ? "text-white"
                          : "text-gray-600 group-hover:text-black"
                      }`}
                    />
                  </div>
                  <span className="font-semibold whitespace-nowrap">
                    {item.label}
                  </span>
                </a>
              </Button>
            );
          })}
        </div>
        {/* Mobile User Profile Section */}
        <div className="mt-auto border-t border-gray-100 p-4">
          <div className="flex items-center gap-3 p-2">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden">
                {formData?.profilePicture && formData?.profilePictureMimeType ? (
                  <img
                    src={`data:${formData.profilePictureMimeType};base64,${formData.profilePicture}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    style={{ borderRadius: "50%" }}
                  />
                ) : (
                  <img
                    src="/public/images/placeholder.jpg"
                    alt="Profile"
                    className="w-full h-full object-cover"
                    style={{ borderRadius: "50%" }}
                  />
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 truncate">{formData?.username}</h4>
              <p className="text-xs text-gray-500 truncate">
                {formData?.email}
              </p>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <div className="relative">
              <Button
                variant="ghost"
                className="w-full justify-between text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl h-9"
                onClick={toggleMoreSettings}
              >
                <div className="flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  <span className="text-sm">More Settings</span>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    showMoreSettings ? "rotate-90" : ""
                  }`}
                />
              </Button>
              {/* Dropdown menu */}
              <div
                className={`mt-1 pl-6 space-y-1 overflow-hidden transition-all duration-200 ${
                  showMoreSettings
                    ? "max-h-32 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {settingsMenuItems.map((item) => {
                  if (item.label === "Stripe Express") {
                    return (
                      <Button
                        key={item.label}
                        variant="ghost"
                        className="w-full justify-start rounded-xl h-8 text-sm text-gray-600 hover:text-black hover:bg-gray-100"
                        onClick={(e) => {
                          handleMobileClose?.();
                          item.onClick?.(e);
                        }}
                      >
                        <item.icon className="w-3.5 h-3.5 mr-2" />
                        <span>{item.label}</span>
                      </Button>
                    );
                  }
                  
                  // Handle other menu items normally
                  const isActive = pathname === item.href;
                  return (
                    <Button
                      key={item.href}
                      asChild
                      variant="ghost"
                      className={`w-full justify-start rounded-xl h-8 text-sm ${
                        isActive
                          ? "bg-black text-white"
                          : "text-gray-600 hover:text-black hover:bg-gray-100"
                      }`}
                    >
                      <a href={item.href} onClick={handleMobileClose}>
                        <item.icon
                          className={`w-3.5 h-3.5 mr-2 ${
                            isActive ? "text-white" : ""
                          }`}
                        />
                        <span>{item.label}</span>
                      </a>
                    </Button>
                  );
                })}
              </div>
            </div>
            {/* Logout Button for mobile drawer */}
            <LogoutDialog onConfirm={handleLogout}>
              <Button
                variant="ghost"
                className="w-full justify-start text-gray-600 hover:text-black hover:bg-gray-100 rounded-xl h-9"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="text-sm">Logout</span>
              </Button>
            </LogoutDialog>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}