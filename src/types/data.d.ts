export {};

declare global {
  type Subject = {
  subject_id: number;
  subject_name: string;
};

type Year = {
  year_id: number;
  year_name: string;
};

type TeacherProfile = {
  teacher_id: number;
  teacher_name: string;
  subject: Subject;
  year: Year;
  rooms: unknown[]; 
};

 type User = {
        id: number;
        name: string;
        role: "teacher" | "student" | "admin";
      };

  type Login = {
    username: string;
    password: string;
  };
 type LoginResponse = {
    status: "success" | "error";
    message: string;
    data: {
      tokens: {
        accessToken: string;
        refreshToken: string;
      };
      user: {
        id: number;
        name: string;
        role: "teacher" | "student" | "admin";
      };
    }
 }
  type AssignmentPayload = {
    title: string,
    description: string,
    dueDate : string
  }
   type Assignment = {
  id: number;
  title: string;
  description: string;
  dueDate: string; 
  subject: string;
  score? : number,
  submitted? : boolean,
  submissions: number;
  totalStudents: number;
  is_closed: boolean;
  status: "active" | "inactive"; 
  createdAt: string;
  updatedAt: string;
};
type Submission = {
  studentId: number;
  name: string;
  score?: number;
  attachments: string;
  submitted: true;
}

}