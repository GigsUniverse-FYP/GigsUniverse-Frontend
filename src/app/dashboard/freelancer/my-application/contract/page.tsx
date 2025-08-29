"use client"

import { useState } from "react"
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

export default function FreelancerContractPage() {
  const [formData, setFormData] = useState({
    jobId: "JOB-2024-001",
    jobName: "Full Stack Developer",
    employerId: "EMP-001",
    employerName: "John Smith",
    freelancerId: "FRL-001",
    freelancerName: "Sarah Johnson",
    payRate: "25.00",
    startDate: "2024-02-01",
    endDate: "2024-05-01",
    hoursPerWeek: "40",
    freelancerSignature: "",
    agreedToTerms: false,
  })

  const calculatePayment = () => {
    const hourlyRate = Number.parseFloat(formData.payRate) || 0
    const serviceFee = hourlyRate * 0.08
    const netRate = hourlyRate - serviceFee
    return { hourlyRate, serviceFee, netRate }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSignContract = () => {
    console.log("Contract signed:", formData)
    // Handle contract signing logic here
  }

  const { hourlyRate, serviceFee, netRate } = calculatePayment()

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Freelancing Job Contract</h1>
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
                <Label htmlFor="jobId">Job ID</Label>
                <Input id="jobId" value={formData.jobId} disabled className="bg-muted" />
              </div>
              <div>
                <Label htmlFor="jobName">Job Title</Label>
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
                <Label htmlFor="employerId">Employer ID</Label>
                <Input id="employerId" value={formData.employerId} disabled className="bg-muted" />
              </div>
              <div>
                <Label htmlFor="employerName">Employer Full Name</Label>
                <Input id="employerName" value={formData.employerName} disabled className="bg-muted" />
              </div>
              <div>
                <Label htmlFor="freelancerId">Freelancer ID</Label>
                <Input id="freelancerId" value={formData.freelancerId} disabled className="bg-muted" />
              </div>
              <div>
                <Label htmlFor="freelancerName">Freelancer Full Name</Label>
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
                <Label htmlFor="payRate">Pay Rate (per hour)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="payRate" value={`$${formData.payRate}`} disabled className="pl-10 bg-muted" />
                </div>
              </div>
              <div>
                <Label htmlFor="startDate">Contract Start Date</Label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="startDate" value={formData.startDate} disabled className="pl-10 bg-muted" />
                </div>
              </div>
              <div>
                <Label htmlFor="endDate">Contract End Date</Label>
                <div className="relative">
                  <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="endDate" value={formData.endDate} disabled className="pl-10 bg-muted" />
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="hoursPerWeek">Hours of Contribution per Week</Label>
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
              <Label htmlFor="freelancerSignature">Type your full name as digital signature</Label>
              <Input
                id="freelancerSignature"
                placeholder="Sarah Johnson"
                value={formData.freelancerSignature}
                onChange={(e) => handleInputChange("freelancerSignature", e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                By typing your name, you agree that this serves as your legal digital signature
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="lg" className="px-8" disabled={!formData.freelancerSignature || !formData.agreedToTerms}>
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
                <AlertDialogAction onClick={handleSignContract}>Sign Contract</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}
