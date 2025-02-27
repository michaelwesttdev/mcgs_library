export type Student = {
  id: string;
  name: string;
  email: string;
  grade: string;
  enrollmentDate: string;
};

export type StudentFormData = Omit<Student, "id">;
