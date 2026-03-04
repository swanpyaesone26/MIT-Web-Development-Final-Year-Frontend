
import CalendarPage from "@/pages/Home/Home";
import { createBrowserRouter } from "react-router-dom";


const router = createBrowserRouter([
    {
        path : '/',
        element : <CalendarPage/>,
    }
])

export default router