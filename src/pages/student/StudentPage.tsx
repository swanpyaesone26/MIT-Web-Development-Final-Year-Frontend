import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import ScoreChart from "./BarChart";
import { useAssignment, useSubmitAssignment } from "@/queries/student.query";



const StudentPage = () => {
  const { data } = useAssignment()
  console.log('student', data);
  const [open, setOpen] = useState<Record<number, boolean>>({});


  const [assignmentFile, setAssignmentFile] = useState<Record<number, File | null>>({});
  const { mutate: submitMutate, isPending: isSubmitting } = useSubmitAssignment();

  const handleSubmit = (assignmentId: number) => {
    const file = assignmentFile[assignmentId];
    if (!file) {
      return alert("Please select a file first!");
    }
    submitMutate({ assignmentId, file }, {
      onSuccess: () => {
        setAssignmentFile((prev) => ({
          ...prev,
          [assignmentId]: null,
        }));

        setOpen((prev) => ({
          ...prev,
          [assignmentId]: false,
        }));
      },
    });
  };

  const handleFileChange = (assignmentId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setAssignmentFile((prev) => ({
      ...prev,
      [assignmentId]: file,
    }));
  };

  const removeFile = (assignmentId: number) => {
    setAssignmentFile((prev) => ({
      ...prev,
      [assignmentId]: null,
    }));
  };

  const isOverdue = (date: string) => {
    return new Date(date) < new Date();
  };

  return (
    <div className="p-6 space-y-6">
      <ScoreChart />

      <h1 className="text-2xl font-semibold">Assignments</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {data?.data.map((assignment: Assignment) => {
          const overdue = isOverdue(assignment.dueDate);
          return (
            <div
              key={assignment.id}
              className="w-full bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className="flex justify-between items-start gap-3">
                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                  {assignment.title}
                </h2>

                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${overdue
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                    }`}
                >
                  {overdue ? "Overdue" : "Active"}
                </span>
              </div>
              <p className="text-sm mt-2">
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                  {assignment.subject}
                </span>
              </p>

              <p className="text-gray-500 text-sm mt-3">
                {assignment.description}
              </p>

              <Separator className="my-6" />

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-sm text-gray-600">
                <div>
                  <p className="font-medium text-gray-700">Due Date</p>
                  <p>{assignment.dueDate}</p>
                </div>


                <Dialog open={open[assignment.id] || false}
                  onOpenChange={(isOpen) =>
                    setOpen((prev) => ({ ...prev, [assignment.id]: isOpen }))
                  }>
                  {!assignment.submitted && (
                    <DialogTrigger asChild>
                      <Button size="sm">Submit</Button>
                    </DialogTrigger>
                  )}

                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Submit Assignment</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                      <p className="font-medium">{assignment.title}</p>

                      <input
                        type="file"
                        onChange={(e) => handleFileChange(assignment.id, e)}
                        className="border rounded p-2 w-full"
                      />

                      {assignmentFile[assignment.id] && (
                        <div className="flex justify-between items-center border p-2 rounded mt-2">
                          <span className="text-sm">{assignmentFile[assignment.id]?.name}</span>
                          <button
                            onClick={() => removeFile(assignment.id)}
                            className="text-red-500 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>

                      {/* Upload button inside dialog */}
                      {!assignment.submitted && (
                        <Button
                          onClick={() => handleSubmit(assignment.id)}
                          disabled={!assignmentFile[assignment.id] || isSubmitting}
                        >
                          {isSubmitting ? "Uploading..." : "Upload"}
                        </Button>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>

              </div>
            </div>
          );
        })}
      </div>
    </div >
  );
};

export default StudentPage;