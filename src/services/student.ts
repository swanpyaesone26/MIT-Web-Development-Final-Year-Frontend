import API from "@/util/axiosInstance";
import { HelperError } from "@/util/herlper";

export const getAllAssignment = async () => {
  try {
    const response = await API.get(
      `/student/assignments/`
    );
    return response.data;
  } catch (error) {
    HelperError(error);
  }
};
export const createAssignment = async (data : AssignmentPayload)=>{
    try{
        const response = await API.post('/student/assignments/',data)
        return response.data
    }catch(error){
        HelperError(error)
    }
}

export const getAssignmentDetail = async (id: number) => {
  try {
    const response = await API.get(`/student/assignments/${id}`);
    return response.data;
  } catch (error) {
    HelperError(error);
  }
};

export const getAllScore = async () => {
  try {
    const response = await API.get(
      `/student/scores/`
    );
    return response.data;
  } catch (error) {
    HelperError(error);
  }
};



export const submitAssignment = async (assignmentId: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file); 

  const response = await API.post(
    `/student/assignments/${assignmentId}/submit/`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


