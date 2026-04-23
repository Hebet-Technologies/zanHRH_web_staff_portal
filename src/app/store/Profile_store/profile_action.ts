import { createAction, props } from "@ngrx/store";
import { ProfileAttachmentsPayload, ProfileEducationPayload, ProfileHobbiesPayload, ProfileLanguagePayload, ProfileNextOfKinPayload, ProfileRefereePayload, ProfileSkillPayload, ProfileWorkExperiencePayload, UpdateProfilePayload } from "./profile_model";

// load personal detail
export const fetchPersonalDetail = createAction('[Data] Load Personal Profile Detail',props<{ employeeID: string }>());
export const fetchPersonalDetailSuccess = createAction('[Data] Load Personal Profile Detail Success',props<{ personalDetail: any }>());
export const fetchPersonalDetailFailure = createAction('[Data] Load Personal Profile Detail Failure',props<{ error: any }>());

// View Education
export const fetchEducationData = createAction('[Data] Fetch Education',props<{ employeeID: string }>());
export const fetchEducationSuccess = createAction('[Data] Fetch Education Success',props<{ education: any }>());
export const fetchEducationFailure = createAction('[Data] Fetch Education Failure', props<{ error: string }>());
// // Add Education Data
export const addEducation = createAction('[Data] Add Education',props<{ newData: ProfileEducationPayload }>());
export const addEducationSuccess = createAction('[Data] Add Education Success',);
export const addEducationFailure = createAction('[Data] Add Education Failure',props<{ error: string }>());
// Delete Education Data
export const deleteEducation = createAction('[Data] Delete Education',props<{ education_details_id: number }>());
export const deleteEducationSuccess = createAction('[Data] Delete Education Success',props<{ education_details_id: number }>());
export const deleteEducationFailure = createAction('[Data] Delete Education Failure',props<{ error: string }>());
//load Education Level general
export const loadEducationLevel = createAction('[Data] Load Education Level');
export const loadEducationLevelSuccess = createAction('[Data] Load Education Level Success',props<{ eduLevel: any[] }>());
export const loadEducationLevelFailure = createAction('[Data] Load Education Level Failure',props<{ error: any }>());
// load Program By Education Level
export const loadProgramByEducationLevel = createAction('[Data] Load Program By Education Level',props<{ educationLevel: number }>());
export const loadProgramByEducationLevelSuccess = createAction('[Data] Load Program By Education Level Success',props<{ programID: any[] }>());
export const loadProgramByEducationLevelFailure = createAction('[Data] Load Program By Education Level Failure',props<{ error: any }>());
//load Institute Country
export const loadInstituteCountry = createAction('[Data] Load Institute Country');
export const loadInstituteCountrySuccess = createAction('[Data] Load Institute Country Success',props<{ country: any[] }>());
export const loadInstituteCountryFailure = createAction('[Data] Load Institute Country Failure',props<{ error: any }>());
//load Institute
export const loadInstitute = createAction('[Data] Load Institute',props<{ countryCode: string; educationLevel: number }>());
export const loadInstituteSuccess = createAction('[Data] Load Institute Success',props<{ institutes: any[] }>());
export const loadInstituteFailure = createAction('[Data] Load Institute Failure',props<{ error: any }>());

// View WorkExperience
export const fetchWorkExperienceData = createAction('[Data] Fetch WorkExperience',props<{ employeeID: string }>());
export const fetchWorkExperienceSuccess = createAction('[Data] Fetch WorkExperience Success',props<{ workExperience: any }>());
export const fetchWorkExperienceFailure = createAction('[Data] Fetch WorkExperience Failure', props<{ error: string }>());
//add workexperience
export const addWorkExperience = createAction('[Data] Add WorkExperience',props<{ newData: ProfileWorkExperiencePayload }>());
export const addWorkExperienceSuccess = createAction('[Data] Add WorkExperience Success');
export const addWorkExperienceFailure = createAction('[Data] Add WorkExperience Failure',props<{ error: string }>());
// Delete workexperience
export const deleteWorkExperience = createAction('[Data] Delete WorkExperience',props<{ experience_id: number }>());
export const deleteWorkExperienceSuccess = createAction('[Data] Delete WorkExperience Success',props<{ experience_id: number }>());
export const deleteWorkExperienceFailure = createAction('[Data] Delete WorkExperience Failure',props<{ error: string }>());

