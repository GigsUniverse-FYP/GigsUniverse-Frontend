"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
} from "@/components/ui/alert-dialog"
import { CalendarDays, DollarSign, Clock, FileText, User, Building } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import { useReactToPrint } from "react-to-print";

export const dynamic = "force-dynamic";

export default function EmployerContractPage() {
  const contractRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const employerId = searchParams.get("employerId");
  const freelancerId = searchParams.get("freelancerId");
  const jobId = searchParams.get("jobId");
  const jobApplicationId = searchParams.get("jobApplicationId");

  const [formData, setFormData] = useState({
    jobId: "",
    jobName: "",
    employerId: "",
    employerName: "",
    freelancerId: "",
    freelancerName: "",
    payRate: "",
    startDate: "",
    endDate: "",
    hoursPerWeek: "",
    employerSignature: "",
    agreedToTerms: false,
    jobApplicationId: jobApplicationId || "",
  })

  const handlePrint = useReactToPrint({
    contentRef: contractRef,
    documentTitle: `Contract_${formData.jobName}_${formData.freelancerName}`,
    onAfterPrint: () => console.log("PDF generated!"),
  });

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    useEffect(() => {
        const fetchContractDetails = async () => {
        try {
            const res = await fetch(
            `${backendUrl}/api/contracts/details?jobId=${jobId}&employerId=${employerId}&freelancerId=${freelancerId}`,
            {
                method: "GET",
                credentials: "include",
            }
            )

            if (!res.ok) {
            throw new Error("Failed to fetch contract details")
            }

            const data = await res.json()

            setFormData(prev => ({
            ...prev,
            jobId: data.jobId,
            jobName: data.jobName,
            employerId: data.employerId,
            employerName: data.employerName,
            freelancerId: data.freelancerId,
            freelancerName: data.freelancerName,
            }))

            console.log("Fetched contract details:", data)

        } catch (err) {
            console.error("Error fetching contract details:", err)
        }
        }

        if (jobId && employerId && freelancerId) {
        fetchContractDetails()
        }
    }, [jobId, employerId, freelancerId])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const [ premium, setPremium ] = useState(false);
  
    useEffect(() => {
        const fetchPremiumStatus = async () => {
          try {
            const res = await fetch(`${backendUrl}/api/employer/subscription/premium-status`, {
              method: "GET",
              credentials: "include", 
            })
    
            if (!res.ok) {
              throw new Error("Failed to fetch premium status")
            }
    
            const data: boolean = await res.json()
            setPremium(data)
    
          } catch (error) {
            console.error(error)
          }
        }
    
        fetchPremiumStatus()
      }, [])

  const handleSendContract = async () => {
    try {
      const now = new Date();

      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);

      // 1. Check if start or end are in the past
      if (start < now) {
        toast.error("Start date cannot be in the past.");
        return;
      }

      if (end < now) {
        toast.error("End date cannot be in the past.");
        return;
      }

      // 2. Check if end is before start
      if (end < start) {
        toast.error("End date cannot be before start date.");
        return;
      }

      const countRes = await fetch(`${backendUrl}/api/contracts/count-active`, {
        method: "GET",
        credentials: "include",
      });

      if (!countRes.ok) throw new Error("Failed to fetch active contracts count");

      const { count } = await countRes.json();

      // 2. Determine limit based on premium status
      const maxContracts = premium ? 10 : 5;

      if (count >= maxContracts) {
        toast.error(`You have reached the maximum of ${maxContracts} active contracts. Any rejected, completed, or cancelled contracts will free up slots.`);
        return;
      }

      // If validation passes, proceed with sending contract
      const res = await fetch(`${backendUrl}/api/contracts/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          agreedPayRatePerHour: formData.payRate,
          hourPerWeek: formData.hoursPerWeek,
          contractStartDate: formData.startDate,
          contractEndDate: formData.endDate,
          jobId: formData.jobId,
          employerId: formData.employerId,
          freelancerId: formData.freelancerId,
          jobApplicationId: formData.jobApplicationId
        }),
      });

      if (!res.ok) throw new Error("Failed to send contract");

      handlePrint();
      toast.success("Contract sent successfully. Auto Rejection Upon 3 Days without Response.");

      setTimeout(() => {
        window.location.href = `/dashboard/employer/job-post/${formData.jobId}`;
      }, 3000);

    } catch (err) {
      console.error("Error sending contract:", err);
    }
  };


  

  return (
       <div className="w-full sm:max-w-8xl min-w-sm mx-auto space-y-6 mb-5 -ml-10 sm:ml-0" ref={contractRef}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">GigsUniverse Job Contract</h1>
          <p className="text-muted-foreground">Employer Contract Form</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Job Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="jobId" className="mb-2">Job ID</Label>
                <Input id="jobId" value={formData.jobId} disabled className="bg-muted" />
              </div>
              <div>
                <Label htmlFor="jobName" className="mb-2">Job Title</Label>
                <Input id="jobName" value={formData.jobName} disabled className="bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Party Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employerId" className="mb-2">Employer ID</Label>
                <Input id="employerId" value={formData.employerId} disabled className="bg-muted" />
              </div>
              <div>
                <Label htmlFor="employerName" className="mb-2">Employer Full Name</Label>
                <Input id="employerName" value={formData.employerName} disabled className="bg-muted" />
              </div>
              <div>
                <Label htmlFor="freelancerId" className="mb-2">Freelancer ID</Label>
                <Input id="freelancerId" value={formData.freelancerId} disabled className="bg-muted" />
              </div>
              <div>
                <Label htmlFor="freelancerName" className="mb-2">Freelancer Full Name</Label>
                <Input id="freelancerName" value={formData.freelancerName} disabled className="bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Contract Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="payRate" className="mb-2">Pay Rate (per hour)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="payRate"
                    type="number"
                    placeholder="25.00"
                    className="pl-10"
                    value={formData.payRate}
                    onChange={(e) => handleInputChange("payRate", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="startDate" className="mb-2">Contract Start Date</Label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="startDate"
                    type="datetime-local"
                    className="pl-10"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="endDate" className="mb-2">Contract End Date</Label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endDate"
                    type="datetime-local"
                    className="pl-10"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="hoursPerWeek" className="mb-2">Hours of Contribution per Week</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="hoursPerWeek"
                  type="number"
                  placeholder="40"
                  className="pl-10"
                  value={formData.hoursPerWeek}
                  onChange={(e) => handleInputChange("hoursPerWeek", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Terms and Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
              <p>
                <strong>Payment Terms:</strong> All payments will be processed through Stripe payment gateway. Payments
                are due within 7 days of invoice submission.
              </p>
              <p>
                <strong>Payment Escrow System:</strong> The employer agrees to use the platform's escrow system to
                ensure secure payment processing.
              </p>
              <p>
                <strong>Service Agreement:</strong> The employer must not violate any Terms and Conditions of the
                platform including the agreed contract term in any way.
              </p>
              <p>
                <strong>Work Standards:</strong> The freelancer agrees to deliver work according to the specified
                requirements and timeline.
              </p>
              <p>
                <strong>Intellectual Property:</strong> All work produced under this contract belongs to the employer
                upon full payment.
              </p>
              <p>
                <strong>Termination:</strong> Either party may terminate this contract with 7 days written notice.
              </p>
              <p>
                <strong>Terms and Condition:</strong> The employer and freelancer agree to abide by the terms set forth
                in this contract. Any violation of these terms may result in penalties or termination of the contract.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreedToTerms}
                onCheckedChange={(checked) => handleInputChange("agreedToTerms", checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the above terms and conditions
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Digital Signature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="employerSignature" className="mb-2">Type your full name as digital signature</Label>
              <Input
                id="employerSignature"
                placeholder={formData.employerName}
                value={formData.employerSignature}
                onChange={(e) => handleInputChange("employerSignature", e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                By typing your name, you agree that this serves as your legal digital signature
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-start">
            <span className="text-xs text-gray-500 mb-5">Subject Rights by GigsUniverse Sdn. Bhd.</span>
        </div>

        <div className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="lg"
                className="px-8 no-print"
                disabled={
                    !formData.payRate ||
                    !formData.startDate ||
                    !formData.endDate ||
                    !formData.hoursPerWeek ||
                    !formData.employerSignature ||
                    !formData.agreedToTerms ||
                    formData.employerSignature !== formData.employerName
                }
              >
                Send Contract
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Contract Submission</AlertDialogTitle>
                <AlertDialogDescription>
                  Please double-check all contract information. Once saved, the contract details cannot be modified. Are
                  you sure you want to send this contract to the freelancer?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSendContract}>Send Contract</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}
