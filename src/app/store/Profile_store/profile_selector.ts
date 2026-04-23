import { createFeatureSelector, createSelector } from "@ngrx/store";
import { PersonalProfileState } from "./profile_reducer";

export const selectProfileState = createFeatureSelector<PersonalProfileState>('profile');
export const selectProfileData = createSelector(selectProfileState,(state: PersonalProfileState) => state.PersonalProfile);
export const selectEducationData = createSelector(selectProfileState,(state: PersonalProfileState) => state.Education);
export const selectWorkExperienceData = createSelector(selectProfileState,(state: PersonalProfileState) => state.WorkExperience);
export const selectHobbiesInterestsData = createSelector(selectProfileState,(state: PersonalProfileState) => state.HobbiesOrInterests);
export const selectSkillsData = createSelector(selectProfileState,(state: PersonalProfileState) => state.Skills);
export const selectLanguageData = createSelector(selectProfileState,(state: PersonalProfileState) => state.Languages);
export const selectNextOfKinData = createSelector(selectProfileState,(state: PersonalProfileState) => state.NextOfKins);
export const selectRefereeData = createSelector(selectProfileState,(state: PersonalProfileState) => state.Referees);
export const selectAttachmentsData = createSelector(selectProfileState,(state: PersonalProfileState) => state.Attachments);

//general
export const selectEducationLevel = createSelector(selectProfileState,state => state.EducationLevel);
export const selectProgramByEducationLevel = createSelector(selectProfileState,state => state.ProgramByEducationLevel);
export const selectInstituteCountry = createSelector(selectProfileState,state => state.InstituteCountry);
export const selectInstitutes = createSelector(selectProfileState,state => state.Institutes);
export const selectHobbiesForm = createSelector(selectProfileState,state => state.HobbiesForm);
export const selectSkillsForm = createSelector(selectProfileState,state => state.SkillsForm);
export const selectLanguageForm = createSelector(selectProfileState,state => state.LanguagesForm);
export const selectNextOfKinsForm = createSelector(selectProfileState,state => state.NextOfKinsForm);
export const selectDistrictForm = createSelector(selectProfileState,state => state.DistrictForm);
export const selectShehiaForm = createSelector(selectProfileState,state => state.ShehiaForm);
export const selectIdentitiesTypeForm = createSelector(selectProfileState,state => state.IdentificationTypeForm);
export const selectAttachmentsUploadTypeForm = createSelector(selectProfileState,state => state.AttachmentsUploadType);
//editform
export const selectMaritalStatus = createSelector(selectProfileState, state => state.MaritalStatus);
export const selectShehiaProfile = createSelector(selectProfileState, state => state.ShehiaProfile);
export const selectBankName = createSelector(selectProfileState, state => state.BankName);



//load and error
export const selectProfileLoading = createSelector(selectProfileState,(state: PersonalProfileState) => state.loading);
export const selectProfileError = createSelector(selectProfileState,(state: PersonalProfileState) => state.error);


