import API from "@/util/axiosInstance"
import { HelperError } from "@/util/herlper"

export const loginUser =async (data : Login)=>{
    try{
        const response =await API.post('/auth/login/',data)
        return response.data
    }catch (error) {
      console.log("login",error)
          HelperError(error)
          }
}
export const getUser = async () => {
  try {
    const response = await API.get('/auth/profile/');
    return response.data;
  } catch (error) {
    HelperError(error);
  }
};