// View Hobbies / Interests
export const fetchHobbiesData = createAction('[Data] Fetch Hobbies / Interests',props<{ employeeID: string }>());
export const fetchHobbiesSuccess = createAction('[Data] Fetch Hobbies / Interests Success',props<{ hobby: any }>());
export const fetchHobbiesFailure = createAction('[Data] Fetch Hobbies / Interests Failure', props<{ error: string }>());
//add Hobbies / Interests
export const addHobbies = createAction('[Data] Add Hobbies / Interests',props<{ newData: ProfileHobbiesPayload }>());
export const addHobbiesSuccess = createAction('[Data] Add Hobbies / Interests Success');
export const addHobbiesFailure = createAction('[Data] Add Hobbies / Interests Failure',props<{ error: string }>());
// Delete Hobbies / Interests
export const deleteHobbies = createAction('[Data] Delete Hobbies / Interests',props<{ personal_hobby_id: number }>());
export const deleteHobbiesSuccess = createAction('[Data] Delete Hobbies / Interests Success',props<{ personal_hobby_id: number }>());
export const deleteHobbiesFailure = createAction('[Data] Delete Hobbies / Interests Failure',props<{ error: string }>());
//load Hobbies Form
export const loadHobbiesForm = createAction('[Data] Load HobbiesForm');
export const loadHobbiesFormSuccess = createAction('[Data] Load HobbiesForm Success',props<{ hobbies: any[] }>());
export const loadHobbiesFormFailure = createAction('[Data] Load HobbiesForm Failure',props<{ error: any }>());

// View Skills
export const fetchSkillsData = createAction('[Data] Fetch Skills',props<{ employeeID: string }>());
export const fetchSkillsSuccess = createAction('[Data] Fetch Skills Success',props<{ skills: any }>());
export const fetchSkillsFailure = createAction('[Data] Fetch Skills Failure', props<{ error: string }>());
//add Skills
export const addSkills = createAction('[Data] Add Skills',props<{ newData: ProfileSkillPayload }>());
export const addSkillsSuccess = createAction('[Data] Add Skills Success');
export const addSkillsFailure = createAction('[Data] Add Skills Failure',props<{ error: string }>());
// Delete Skills
export const deleteSkills = createAction('[Data] Delete Skills',props<{ personal_skill_id: number }>());
export const deleteSkillsSuccess = createAction('[Data] Delete Skills Success',props<{ personal_skill_id: number }>());
export const deleteSkillsFailure = createAction('[Data] Delete Skills Failure',props<{ error: string }>());
//load Skills Form
export const loadSkillsForm = createAction('[Data] Load SkillsForm');
export const loadSkillsFormSuccess = createAction('[Data] Load SkillsForm Success',props<{ skil: any[] }>());
export const loadSkillsFormFailure = createAction('[Data] Load SkillsForm Failure',props<{ error: any }>());

// View Languages
export const fetchLanguagesData = createAction('[Data] Fetch Languages', props<{ employeeID: string }>());
export const fetchLanguagesSuccess = createAction('[Data] Fetch Languages Success', props<{ languages: any }>());
export const fetchLanguagesFailure = createAction('[Data] Fetch Languages Failure', props<{ error: string }>());
// Add Language
export const addLanguage = createAction('[Data] Add Language', props<{ newData: ProfileLanguagePayload }>());
export const addLanguageSuccess = createAction('[Data] Add Language Success');
export const addLanguageFailure = createAction('[Data] Add Language Failure', props<{ error: string }>());
// Delete Language
export const deleteLanguage = createAction('[Data] Delete Language', props<{ personal_language_id: number }>());
export const deleteLanguageSuccess = createAction('[Data] Delete Language Success', props<{ personal_language_id: number }>());
export const deleteLanguageFailure = createAction('[Data] Delete Language Failure', props<{ error: string }>());
// Load Language Form
export const loadLanguageForm = createAction('[Data] Load Language Form');
export const loadLanguageFormSuccess = createAction('[Data] Load Language Form Success', props<{ language: any[] }>());
export const loadLanguageFormFailure = createAction('[Data] Load Language Form Failure', props<{ error: any }>());

// View Next Of Kins
export const fetchNextOfKinsData = createAction('[Data] Fetch Next Of Kins', props<{ employeeID: string }>());
export const fetchNextOfKinsSuccess = createAction('[Data] Fetch Next Of Kins Success', props<{ nextOfKins: any }>());
export const fetchNextOfKinsFailure = createAction('[Data] Fetch Next Of Kins Failure', props<{ error: string }>());
// Add Next Of Kin
export const addNextOfKin = createAction('[Data] Add Next Of Kin', props<{ newData: ProfileNextOfKinPayload }>());
export const addNextOfKinSuccess = createAction('[Data] Add Next Of Kin Success');
export const addNextOfKinFailure = createAction('[Data] Add Next Of Kin Failure', props<{ error: string }>());
// Delete Next Of Kin
export const deleteNextOfKin = createAction('[Data] Delete Next Of Kin', props<{ next_of_kin_id: number }>());
export const deleteNextOfKinSuccess = createAction('[Data] Delete Next Of Kin Success', props<{ next_of_kin_id: number }>());
export const deleteNextOfKinFailure = createAction('[Data] Delete Next Of Kin Failure', props<{ error: string }>());
// Load Next Of Kin Form
export const loadNextOfKinForm = createAction('[Data] Load Next Of Kin Form');
export const loadNextOfKinFormSuccess = createAction('[Data] Load Next Of Kin Form Success', props<{ nextOfKinsForm: any[] }>());
export const loadNextOfKinFormFailure = createAction('[Data] Load Next Of Kin Form Failure', props<{ error: any }>());

