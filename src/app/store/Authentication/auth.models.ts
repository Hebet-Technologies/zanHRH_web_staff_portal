export class LoginCredential {
  id?: number;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  token?: string;
  email?: string;
  permissions?: any[];
}

export interface StaffRegistrationPayload{
  first_name: string;
  middle_name: string;
  last_name: string;
  sur_name: string;
  gender: string;
  location_id: number;
  phone_no: string;
  date_of_birth: string;
  transfer_path_id?: number | null;
  training_path_id?: number | null;
  working_station_id: number;
  working_station_name: string;
  personal_information_id: number;
  email: string;
  path_id: number;
  password: string;
  confirm_password: string;

}
