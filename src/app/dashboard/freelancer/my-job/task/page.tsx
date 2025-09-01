"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, XCircle, Edit, MessageCircle, Download } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import Link from "next/link"

interface Task {
  taskId: number
  taskName: string
  taskInstruction: string
  taskSubmission: string
  taskComment: string
  taskStatus: "pending" | "submitted" | "approved" | "rejected"
  taskSubmissionNote?: string
  rejectReason?: string
  taskHour: string
  taskTotalPay: string
  taskDueDate: string
  taskCreationDate: string
  contractId: string
  taskSubmissionDate?: string
}

interface Contract {
  contractId: string
  contractEndDate: string
}

// A single file entry from MongoDB
export interface FileEntry {
  fileName: string
  fileType: string
  fileSize: number
  fileData: string // base64 encoded if returned as JSON
}

// Combined DTO returned from backend
export interface TaskWithFilesDTO {
  task: Task
  files: FileEntry[]
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

export default function FreelancerTasksPage() {
  const [showCancelContract, setShowCancelContract] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: number]: File[] }>({})
  const [submissionNotes, setSubmissionNotes] = useState<{ [key: number]: string }>({})
  const [editingSubmission, setEditingSubmission] = useState<number | null>(null)
  const [removedBackendFiles, setRemovedBackendFiles] = useState<{ [key: number]: number[] }>({})
  const [cancellationReason, setCancellationReason] = useState("")

  const searchParams = useSearchParams()
  const contractId = searchParams.get("contractId")
  const freelancerId = searchParams.get("freelancerId")
  const jobId = searchParams.get("jobId")
  const employerId = searchParams.get("employerId")
  const hourlyRate = Number(searchParams.get("hourlyRate") || 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200"
      case "submitted":
        return "bg-blue-100 text-blue-800 border border-blue-200"
      case "approved":
        return "bg-green-100 text-green-800 border border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200"
    }
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

  const [ isCancelled, setIsCancelled ] = useState(false)

   useEffect(() => {
    const fetchCancellationStatus = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/contracts/cancel-reason/${contractId}`, {
          method: "GET",
          credentials: "include",
        })

        if (!res.ok) {
          throw new Error("Failed to check cancellation reason")
        }
        const data = await res.json()

        setIsCancelled(data.exists)

      } catch (error) {
        console.error(error)
      } 
    }

    if (contractId) {
      fetchCancellationStatus()
    }
  }, [contractId, backendUrl])

  const [contract, setContract] = useState<Contract | null>(null)

  const handleCancelContract = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/contracts/cancel/${contractId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ reason: cancellationReason }),
      });

      if (!res.ok) throw new Error("Failed to cancel contract");

      toast.success("Request for Contract Cancellation is Submitted.");
      setShowCancelContract(false);
    } catch (error) {
      console.error("Error cancelling contract:", error);
      toast.error("Failed to Upload Cancellation Reason.");
    }
  };

  useEffect(() => {
    if (!contractId) return

    const fetchContract = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/tasks/get-end-date?contractId=${contractId}`)
        if (!res.ok) throw new Error("Failed to fetch contract")

        const data: Contract = await res.json()
        setContract(data)
        console.log(data)
      } catch (err) {
        console.error(err)
        toast.error("Failed to load contract details")
      }
    }

    fetchContract()
  }, [contractId])

  const isContractEnded = contract ? new Date() > new Date(contract.contractEndDate) : false

  const [tasksWithFiles, setTasksWithFiles] = useState<TaskWithFilesDTO[]>([])

  useEffect(() => {
    if (!employerId || !freelancerId || !contractId) return

    const fetchTasks = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/api/tasks/get-task-file-data?employerId=${employerId}&freelancerId=${freelancerId}&contractId=${contractId}`,
          { credentials: "include" },
        )
        if (!res.ok) throw new Error("Failed to fetch tasks")

        const data: TaskWithFilesDTO[] = await res.json()
        setTasksWithFiles(data)
        console.log("Fetched tasks with files:", data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchTasks()
  }, [employerId, freelancerId, contractId])

  const handleFileUpload = (taskId: number, files: FileList | null) => {
    if (!files) return;

    const maxSize = 15 * 1024 * 1024; // 15MB
    const validFiles: File[] = [];
    
    Array.from(files).forEach((file) => {
      if (file.size <= maxSize) {
        validFiles.push(file);
      } else {
        toast.error(`File "${file.name}" exceeds the 15MB upload limit.`);
      }
    });

    if (validFiles.length > 0) {
      setUploadedFiles((prev) => ({
        ...prev,
        [taskId]: [...(prev[taskId] || []), ...validFiles],
      }));
    }
  };

  const removeFile = (taskId: number, fileIndex: number) => {
    setUploadedFiles((prev) => ({
      ...prev,
      [taskId]: prev[taskId]?.filter((_, index) => index !== fileIndex) || [],
    }))
  }

  const removeBackendFile = (taskId: number, fileIndex: number) => {
    setRemovedBackendFiles((prev) => ({
      ...prev,
      [taskId]: [...(prev[taskId] || []), fileIndex],
    }));

    setTasksWithFiles((prev) =>
      prev.map((dto) => {
        if (dto.task.taskId === taskId) {
          return {
            ...dto,
            files: dto.files.filter((_, idx) => idx !== fileIndex),
          };
        }
        return dto;
      })
    );
  };

  const handleSubmitTask = async (taskId: number) => {
    const submissionNote = submissionNotes[taskId] || ""
    const files = uploadedFiles[taskId] || []

    const formData = new FormData()
    formData.append("taskId", taskId.toString())
    formData.append("submissionNote", submissionNote)
    files.forEach((file) => formData.append("files", file))

    try {
      const res = await fetch(`${backendUrl}/api/tasks/submit`, {
        method: "POST",
        body: formData,
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to submit task")
      const updatedTask = await res.json()

      // Update UI
      setTasksWithFiles((prev) =>
        prev.map((dto) =>
          dto.task.taskId === taskId
            ? { ...dto, task: { ...dto.task, taskStatus: "submitted", taskSubmissionNote: submissionNote } }
            : dto,
        ),
      )

      toast.success("Task submitted successfully!")
    } catch (err) {
      console.error(err)
    }
  }

  const handleDownloadFile = (file: FileEntry) => {
    try {
      const byteCharacters = atob(file.fileData)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: file.fileType })

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = file.fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading file:", error)
    }
  }

  const handleEditSubmission = (taskId: number) => {
    setEditingSubmission(taskId)
  }

  const handleUpdateSubmission = async (taskId: number) => {
    const submissionNote = submissionNotes[taskId] || ""
    const newFiles = uploadedFiles[taskId] || []

    const backendFiles = tasksWithFiles.find(dto => dto.task.taskId === taskId)?.files || []

    const filesToKeep = backendFiles.filter((_, index) => !(removedBackendFiles[taskId] || []).includes(index))

    const backendFilesAsFile: File[] = await Promise.all(
      filesToKeep.map(async (fileEntry) => {
        const byteCharacters = atob(fileEntry.fileData)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) byteNumbers[i] = byteCharacters.charCodeAt(i)
        const byteArray = new Uint8Array(byteNumbers)
        return new File([byteArray], fileEntry.fileName, { type: fileEntry.fileType })
      })
    )

    const allFilesToSend = [...backendFilesAsFile, ...newFiles]

    const formData = new FormData()
    formData.append("taskId", taskId.toString())
    formData.append("submissionNote", submissionNote)
    allFilesToSend.forEach(file => formData.append("files", file))

    try {
      const res = await fetch(`${backendUrl}/api/tasks/update-submission`, {
        method: "POST",
        body: formData,
        credentials: "include",
      })
      if (!res.ok) throw new Error("Failed to update submission")

      const updatedTask = await res.json()

      // Update UI
      setTasksWithFiles((prev) =>
        prev.map((dto) =>
          dto.task.taskId === taskId
            ? { ...dto, task: { ...dto.task, taskStatus: "submitted", taskSubmissionNote: submissionNote } }
            : dto
        )
      )

      setRemovedBackendFiles((prev) => ({ ...prev, [taskId]: [] }))
      toast.success("Submission updated successfully!")
      setEditingSubmission(null)
    } catch (err) {
      console.error(err)
      toast.error("Failed to update submission")
    }
  }


  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">My Tasks - Freelancer</h1>
        <div className="flex gap-3">
          <Link href={`/dashboard/freelancer/chat?userId=${employerId}`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="border border-gray-200 bg-white hover:bg-gray-50">
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat with Employer
            </Button>
          </Link>
          <Button variant="destructive" onClick={() => setShowCancelContract(true)} disabled={isContractEnded || isCancelled}>
            <XCircle className="w-4 h-4 mr-2" />
            Cancel Contract
          </Button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasksWithFiles.map(({ task, files }) => (
          <Card key={task.taskId} className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{task.taskName}</h3>
                  <Badge className={getStatusColor(task.taskStatus)}>
                    {((task.taskStatus === "pending" && new Date() > new Date(task.taskDueDate)) ||
                      (task.taskStatus === "submitted" &&
                        task.taskSubmission &&
                        task.taskSubmissionDate &&
                        new Date(task.taskSubmissionDate) > new Date(task.taskDueDate)))
                      ? "OVERDUE"
                      : task.taskStatus.toUpperCase()}
                  </Badge>
                </div>
                  <p className="text-gray-600 mb-2">Contract ID: {task.contractId}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Task Details */}
                <div className="space-y-4">
                  <div>
                    <Label className="font-semibold mb-2">Instructions</Label>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{task.taskInstruction}</p>
                  </div>
                  <div>
                    <Label className="font-semibold mb-2">Submission Requirements</Label>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{task.taskSubmission}</p>
                  </div>
                  {task.taskComment && (
                    <div>
                      <Label className="font-semibold mb-2">Employer Comment</Label>
                      <p className="text-gray-700 bg-blue-50 p-3 rounded-lg border border-blue-200">
                        {task.taskComment}
                      </p>
                    </div>
                  )}
                  {task.rejectReason && (
                    <div>
                      <Label className="font-semibold text-red-600 mb-2">Rejection Reason</Label>
                      <p className="text-red-700 bg-red-50 p-3 rounded-lg border border-red-200">{task.rejectReason}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="font-semibold mb-2">Hours</Label>
                      <p className="text-gray-700">{task.taskHour} hours</p>
                    </div>
                    <div>
                      <Label className="font-semibold mb-2">Payment</Label>
                      <p className="text-gray-700">$ {(Number(task.taskTotalPay) / 100).toFixed(2)}</p>
                    </div>
                    <div>
                      <Label className="font-semibold mb-2">Due Date</Label>
                      <p className="text-gray-700">{formatDate(task.taskDueDate)}</p>
                    </div>
                    <div>
                      <Label className="font-semibold mb-2">Created</Label>
                      <p className="text-gray-700">{formatDate(task.taskCreationDate)}</p>
                    </div>
                  </div>
                </div>

                {/* File Upload Section */}
                <div className="space-y-4">
                  <div>
                    <Label className="font-semibold">Upload Your Work</Label>
                    <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload files (PDF, Word, ZIP, etc.) - Max 15MB each</p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.zip,.rar,.png,.jpg,.jpeg"
                        onChange={(e) => handleFileUpload(task.taskId, e.target.files)}
                        className="hidden"
                        id={`file-upload-${task.taskId}`}
                        disabled={task.taskStatus === "approved"}
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById(`file-upload-${task.taskId}`)?.click()}
                        disabled={
                          task.taskStatus === "approved" ||
                          (task.taskStatus === "submitted" && editingSubmission !== task.taskId)
                        }
                      >
                        Choose Files
                      </Button>
                    </div>
                  </div>

                  {files &&
                    files.length > 0 &&
                    (task.taskStatus === "submitted" ||
                      task.taskStatus === "approved" ||
                      task.taskStatus === "rejected") && (
                      <div>
                        <Label className="font-semibold">Submitted Files</Label>
                        <div className="space-y-2 mt-2">
                          {files
                            .filter((_, index) => !(removedBackendFiles[task.taskId] || []).includes(index))
                            .map((file, originalIndex) => {
                              const actualIndex = files.findIndex(
                                (f, i) => f === file && !(removedBackendFiles[task.taskId] || []).includes(i),
                              )
                              return (
                                <div
                                  key={originalIndex}
                                  className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-200"
                                >
                                  <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm text-gray-700">{file.fileName}</span>
                                    <span className="text-xs text-gray-500">
                                      ({(file.fileSize / 1024 / 1024).toFixed(2)} MB)
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDownloadFile(file)}
                                      className="text-blue-600 hover:text-blue-700"
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                    {task.taskStatus === "submitted" && editingSubmission === task.taskId && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeBackendFile(task.taskId, files.indexOf(file))}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        Remove
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                        </div>
                      </div>
                    )}

                  {/* Uploaded Files */}
                  {uploadedFiles[task.taskId] && uploadedFiles[task.taskId].length > 0 && (
                    <div>
                      <Label className="font-semibold">Uploaded Files</Label>
                      <div className="space-y-2 mt-2">
                        {uploadedFiles[task.taskId].map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                            </div>
                            {(task.taskStatus === "pending" ||
                              task.taskStatus === "rejected" ||
                              (task.taskStatus === "submitted" && editingSubmission === task.taskId)) && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(task.taskId, index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submission Notes */}
                  <div>
                    <Label className="font-semibold mb-2">Submission Notes</Label>
                    <Textarea
                      value={submissionNotes[task.taskId] || task.taskSubmissionNote || ""}
                      onChange={(e) =>
                        setSubmissionNotes((prev) => ({
                          ...prev,
                          [task.taskId]: e.target.value,
                        }))
                      }
                      placeholder="Add any notes about your submission..."
                      rows={3}
                      className="mt-1"
                      disabled={
                        task.taskStatus === "approved" ||
                        (task.taskStatus === "submitted" && editingSubmission !== task.taskId)
                      }
                    />
                  </div>

                  {/* Submit/Action Buttons */}
                  {task.taskStatus === "pending" && (
                    <Button
                      onClick={() => handleSubmitTask(task.taskId)}
                      className="w-full bg-black hover:bg-gray-800 text-white"
                      disabled={!uploadedFiles[task.taskId] || uploadedFiles[task.taskId].length === 0}
                    >
                      Submit Task
                    </Button>
                  )}

                  {task.taskStatus === "submitted" && (
                    <div className="space-y-2">
                      <Button
                        onClick={() =>
                          editingSubmission === task.taskId
                            ? handleUpdateSubmission(task.taskId)
                            : handleEditSubmission(task.taskId)
                        }
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {editingSubmission === task.taskId ? "Save Changes" : "Edit Submission"}
                      </Button>

                      <Link
                        href={`/dashboard/freelancer/chat?userId=${employerId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" className="w-full border border-gray-200 bg-white hover:bg-gray-50">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat with Employer
                        </Button>
                      </Link>
                    </div>
                  )}

                  {task.taskStatus === "rejected" && (
                    <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                      <p className="text-red-800 font-medium">✗ Task Rejected - Cannot Resubmit</p>
                    </div>
                  )}

                  {task.taskStatus === "approved" && (
                    <div className="w-full p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                      <p className="text-green-800 font-medium">✓ Task Approved - Payment Released</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cancel Contract Modal */}
      {showCancelContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cancel Contract</h3>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Please provide a valid reason to cancel this contract. Our Support Team will reach out with you within 24 hours.
                </p>
                <div>
                  <Label htmlFor="cancellation-reason" className="mb-2">Reason for Cancellation *</Label>
                  <Textarea
                    id="cancellation-reason"
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    placeholder="Please explain why you want to cancel this contract..."
                    rows={4}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCancelContract(false)
                    setCancellationReason("")
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleCancelContract()
                    setShowCancelContract(false)
                    setCancellationReason("")
                  }}
                  disabled={!cancellationReason.trim()}
                  className="flex-1"
                >
                  Cancel Contract
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
