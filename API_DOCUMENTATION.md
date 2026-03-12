# API Documentation

**Base URL:** `http://localhost:8000/api/`

---

## Authentication

### Login

**Method:** POST  
**Endpoint:** `/auth/login/`

**Description:**  
Authenticate user and receive access and refresh tokens.

**Request Headers**
```
Content-Type: application/json
```

**Request Body**
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response (200 OK)**
```json
{
  "message": "Login successful",
  "data": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401 Unauthorized)**
```json
{
  "message": "Authentication failed",
  "errors": {
    "username": "Invalid username or password"
  }
}
```

---

### Refresh Token

**Method:** POST  
**Endpoint:** `/auth/refresh/`

**Description:**  
Refresh the access token using a valid refresh token.

**Request Headers**
```
Content-Type: application/json
```

**Request Body**
```json
{
  "refresh": "string"
}
```

**Success Response (200 OK)**
```json
{
  "message": "Token refreshed successfully",
  "data": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401 Unauthorized)**
```json
{
  "message": "Invalid refresh token",
  "errors": {
    "refresh": "Token is invalid or expired"
  }
}
```

---

## Teacher Endpoints

All teacher endpoints require authentication header:  
`Authorization: Bearer <access_token>`

### Get Assignments (Teacher)

**Method:** GET  
**Endpoint:** `/teacher/assignments/`

**Description:**  
Retrieve all assignments created by the authenticated teacher.

**Request Headers**
```
Authorization: Bearer <token>
```

**Success Response (200 OK)**
```json
{
  "message": "Assignments retrieved successfully",
  "data": [
    {
      "assignment_id": 1,
      "teacher": 1,
      "assignment_name": "Math Homework Chapter 5",
      "due_date": "2026-03-15T23:59:59Z",
      "created_at": "2026-03-01T10:00:00Z",
      "updated_at": "2026-03-01T10:00:00Z"
    }
  ]
}
```

**Error Response (401 Unauthorized)**
```json
{
  "message": "Authentication failed",
  "errors": {
    "authorization": "Invalid or missing token"
  }
}
```

**Error Response (403 Forbidden)**
```json
{
  "message": "Access denied",
  "errors": {
    "permission": "You are not a teacher"
  }
}
```

---

### Create Assignment (Teacher)

**Method:** POST  
**Endpoint:** `/teacher/assignments/`

**Description:**  
Create a new assignment for students.

**Request Headers**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body**
```json
{
  "assignment_name": "Math Homework Chapter 5",
  "due_date": "2026-03-15T23:59:59Z"
}
```

**Success Response (201 Created)**
```json
{
  "message": "Assignment created successfully",
  "data": {
    "assignment_id": 1,
    "teacher": 1,
    "assignment_name": "Math Homework Chapter 5",
    "due_date": "2026-03-15T23:59:59Z",
    "created_at": "2026-03-01T10:00:00Z",
    "updated_at": "2026-03-01T10:00:00Z"
  }
}
```

**Error Response (400 Bad Request)**
```json
{
  "message": "Validation failed",
  "errors": {
    "assignment_name": "Assignment name is required",
    "due_date": "Due date must be a future date"
  }
}
```

---

### Get Submissions for Assignment (Teacher)

**Method:** GET  
**Endpoint:** `/teacher/assignments/<assignment_id>/submissions/`

**Description:**  
Retrieve all student submissions for a specific assignment.

**Request Headers**
```
Authorization: Bearer <token>
```

**Success Response (200 OK)**
```json
{
  "message": "Submissions retrieved successfully",
  "data": [
    {
      "submission_id": 1,
      "assignment": 1,
      "student": 1,
      "file": "http://localhost:8000/media/submissions/file.pdf",
      "score": 85.5,
      "submitted_at": "2026-03-10T14:30:00Z",
      "updated_at": "2026-03-10T14:30:00Z"
    }
  ]
}
```

**Error Response (404 Not Found)**
```json
{
  "message": "Assignment not found",
  "errors": {
    "assignment": "Assignment with the given ID does not exist"
  }
}
```

---

### Score Submission (Teacher)

**Method:** PATCH  
**Endpoint:** `/teacher/submissions/<submission_id>/score/`

**Description:**  
Update the score for a student's submission.

**Request Headers**
```
Content-Type: application/json
Authorization: Bearer <token>
```

**Request Body**
```json
{
  "score": 85.5
}
```

**Success Response (200 OK)**
```json
{
  "message": "Score updated successfully",
  "data": {
    "submission_id": 1,
    "assignment": 1,
    "student": 1,
    "file": "http://localhost:8000/media/submissions/file.pdf",
    "score": 85.5,
    "submitted_at": "2026-03-10T14:30:00Z",
    "updated_at": "2026-03-10T14:30:00Z"
  }
}
```

**Error Response (400 Bad Request)**
```json
{
  "message": "Validation failed",
  "errors": {
    "score": "Score must be between 0 and 100"
  }
}
```

