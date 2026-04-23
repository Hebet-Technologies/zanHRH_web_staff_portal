export interface ProfileEducationPayload {
  personal_information_id: number;
  education_level_id: number;
  institute_id: number;
  country_id: number;
  program_id: number;
  from_year: number;
  to_year: number;
  gpa: number;
}

export interface ProfileWorkExperiencePayload {
  personal_information_id: number;
  experience_id: number;
  employer_name: string;
  experience_position: string;
  start_date: string;
  end_date: number;
  upload_file_name?: File;
}

export interface ProfileHobbiesPayload {
  personal_information_id: number;
  hobby_id: number;
}

export interface ProfileSkillPayload {
  personal_information_id: number;
  skill_id: number;
  upload_file_name?: File;
}

export interface ProfileLanguagePayload {
  personal_information_id: number;
  language_id: number;
  speaking: string;
  reading: string;
  writting: string;
}

export interface ProfileNextOfKinPayload {
  personal_information_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  phone_no: string;
  email: string;
  gender: string;
  relation_id: number;
}

export interface ProfileRefereePayload {
  personal_information_id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  refferee_phone: string;
  refferee_position: string;
  working_area: string;
  email: string;
  date_of_birth: string;
  location_id: number;
  identification_id: number;
  id_number: number;
  upload_file_name?: File;
}

export interface ProfileAttachmentsPayload {
  personal_information_id: number;
  upload_type_id: number;
  upload_file_name?: File;
}

export interface UpdateProfilePayload {
  personal_information_id: number;
  merital_status_id: number;
  phone_no: string;
  physical_address: string;
  location_id: number;
  gender: string;
  id_number: number;
  bank_id: number;
  bank_account_number: string;
  photo?: File;
  identification_file?: File;
}
