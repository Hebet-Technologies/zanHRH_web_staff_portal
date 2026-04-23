import { Action, createReducer, on } from '@ngrx/store';
import { fetchPersonalDetail, fetchPersonalDetailSuccess, fetchPersonalDetailFailure, fetchEducationData, fetchEducationFailure, fetchEducationSuccess, fetchWorkExperienceData, fetchWorkExperienceFailure, fetchWorkExperienceSuccess, deleteEducationSuccess, loadEducationLevelSuccess, loadProgramByEducationLevel, loadProgramByEducationLevelSuccess, loadInstituteCountrySuccess, loadInstituteSuccess, addEducationSuccess, addEducation, addEducationFailure, addWorkExperience, addWorkExperienceFailure, addWorkExperienceSuccess, deleteWorkExperienceSuccess, addHobbies, addHobbiesFailure, addHobbiesSuccess, deleteHobbiesSuccess, fetchHobbiesData, fetchHobbiesFailure, fetchHobbiesSuccess, loadHobbiesFormSuccess, addSkills, addSkillsFailure, addSkillsSuccess, deleteSkillsSuccess, fetchSkillsData, fetchSkillsFailure, fetchSkillsSuccess, loadSkillsFormSuccess, addLanguage, addLanguageFailure, addLanguageSuccess, deleteLanguageSuccess, fetchLanguagesData, fetchLanguagesFailure, fetchLanguagesSuccess, loadLanguageFormSuccess, addNextOfKin, addNextOfKinFailure, addNextOfKinSuccess, deleteNextOfKinSuccess, fetchNextOfKinsData, fetchNextOfKinsFailure, fetchNextOfKinsSuccess, loadNextOfKinFormSuccess, addReferee, addRefereeFailure, addRefereeSuccess, deleteRefereeSuccess, fetchRefereesData, fetchRefereesFailure, fetchRefereesSuccess, loadDistrictFormSuccess, loadIdentificationTypeFormSuccess, loadShehiaFormSuccess, addAttachment, addAttachmentFailure, addAttachmentSuccess, deleteAttachmentSuccess, fetchAttachmentsData, fetchAttachmentsFailure, fetchAttachmentsSuccess, loadAttachmentsUploadTypeSuccess, loadBankNameSuccess, loadMaritalStatusSuccess, loadShehiaProfileSuccess, updateProfile } from './profile_action';

export interface PersonalProfileState {
    PersonalProfile: any[];
    Education: any[];
    EducationLevel: any[];
    ProgramByEducationLevel: any[];
    InstituteCountry: any[];
    Institutes: any[];
    WorkExperience: any[];
    HobbiesOrInterests: any[];
    HobbiesForm: any[];
    Skills: any[];
    SkillsForm: any[];
    Languages:any[];
    LanguagesForm: any[];
    NextOfKins: any[];
    NextOfKinsForm: any[];
    Referees: any[];
    DistrictForm:any[];
    ShehiaForm:any[];
    IdentificationTypeForm:any[];
    Attachments: any[];
    AttachmentsUploadType: any[];
    MaritalStatus:any[];
    ShehiaProfile:any[];
    BankName:any[];

    loading: boolean;
    error: any;
}

export const initialState: PersonalProfileState = {
    PersonalProfile: [],
    Education: [],
    EducationLevel: [],
    ProgramByEducationLevel: [],
    InstituteCountry: [],
    Institutes: [],
    WorkExperience: [],
    HobbiesOrInterests: [],
    HobbiesForm: [],
    Skills: [],
    SkillsForm: [],
    Languages: [],
    LanguagesForm: [],
    NextOfKins: [],
    NextOfKinsForm: [],
    Referees: [],
    DistrictForm:[],
    ShehiaForm:[],
    IdentificationTypeForm:[],
    Attachments: [],
    AttachmentsUploadType: [],
    MaritalStatus:[],
    ShehiaProfile:[],
    BankName:[],

    loading: false,
    error: null,
};

