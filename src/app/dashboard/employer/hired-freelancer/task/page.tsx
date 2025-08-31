"use client"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Check, X, XCircle, FileText, MessageCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { toast } from "react-toastify"

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
  submittedFiles?: { name: string; size: number; url: string }[]
}

interface Contract {
  contractId: string;
  contractEndDate: string; 
}

export const formatDate = (isoDate: string | undefined | null) => {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export default function EmployerTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [calculatedPay, setCalculatedPay] = useState("0")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTask, setEditingTask] = useState<number | null>(null)
  const [editingComment, setEditingComment] = useState<number | null>(null)
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
    );
   };

   const [contract, setContract] = useState<Contract | null>(null);

    useEffect(() => {
    if (!contractId) return;

    const fetchContract = async () => {
        try {
        const res = await fetch(`${backendUrl}/api/tasks/get-end-date?contractId=${contractId}`);
        if (!res.ok) throw new Error("Failed to fetch contract");

        const data: Contract = await res.json();
        setContract(data);
        console.log(data);
        } catch (err) {
        console.error(err);
        toast.error("Failed to load contract details");
        }
    };

    fetchContract();
    }, [contractId]);

    const isContractEnded = contract ? new Date() > new Date(contract.contractEndDate) : false;

    // fetch all task from backend
    useEffect(() => {
        if (!employerId || !freelancerId || !contractId) return;

        (async () => {
            try {
            const res = await fetch(
                `${backendUrl}/api/tasks/employer-view?employerId=${employerId}&freelancerId=${freelancerId}&contractId=${contractId}`
            );
            if (!res.ok) throw new Error("Failed to fetch tasks");

            const data: Task[] = await res.json();
            setTasks(data);

            console.log(data);

            } catch (err) {
            console.error(err);
            }
        })();
    }, [employerId, freelancerId, contractId]);
   

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

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const handleAddTask = async () => {
        try {
            const selectedDate = new Date(newTask.taskDueDate);
            const now = new Date();

            if (selectedDate < now) {
                toast.error("Due date cannot be in the past.");
                return;
            }

            // 2. Prepare payload
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
            };

            // 3. Send to backend
            const res = await fetch(`${backendUrl}/api/tasks/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(taskPayload),
            });

            if (!res.ok) {
                    const errorData = await res.json(); // backend should send { message: "..." }
                    if (res.status === 400 && errorData?.message?.includes("Insufficient credits")) {
                        toast.error("Insufficient Credits to Create Task, Please Top Up First");
                        return;
                    }
                    throw new Error("Failed to create task");
                }

            const createdTask = await res.json();

            // 4. Update state
            setTasks([createdTask, ...tasks]);
            setNewTask({
                taskName: "",
                taskInstruction: "",
                taskSubmission: "",
                taskHour: "",
                taskDueDate: "",
                contractId: "",
            });
            setCalculatedPay("0");
            setShowAddForm(false);

            toast.success("Task created successfully!");
        } catch (err) {
            console.error(err);
            alert("Something went wrong while creating the task.");
        }
    };


  const handleEditTask = (task: Task) => {
    setEditingTask(task.taskId)
    setEditingTaskData({
      taskName: task.taskName,
      taskInstruction: task.taskInstruction,
      taskSubmission: task.taskSubmission,
      taskHour: task.taskHour,
      taskDueDate: task.taskDueDate,
    })
  }

  const handleSaveEdit = (taskId: number) => {
    setTasks(tasks.map((task) => (task.taskId === taskId ? { ...task, ...editingTaskData } : task)))
    setEditingTask(null)
    setEditingTaskData({})
  }

  const handleDownloadFile = (fileName: string, url: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleApprove = (taskId: number) => {
    setTasks(tasks.map((task) => (task.taskId === taskId ? { ...task, taskStatus: "approved" as const } : task)))
  }

  const handleReject = (taskId: number, reason: string) => {
    setTasks(
      tasks.map((task) =>
        task.taskId === taskId ? { ...task, taskStatus: "rejected" as const, rejectReason: reason } : task,
      ),
    )
    setShowRejectDialog(false)
    setRejectingTaskId(null)
    setRejectReason("")
  }

  const openRejectDialog = (taskId: number) => {
    setRejectingTaskId(taskId)
    setShowRejectDialog(true)
  }

  const updateTaskComment = (taskId: number, comment: string) => {
    setTasks(tasks.map((task) => (task.taskId === taskId ? { ...task, taskComment: comment } : task)))
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-6 min-w-3xl">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Task</h1>
        <div className="flex gap-3">

            {isContractEnded && (
                <Button
                onClick={() => setShowCompleteContract(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
                >
                Complete Contract
                </Button>
            )}


          <Button onClick={() => setShowAddForm(true)} className="bg-black hover:bg-gray-800 text-white" disabled={isContractEnded}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Task
          </Button>

          <Button variant="destructive" onClick={() => setShowCancelContract(true)} disabled={isContractEnded}>
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
                <Label htmlFor="taskName" className="mb-2">Task Name</Label>
                <Input
                  id="taskName"
                  value={newTask.taskName}
                  onChange={(e) => setNewTask({ ...newTask, taskName: e.target.value })}
                  placeholder="Enter task name"
                />
              </div>
              <div>
                <Label htmlFor="taskHour" className="mb-2">Task Hours</Label>
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
                <Label htmlFor="taskInstruction" className="mb-2">Task Instructions</Label>
                <Textarea
                  id="taskInstruction"
                  value={newTask.taskInstruction}
                  onChange={(e) => setNewTask({ ...newTask, taskInstruction: e.target.value })}
                  placeholder="Detailed task instructions"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="taskSubmission" className="mb-2">Submission Requirements</Label>
                <Textarea
                  id="taskSubmission"
                  value={newTask.taskSubmission}
                  onChange={(e) => setNewTask({ ...newTask, taskSubmission: e.target.value })}
                  placeholder="What should the freelancer submit?"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="taskDueDate" className="mb-2">Due Date</Label>
                <Input
                  id="taskDueDate"
                  type="datetime-local"
                  value={newTask.taskDueDate}
                  onChange={(e) => setNewTask({ ...newTask, taskDueDate: e.target.value })}
                />
              </div>

              <div>
                <Label className="mb-2">Total Balance Required</Label>
                <p className="text-lg font-semibold text-blue-700">
                    ${calculatedPay}
                </p>
              </div>

            </div>
            <div className="flex gap-3 mt-4">
              <Button onClick={handleAddTask} className="bg-black hover:bg-gray-800 text-white" disabled={!isAddTaskFormValid()}>
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
        {tasks.map((task) => (
          <Card key={task.taskId} className="border border-gray-200">
            <CardContent className="p-6 ">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{task.taskName}</h3>
                    <Badge className={getStatusColor(task.taskStatus)}>{task.taskStatus.toUpperCase()}</Badge>
                  </div>
                  <p className="text-gray-600 mb-2">Contract ID: {task.contractId}</p>
                </div>
                {(task.taskStatus === "pending" || task.taskStatus === "submitted") && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => (editingTask === task.taskId ? handleSaveEdit(task.taskId) : handleEditTask(task))}
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
                        className="mt-1"
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

                  {/* Submitted Files Section */}
                  {task.submittedFiles && task.submittedFiles.length > 0 && (
                    <div>
                      <Label className="font-semibold">Submitted Files</Label>
                      <div className="space-y-2 mt-2">
                        {task.submittedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-900">{file.name}</span>
                              <span className="text-xs text-blue-600">({file.size} MB)</span>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadFile(file.name, file.url)}
                              className="text-blue-600 border-blue-200 hover:bg-blue-100"
                            >
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
                      <p className="text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200">
                        {task.taskSubmissionNote}
                      </p>
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
                          onChange={(e) => setEditingTaskData({ ...editingTaskData, taskHour: e.target.value })}
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-gray-700">{task.taskHour} hours</p>
                      )}
                    </div>
                    <div>
                      <Label className="font-semibold mb-2">Total Pay</Label>
                      <p className="text-gray-700">${ (Number(task.taskTotalPay) / 100).toFixed(2) }</p>
                    </div>
                    <div>
                      <Label className="font-semibold mb-2">Due Date</Label>
                      {editingTask === task.taskId ? (
                        <Input
                          type="date"
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
                        value={task.taskComment}
                        onChange={(e) => updateTaskComment(task.taskId, e.target.value)}
                        placeholder="Add your comment for the freelancer..."
                        rows={2}
                        className="mt-1"
                      />
                    ) : task.taskStatus === "submitted" && editingTask === task.taskId ? (
                      <Textarea
                        value={task.taskComment}
                        onChange={(e) => updateTaskComment(task.taskId, e.target.value)}
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
                        <Button
                          onClick={() => handleApprove(task.taskId)}
                          className="bg-green-600 hover:bg-green-700 text-white flex-1"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button variant="destructive" onClick={() => openRejectDialog(task.taskId)} className="flex-1">
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full border border-gray-200 bg-white hover:bg-gray-50">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat with Freelancer
                        </Button>
                        <p className="text-xs text-gray-600 text-center">
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
        ))}
      </div>

      {/* Reject Task Dialog */}
      {showRejectDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Reject Task</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reject-reason">Reason for Rejection</Label>
                  <Textarea
                    id="reject-reason"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Please explain what needs to be changed or improved..."
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

      {/* Complete Contract Dialog */}
      {showCompleteContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Complete Contract</h3>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Are you sure you want to mark this contract as complete? This action cannot be undone.
                </p>
                <div>
                  <Label htmlFor="completion-notes">Final Notes (Optional)</Label>
                  <Textarea
                    id="completion-notes"
                    placeholder="Add any final comments about the completed work..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowCompleteContract(false)} className="flex-1">
                  Cancel
                </Button>
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">Complete Contract</Button>
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
                  Are you sure you want to cancel this contract? This action cannot be undone.
                </p>
                <div>
                  <Label htmlFor="cancellation-reason">Reason for Cancellation *</Label>
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
                    // Handle contract cancellation logic here
                    console.log("Contract cancelled with reason:", cancellationReason)
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
