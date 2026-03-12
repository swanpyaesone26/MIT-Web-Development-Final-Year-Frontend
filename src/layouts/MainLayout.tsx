import Header from "@/components/core/Header.tsx";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl  space-y-6">

        <Header />
        <div className="  px-4">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default MainLayout;