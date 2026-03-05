# API Documentation

**Base URL:** `http://localhost:8000/api/`

---

## Authentication

### Login
- **POST** `/auth/login/`
  - **Request:**
    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```
  - **Response:**
    ```json
    {
      "access": "string",
      "refresh": "string"
    }
    ```

### Refresh Token
- **POST** `/auth/refresh/`
  - **Request:**
    ```json
    {
      "refresh": "string"
    }
    ```
  - **Response:**
    ```json
    {
      "access": "string"
    }
    ```

---

## Teacher Endpoints

All teacher endpoints require authentication header:  
`Authorization: Bearer <access_token>`

### Get Assignments (Teacher)
- **GET** `/teacher/assignments/`
  - **Response:**
    ```json
    [
      {
        "assignment_id": 1,
        "teacher": 1,
        "assignment_name": "string",
        "due_date": "2026-03-15T23:59:59Z",
        "created_at": "2026-03-01T10:00:00Z",
        "updated_at": "2026-03-01T10:00:00Z"
      }
    ]
    ```

### Create Assignment (Teacher)
- **POST** `/teacher/assignments/`
  - **Request:**
    ```json
    {
      "assignment_name": "string",
      "due_date": "2026-03-15T23:59:59Z"
    }
    ```
  - **Response:**
    ```json
    {
      "assignment_id": 1,
      "teacher": 1,
      "assignment_name": "string",
      "due_date": "2026-03-15T23:59:59Z",
      "created_at": "2026-03-01T10:00:00Z",
      "updated_at": "2026-03-01T10:00:00Z"
    }
    ```

### Get Submissions for Assignment (Teacher)
- **GET** `/teacher/assignments/<assignment_id>/submissions/`
  - **Response:**
    ```json
    [
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
    ```

### Score Submission (Teacher)
- **PATCH** `/teacher/submissions/<submission_id>/score/`
  - **Request:**
    ```json
    {
      "score": 85.5
    }
    ```
  - **Response:**
    ```json
    {
      "submission_id": 1,
      "assignment": 1,
      "student": 1,
      "file": "http://localhost:8000/media/submissions/file.pdf",
      "score": 85.5,
      "submitted_at": "2026-03-10T14:30:00Z",
      "updated_at": "2026-03-10T14:30:00Z"
    }
    ```

---

## Student Endpoints

All student endpoints require authentication header:  
`Authorization: Bearer <access_token>`

### Get Assignments (Student)
- **GET** `/student/assignments/`
  - **Response:**
    ```json
    [
      {
        "assignment_id": 1,
        "teacher": 1,
        "assignment_name": "string",
        "due_date": "2026-03-15T23:59:59Z",
        "created_at": "2026-03-01T10:00:00Z",
        "updated_at": "2026-03-01T10:00:00Z"
      }
    ]
    ```

### Submit Assignment (Student)
- **POST** `/student/assignments/<assignment_id>/submit/`
  - **Headers:** `Content-Type: multipart/form-data`
  - **Request (Form Data):**
    ```
    file: <File>
    ```
  - **Response:**
    ```json
    {
      "submission_id": 1,
      "assignment": 1,
      "student": 1,
      "file": "http://localhost:8000/media/submissions/file.pdf",
      "score": null,
      "submitted_at": "2026-03-10T14:30:00Z",
      "updated_at": "2026-03-10T14:30:00Z"
    }
    ```

### Get Scores (Student)
- **GET** `/student/scores/`
  - **Response:**
    ```json
    [
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
    ```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Error message"
}
```

### 403 Forbidden
```json
{
  "error": "You are not a teacher."
}
```
or
```json
{
  "error": "You are not a student."
}
```

### 404 Not Found
```json
{
  "error": "Assignment not found."
}
```
or
```json
{
  "error": "Submission not found."
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
  return response.json();
};

// Get assignments (Teacher)
const getTeacherAssignments = async (token: string) => {
  const response = await fetch(`${BASE_URL}teacher/assignments/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.json();
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
  return response.json();
};
```

---

## TypeScript Interfaces

```typescript
interface LoginResponse {
  access: string;
  refresh: string;
}

interface Assignment {
  assignment_id: number;
  teacher: number;
  assignment_name: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

interface Submission {
  submission_id: number;
  assignment: number;
  student: number;
  file: string;
  score: number | null;
  submitted_at: string;
  updated_at: string;
}
```
