import { errorToast, successToast } from "@/lib/toast";
import { loginUser } from "@/services/auth";
import { useAuthStore } from "@/store/user-store";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export const useLoginMutation = () => {
const navigate= useNavigate()
  const logInStore = useAuthStore((state) => state.logIn);
  return useMutation({
    mutationFn: (data: Login) => loginUser(data),
    onSuccess: (response) => {
        if (response) {
            if (response.data.user.role === 'teacher') {
                navigate('/teacher')
            } else {
                navigate('/student')
            }
        successToast(
          "Login Successful","Welcome back! You’ve logged in successfully."
        );
          const { tokens, user } = response.data;
            if (tokens.refreshToken) localStorage.setItem("refreshToken", tokens.refreshToken);
            logInStore(tokens.accessToken, user);
      }
    },
    onError: (err) => {
      errorToast("Login Failed!!", err.message);
    },
  });
};