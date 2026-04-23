import { Injectable } from "@angular/core";

import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from "@ngrx/effects";
import { TransferService } from "src/app/core/services/transter-card/transfer.service";
import { ProfileService } from "src/app/core/services/personal-profile-card/profile.service";
import { fetchPersonalDetail, fetchPersonalDetailSuccess, fetchPersonalDetailFailure, fetchEducationData, fetchEducationFailure, fetchEducationSuccess, fetchWorkExperienceData, fetchWorkExperienceFailure, fetchWorkExperienceSuccess, deleteEducation, deleteEducationFailure, deleteEducationSuccess, loadEducationLevel, loadEducationLevelFailure, loadEducationLevelSuccess, loadProgramByEducationLevel, loadProgramByEducationLevelFailure, loadProgramByEducationLevelSuccess, loadInstituteCountry, loadInstituteCountryFailure, loadInstituteCountrySuccess, loadInstitute, loadInstituteFailure, loadInstituteSuccess, addEducation, addEducationFailure, addEducationSuccess, deleteWorkExperience, deleteWorkExperienceFailure, deleteWorkExperienceSuccess, addWorkExperience, addWorkExperienceFailure, addWorkExperienceSuccess, deleteHobbies, deleteHobbiesFailure, deleteHobbiesSuccess, fetchHobbiesData, fetchHobbiesFailure, fetchHobbiesSuccess, loadHobbiesForm, loadHobbiesFormFailure, loadHobbiesFormSuccess, addHobbies, addHobbiesSuccess, addSkills, addSkillsFailure, addSkillsSuccess, deleteSkills, deleteSkillsFailure, deleteSkillsSuccess, fetchSkillsData, fetchSkillsFailure, fetchSkillsSuccess, loadSkillsForm, loadSkillsFormFailure, loadSkillsFormSuccess, addLanguage, addLanguageSuccess, deleteLanguage, deleteLanguageFailure, deleteLanguageSuccess, fetchLanguagesData, fetchLanguagesFailure, fetchLanguagesSuccess, loadLanguageForm, loadLanguageFormFailure, loadLanguageFormSuccess, addNextOfKin, addNextOfKinSuccess, deleteNextOfKin, deleteNextOfKinFailure, deleteNextOfKinSuccess, fetchNextOfKinsData, fetchNextOfKinsFailure, fetchNextOfKinsSuccess, loadNextOfKinForm, loadNextOfKinFormFailure, loadNextOfKinFormSuccess, deleteReferee, deleteRefereeFailure, deleteRefereeSuccess, fetchRefereesData, fetchRefereesFailure, fetchRefereesSuccess, loadDistrictForm, loadDistrictFormFailure, loadDistrictFormSuccess, loadIdentificationTypeForm, loadIdentificationTypeFormFailure, loadIdentificationTypeFormSuccess, loadShehiaForm, loadShehiaFormFailure, loadShehiaFormSuccess, addReferee, addRefereeFailure, addRefereeSuccess, deleteAttachment, deleteAttachmentFailure, deleteAttachmentSuccess, fetchAttachmentsData, fetchAttachmentsFailure, fetchAttachmentsSuccess, loadAttachmentsUploadType, loadAttachmentsUploadTypeFailure, loadAttachmentsUploadTypeSuccess, addAttachment, addAttachmentFailure, addAttachmentSuccess, loadBankName, loadBankNameFailure, loadBankNameSuccess, loadMaritalStatus, loadMaritalStatusFailure, loadMaritalStatusSuccess, loadShehiaProfile, loadShehiaProfileFailure, loadShehiaProfileSuccess, updateProfile, updateProfileFailure, updateProfileSuccess } from "./profile_action";


@Injectable()
export class ProfileEffects {

