// import { useAuthStore } from "@/store/user-store";

import { AddAssignmentDialog } from "@/pages/teacher/CreateForm";
import { useAuthStore } from "@/store/user-store";

// import { useModalStore } from "@/store/model-store";

const Header = () => {
  const user = useAuthStore((state) => state.user);
  // if (!user) return null;

  const isTeacher = user?.role === "teacher";


  return (
    <div className="w-full m-4">
      <div className="bg-white rounded-lg shadow-md p-2 md:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-primary">
          {isTeacher ? "Teacher" : "Student"} Dashboard
        </h1>

        <div className="flex items-center gap-3">
          <img
            src="/public/images/rose.jpeg"
            alt="profile"
            className="w-10 h-10 rounded-full object-cover border border-teal-800"
          />
          <h2 className="font-medium text-teal-900 ">
            {user?.name}
          </h2>
        </div>
      </div>

      <div className=" p-2 md:p-4  flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-primary">
            Welcome {user?.name}
            {/* <span className=" ml-2 bg-blue-200 py-1 px-3 rounded-md font-medium text-blue-600">{user?.profile?.subject?.subject_name}</span> */}
          </h2>

        </div>

        {isTeacher && (
          <AddAssignmentDialog />
        )}

      </div>
    </div>
  );
};

export default Header;