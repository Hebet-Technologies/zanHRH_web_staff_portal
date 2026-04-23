export interface LeaveRequestPayload {
  personal_information_id: number;
  employement_status_id: number;
  proposed_start_date: string;
  number_of_days: number;
  upload_file_name?: File;
  contact_on_leave: number;
  place_to_travel: string;
  representative_id: number
}

export interface LeaveReturnToWorkPayload {
  leave_request_id: number;
  description: string;
  returned_date: string;
}