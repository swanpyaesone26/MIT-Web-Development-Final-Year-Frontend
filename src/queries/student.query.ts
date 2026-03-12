import { errorToast, successToast } from "@/lib/toast";
import { createAssignment, getAllAssignment, getAllScore, getAssignmentDetail, submitAssignment } from "@/services/student";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAssignment = () => {
  return useQuery({
    queryKey: ["assignments"],
    queryFn: () => getAllAssignment()
  });
};

export const useAssignmentMutation = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AssignmentPayload) => createAssignment(data),
    onSuccess: (response) => {
      if (response) {
        successToast(
          " Successful","Create Assignment Successfully."
        );
      }
    queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
    onError: (err) => {
      errorToast("Create Assignment Failed!!", err.message);
    },
  });
};


export const useAssignmentDetail = (id: number) => {
  return useQuery({
    queryKey: ["assignment", id],
    queryFn: () => getAssignmentDetail(id),
    enabled: !!id,
  });
};
export const useScore = () => {
  return useQuery({
    queryKey: ["scores"],
    queryFn: () => getAllScore()
  });
};

export const useSubmitAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ assignmentId, file }: { assignmentId: number; file: File }) =>
      submitAssignment(assignmentId, file),
    onSuccess: () => {
      successToast("Success", "Assignment submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
    onError: (error) => {
      errorToast("Failed", error?.message || "Submit failed");
    },
  });
};