**Error Response (404 Not Found)**
```json
{
  "message": "Submission not found",
  "errors": {
    "submission": "Submission with the given ID does not exist"
  }
}
```

---

## Student Endpoints

All student endpoints require authentication header:  
`Authorization: Bearer <access_token>`

### Get Assignments (Student)

**Method:** GET  
**Endpoint:** `/student/assignments/`

**Description:**  
Retrieve all available assignments for the authenticated student.

**Request Headers**
```
Authorization: Bearer <token>
```

**Success Response (200 OK)**
```json
{
  "message": "Assignments retrieved successfully",
  "data": [
    {
      "assignment_id": 1,
      "teacher": 1,
      "assignment_name": "Math Homework Chapter 5",
      "due_date": "2026-03-15T23:59:59Z",
      "created_at": "2026-03-01T10:00:00Z",
      "updated_at": "2026-03-01T10:00:00Z"
    }
  ]
}
```

**Error Response (401 Unauthorized)**
```json
{
  "message": "Authentication failed",
  "errors": {
    "authorization": "Invalid or missing token"
  }
}
```

**Error Response (403 Forbidden)**
```json
{
  "message": "Access denied",
  "errors": {
    "permission": "You are not a student"
  }
}
```

---

### Submit Assignment (Student)

**Method:** POST  
**Endpoint:** `/student/assignments/<assignment_id>/submit/`

**Description:**  
Submit a file for a specific assignment.

**Request Headers**
```
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

**Request Body (Form Data)**
```
file: <File>
```

**Success Response (201 Created)**
```json
{
  "message": "Assignment submitted successfully",
  "data": {
    "submission_id": 1,
    "assignment": 1,
    "student": 1,
    "file": "http://localhost:8000/media/submissions/file.pdf",
    "score": null,
    "submitted_at": "2026-03-10T14:30:00Z",
    "updated_at": "2026-03-10T14:30:00Z"
  }
}
```

**Error Response (400 Bad Request)**
```json
{
  "message": "Validation failed",
  "errors": {
    "file": "File is required"
  }
}
```

**Error Response (404 Not Found)**
```json
{
  "message": "Assignment not found",
  "errors": {
    "assignment": "Assignment with the given ID does not exist"
  }
}
```

---

### Get Scores (Student)

**Method:** GET  
**Endpoint:** `/student/scores/`

**Description:**  
Retrieve all scored submissions for the authenticated student.

**Request Headers**
```
Authorization: Bearer <token>
```

**Success Response (200 OK)**
```json
{
  "message": "Scores retrieved successfully",
  "data": [
    {
      "submission_id": 1,
      "assignment": 1,
      "student": 1,
      "file": "http://localhost:8000/media/submissions/file.pdf",
      "score": 85.5,
      "submitted_at": "2026-03-10T14:30:00Z",
      "updated_at": "2026-03-10T14:30:00Z"
    }
  ]
}
```

**Error Response (401 Unauthorized)**
```json
{
  "message": "Authentication failed",
  "errors": {
    "authorization": "Invalid or missing token"
  }
}
```

---

## React TypeScript Usage Example

```typescript
const BASE_URL = "http://localhost:8000/api/";

// Login
const login = async (username: string, password: string) => {
  const response = await fetch(`${BASE_URL}auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  const result = await response.json();
  return result.data; // Returns { access, refresh }
};

// Get assignments (Teacher)
const getTeacherAssignments = async (token: string) => {
  const response = await fetch(`${BASE_URL}teacher/assignments/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const result = await response.json();
  return result.data; // Returns array of assignments
};

// Create assignment (Teacher)
const createAssignment = async (token: string, assignmentName: string, dueDate: string) => {
  const response = await fetch(`${BASE_URL}teacher/assignments/`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify({ assignment_name: assignmentName, due_date: dueDate })
  });
  const result = await response.json();
  return result.data; // Returns created assignment
};

// Submit assignment (Student)
const submitAssignment = async (token: string, assignmentId: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch(`${BASE_URL}student/assignments/${assignmentId}/submit/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  const result = await response.json();
  return result.data; // Returns submission details
};
```

---

## TypeScript Interfaces

```typescript
// API Response Wrapper
interface ApiResponse<T> {
  message: string;
  data: T;
}

interface ApiErrorResponse {
  message: string;
  errors: Record<string, string>;
}

// Authentication
interface LoginResponse {
  access: string;
  refresh: string;
}

interface RefreshResponse {
  access: string;
}

// Assignment
interface Assignment {
  assignment_id: number;
  teacher: number;
  assignment_name: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

// Submission
interface Submission {
  submission_id: number;
  assignment: number;
  student: number;
  file: string;
  score: number | null;
  submitted_at: string;
  updated_at: string;
}

// Usage Examples
type LoginApiResponse = ApiResponse<LoginResponse>;
type AssignmentsApiResponse = ApiResponse<Assignment[]>;
type SubmissionApiResponse = ApiResponse<Submission>;
```
