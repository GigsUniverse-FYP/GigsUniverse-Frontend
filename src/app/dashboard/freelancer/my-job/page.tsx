"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DollarSign, Plus, Star, Timer } from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";

interface HiredFreelancer {
  id: string; // contractId
  name: string; // freelancer name
  freelancerId: string;
  hourlyRate: number;
  totalHours: number;
  freelancerFeedback: boolean;
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
  const date = new Date(dateStr);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export default function HiredFreelancersPage() {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showCompleteContract, setShowCompleteContract] = useState(false);
  const [ratingData, setRatingData] = useState({
    rating: 0,
    feedback: "",
    freelancerId: "",
    employerId: "",
    jobId: "",
    contractId: "",
  });

  const [showTaskModal, setShowTaskModal] = useState(false);

  const [hiredFreelancers, setHiredFreelancers] = useState<HiredFreelancer[]>(
    []
  );

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/api/hired-freelancers/freelancer-view`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data = await res.json();

        // Map backend response to frontend interface
        const mapped: HiredFreelancer[] = data.map((item: any) => ({
          id: item.contractId,
          name: item.name,
          freelancerId: item.freelancerId,
          hourlyRate: item.hourlyRate || 0,
          totalHours: item.totalHours || 0,
          freelancerFeedback: item.freelancerFeedback || false,
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
        return "bg-green-100 text-green-800 border border-green-200";
      case "upcoming":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  const handleAssignTask = () => {
    setShowTaskModal(true);
  };

  const handleCompleteContract = async () => {
    if (!ratingData.contractId) return;

    try {
      const res = await fetch(
        `${backendUrl}/api/contracts/complete/freelancer/${ratingData.contractId}`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(ratingData),
        }
      );

      if (!res.ok) throw new Error("Failed to complete contract");

      toast.success("Contract completed and feedback submitted successfully");

      // Close modal and reset ratingData
      setShowCompleteContract(false);
      setRatingData({
        rating: 0,
        feedback: "",
        freelancerId: "",
        employerId: "",
        jobId: "",
        contractId: "",
      });

      setHiredFreelancers(prev =>
        prev.map(f => {
          if (f.contract.contractId === ratingData.contractId) {
            return {
              ...f,
              contract: { ...f.contract, status: "completed" },
              freelancerFeedback: true,
            };
          }
          return f;
        })
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to complete contract");
    }
  };



  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Jobs</h1>
        <p className="text-gray-600">Overview and Handle Your Jobs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hiredFreelancers.map((freelancer) => (
          <Card
            key={freelancer.id}
            className="border border-gray-200 shadow-sm bg-white rounded-lg min-w-xs"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">
                    {freelancer.contract.jobName}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">
                  {freelancer.hourlyRate}/hour
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Timer className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">
                  Contributing {freelancer.totalHours} hours/week
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    {freelancer.name}
                  </p>
                  <Badge className={getStatusColor(freelancer.contract.status)}>
                    {freelancer.contract.status.charAt(0).toUpperCase() +
                      freelancer.contract.status.slice(1)}
                  </Badge>
                </div>

                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Contract ID:</span>
                    <span className="font-medium">
                      {freelancer.contract.contractId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Job ID:</span>
                    <span className="font-medium">
                      {freelancer.contract.jobId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Employer:</span>
                    <span className="font-medium">
                      {freelancer.contract.employerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Company Name:</span>
                    <span className="font-medium">
                      {freelancer.contract.companyName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Start:</span>
                    <span className="font-medium">
                      {formatDate(freelancer.contract.startDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>End:</span>
                    <span className="font-medium">
                      {formatDate(freelancer.contract.endDate)}
                    </span>
                  </div>
                </div>
              </div>

              {freelancer.contract.status === "active" && (
                <Link
                  href={{
                    pathname: `/dashboard/freelancer/my-job/task`,
                    query: {
                      contractId: freelancer.contract.contractId,
                      freelancerId: freelancer.freelancerId,
                      jobId: freelancer.contract.jobId,
                      employerId: freelancer.contract.employerId,
                      hourlyRate: freelancer.hourlyRate,
                    },
                  }}
                >
                  <Button className="w-full bg-black hover:bg-gray-800 text-white h-9 rounded-lg text-sm">
                    View Task
                  </Button>
                </Link>
              )}
              {freelancer.contract.status === "completed" &&
                !freelancer.freelancerFeedback && (
                  <div className="mt-4">
                    <Button onClick={() => {
                      setRatingData({
                        rating: 0,
                        feedback: "",
                        freelancerId: freelancer.freelancerId,
                        employerId: freelancer.contract.employerId,
                        jobId: freelancer.contract.jobId,
                        contractId: freelancer.contract.contractId,
                      });
                      setShowCompleteContract(true);
                    }}
                    className="w-full bg-black hover:bg-gray-800 text-white h-9 rounded-lg text-sm">
                      Provide Feedback
                    </Button>
                  </div>
                )}
            </CardContent>
          </Card>
        ))}
      </div>

      {showCompleteContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Rate Your Experience
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700 mb-2 block">
                    How would you rate the employer?
                  </Label>
                  <div className="flex gap-1 mb-2">
                   {[1,2,3,4,5].map(star => (
                    <button
                      key={star}
                      type="button"
                      className="p-1 transition-colors"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRatingData(prev => ({ ...prev, rating: star }))}
                    >
                      <Star
                        className={`w-8 h-8 ${star <= (hoveredRating || ratingData.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} transition-colors`}
                      />
                    </button>
                  ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    {ratingData.rating > 0 && (
                      <>
                        {ratingData.rating === 1 && "Poor"}
                        {ratingData.rating === 2 && "Fair"}
                        {ratingData.rating === 3 && "Good"}
                        {ratingData.rating === 4 && "Very Good"}
                        {ratingData.rating === 5 && "Excellent"}
                      </>
                    )}
                  </p>
                </div>
                <div>
                  <Label htmlFor="feedback" className="mb-2">
                    Your Feedback (Min 10 words.){" "}
                  </Label>
                <Textarea
                  id="feedback"
                  placeholder="Tell us about your experience..."
                  rows={3}
                  className="mt-1"
                  value={ratingData.feedback}
                  onChange={(e) => setRatingData(prev => ({ ...prev, feedback: e.target.value }))}
                />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCompleteContract(false);
                    setRating(0);
                    setFeedback("");
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCompleteContract}
                  disabled={
                    ratingData.rating === 0 ||
                    ratingData.feedback.trim() === "" ||
                    ratingData.feedback.trim().split(/\s+/).length < 10
                  }
                  className="flex-1 bg-black hover:bg-gray-700 text-white disabled:bg-gray-300"
                >
                  Submit Rating
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
