import { EmploymentType } from "./applicant";

// Station names
export type StationName =
  | "pantry"
  | "grill"
  | "fryman"
  | "back-up"
  | "stockman"
  | "counter"
  | "dining"
  | "drive-thru"
  | "jeds"
  | "um"
  | "sc";

export type StationStatus =
  | "no-status"
  | "initial"
  | "follow-up"
  | "certify"
  | "recertify";

export type Employee = {
  id: string;
  fullname: string;
  email: string | null;
  type: EmploymentType;
  deployed_at: string;
  applicant_id: string;
};

export type EmployeeCreate = Omit<Employee, "id" | "deployed_at">;
export type EmployeeUpdate = Partial<Omit<Employee, "id" | "deployed_at">> & {
  id: string;
};

export type EmployeeStation = {
  id: string;
  employee_id: string;
  station_name: StationName | null;
  assigned_at: string;
  status: StationStatus;
};

export type EmployeeStationCreate = Omit<
  EmployeeStation,
  "id" | "assigned_at"
> & {
  status?: StationStatus;
};

export type EmployeeStationUpdate = Partial<
  Omit<EmployeeStation, "id" | "assigned_at">
> & {
  id: string;
};
