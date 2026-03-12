import API from "@/util/axiosInstance";
import { HelperError } from "@/util/herlper";

export const getAllAssignment = async () => {
  try {
    const response = await API.get(
      `/teacher/assignments/`
    );
    return response.data;
  } catch (error) {
    HelperError(error);
  }
};
export const createAssignment = async (data : AssignmentPayload)=>{
    try{
        const response = await API.post('/teacher/assignments/',data)
        return response.data
    }catch(error){
        HelperError(error)
    }
}

export const getAssignmentDetail = async (id: number) => {
  try {
    const response = await API.get(`/teacher/assignments/${id}`);
    return response.data;
  } catch (error) {
    HelperError(error);
  }
};

export const updateAssignment = async (id: number, data: AssignmentPayload) => {
  try {
    const response = await API.put(`/teacher/assignments/${id}/`, data);
    return response.data;
  } catch (error) {
    HelperError(error);
    throw error;
  }
};

export const getAssignmentSubmissions = async (assignmentId: number,data : Submission)=> {
  const response = await API.get<{ data: Submission }>(
    `/teacher/assignments/${assignmentId}/submissions/`
  );
  return response.data.data;
};