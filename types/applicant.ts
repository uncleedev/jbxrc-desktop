export type ApplicantStatus =
  | "no-status"
  | "examination"
  | "interview"
  | "requirements"
  | "deployment"
  | "orientation"
  | "cancelled"
  | "deployed";

export type EmploymentType = "working-student" | "full-time";

export type Applicant = {
  id: string;
  fullname: string;
  email: string;
  type: EmploymentType;
  status: ApplicantStatus;
  created_at: string;
  updated_at?: string;
};

export type ApplicantCreate = Omit<
  Applicant,
  "id" | "created_at" | "updated_at"
>;

export type ApplicantUpdate = Partial<Omit<Applicant, "id" | "created_at">> & {
  id: string;
  note?: string;
};
