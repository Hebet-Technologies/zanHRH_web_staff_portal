export interface TrainingRequestFormPayload {
  personal_information_id: number;
  development_plan_vendor_id: number;
  institute_id: number;
  start_date: string;
  end_date: number;
  admission_letter?: File;
}