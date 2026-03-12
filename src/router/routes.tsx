import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";

import LoginPage from "@/pages/auth/LoginPage";
import RoleRedirect from "@/constant/RoleDirect";
import TeacherPage from "@/pages/teacher/TeacherPage";
import StudentPage from "@/pages/student/StudentPage";
import AssignmentDetailPage from "@/pages/teacher/AssignmentDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RoleRedirect />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    element: <MainLayout />,
    children: [
      {
        path: "/teacher",
        element: <TeacherPage />,
      },
      {
        path: "/assignment/:id",
        element: <AssignmentDetailPage />,
      },
      {
        path: "/student",
        element: <StudentPage />,
      },
    ],
  },
]);

export default router;