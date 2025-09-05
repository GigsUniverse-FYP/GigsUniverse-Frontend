"use client"

import { useEffect, useState, useRef } from "react"
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
import { CalendarDays, DollarSign, Clock, FileText, User, UserCheck, CreditCard } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useReactToPrint } from "react-to-print";
import { toast } from "react-toastify"

const formatToDisplay = (isoString: string | null) => {
  if (!isoString) return "";
  const date = new Date(isoString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export default function FreelancerContractPage() {
  
  const searchParams = useSearchParams();
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
    freelancerSignature: "",
    agreedToTerms: false,
    jobApplicationId: jobApplicationId || "",
  })
  const contractRef = useRef<HTMLDivElement>(null);

  const [ premium, setPremium ] = useState(false);
  
  useEffect(() => {
      const fetchPremiumStatus = async () => {
        try {
          const res = await fetch(`${backendUrl}/api/freelancer/subscription/premium-status`, {
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


  const handlePrint = useReactToPrint({
    contentRef: contractRef,
    documentTitle: `Contract_${formData.jobName}_${formData.freelancerName}`,
    onAfterPrint: () => console.log("PDF generated!"),
  });

  const handleRejectContract = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/contracts/reject?jobApplicationId=${formData.jobApplicationId}&freelancerId=${formData.freelancerId}`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to reject contract");

      toast.success("Contract rejected successfully");

      setTimeout(() => {
        window.location.href = "/dashboard/freelancer/my-application";
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error("Error rejecting contract");
    }
  };



  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
    useEffect(() => {
        const fetchContractDetails = async () => {
        try {
            const res = await fetch(
            `${backendUrl}/api/contracts/contract-details?jobApplicationId=${jobApplicationId}`,
            {
                method: "GET",
                credentials: "include",
            }
            )

            if (!res.ok) {
            throw new Error("Failed to fetch contract details")
            }

            const data = await res.json()

            
            console.log("Fetched contract details:", data)

            setFormData(prev => ({
            ...prev,
            payRate: data.payRate,
            jobId: data.jobId,
            jobName: data.jobTitle,
            employerId: data.employerId,
            employerName: data.employerName,
            freelancerId: data.freelancerId,
            freelancerName: data.freelancerName,
            hoursPerWeek: data.hoursPerWeek,
            startDate: formatToDisplay(data.startDate),
            endDate: formatToDisplay(data.endDate),
            }))

            console.log("Fetched contract details:", data)

        } catch (err) {
            console.error("Error fetching contract details:", err)
        }
        }

        if (jobApplicationId) {
          fetchContractDetails()
        }
    }, [jobApplicationId])


  const calculatePayment = () => {
    const hourlyRate = Number.parseFloat(formData.payRate) || 0
    const serviceFee = hourlyRate * 0.08
    const netRate = hourlyRate - serviceFee
    return { hourlyRate, serviceFee, netRate }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmitContract = async () => {
    if (formData.freelancerSignature !== formData.freelancerName) {
      toast.error("Digital signature must match your full name.");
      return;
    }

    const countRes = await fetch(
      `${backendUrl}/api/contracts/freelancer/count-active?freelancerId=${formData.freelancerId}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!countRes.ok) throw new Error("Failed to fetch active contracts count");

    const { count } = await countRes.json();

    const maxContracts = premium ? 5 : 2;

    if (count >= maxContracts) {
      toast.error(
        `You have reached the maximum of ${maxContracts} active contracts. Any completed with feedback included, cancelled, or rejected contracts will free up slots.`
      );
      return;
    }
    
    try {
      const res = await fetch(`${backendUrl}/api/contracts/submit?jobApplicationId=${formData.jobApplicationId}&freelancerId=${formData.freelancerId}`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to submit contract");

      handlePrint();

      toast.success("Contract submitted successfully");

      setTimeout(() => {
        window.location.href = "/dashboard/freelancer/my-application";
      }, 3000);

    } catch (err) {
      console.error(err);
      toast.error("Error submitting contract");
    }
  };
  

  const { hourlyRate, serviceFee, netRate } = calculatePayment()

  return (
   <div className="w-full sm:max-w-8xl min-w-sm mx-auto space-y-6 mb-5 -ml-10 sm:ml-0" ref={contractRef}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">GigsUniverse Job Contract</h1>
          <p className="text-muted-foreground">Freelancer Contract Review & Signature</p>
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
                  <Input id="payRate" value={`${formData.payRate}`} disabled className="pl-10 bg-muted" />
                </div>
              </div>
              <div>
                <Label htmlFor="startDate" className="mb-2">Contract Start Date</Label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="startDate" value={formData.startDate} disabled className="pl-10 bg-muted" />
                </div>
              </div>
              <div>
                <Label htmlFor="endDate" className="mb-2">Contract End Date</Label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="endDate" value={formData.endDate} disabled className="pl-10 bg-muted" />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="hoursPerWeek" className="mb-2">Hours of Contribution per Week</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="hoursPerWeek" value={`${formData.hoursPerWeek} hours`} disabled className="pl-10 bg-muted" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Hourly Rate:</span>
                <span className="font-semibold">${hourlyRate.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-destructive">
                <span>Platform Service Fee (8%):</span>
                <span className="font-semibold">-${serviceFee.toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Your Net Rate per Hour:</span>
                <span className="text-primary">${netRate.toFixed(2)}</span>
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
                <strong>Payment Processing:</strong> All payments will be processed through Stripe payment gateway with
                automatic rate conversion to your local currency.
              </p>
              <p>
                <strong>Service Fee:</strong> You accept an 8% service fee per payment which covers platform
                maintenance, payment processing, and dispute resolution.
              </p>
              <p>
                <strong>Platform Compliance:</strong> This contract does not violate any Terms and Conditions of the
                platform.
              </p>
              <p>
                <strong>Work Delivery:</strong> You agree to deliver work according to the specified requirements and
                timeline.
              </p>
              <p>
                <strong>Payment Schedule:</strong> Payments will be released upon milestone completion or weekly, as
                agreed with the employer.
              </p>
              <p>
                <strong>Dispute Resolution:</strong> Any disputes will be handled through the platform's resolution
                system.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={formData.agreedToTerms}
                onCheckedChange={(checked) => handleInputChange("agreedToTerms", checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the above terms and conditions, including the 8% service fee
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Digital Signature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="freelancerSignature" className="mb-2">Type your full name as digital signature</Label>
              <Input
                id="freelancerSignature"
                placeholder={formData.freelancerName}
                value={formData.freelancerSignature}
                onChange={(e) => handleInputChange("freelancerSignature", e.target.value)}
                disabled={!formData.agreedToTerms}
                
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
              <Button size="lg" className="px-8 no-print text-red-500 border border-red-500 bg-white cursor-pointer hover:bg-white mr-5">
                Reject Contract
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Contract Rejection</AlertDialogTitle>
                <AlertDialogDescription>
                  By rejecting this contract, you are declining the offer and it will not be executed. Are you sure you want to proceed?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleRejectContract}>Reject Contract</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="lg" className="px-8 no-print" disabled={!formData.freelancerSignature || !formData.agreedToTerms}>
                Sign Contract
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Contract Signature</AlertDialogTitle>
                <AlertDialogDescription>
                  By signing this contract, you agree to all terms and conditions including the 8% service fee. Once
                  signed, the contract becomes legally binding. Are you sure you want to proceed?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmitContract}>Sign Contract</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}
