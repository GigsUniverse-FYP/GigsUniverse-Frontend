"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DollarSign, Plus, Timer } from "lucide-react"
import Link from "next/link"


interface HiredFreelancer {
  id: string; // contractId
  name: string; // freelancer name
  freelancerId: string;
  avatar: string | null;
  hourlyRate: number;
  totalHours: number;
  contract: {
    contractId: string;
    jobId: string;
    companyName: string;
    jobName: string;
    employerId: string;
    employerName: string;
    startDate: string;
    endDate: string;
    status: string;
  };
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}
  
export default function HiredFreelancersPage() {
  const [showTaskModal, setShowTaskModal] = useState(false)

  const [hiredFreelancers, setHiredFreelancers] = useState<HiredFreelancer[]>([])

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/hired-freelancers/employer-view`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data = await res.json();

        // Map backend response to frontend interface
        const mapped: HiredFreelancer[] = data.map((item: any) => ({
          id: item.contractId,
          name: item.freelancerName,
          freelancerId: item.freelancerId,
          avatar: item.avatar || null,
          hourlyRate: item.hourlyRate || 0,
          totalHours: item.totalHours || 0,
          contract: {
            contractId: item.contractId,
            jobId: item.jobId,
            companyName: item.companyName || "",
            jobName: item.jobName || "",
            employerId: item.employerId || "",
            employerName: item.employerName || "",
            startDate: item.startDate,
            endDate: item.endDate,
            status: item.status,
          },
        }));

        setHiredFreelancers(mapped);
        console.log(mapped);
      } catch (err: any) {
        console.error(err.message);
      }
    };

    fetchContracts();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border border-green-200"
      case "upcoming":
        return "bg-blue-100 text-blue-800 border border-blue-200"
      case "completed":
        return "bg-gray-100 text-gray-800 border border-gray-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200"
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hired Freelancers</h1>
        <p className="text-gray-600">Manage your freelancer contracts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hiredFreelancers.map((freelancer) => (
          <Card key={freelancer.id} className="border border-gray-200 shadow-sm bg-white rounded-lg min-w-xs">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  {freelancer.avatar ? (
                    <img src={freelancer.avatar} alt={freelancer.name} className="w-12 h-12 rounded-lg" />
                  ) : (
                    <span className="text-gray-600 font-medium">{freelancer.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{freelancer.name}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">{freelancer.hourlyRate}/hour</span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Timer className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">Contributing {freelancer.totalHours} hours/week</span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">{freelancer.contract.jobName}</p>
                  <Badge className={getStatusColor(freelancer.contract.status)}>
                    {freelancer.contract.status.charAt(0).toUpperCase() + freelancer.contract.status.slice(1)}
                  </Badge>
                </div>

                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Contract ID:</span>
                    <span className="font-medium">{freelancer.contract.contractId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Job ID:</span>
                    <span className="font-medium">{freelancer.contract.jobId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Employer:</span>
                    <span className="font-medium">{freelancer.contract.employerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Company Name:</span>
                    <span className="font-medium">{freelancer.contract.companyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Start:</span>
                    <span className="font-medium">{formatDate(freelancer.contract.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>End:</span>
                    <span className="font-medium">{formatDate(freelancer.contract.endDate)}</span>
                  </div>
                </div>
              </div>

              {freelancer.contract.status === "active" && (
                  <Link
                    href={{
                      pathname: `/dashboard/employer/hired-freelancer/task`,
                      query: {
                        contractId: freelancer.contract.contractId,
                        freelancerId: freelancer.freelancerId,
                        jobId: freelancer.contract.jobId,
                        employerId: freelancer.contract.employerId,
                        hourlyRate: freelancer.hourlyRate,
                      },
                    }}
                  >
                  <Button
                    className="w-full bg-black hover:bg-gray-800 text-white h-9 rounded-lg text-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Assign Task
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  )
}