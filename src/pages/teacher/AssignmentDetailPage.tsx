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
import { useAssignmentDetail, useUpdateAssignment, useSubmissions, useScoreSubmission } from "@/queries/teacher.query";
import { formatDate } from "@/util/herlper";
import { FormInput } from "@/components/core/FormInput";
import { FormDatePicker } from "@/components/core/FormDatePicker";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

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
  const { data: submissionsData } = useSubmissions(assignmentId);
  const { mutate: scoreMutate, isPending: isScoring } = useScoreSubmission();
  const [open, setOpen] = useState(false);
  const [scores, setScores] = useState<Record<number, number | "">>({});
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
  const submissions: SubmissionDetail[] = submissionsData?.data || [];
  const navigate = useNavigate();
  const isOverdue = assignment?.is_closed;

  const [activeTab, setActiveTab] = useState<"submitted" | "unsubmitted">(
    "submitted"
  );

  const unsubmittedCount = (assignment?.totalStudents ?? 0) - submissions.length;

  const handleScoreSave = (submission: SubmissionDetail) => {
    const score = scores[submission.submission_id];
    if (score === "" || score === undefined) return;
    scoreMutate({
      submissionId: submission.submission_id,
      data: { studentId: submission.student, score: Number(score) },
    });
  };

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

  const getFileUrl = (file: string) => {
    if (file.startsWith("http")) return file;
    return `https://swan-school-management-storage.s3.amazonaws.com${file}`;
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
      {assignment?.submissions > 0 ? (
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
              Submitted Students ({submissions.length})
            </button>

            <button
              className={`px-4 py-2 rounded-t-lg font-medium ${activeTab === "unsubmitted"
                ? "bg-red-100 text-red-700"
                : "text-gray-600 hover:text-gray-800"
                }`}
              onClick={() => setActiveTab("unsubmitted")}
            >
              Unsubmitted Students ({unsubmittedCount})
            </button>
          </div>

          {/* Tab Content */}
          <div className="bg-white p-4 rounded-lg shadow space-y-3">
            {/* Submitted Students */}
            {activeTab === "submitted" &&
              submissions.map((submission: SubmissionDetail) => (
                <div
                  key={submission.submission_id}
                  className="flex items-center justify-between p-3 border rounded"
                >
                  <span>{submission.student_name}</span>

                  <div className="flex items-center gap-2">
                    {/* Score Input */}
                    <Input
                      type="number"
                      value={scores[submission.submission_id] ?? submission.score ?? ""}
                      onChange={(e) =>
                        setScores((prev) => ({
                          ...prev,
                          [submission.submission_id]: e.target.value === "" ? "" : Number(e.target.value),
                        }))
                      }
                      placeholder="Score"
                      className="w-20"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleScoreSave(submission)}
                      disabled={isScoring}
                    >
                      {isScoring ? "..." : "Save"}
                    </Button>

                    {/* Detail Modal */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="default">
                          View Files
                        </Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>{submission.student_name} Submission</DialogTitle>
                        </DialogHeader>

                        {submission.file ? (
                          <div className="space-y-2 mt-4">
                            <div className="flex items-center justify-between border rounded p-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getFileIcon(submission.file)}</span>
                                <span className="text-sm font-medium">
                                  {getFileName(submission.file)}
                                </span>
                              </div>

                              <a
                                href={getFileUrl(submission.file)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 text-sm font-medium hover:underline"
                              >
                                Open
                              </a>
                            </div>
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
            {activeTab === "unsubmitted" && (
              <p className="text-gray-500 text-center py-4">
                {unsubmittedCount} student(s) haven't submitted yet.
              </p>
            )}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500 mt-36">No submissions yet.</p>
      )}

    </div >
  );
};

export default AssignmentDetailPage;