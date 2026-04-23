export interface TransferRequestPayload {
  personal_information_id: number;
  working_station_id_to: number;
  transfer_reason_id: number;
  upload_file_name?: File;
}

