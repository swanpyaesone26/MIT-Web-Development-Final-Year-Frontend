import { errorToast, successToast } from "@/lib/toast";
import { createAssignment, getAllAssignment, getAssignmentDetail, getAssignmentSubmissions, scoreSubmission, updateAssignment } from "@/services/teacher";
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

export const useUpdateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AssignmentPayload }) =>
      updateAssignment(id, data),
    onSuccess: (response) => {
       if (response) {
        successToast(
          " Successful","Update Assignment Successfully."
        );
      }
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
       queryClient.refetchQueries({ queryKey: ["assignment"], exact: false });
    },
     onError: (err) => {
      errorToast("Update Assignment Failed!!", err.message);
    },
  });
};

export const useSubmissions = (assignmentId: number) => {
  return useQuery({
    queryKey: ["submissions", assignmentId],
    queryFn: () => getAssignmentSubmissions(assignmentId),
    enabled: !!assignmentId,
  });
};

export const useScoreSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ submissionId, data }: { submissionId: number; data: { studentId: number; score: number } }) =>
      scoreSubmission(submissionId, data),
    onSuccess: () => {
      successToast("Successful", "Score updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
    onError: (err) => {
      errorToast("Score Update Failed!", err.message);
    },
  });
};