    loadPersonalDetail$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchPersonalDetail),
            mergeMap(({ employeeID }) =>
            this._profileApiService.getPersonalInformation(employeeID).pipe(
                map(res =>
                fetchPersonalDetailSuccess({ personalDetail: res.data[0] })
                ),
                catchError(error =>
                of(fetchPersonalDetailFailure({ error }))
                )
            )
            )
        )
    );
    //update profile
    updatePersonalProfile$ = createEffect(() =>
        this.actions$.pipe(
        ofType(updateProfile),
        mergeMap(({ updatedData }) => {
            // Convert to FormData because backend expects file
            const formData = new FormData();
            formData.append('personal_information_id', updatedData.personal_information_id.toString());
            formData.append('merital_status_id', updatedData.merital_status_id.toString());
            formData.append('phone_no', updatedData.phone_no);
            formData.append('physical_address', updatedData.physical_address);
            formData.append('location_id', updatedData.location_id.toString());

            formData.append('gender', updatedData.gender);
            formData.append('id_number', updatedData.id_number.toString());
            formData.append('bank_id', updatedData.bank_id.toString());
            formData.append('bank_account_number', updatedData.bank_account_number.toString());

            // identification_file itatumwa tu kama ipo
            if (
                updatedData.identification_file !== undefined &&
                updatedData.identification_file !== null
            ) {
                formData.append(
                'identification_file',
                updatedData.identification_file
                );
            }
            // photo itatumwa tu kama ipo
            if (
                updatedData.photo !== undefined &&
                updatedData.photo !== null
            ) {
                formData.append('photo', updatedData.photo);
            }

            const user = JSON.parse(localStorage.getItem('user')!);
            const employeeID = user.personalInformationID;
            return this._profileApiService.updatePersonalInfor(formData).pipe(
                mergeMap(res => {
                if (res.statusCode === 201) {
                    return [
                        updateProfileSuccess(), // trigger success for component
                        fetchPersonalDetail({ employeeID }) // refresh table
                    ];
                } else {
                    return [updateProfileFailure({ error: res.message })];
                }
                }),
                catchError(err => of(updateProfileFailure({ error: err.message })))
            );
        })
        )
    );





    //education
    loadEducationDetail$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchEducationData),
            mergeMap(({ employeeID }) =>
            this._profileApiService.getEducations(employeeID).pipe(
                map(res =>
                fetchEducationSuccess({ education: res.data })
                ),
                catchError(error =>
                of(fetchEducationFailure({ error }))
                )
            )
            )
        )
    );
    deleteEducation$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteEducation),
            mergeMap(({ education_details_id }) =>
            this._profileApiService.deleteEducation(education_details_id).pipe(
                map(() =>
                deleteEducationSuccess({ education_details_id })
                ),
                catchError((error) =>
                of(deleteEducationFailure({ error: error.message }))
                )
            )
            )
        )
    );
    loadEducationLevel$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadEducationLevel),
            mergeMap(() =>
            this._profileApiService.getEducationLevel().pipe(
                map(res =>
                loadEducationLevelSuccess({ eduLevel: res.data })
                ),
                catchError(error =>
                of(loadEducationLevelFailure({ error }))
                )
            )
            )
        )
    );
    loadProgramByEducationLevel$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadProgramByEducationLevel),
            switchMap(({ educationLevel }) =>
            this._profileApiService.getPrograms(educationLevel).pipe(
                map(res =>
                loadProgramByEducationLevelSuccess({ programID: res.data })
                ),
                catchError(error =>
                of(loadProgramByEducationLevelFailure({ error }))
                )
            )
            )
        )
    );
    loadInstituteCountry$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadInstituteCountry),
            mergeMap(() =>
            this._profileApiService.getCountries().pipe(
                map(res =>
                loadInstituteCountrySuccess({ country: res.data })
                ),
                catchError(error =>
                of(loadInstituteCountryFailure({ error }))
                )
            )
            )
        )
    );
    loadInstitute$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadInstitute),
            switchMap(({ countryCode, educationLevel }) =>
            this._profileApiService.getInstitutes(countryCode,educationLevel).pipe(
                map(res =>
                loadInstituteSuccess({ institutes: res.data })
                ),
                catchError(error =>
                of(loadInstituteFailure({ error }))
                )
            )
            )
        )
    );
    //add ya kawaida tu hii
    addEducationBackground$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addEducation),
            mergeMap(({ newData }) =>
            this._profileApiService.saveEducation(newData).pipe(
                mergeMap(() => {
                const user = JSON.parse(localStorage.getItem('user')!);
                const employeeID = user.personalInformationID;
                return [
                    addEducationSuccess(),
                    fetchEducationData({ employeeID })
                ];
                }),
                catchError(error =>
                of(addEducationFailure({ error: error.message || 'Error occurred' }))
                )
            )
            )
        )
    );



    //WorkExperience
    loadWorkExperienceDetail$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchWorkExperienceData),
            mergeMap(({ employeeID }) =>
            this._profileApiService.getWorkExperience(employeeID).pipe(
                map(res =>
                fetchWorkExperienceSuccess({ workExperience: res.data })
                ),
                catchError(error =>
                of(fetchWorkExperienceFailure({ error }))
                )
            )
            )
        )
    );
    deleteWorkExperience$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteWorkExperience),
            mergeMap(({ experience_id }) =>
            this._profileApiService.deleteWorkExperience(experience_id).pipe(
                map(() =>
                deleteWorkExperienceSuccess({ experience_id })
                ),
                catchError((error) =>
                of(deleteWorkExperienceFailure({ error: error.message }))
                )
            )
            )
        )
    );
    addWorkExperience$ = createEffect(() =>
        this.actions$.pipe(
        ofType(addWorkExperience),
        mergeMap(({ newData }) => {
            // Convert to FormData because backend expects file
            const formData = new FormData();
            formData.append('personal_information_id', newData.personal_information_id.toString());
            formData.append('employer_name', newData.employer_name);
            formData.append('experience_position', newData.experience_position);
            formData.append('start_date', newData.start_date.toString());
            formData.append('end_date', newData.end_date.toString());

            if (newData.upload_file_name) {
            formData.append('upload_file_name', newData.upload_file_name);
            }
            const user = JSON.parse(localStorage.getItem('user')!);
            const employeeID = user.personalInformationID;
            return this._profileApiService.saveWorkExperience(formData).pipe(
                mergeMap(res => {
                if (res.statusCode === 201) {
                    // Success, re-fetch all transfers
                    return [
                        addWorkExperienceSuccess(), // trigger success for component
                        fetchWorkExperienceData({ employeeID }) // refresh table
                    ];
                } else {
                    return [addWorkExperienceFailure({ error: res.message })];
                }
                }),
                catchError(err => of(addWorkExperienceFailure({ error: err.message })))
            );
        })
        )
    );


    //Hobbies / Interests
    loadHobbiesInterests$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchHobbiesData),
            mergeMap(({ employeeID }) =>
            this._profileApiService.getHobbiesOrInterests(employeeID).pipe(
                map(res =>
                fetchHobbiesSuccess({ hobby: res.data })
                ),
                catchError(error =>
                of(fetchHobbiesFailure({ error }))
                )
            )
            )
        )
    );
    deleteHobbiesInterests$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteHobbies),
            mergeMap(({ personal_hobby_id }) =>
            this._profileApiService.deleteHobbiesOrInterests(personal_hobby_id).pipe(
                map(() =>
                deleteHobbiesSuccess({ personal_hobby_id })
                ),
                catchError((error) =>
                of(deleteHobbiesFailure({ error: error.message }))
                )
            )
            )
        )
    );
    loadHobbiesInterestsForm$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadHobbiesForm),
            mergeMap(() =>
            this._profileApiService.getHobbies().pipe(
                map(res =>
                loadHobbiesFormSuccess({ hobbies: res.data })
                ),
                catchError(error =>
                of(loadHobbiesFormFailure({ error }))
                )
            )
            )
        )
    );
    addHobbiesInterests$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addHobbies),
            mergeMap(({ newData }) =>
            this._profileApiService.saveHobbiesOrInterests(newData).pipe(
                mergeMap(() => {
                const user = JSON.parse(localStorage.getItem('user')!);
                const employeeID = user.personalInformationID;
                return [
                    addHobbiesSuccess(),
                    fetchHobbiesData({ employeeID })
                ];
                }),
                catchError(error =>
                of(fetchHobbiesFailure({ error: error.message || 'Error occurred' }))
                )
            )
            )
        )
    );

    //Skills
    loadSkills$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchSkillsData),
            mergeMap(({ employeeID }) =>
            this._profileApiService.getAllSkills(employeeID).pipe(
                map(res =>
                fetchSkillsSuccess({ skills: res.data })
                ),
                catchError(error =>
                of(fetchSkillsFailure({ error }))
                )
            )
            )
        )
    );
    deleteSkills$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteSkills),
            mergeMap(({ personal_skill_id }) =>
            this._profileApiService.deleteSkills(personal_skill_id).pipe(
                map(() =>
                deleteSkillsSuccess({ personal_skill_id })
                ),
                catchError((error) =>
                of(deleteSkillsFailure({ error: error.message }))
                )
            )
            )
        )
    );
    loadSkillsForm$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadSkillsForm),
            mergeMap(() =>
            this._profileApiService.getSkills().pipe(
                map(res =>
                loadSkillsFormSuccess({ skil: res.data })
                ),
                catchError(error =>
                of(loadSkillsFormFailure({ error }))
                )
            )
            )
        )
    );
    addSkills$ = createEffect(() =>
        this.actions$.pipe(
        ofType(addSkills),
        mergeMap(({ newData }) => {
            // Convert to FormData because backend expects file
            const formData = new FormData();
            formData.append('personal_information_id', newData.personal_information_id.toString());
            formData.append('skill_id', newData.skill_id.toString());

            if (newData.upload_file_name) {
            formData.append('upload_file_name', newData.upload_file_name);
            }
            const user = JSON.parse(localStorage.getItem('user')!);
            const employeeID = user.personalInformationID;
            return this._profileApiService.saveSkills(formData).pipe(
                mergeMap(res => {
                if (res.statusCode === 201) {
                    // Success, re-fetch all transfers
                    return [
                        addSkillsSuccess(), // trigger success for component
                        fetchSkillsData({ employeeID }) // refresh table
                    ];
                } else {
                    return [addSkillsFailure({ error: res.message })];
                }
                }),
                catchError(err => of(addSkillsFailure({ error: err.message })))
            );
        })
        )
    );

    //Language
    loadLanguages$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchLanguagesData),
            mergeMap(({ employeeID }) =>
            this._profileApiService.getAllLanguage(employeeID).pipe(
                map(res =>
                fetchLanguagesSuccess({ languages: res.data })
                ),
                catchError(error =>
                of(fetchLanguagesFailure({ error }))
                )
            )
            )
        )
    );
    deleteLanguage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteLanguage),
            mergeMap(({ personal_language_id }) =>
            this._profileApiService.deleteLanguage(personal_language_id).pipe(
                map(() =>
                deleteLanguageSuccess({ personal_language_id })
                ),
                catchError((error) =>
                of(deleteLanguageFailure({ error: error.message }))
                )
            )
            )
        )
    );
    loadLanguageForm$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadLanguageForm),
            mergeMap(() =>
            this._profileApiService.getLanguages().pipe(
                map(res =>
                loadLanguageFormSuccess({ language: res.data })
                ),
                catchError(error =>
                of(loadLanguageFormFailure({ error }))
                )
            )
            )
        )
    );
    addLanguage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addLanguage),
            mergeMap(({ newData }) =>
            this._profileApiService.saveLanguage(newData).pipe(
                mergeMap(() => {
                const user = JSON.parse(localStorage.getItem('user')!);
                const employeeID = user.personalInformationID;
                return [
                    addLanguageSuccess(),
                    fetchLanguagesData({ employeeID })
                ];
                }),
                catchError(error =>
                of(fetchLanguagesFailure({ error: error.message || 'Error occurred' }))
                )
            )
            )
        )
    );

    //Next Of Kins
    loadNextOfKins$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchNextOfKinsData),
            mergeMap(({ employeeID }) =>
            this._profileApiService.getAllNextOfKins(employeeID).pipe(
                map(res =>
                fetchNextOfKinsSuccess({ nextOfKins: res.data })
                ),
                catchError(error =>
                of(fetchNextOfKinsFailure({ error }))
                )
            )
            )
        )
    );
    deleteNextOfKin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteNextOfKin),
            mergeMap(({ next_of_kin_id }) =>
            this._profileApiService.deleteNextOfKins(next_of_kin_id).pipe(
                map(() =>
                deleteNextOfKinSuccess({ next_of_kin_id })
                ),
                catchError((error) =>
                of(deleteNextOfKinFailure({ error: error.message }))
                )
            )
            )
        )
    );
    loadNextOfKinForm$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadNextOfKinForm),
            mergeMap(() =>
            this._profileApiService.getRelation().pipe(
                map(res =>
                loadNextOfKinFormSuccess({ nextOfKinsForm: res.data })
                ),
                catchError(error =>
                of(loadNextOfKinFormFailure({ error }))
                )
            )
            )
        )
    );
    addNextOfKin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addNextOfKin),
            mergeMap(({ newData }) =>
            this._profileApiService.saveNextOfKins(newData).pipe(
                mergeMap(() => {
                const user = JSON.parse(localStorage.getItem('user')!);
                const employeeID = user.personalInformationID;
                return [
                    addNextOfKinSuccess(),
                    fetchNextOfKinsData({ employeeID })
                ];
                }),
                catchError(error =>
                of(fetchNextOfKinsFailure({ error: error.message || 'Error occurred' }))
                )
            )
            )
        )
    );


    //Referees
    loadReferees$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchRefereesData),
            mergeMap(({ employeeID }) =>
            this._profileApiService.getAllReferee(employeeID).pipe(
                map(res =>
                fetchRefereesSuccess({ referees: res.data })
                ),
                catchError(error =>
                of(fetchRefereesFailure({ error }))
                )
            )
            )
        )
    );
    deleteReferee$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteReferee),
            mergeMap(({ refferee_id }) =>
            this._profileApiService.deleteReferee(refferee_id).pipe(
                map(() =>
                deleteRefereeSuccess({ refferee_id })
                ),
                catchError((error) =>
                of(deleteRefereeFailure({ error: error.message }))
                )
            )
            )
        )
    );
    loadDistrictForm$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadDistrictForm),
            mergeMap(() =>
            this._profileApiService.getDistrict().pipe(
                map(res =>
                loadDistrictFormSuccess({ DistrictForm: res.data })
                ),
                catchError(error =>
                of(loadDistrictFormFailure({ error }))
                )
            )
            )
        )
    );
    loadShehiaForm$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadShehiaForm),
            switchMap(({ districtIDs }) =>
            this._profileApiService.getShehia(districtIDs).pipe(
                map(res =>
                loadShehiaFormSuccess({ shehiaID: res.data })
                ),
                catchError(error =>
                of(loadShehiaFormFailure({ error }))
                )
            )
            )
        )
    );
    loadIdentificationTypeForm$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadIdentificationTypeForm),
            mergeMap(() =>
            this._profileApiService.getIdentificationType().pipe(
                map(res =>
                loadIdentificationTypeFormSuccess({ IdentificationTypeForm: res.data })
                ),
                catchError(error =>
                of(loadIdentificationTypeFormFailure({ error }))
                )
            )
            )
        )
    );
    addReferee$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addReferee), // assume action inaitwa addReferee
            mergeMap(({ newData }) => {
            // Create FormData
            const formData = new FormData();
            formData.append('personal_information_id', newData.personal_information_id.toString());
            formData.append('first_name', newData.first_name);
            formData.append('middle_name', newData.middle_name);
            formData.append('last_name', newData.last_name);
            formData.append('refferee_phone', newData.refferee_phone);
            formData.append('refferee_position', newData.refferee_position);
            formData.append('working_area', newData.working_area);
            formData.append('email', newData.email);
            formData.append('date_of_birth', newData.date_of_birth);
            formData.append('location_id', newData.location_id.toString());
            formData.append('identification_id', newData.identification_id.toString());
            formData.append('id_number', newData.id_number.toString());

            if (newData.upload_file_name) {
                formData.append('upload_file_name', newData.upload_file_name);
            }
            const user = JSON.parse(localStorage.getItem('user')!);
            const employeeID = user.personalInformationID;

            return this._profileApiService.saveReferee(formData).pipe(
                mergeMap(res => {
                if (res.statusCode === 201) {
                    return [
                    addRefereeSuccess(),
                    fetchRefereesData({ employeeID })
                    ];
                } else {
                    return [addRefereeFailure({ error: res.message })];
                }
                }),
                catchError(err => of(addRefereeFailure({ error: err.message })))
            );
            })
        )
    );


    // Attachments
    loadAttachments$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchAttachmentsData),
            mergeMap(({ employeeID }) =>
                this._profileApiService.getPersonalAttachement(employeeID).pipe(
                    map(res =>
                        fetchAttachmentsSuccess({ attachments: res.data })
                    ),
                    catchError(error =>
                        of(fetchAttachmentsFailure({ error }))
                    )
                )
            )
        )
    );
    deleteAttachment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteAttachment),
            mergeMap(({ employee_attachment_id }) =>
                this._profileApiService.deleteAttachement(employee_attachment_id).pipe(
                    map(() =>
                        deleteAttachmentSuccess({ employee_attachment_id })
                    ),
                    catchError((error) =>
                        of(deleteAttachmentFailure({ error: error.message }))
                    )
                )
            )
        )
    );
    //hii ya kuselect child ikiwa katika fomati ya post na pia data zake za body ndio unaziweka katika api yenyewe
    loadAttachmentsUploadType$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadAttachmentsUploadType),
            switchMap(({ educationLevel }) => {
            const user = JSON.parse(localStorage.getItem('user')!);
            const employeeID = user.personalInformationID;

            return this._profileApiService.getUploadType({
                education_level_id: educationLevel,
                personal_information_id: employeeID
            }).pipe(
                map(res =>
                loadAttachmentsUploadTypeSuccess({
                    attachmentsUploadTypeID: res.data
                })
                ),
                catchError(error =>
                of(loadAttachmentsUploadTypeFailure({ error }))
                )
            );
            })
        )
    );
    addAttachmentsUploadType$ = createEffect(() =>
        this.actions$.pipe(
        ofType(addAttachment),
        mergeMap(({ newData }) => {
            // Convert to FormData because backend expects file
            const formData = new FormData();
            formData.append('personal_information_id', newData.personal_information_id.toString());
            formData.append('upload_type_id', newData.upload_type_id.toString());

            if (newData.upload_file_name) {
            formData.append('upload_file_name', newData.upload_file_name);
            }
            const user = JSON.parse(localStorage.getItem('user')!);
            const employeeID = user.personalInformationID;
            return this._profileApiService.savePersonalAttachement(formData).pipe(
                mergeMap(res => {
                if (res.statusCode === 201) {
                    return [
                        addAttachmentSuccess(), // trigger success for component
                        fetchAttachmentsData({ employeeID }) // refresh table
                    ];
                } else {
                    return [addAttachmentFailure({ error: res.message })];
                }
                }),
                catchError(err => of(addAttachmentFailure({ error: err.message })))
            );
        })
        )
    );

    //Edit data
    loadMaritalStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadMaritalStatus),
            mergeMap(() =>
                this._profileApiService.getMeritalStatus().pipe(
                    map(res =>
                        loadMaritalStatusSuccess({ maritalStatus: res.data })
                    ),
                    catchError(error =>
                        of(loadMaritalStatusFailure({ error }))
                    )
                )
            )
        )
    );
    loadShehiaProfile$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadShehiaProfile),
            mergeMap(() =>
                this._profileApiService.getShehiaProfile().pipe(
                    map(res =>
                        loadShehiaProfileSuccess({ shehiaProfile: res.data })
                    ),
                    catchError(error =>
                        of(loadShehiaProfileFailure({ error }))
                    )
                )
            )
        )
    );
    loadBankName$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadBankName),
            mergeMap(() =>
                this._profileApiService.getAllBanks().pipe(
                    map(res =>{

                    const bankNames = res.data.map((bank: any) => ({
                        ...bank,
                        displayName: `${bank.bank_name} (${bank.abraviation})`
                    }));

                       return loadBankNameSuccess({ bankName: bankNames })

                    }),
                    catchError(error =>
                        of(loadBankNameFailure({ error }))
                    )
                )
            )
        )
    );
    



    






    constructor(
        private actions$: Actions,
        private _profileApiService: ProfileService
    ) { }
}