import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/util/herlper";
import { useNavigate } from "react-router-dom";


interface CardProps {
  assignment: Assignment;
}

const Card = ({ assignment }: CardProps) => {
  const today = new Date();
  const due = new Date(assignment.dueDate);
  const isOverdue = due < today;
  const navigate = useNavigate();

  return (
    <div onClick={() => navigate(`/assignment/${assignment.id}`)} className="w-full bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl hover:scale-101   transition-all duration-100 border border-gray-100">

      <div className="flex justify-between items-start gap-3">
        <h2 className="text-lg md:text-xl font-semibold text-teal-900">
          {assignment.title}
        </h2>

        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${isOverdue
            ? "bg-red-100 text-red-600"
            : "bg-green-100 text-green-600"
            }`}
        >
          {isOverdue ? "Overdue" : "Active"}
        </span>
      </div>

      <p className="text-teal-700 text-sm mt-3">
        {assignment.description}
      </p>

      <Separator className="my-6" />

      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 text-sm text-teal-600">
        <div>
          <p className="font-medium text-teal-900">Due Date</p>
          <p>{formatDate(assignment.dueDate)}</p>
        </div>

        <div>
          <p className="font-medium text-teal-900">Submissions</p>
          <div className="flex">
            <p>{assignment.submissions}</p>/
            <p>{assignment.totalStudents}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Card;