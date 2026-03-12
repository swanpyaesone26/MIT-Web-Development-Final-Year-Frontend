import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ChevronLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { useAssignmentDetail, useUpdateAssignment } from "@/queries/teacher.query";
import { formatDate } from "@/util/herlper";
import { FormInput } from "@/components/core/FormInput";
import { FormDatePicker } from "@/components/core/FormDatePicker";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const dummyStudents = [
  {
    id: 1,
    name: "Aung Aung",
    submitted: true,
    score: 80,
    attachments: [
      "/files/react-assignment.pdf",
      "/files/design.png",
    ],
  },
  {
    id: 2,
    name: "Kyaw Kyaw",
    submitted: true,
    score: 70,
    attachments: [
      "/files/demo-video.mp4",
      "/files/ui-doc.docx",
    ],
  },
  {
    id: 3,
    name: "Htet Htet",
    submitted: false,
    attachments: [],
  },
  {
    id: 4,
    name: "Mya Mya",
    submitted: false,
    attachments: [],
  },
];
const assignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string({ message: "Description is required" }),
  dueDate: z.string({ message: "Due date is required" }),
});

export type AssignmentForm = z.infer<typeof assignmentSchema>;
const AssignmentDetailPage = () => {
  const { id } = useParams();
  const assignmentId = Number(id)
  const { data, isPending } = useAssignmentDetail(assignmentId);
  const { mutate } = useUpdateAssignment();
  const [open, setOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
    },
    resolver: zodResolver(assignmentSchema),
  });
  console.log("formdata : ", data);
  const onSubmit = (values: AssignmentForm) => {
    mutate(
      { id: assignmentId, data: values },
      {
        onSuccess: () => {
          form.reset();
          setOpen(false);
        },
      }
    );
  };

  if (!id) {
    throw new Error("Assignment ID is missing");
  }
  const handleEditClick = () => {
    if (assignment) {
      form.reset({
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
      });
    }
    setOpen(true);
  };

  const assignment = data?.data;
  console.log(assignment)
  const navigate = useNavigate();
  const isOverdue = assignment?.is_closed

  const [activeTab, setActiveTab] = useState<"submitted" | "unsubmitted">(
    "submitted"
  );
  const [students, setStudents] = useState(dummyStudents);

  const updateScore = (studentId: number, newScore: number) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, score: newScore } : s))
    );
  };

  const submittedStudents = students.filter((s) => s.submitted);
  const unsubmittedStudents = students.filter((s) => !s.submitted);

  const getFileIcon = (file: string) => {
    const ext = file.split(".").pop()?.toLowerCase();
    if (["png", "jpg", "jpeg"].includes(ext!)) return "🖼️";
    if (["mp4", "webm"].includes(ext!)) return "🎥";
    if (ext === "pdf") return "📄";
    if (["doc", "docx"].includes(ext!)) return "📝";
    return "📁";
  };

  const getFileName = (file: string) => {
    return file.split("/").pop();
  };
  if (isPending) return <p className="text-center mt-10">Loading...</p>;
  if (!id) {
    throw new Error("Assignment ID is missing");
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <Button
        variant="secondary"
        className="flex items-center gap-2 shadow-sm text-primary hover:text-teal-800 hover:shadow-sm font-medium"
        onClick={() => navigate(-1)}
      >
        <ChevronLeftIcon className="w-5 h-5" />
        Back
      </Button>


      {/* Assignment Detail Info */}
      <div className="bg-white p-4 rounded-lg shadow flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-teal-900">{assignment?.title}<span
            className={`px-3 py-1 ml-3 text-xs font-medium rounded-full ${isOverdue
              ? "bg-red-100 text-red-600"
              : "bg-green-100 text-green-600"
              }`}
          >
            {isOverdue ? "Overdue" : "Active"}
          </span></h2>
          <p className="text-base text-teal-700">
            {assignment?.description}
          </p>
          <p className="text-base text-primary">Due Date: <span className="text-teal-900"> {formatDate(assignment?.dueDate)}</span></p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleEditClick} variant="outline" size="sm">
              Edit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <DialogHeader className="mb-3">
                  <DialogTitle>Edit Assignment</DialogTitle>
                  <DialogDescription>
                    Update the assignment details below and click save.
                  </DialogDescription>
                </DialogHeader>

                <FieldGroup className="mb-6">
                  <FormInput
                    name="title"
                    placeholder="Enter title"
                    label="Title"
                    defaultValue={assignment?.title}
                  />
                  <FormInput
                    name="description"
                    placeholder="Enter description"
                    label="Description"
                    defaultValue={assignment?.description}
                  />
                  <FormDatePicker
                    name="dueDate"
                    label="Due Date"
                    disabled={[{ before: new Date() }]}
                    endMonth={new Date(new Date().getFullYear() + 10, 11)}
                    defaultValue={assignment?.dueDate}
                  />
                </FieldGroup>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">{isPending ? "Saving..." : "Save"}</Button>
                </DialogFooter>
              </form>
            </FormProvider>
          </DialogContent>
        </Dialog>

      </div>
      {assignment?.submissions.length > 0 ? (
        <>
          {/* Tabs */}
          <div className="flex space-x-4 border-b pb-2 mt-4">
            <button
              className={`px-4 py-2 rounded-t-lg font-medium ${activeTab === "submitted"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:text-gray-800"
                }`}
              onClick={() => setActiveTab("submitted")}
            >
              Submitted Students ({submittedStudents.length})
            </button>

            <button
              className={`px-4 py-2 rounded-t-lg font-medium ${activeTab === "unsubmitted"
                ? "bg-red-100 text-red-700"
                : "text-gray-600 hover:text-gray-800"
                }`}
              onClick={() => setActiveTab("unsubmitted")}
            >
              Unsubmitted Students ({unsubmittedStudents.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white p-4 rounded-lg shadow space-y-3">
            {/* Submitted Students */}
            {activeTab === "submitted" &&
              submittedStudents.map((student) => (
                <div
                  key={student.id}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <span>{student.name}</span>

                  <div className="flex items-center gap-2">
                    {/* Score Input */}
                    <Input
                      type="number"
                      value={student.score ?? ""}
                      onChange={(e) =>
                        setStudents((prev) =>
                          prev.map((s) =>
                            s.id === student.id
                              ? { ...s, score: Number(e.target.value) }
                              : s
                          )
                        )
                      }
                      placeholder="Score"
                      className="w-20"
                    />

                    {/* Detail Modal */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="default">
                          View Files
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>{student.name} Submission</DialogTitle>
                        </DialogHeader>

                        {student.attachments && student.attachments.length > 0 ? (
                          <div className="space-y-2 mt-4">
                            {student.attachments.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between border rounded p-2"
                              >
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{getFileIcon(file)}</span>
                                  <span className="text-sm font-medium">
                                    {getFileName(file)}
                                  </span>
                                </div>

                                <a
                                  href={file}
                                  target="_blank"
                                  className="text-blue-600 text-sm font-medium hover:underline"
                                >
                                  Open
                                </a>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground mt-4">
                            No files submitted.
                          </p>
                        )}

                        <DialogClose asChild>
                          <Button className="mt-4 w-full">Close</Button>
                        </DialogClose>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}

            {/* Unsubmitted Students */}
            {activeTab === "unsubmitted" &&
              unsubmittedStudents.map((student) => (
                <div key={student.id} className="p-2 border rounded">
                  {student.name}
                </div>
              ))}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-36">No submissions yet.</p>
      )}

    </div >
  );
};

export default AssignmentDetailPage;