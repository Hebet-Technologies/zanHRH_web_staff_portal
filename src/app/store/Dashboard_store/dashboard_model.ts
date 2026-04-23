export interface StaffAdvertFormPayload {
  personal_information_id: number;
  staff_advertisement_id: number;
  staff_adver_position_id: number;
  program_id: number;
  upload_file_name?: File;
  working_area: string;
  working_position: string;
}