import { useAssignment } from "@/queries/teacher.query";
import Card from "./Card";

const TeacherPage = () => {
  const { data } = useAssignment();
  const assignments = data?.data || [];

  if (assignments.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-20 text-lg">
        No assignments yet. Add a new assignment!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {assignments.map((assignment: Assignment) => (
        <Card key={assignment.id} assignment={assignment} />
      ))}
    </div>
  );
};

export default TeacherPage;