"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Check, X, XCircle, FileText, MessageCircle, Download, Delete, Star } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import Link from "next/link"
import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"


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
  taskCredit: string
  taskCreationDate: string
  taskSubmissionDate?: string
  taskDueDate: string
  employerId: string
  freelancerId: string
  jobId: string
  contractId: string
}

interface Contract {
  contractId: string
  contractEndDate: string
}

export interface FileEntry {
  fileName: string
  fileType: string
  fileSize: number
  fileData: string
}

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

export default function EmployerTasksPage() {

  // rating section
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState("")



  const [calculatedPay, setCalculatedPay] = useState("0")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTask, setEditingTask] = useState<number | null>(null)
  const [showCancelContract, setShowCancelContract] = useState(false)
  const [showCompleteContract, setShowCompleteContract] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectingTaskId, setRejectingTaskId] = useState<number | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [cancellationReason, setCancellationReason] = useState("")
  const [editingTaskData, setEditingTaskData] = useState<Partial<Task>>({})
  const [newTask, setNewTask] = useState({
    taskName: "",
    taskInstruction: "",
    taskSubmission: "",
    taskHour: "",
    taskDueDate: "",
    contractId: "",
  })

  const [approveTaskId, setApproveTaskId] = useState<number | null>(null)
  const [approveTaskDialog, setApproveTaskDialog] = useState(false)

  const [ showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [ deleteTaskId, setDeleteTaskId ] = useState<number | null>(null);
  const [editCalculatedPay, setEditCalculatedPay] = useState<string>("0")

  const searchParams = useSearchParams()
  const contractId = searchParams.get("contractId")
  const freelancerId = searchParams.get("freelancerId")
  const jobId = searchParams.get("jobId")
  const employerId = searchParams.get("employerId")
  const hourlyRate = Number(searchParams.get("hourlyRate") || 0)

  const isAddTaskFormValid = () => {
    return (
      newTask.taskName.trim() !== "" &&
      newTask.taskInstruction.trim() !== "" &&
      newTask.taskSubmission.trim() !== "" &&
      newTask.taskHour.trim() !== "" &&
      newTask.taskDueDate.trim() !== ""
    )
  }

  const [contract, setContract] = useState<Contract | null>(null)

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
  const [isCompletedOrCancelled, setIsCompletedOrCancelled] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/contracts/checkstatus/${contractId}`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch contract status");
        }

        const data: boolean = await res.json();
        setIsCompletedOrCancelled(data);
      } catch (error) {
        console.error("Error fetching contract status:", error);
        setIsCompletedOrCancelled(null);
      }
    };
    if (contractId) {
      fetchStatus();
    }
  }, [contractId]);



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


  const hasIncompleteTasks = (tasks: Task[]): boolean => {
    return tasks.some(task => task.taskStatus === "pending" || task.taskStatus === "submitted");
  };


  const handleCompleteContract = async () => {
    if (!contractId || !contract) return;

    try {
      const res = await fetch(`${backendUrl}/api/contracts/complete/${contractId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,                    
          feedback,               
          employerId: employerId, 
          freelancerId: freelancerId,
          jobId: jobId,
          contractId: contractId                
        }),
      });

      if (!res.ok) throw new Error("Failed to complete contract");

      toast.success("Contract completed successfully");
      setShowCompleteContract(false);
      setRating(0);
      setFeedback("");

      setTimeout(() => {
        window.location.reload();
      }, 3000);

    } catch (err) {
      console.error(err);
      toast.error("Failed to complete contract");
    }
  };

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

  const handleAddTask = async () => {
    try {
      const selectedDate = new Date(newTask.taskDueDate)
      const now = new Date()

      // Validate due date
      if (selectedDate < now) {
        toast.error("Due date cannot be in the past.")
        return
      }

      // Validate task hours
      if (!newTask.taskHour || Number(newTask.taskHour) < 1) {
        toast.error("Task hours must be at least 1.")
        return
      }

      const taskPayload = {
        taskName: newTask.taskName,
        taskInstruction: newTask.taskInstruction,
        taskSubmission: newTask.taskSubmission,
        taskHour: newTask.taskHour,
        taskDueDate: newTask.taskDueDate,
        contractId: contractId || "",
        freelancerId: freelancerId || "",
        jobId: jobId || "",
        employerId: employerId || "",
        hourlyRate: hourlyRate || "",
        taskTotalPay: calculatedPay || "0",
      }

      const res = await fetch(`${backendUrl}/api/tasks/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskPayload),
      })

      if (!res.ok) {
        const errorData = await res.json()
        if (res.status === 400 && errorData?.message?.includes("Insufficient credits")) {
          toast.error("Insufficient Credits to Create Task, Please Top Up First")
          return
        }
        toast.error("Insufficient Credits to Create Task, Please Top Up First")
        return
      }

      const createdTask: Task = await res.json()
      const newEntry: TaskWithFilesDTO = {
        task: createdTask,
        files: [],
      }

      setTasksWithFiles((prev) => [newEntry, ...prev])

      setNewTask({
        taskName: "",
        taskInstruction: "",
        taskSubmission: "",
        taskHour: "",
        taskDueDate: "",
        contractId: "",
      })
      setCalculatedPay("0")
      setShowAddForm(false)

      toast.success("Task created successfully!")
    } catch (err) {
      console.error(err)
      alert("Something went wrong while creating the task.")
    }
  }

  const handleEditTask = (task: Task | undefined) => {
    if (!task) return
    setEditingTask(task.taskId)

    const formatForInput = (dateStr: string) => {
      const d = new Date(dateStr)
      const offset = d.getTimezoneOffset() * 60000 // offset in ms
      const local = new Date(d.getTime() - offset)
      return local.toISOString().slice(0, 16)
    }

    const formattedDueDate = task.taskDueDate
      ? formatForInput(task.taskDueDate)
      : ""

    const pay = Number(task.taskHour) * hourlyRate

    setEditingTaskData({
      taskName: task.taskName,
      taskInstruction: task.taskInstruction,
      taskSubmission: task.taskSubmission,
      taskHour: task.taskHour.toString(),
      taskDueDate: formattedDueDate,
      taskTotalPay: pay.toString(),   
      taskComment: task.taskComment || "",
    })

    setEditCalculatedPay(pay.toString())
  }


  const handleSaveEdit = async (taskId: number) => {
    try {
      const selectedDate = new Date(editingTaskData.taskDueDate || "")
      const now = new Date()

      if (selectedDate < now) {
        toast.error("Due date cannot be in the past.")
        return
      }

      if (!editingTaskData.taskHour || Number(editingTaskData.taskHour) < 1) {
        toast.error("Task hours must be at least 1.")
        return
      }

      // calculate total pay dynamically before sending
      const pay = Number(editingTaskData.taskHour) * hourlyRate

      const res = await fetch(`${backendUrl}/api/tasks/update/${taskId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskName: editingTaskData.taskName,
          taskInstruction: editingTaskData.taskInstruction,
          taskSubmission: editingTaskData.taskSubmission,
          taskHour: Number(editingTaskData.taskHour),   // convert string → number
          taskDueDate: editingTaskData.taskDueDate,
          taskTotalPay: pay.toString(),                 // always send string
          employerId: employerId,
          taskComment: editingTaskData.taskComment,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        if (res.status === 400 && errorData?.message?.includes("Insufficient credits")) {
          toast.error("Insufficient Credits to Edit Task, Please Top Up First. Edit Failed")
          return
        }
        toast.error(errorData?.message || "Failed to update task")
        return
      }

      const updatedTask = await res.json()

      setTasksWithFiles((prev) =>
        prev.map((dto) =>
          dto.task.taskId === taskId ? { ...dto, task: updatedTask } : dto,
        ),
      )

      setEditingTask(null)
      setEditingTaskData({})
      toast.success("Task updated successfully!")
    } catch (err) {
      console.error("Error updating task:", err)
      toast.error("Something went wrong while updating task")
    }
  }


  const handleDownloadFile = (file?: FileEntry) => {
    try {
      if (!file) throw new Error("File not found")

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
      toast.error("Failed to download file")
    }
  }

  const handleApproveTask = async (approveTaskId: number) => {
    try {
      const res = await fetch(`${backendUrl}/api/tasks/approve/${approveTaskId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          contractId: contractId,
          employerId: employerId,
          freelancerId: freelancerId,
        }),
      })

      if (!res.ok) throw new Error("Failed to release payment")

      toast.success("Processing Payment Please Wait...!")

      setTimeout(() => {
        window.location.reload()
      }, 3000)

    } catch (err) {
      console.error(err)
      toast.error("Failed to initiate payment. Please Contact Customer Support.")
    }
  }

  const handleReject = async (taskId: number, reason: string) => {
    try {
      const res = await fetch(`${backendUrl}/api/tasks/reject/${rejectingTaskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ reason }),
      });

      if (!res.ok) {
        throw new Error("Failed to reject task");
      }

      const updatedTask = await res.json();

      setTasksWithFiles((prev) =>
        prev.map((dto) =>
          dto.task.taskId === updatedTask.taskId
            ? { ...dto, task: updatedTask }
            : dto
        )
      );

      toast.success("Task rejected and refund processed");
      setShowRejectDialog(false);
      setRejectingTaskId(null);
      setRejectReason("");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong rejecting the task");
    }
  };

  const openRejectDialog = (taskId: number) => {
    setRejectingTaskId(taskId)
    setShowRejectDialog(true)
  }

  const handleDeleteTask = async (taskId: number) => {
    if (!taskId) return;
    try {
      const res = await fetch(`${backendUrl}/api/tasks/delete/${deleteTaskId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to delete task");
      }

      setTasksWithFiles((prev) => prev.filter((dto) => dto.task.taskId !== taskId));

      toast.success("Task deleted and refund processed successfully");

      setDeleteTaskId(null);

      setShowDeleteDialog(false);

    } catch (err) {
      console.error(err);
      toast.error("Failed to delete task");
    }
  };

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

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-6 min-w-3xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Task</h1>
        <div className="flex gap-3">
          {isContractEnded && (
            <Button
              onClick={() => {
                if (hasIncompleteTasks(tasksWithFiles.map(dto => dto.task))) {
                  toast.error("Please approve, reject or delete all pending or submitted tasks before completing the contract.");
                  return;
                }
                setShowCompleteContract(true);
              }}
              disabled={isCompletedOrCancelled === true}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Complete Contract
            </Button>
          )}

          <Button
            onClick={() => setShowAddForm(true)}
            className="bg-black hover:bg-gray-800 text-white"
            disabled={isContractEnded || isCompletedOrCancelled === true}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Task
          </Button>

          <Button variant="destructive" onClick={() => setShowCancelContract(true)} disabled={isContractEnded || isCompletedOrCancelled || isCancelled}>
            <XCircle className="w-4 h-4 mr-2" />
            Cancel Contract
          </Button>
        </div>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">Add New Task</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="taskName" className="mb-2">
                  Task Name
                </Label>
                <Input
                  id="taskName"
                  value={newTask.taskName}
                  onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
                  placeholder="Enter task name"
                />
              </div>
              <div>
                <Label htmlFor="taskHour" className="mb-2">
                  Task Hours
                </Label>
                <Input
                  id="taskHour"
                  type="number"
                  value={newTask.taskHour}
                  onChange={(e) => {
                    const hours = Number(e.target.value)
                    setNewTask({ ...newTask, taskHour: e.target.value })

                    const pay = hours * hourlyRate
                    setCalculatedPay(pay.toString())
                  }}
                  placeholder="Hours required"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="taskInstruction" className="mb-2">
                  Task Instructions
                </Label>
                <Textarea
                  id="taskInstruction"
                  value={newTask.taskInstruction}
                  onChange={(e) => setNewTask({ ...newTask, taskInstruction: e.target.value })}
                  placeholder="Detailed task instructions"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="taskSubmission" className="mb-2">
                  Submission Requirements
                </Label>
                <Textarea
                  id="taskSubmission"
                  value={newTask.taskSubmission}
                  onChange={(e) => setNewTask({ ...newTask, taskSubmission: e.target.value })}
                  placeholder="What should the freelancer submit?"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="taskDueDate" className="mb-2">
                  Due Date
                </Label>
                <Input
                  id="taskDueDate"
                  type="datetime-local"
                  value={newTask.taskDueDate}
                  onChange={(e) => setNewTask({ ...newTask, taskDueDate: e.target.value })}
                />
              </div>

              <div>
                <Label className="mb-2">Total Balance Required</Label>
                <p className="text-lg font-semibold text-blue-700">${calculatedPay}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button
                onClick={handleAddTask}
                className="bg-black hover:bg-gray-800 text-white"
                disabled={!isAddTaskFormValid()}
              >
                Create Task
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {tasksWithFiles
        .filter(dto => dto?.task)
        .map((taskWithFiles) => {
          const task = taskWithFiles.task
          const files = taskWithFiles.files

          return (
            <Card key={task.taskId} className="border border-gray-200">
              <CardContent className="p-6 ">
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

                  {(task.taskStatus === "pending" ) && ( 
                    <div className="flex gap-2 cursor-pointer">
                      <Button
                          variant="outline"
                          size="sm"
                          className="mr-3"
                          onClick={() => {
                            setDeleteTaskId(task.taskId);
                            setShowDeleteDialog(true);
                          }}
                      >
                          <Delete className="w-4 h-4 mr-1" />
                          Delete
                      </Button>
                    </div>
                  )}

                  {(task.taskStatus === "pending" || task.taskStatus === "submitted") && (
                    <div className="flex gap-2 cursor-pointer">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          editingTask === task.taskId ? handleSaveEdit(task.taskId) : handleEditTask(task)
                        }
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        {editingTask === task.taskId ? "Save" : "Edit"}
                      </Button>
                      {editingTask === task.taskId && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingTask(null)
                            setEditingTaskData({})
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Task Details */}
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <Label className="font-semibold mb-2">Task Name</Label>
                      {editingTask === task.taskId ? (
                        <Input
                          value={editingTaskData.taskName || ""}
                          onChange={(e) => setEditingTaskData({ ...editingTaskData, taskName: e.target.value })}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{task.taskName}</p>
                      )}
                    </div>
                    <div>
                      <Label className="font-semibold mb-2">Instructions</Label>
                      {editingTask === task.taskId ? (
                        <Textarea
                          value={editingTaskData.taskInstruction || ""}
                          onChange={(e) => setEditingTaskData({ ...editingTaskData, taskInstruction: e.target.value })}
                                rows={3}
                        /> 
                      ) : (
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{task.taskInstruction}</p>
                      )}
                    </div>
                    <div>
                      <Label className="font-semibold mb-2">Submission Requirements</Label>
                      {editingTask === task.taskId ? (
                        <Textarea
                          value={editingTaskData.taskSubmission || ""}
                          onChange={(e) => setEditingTaskData({ ...editingTaskData, taskSubmission: e.target.value })}
                          rows={2}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{task.taskSubmission}</p>
                      )}
                    </div>

                    {(task.taskStatus === "submitted" ||
                      task.taskStatus === "approved" ||
                      task.taskStatus === "rejected") &&
                      files &&
                      files.length > 0 && (
                        <div>
                          <Label className="font-semibold">Submitted Files</Label>
                          <div className="space-y-2 mt-2">
                            {files.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                              >
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-blue-600" />
                                  <span className="text-sm font-medium text-blue-900">{file.fileName}</span>
                                  <span className="text-xs text-blue-600">
                                    ({(file.fileSize / (1024 * 1024)).toFixed(2)} MB)
                                  </span>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownloadFile(file)}
                                  className="text-blue-600 border-blue-200 hover:bg-blue-100"
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Freelancer's Submission Note */}
                    {task.taskSubmissionNote && (
                      <div>
                        <Label className="font-semibold mb-2">Freelancer's Note</Label>
                        <p className="text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200 mb-2">
                          {task.taskSubmissionNote}
                        </p>

                      {task.taskStatus === "rejected" && (
                        <div className="mt-2">
                        <Label className="font-semibold mb-2">Reject Reason</Label>
                        <p className="text-gray-700 bg-red-50 p-3 rounded-lg border border-red-200">
                          {task.rejectReason}
                        </p>
                        </div>
                      )}
                      </div>

                    )}
                  </div>

                  {/* Task Info & Actions */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 text-sm">
                      <div>
                        <Label className="font-semibold mb-2">Hours</Label>
                        {editingTask === task.taskId ? (
                          <Input
                            type="number"
                            value={editingTaskData.taskHour || ""}
                            onChange={(e) => {
                              const hours = Number(e.target.value)
                              const pay = hours * hourlyRate
                              setEditingTaskData({
                                ...editingTaskData,
                                taskHour: e.target.value,
                                taskTotalPay: pay.toString(),   
                              })
                              setEditCalculatedPay(pay.toString())
                            }}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-gray-700">{task.taskHour} hours</p>
                        )}
                      </div>
                      <div>
                      <Label className="font-semibold mb-2">Total Pay</Label>
                        {editingTask === task.taskId ? (
                          <p className="text-blue-700 font-semibold">
                            ${editCalculatedPay}
                          </p>
                        ) : (
                          <p className="text-gray-700">
                            ${(Number(task.taskTotalPay) / 100).toFixed(2)}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className="font-semibold mb-2">Due Date</Label>
                        {editingTask === task.taskId ? (
                          <Input
                            type="datetime-local"
                            value={editingTaskData.taskDueDate || ""}
                            onChange={(e) => setEditingTaskData({ ...editingTaskData, taskDueDate: e.target.value })}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-gray-700">{formatDate(task.taskDueDate)}</p>
                        )}
                      </div>
                      <div>
                        <Label className="font-semibold mb-2">Created</Label>
                        <p className="text-gray-700">{formatDate(task.taskCreationDate)}</p>
                      </div>
                    </div>

                    {/* Comment Section */}
                    <div>
                      <Label className="font-semibold mb-2">Your Comment</Label>
                      {task.taskStatus === "pending" && editingTask === task.taskId ? (
                        <Textarea
                          value={editingTaskData.taskComment || ""}
                          onChange={(e) => setEditingTaskData((prev) => ({ ...prev, taskComment: e.target.value }))}
                          placeholder="Add your comment for the freelancer..."
                          rows={2}
                          className="mt-1"
                        />
                      ) : task.taskStatus === "submitted" && editingTask === task.taskId ? (
                        <Textarea
                          value={editingTaskData.taskComment || ""}
                          onChange={(e) => setEditingTaskData((prev) => ({ ...prev, taskComment: e.target.value }))}
                          placeholder="Add your comment for the freelancer..."
                          rows={2}
                          className="mt-1"
                        />
                      ) : (
                        <div className="space-y-2">
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg min-h-[60px]">
                            {task.taskComment || "No comment added yet"}
                          </p>
                          {(task.taskStatus === "approved" || task.taskStatus === "rejected") && (
                            <p className="text-xs text-gray-500">
                              Comments cannot be edited after task is {task.taskStatus}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {task.taskStatus === "submitted" && (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          {editingTask !== task.taskId ? (
                            <>
                              <Button
                                onClick={() => {
                                  setApproveTaskId(task.taskId)
                                  setApproveTaskDialog(true)
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white flex-1"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                              </Button>

                              <Button
                                variant="destructive"
                                onClick={() => {
                                  setEditingTask(null)
                                  openRejectDialog(task.taskId)
                                }}
                                className="flex-1"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          ) : null}
                        </div>
                        <div className="space-y-2">
                          <Link href={`/dashboard/employer/chat?userId=${freelancerId}`} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="w-full border border-gray-200 bg-white hover:bg-gray-50">
                              <MessageCircle className="w-4 h-4 mr-2" />
                              Chat with Freelancer
                            </Button>
                          </Link>

                          <p className="text-xs text-gray-600 text-center mt-2">
                            💡 Consider to contact freelancer to edit their submission if you're dissatisfied before
                            rejecting
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>


      {approveTaskDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Approve Task</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="approve-reason" className="mb-2">Approve this task and release payment to the freelancer?</Label>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setApproveTaskDialog(false)
                    setApproveTaskId(null)
                  }}
                  className="flex-1 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleApproveTask(approveTaskId!)}
                  className="flex-1 cursor-pointer"
                >
                  Approve Task
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Task Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Task</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reject-reason" className="mb-2">Reason for Rejection</Label>
                  <Textarea
                    id="reject-reason"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Please specify the reason to reject this tasks."
                    rows={4}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectDialog(false)
                    setRejectingTaskId(null)
                    setRejectReason("")
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => rejectingTaskId && handleReject(rejectingTaskId, rejectReason)}
                  disabled={!rejectReason.trim()}
                  className="flex-1"
                >
                  Reject Task
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deleting Task Dialog */}
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteTask(deleteTaskId!)}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete Task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Complete Contract Dialog */}
      {showCompleteContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Rate Your Experience</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700 mb-2 block">How would you rate the freelancer?</Label>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="p-1 transition-colors"
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        onClick={() => setRating(star)}
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    {rating > 0 && (
                      <>
                        {rating === 1 && "Poor"}
                        {rating === 2 && "Fair"}
                        {rating === 3 && "Good"}
                        {rating === 4 && "Very Good"}
                        {rating === 5 && "Excellent"}
                      </>
                    )}
                  </p>
                </div>
                <div>
                  <Label htmlFor="feedback" className="mb-2">Your Feedback (Min 10 words.) </Label>
                  <Textarea
                    id="feedback"
                    placeholder="Tell us about your experience..."
                    rows={3}
                    className="mt-1"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCompleteContract(false)
                    setRating(0)
                    setFeedback("")
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCompleteContract}
                  disabled={
                    rating === 0 ||
                    feedback.trim() === "" ||
                    feedback.trim().split(/\s+/).length < 10
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

      {/* Cancel Contract Dialog */}
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
