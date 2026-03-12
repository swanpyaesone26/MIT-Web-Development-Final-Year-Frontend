import { useAuthStore } from "@/store/user-store";
import { Navigate } from "react-router-dom";

const RoleRedirect = () => {
  const user = useAuthStore((state) => state.user);
  console.log("dpfiad", user)

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === "teacher") {
    return <Navigate to="/teacher" replace />;
  }

  return <Navigate to="/student" replace />;
};

export default RoleRedirect;