export const PersonalProfileReducer = createReducer(
    initialState,
    // PersonalProfile
    on(fetchPersonalDetail, (state) => ({...state, loading: true, error: null })),
    on(fetchPersonalDetailSuccess, (state, { personalDetail }) => ({...state, PersonalProfile: personalDetail, loading: false })),
    on(fetchPersonalDetailFailure, (state, { error }) => ({...state,error, loading: false })),

    // on(updateProfile, (state, { updatedData }) => {
    //     return {
    //         ...state, PersonalProfile: state.PersonalProfile.map((profile) => profile.personal_information_id === updatedData.personal_information_id ? updatedData : profile), error: null
    //     };
    // }),

    on(updateProfile, (state, { updatedData }) => ({
        ...state,
        PersonalProfile: {
            ...state.PersonalProfile,
            ...updatedData
        },
        error: null
    })),


    // Education
    on(fetchEducationData, (state) => ({...state, loading: true, error: null })),
    on(fetchEducationSuccess, (state, { education }) => ({...state, Education: education, loading: false })),
    on(fetchEducationFailure, (state, { error }) => ({...state,error, loading: false })),

    on(addEducation, (state) => ({...state,loading: true,error: null})),
    on(addEducationSuccess, (state) => ({...state,loading: false})),
    on(addEducationFailure, (state, { error }) => ({...state,loading: false,error})),

    on(deleteEducationSuccess, (state, { education_details_id }) => {
        const updatedEducation = state.Education.filter((education) => education.education_details_id !== education_details_id);
        return {
            ...state,
            Education: updatedEducation,
            loading: false,
            error: null
        };
    }),

    on(loadEducationLevelSuccess, (state, { eduLevel }) => ({...state,EducationLevel: eduLevel})),
    on(loadProgramByEducationLevelSuccess, (state, { programID }) => ({...state,ProgramByEducationLevel: programID})),
    on(loadInstituteCountrySuccess, (state, { country }) => ({...state,InstituteCountry: country})),
    on(loadInstituteSuccess, (state, { institutes }) => ({...state,Institutes: institutes})),
    
    // WorkExperience
    on(fetchWorkExperienceData, (state) => ({...state, loading: true, error: null })),
    on(fetchWorkExperienceSuccess, (state, { workExperience }) => ({...state, WorkExperience: workExperience, loading: false })),
    on(fetchWorkExperienceFailure, (state, { error }) => ({...state,error, loading: false })),

    on(addWorkExperience, (state) => ({...state,loading: true,error: null})),
    on(addWorkExperienceSuccess, (state) => ({...state,loading: false})),
    on(addWorkExperienceFailure, (state, { error }) => ({...state,loading: false,error})),
    
    on(deleteWorkExperienceSuccess, (state, { experience_id }) => {
        const updatedWorkExperience = state.WorkExperience.filter((work) => work.experience_id !== experience_id);
        return {
            ...state,
            WorkExperience: updatedWorkExperience,
            loading: false,
            error: null
        };
    }),

    //Hobbies / Interests
    on(fetchHobbiesData, (state) => ({...state, loading: true, error: null })),
    on(fetchHobbiesSuccess, (state, { hobby }) => ({...state, HobbiesOrInterests: hobby, loading: false })),
    on(fetchHobbiesFailure, (state, { error }) => ({...state,error, loading: false })),

    on(addHobbies, (state) => ({...state,loading: true,error: null})),
    on(addHobbiesSuccess, (state) => ({...state,loading: false})),
    on(addHobbiesFailure, (state, { error }) => ({...state,loading: false,error})),
    
    on(deleteHobbiesSuccess, (state, { personal_hobby_id }) => {
        const updatedHobbies = state.HobbiesOrInterests.filter((hoby) => hoby.personal_hobby_id !== personal_hobby_id);
        return {
            ...state,
            HobbiesOrInterests: updatedHobbies,
            loading: false,
            error: null
        };
    }),

    on(loadHobbiesFormSuccess, (state, { hobbies }) => ({...state,HobbiesForm: hobbies})),


    //Skills
    on(fetchSkillsData, (state) => ({...state, loading: true, error: null })),
    on(fetchSkillsSuccess, (state, { skills }) => ({...state, Skills: skills, loading: false })),
    on(fetchSkillsFailure, (state, { error }) => ({...state,error, loading: false })),

    on(addSkills, (state) => ({...state,loading: true,error: null})),
    on(addSkillsSuccess, (state) => ({...state,loading: false})),
    on(addSkillsFailure, (state, { error }) => ({...state,loading: false,error})),
    
    on(deleteSkillsSuccess, (state, { personal_skill_id }) => {
        const updatedSkills = state.Skills.filter((skil) => skil.personal_skill_id !== personal_skill_id);
        return {
            ...state,
            Skills: updatedSkills,
            loading: false,
            error: null
        };
    }),

    on(loadSkillsFormSuccess, (state, { skil }) => ({...state,SkillsForm: skil})),

    //Language
    on(fetchLanguagesData, (state) => ({...state, loading: true, error: null })),
    on(fetchLanguagesSuccess, (state, { languages }) => ({...state, Languages: languages, loading: false })),
    on(fetchLanguagesFailure, (state, { error }) => ({...state, error, loading: false })),

    on(addLanguage, (state) => ({...state, loading: true, error: null })),
    on(addLanguageSuccess, (state) => ({...state, loading: false })),
    on(addLanguageFailure, (state, { error }) => ({...state, loading: false, error })),

    on(deleteLanguageSuccess, (state, { personal_language_id }) => {
        const updatedLanguages = state.Languages.filter((lang) => lang.personal_language_id !== personal_language_id);
        return { ...state, Languages: updatedLanguages, loading: false, error: null };
    }),

    on(loadLanguageFormSuccess, (state, { language }) => ({...state, LanguagesForm: language })),

    //Next Of Kins
    on(fetchNextOfKinsData, (state) => ({...state, loading: true, error: null })),
    on(fetchNextOfKinsSuccess, (state, { nextOfKins }) => ({...state, NextOfKins: nextOfKins, loading: false })),
    on(fetchNextOfKinsFailure, (state, { error }) => ({...state, error, loading: false })),

    on(addNextOfKin, (state) => ({...state, loading: true, error: null })),
    on(addNextOfKinSuccess, (state) => ({...state, loading: false })),
    on(addNextOfKinFailure, (state, { error }) => ({...state, loading: false, error })),

    on(deleteNextOfKinSuccess, (state, { next_of_kin_id }) => {
        const updatedNextOfKins = state.NextOfKins.filter((kin) => kin.next_of_kin_id !== next_of_kin_id);
        return { ...state, NextOfKins: updatedNextOfKins, loading: false, error: null };
    }),

    on(loadNextOfKinFormSuccess, (state, { nextOfKinsForm }) => ({...state, NextOfKinsForm: nextOfKinsForm })),

    //Referees
    on(fetchRefereesData, (state) => ({...state, loading: true, error: null })),
    on(fetchRefereesSuccess, (state, { referees }) => ({...state, Referees: referees, loading: false })),
    on(fetchRefereesFailure, (state, { error }) => ({...state, error, loading: false })),

    on(addReferee, (state) => ({...state, loading: true, error: null })),
    on(addRefereeSuccess, (state) => ({...state, loading: false })),
    on(addRefereeFailure, (state, { error }) => ({...state, loading: false, error })),

    on(deleteRefereeSuccess, (state, { refferee_id }) => {
        const updatedReferees = state.Referees.filter((ref) => ref.refferee_id !== refferee_id);
        return { ...state, Referees: updatedReferees, loading: false, error: null };
    }),

    on(loadDistrictFormSuccess, (state, { DistrictForm }) => ({...state, DistrictForm: DistrictForm })),
    on(loadShehiaFormSuccess, (state, { shehiaID }) => ({...state, ShehiaForm: shehiaID })),
    on(loadIdentificationTypeFormSuccess, (state, { IdentificationTypeForm }) => ({...state, IdentificationTypeForm: IdentificationTypeForm })),


    // Attachments
    on(fetchAttachmentsData, (state) => ({ ...state, loading: true, error: null })),
    on(fetchAttachmentsSuccess, (state, { attachments }) => ({ ...state, Attachments: attachments, loading: false })),
    on(fetchAttachmentsFailure, (state, { error }) => ({ ...state, error, loading: false })),

    on(addAttachment, (state) => ({ ...state, loading: true, error: null })),
    on(addAttachmentSuccess, (state) => ({ ...state, loading: false })),
    on(addAttachmentFailure, (state, { error }) => ({ ...state, loading: false, error })),

    on(deleteAttachmentSuccess, (state, { employee_attachment_id }) => {
        const updatedAttachments = state.Attachments.filter((attachment) => attachment.employee_attachment_id !== employee_attachment_id);
        return {...state, Attachments: updatedAttachments, loading: false,  error: null};
    }),

    on(loadAttachmentsUploadTypeSuccess, (state, { attachmentsUploadTypeID }) => ({...state, AttachmentsUploadType: attachmentsUploadTypeID })),


    //Edit Profile Data
    on(loadMaritalStatusSuccess, (state, { maritalStatus }) => ({ ...state, MaritalStatus: maritalStatus })),
    on(loadShehiaProfileSuccess, (state, { shehiaProfile }) => ({ ...state, ShehiaProfile: shehiaProfile })),
    on(loadBankNameSuccess, (state, { bankName }) => ({ ...state, BankName: bankName })),









    
);

// Selector
export function reducer(state: PersonalProfileState | undefined, action: Action) {
    return PersonalProfileReducer(state, action);
}
