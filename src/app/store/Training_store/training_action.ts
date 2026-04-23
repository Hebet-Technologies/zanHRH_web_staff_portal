import { createAction, props } from "@ngrx/store";
import { TrainingRequestFormPayload } from "./training_model";

// View Employee Training hii ni ikiwa api ni ya kupata data za get ila inatumia method za post
export const fetchEmployeeTrainingData = createAction('[Data] Fetch Employee Training',props<{ personal_informationID: any[] }>());
export const fetchEmployeeTrainingSuccess = createAction('[Data] Fetch Employee Training Success',props<{ trainingList: any[] }>());
export const fetchEmployeeTrainingFailure = createAction('[Data] Fetch Employee Training Failure', props<{ error: string }>());
// view TrainingAnnoucement
export const loadTrainingAnnoucement = createAction('[Data] Load TrainingAnnoucement');
export const loadTrainingAnnoucementSuccess = createAction('[Data] Load TrainingAnnoucement Success',props<{ trainingAnnoucements: any[] }>());
export const loadTrainingAnnoucementFailure = createAction('[Data] Load TrainingAnnoucement Failure',props<{ error: any }>());
//add TrainingForm
export const addTrainingForm = createAction('[Data] Add TrainingForm',props<{ newData: TrainingRequestFormPayload }>());
export const addTrainingFormSuccess = createAction('[Data] Add TrainingForm Success');
export const addTrainingFormFailure = createAction('[Data] Add TrainingForm Failure',props<{ error: string }>());
// Delete TrainingForm
export const deleteTrainingForm = createAction('[Data] Delete TrainingForm',props<{ training_application_id: number }>());
export const deleteTrainingFormSuccess = createAction('[Data] Delete TrainingForm Success',props<{ training_application_id: number }>());
export const deleteTrainingFormFailure = createAction('[Data] Delete TrainingForm Failure',props<{ error: string }>());
//load Institute Country
export const loadInstituteCountry = createAction('[Data] Load Institute Country');
export const loadInstituteCountrySuccess = createAction('[Data] Load Institute Country Success',props<{ country: any[] }>());
export const loadInstituteCountryFailure = createAction('[Data] Load Institute Country Failure',props<{ error: any }>());
//load Institute
export const loadInstitute = createAction('[Data] Load Institute',props<{ countryCode: string; educationLevel: string }>());
export const loadInstituteSuccess = createAction('[Data] Load Institute Success',props<{ institutes: any[] }>());
export const loadInstituteFailure = createAction('[Data] Load Institute Failure',props<{ error: any }>());