// View Referees
export const fetchRefereesData = createAction('[Data] Fetch Referees', props<{ employeeID: string }>());
export const fetchRefereesSuccess = createAction('[Data] Fetch Referees Success', props<{ referees: any }>());
export const fetchRefereesFailure = createAction('[Data] Fetch Referees Failure', props<{ error: string }>());
// Add Referee
export const addReferee = createAction('[Data] Add Referee', props<{ newData: ProfileRefereePayload }>());
export const addRefereeSuccess = createAction('[Data] Add Referee Success');
export const addRefereeFailure = createAction('[Data] Add Referee Failure', props<{ error: string }>());
// Delete Referee
export const deleteReferee = createAction('[Data] Delete Referee', props<{ refferee_id: number }>());
export const deleteRefereeSuccess = createAction('[Data] Delete Referee Success', props<{ refferee_id: number }>());
export const deleteRefereeFailure = createAction('[Data] Delete Referee Failure', props<{ error: string }>());
// Load District Form
export const loadDistrictForm = createAction('[Data] Load District Form');
export const loadDistrictFormSuccess = createAction('[Data] Load District Form Success', props<{ DistrictForm: any[] }>());
export const loadDistrictFormFailure = createAction('[Data] Load District Form Failure', props<{ error: any }>());
// Load Shehia Form
export const loadShehiaForm = createAction('[Data] Load Shehia Form',props<{ districtIDs: number }>());
export const loadShehiaFormSuccess = createAction('[Data] Load Shehia Form Success', props<{ shehiaID: any[] }>());
export const loadShehiaFormFailure = createAction('[Data] Load Shehia Form Failure', props<{ error: any }>());
// Load Identification Type Form
export const loadIdentificationTypeForm = createAction('[Data] Load Identification Type Form');
export const loadIdentificationTypeFormSuccess = createAction('[Data] Load Identification Type Form Success', props<{ IdentificationTypeForm: any[] }>());
export const loadIdentificationTypeFormFailure = createAction('[Data] Load Identification Type Form Failure', props<{ error: any }>());

// View Attachments
export const fetchAttachmentsData = createAction('[Data] Fetch Attachments', props<{ employeeID: string }>());
export const fetchAttachmentsSuccess = createAction('[Data] Fetch Attachments Success', props<{ attachments: any }>());
export const fetchAttachmentsFailure = createAction('[Data] Fetch Attachments Failure', props<{ error: string }>());
// Add Attachment
export const addAttachment = createAction('[Data] Add Attachment', props<{ newData: ProfileAttachmentsPayload }>());
export const addAttachmentSuccess = createAction('[Data] Add Attachment Success');
export const addAttachmentFailure = createAction('[Data] Add Attachment Failure', props<{ error: string }>());
// Delete Attachment
export const deleteAttachment = createAction('[Data] Delete Attachment', props<{ employee_attachment_id: number }>());
export const deleteAttachmentSuccess = createAction('[Data] Delete Attachment Success', props<{ employee_attachment_id: number }>());
export const deleteAttachmentFailure = createAction('[Data] Delete Attachment Failure', props<{ error: string }>());
//Attachments Upload Type
export const loadAttachmentsUploadType = createAction('[Data] Load Attachments Upload Type',props<{ educationLevel: number }>());
export const loadAttachmentsUploadTypeSuccess = createAction('[Data] Load Attachments Upload Type Success', props<{ attachmentsUploadTypeID: any[] }>());
export const loadAttachmentsUploadTypeFailure = createAction('[Data] Load Attachments Upload Type Failure', props<{ error: any }>());

//Edit Profile Data
//load Marital Status general
export const loadMaritalStatus = createAction('[Data] Load Marital Status');
export const loadMaritalStatusSuccess = createAction('[Data] Load Marital Status Success',props<{ maritalStatus: any[] }>());
export const loadMaritalStatusFailure = createAction('[Data] Load Marital Status Failure',props<{ error: any }>());
//load Shehia Profile general
export const loadShehiaProfile = createAction('[Data] Load Shehia Profile');
export const loadShehiaProfileSuccess = createAction('[Data] Load Shehia Profile Success',props<{ shehiaProfile: any[] }>());
export const loadShehiaProfileFailure = createAction('[Data] Load Shehia Profile Failure',props<{ error: any }>());
//load Bank Name general
export const loadBankName = createAction('[Data] Load Bank Name');
export const loadBankNameSuccess = createAction('[Data] Load Bank Name Success',props<{ bankName: any[] }>());
export const loadBankNameFailure = createAction('[Data] Load Bank Name Failure',props<{ error: any }>());

//update personal detail
export const updateProfile = createAction(
    '[Data] Update Profile',
    props<{ updatedData: UpdateProfilePayload }>()
);
export const updateProfileSuccess = createAction(
    '[Data] Update Profile Success'
);
export const updateProfileFailure = createAction(
    '[Data] Update Profile Failure',
    props<{ error: string }>()
);