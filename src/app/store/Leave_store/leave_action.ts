import { createAction, props } from '@ngrx/store';
import { LeaveRequestPayload, LeaveReturnToWorkPayload } from './leave_model';

// View Leave
export const fetchLeaveData = createAction('[Data] Fetch Leave');
export const fetchLeaveSuccess = createAction('[Data] Fetch Leave Success',props<{ Leave: any[] }>());
export const fetchLeaveFailure = createAction('[Data] Fetch Leave Failure', props<{ error: string }>());
// Add Leave Data
export const addLeave = createAction('[Data] Add Leave',props<{ newData: LeaveRequestPayload }>());
export const addLeaveSuccess = createAction('[Data] Add Leave Success',);
export const addLeaveFailure = createAction('[Data] Add Leave Failure',props<{ error: string }>());
// Delete Leave Data
export const deleteLeave = createAction('[Data] Delete Leave',props<{ leave_request_id: number }>());
export const deleteLeaveSuccess = createAction('[Data] Delete Leave Success',props<{ leave_request_id: number }>());
export const deleteLeaveFailure = createAction('[Data] Delete Leave Failure',props<{ error: string }>());
// load Leave Status Request Form
export const loadLeaveStatusRequestForm = createAction('[Data] Load Leave Status Request Form',props<{ employeeID: string }>());
export const loadLeaveStatusRequestFormSuccess = createAction('[Data] Load Leave Status Request Form Success',props<{ leaveStatus: any[] }>());
export const loadLeaveStatusRequestFormFailure = createAction('[Data] Load Leave Status Request Form Failure',props<{ error: any }>());
// load personal detail
export const loadPersonalDetail = createAction('[Data] Load Personal Detail',props<{ employeeID: string }>());
export const loadPersonalDetailSuccess = createAction('[Data] Load Personal Detail Success',props<{ personalDetail: any }>());
export const loadPersonalDetailFailure = createAction('[Data] Load Personal Detail Failure',props<{ error: any }>());
//loadRepresentatives
export const loadRepresentatives = createAction('[Data] Load Representatives');
export const loadRepresentativesSuccess = createAction('[Data] Load Representatives Success',props<{ representatives: any[] }>());
export const loadRepresentativesFailure = createAction('[Data] Load Representatives Failure',props<{ error: any }>());
//loadCountry
export const loadCountry = createAction('[Data] Load Country');
export const loadCountrySuccess = createAction('[Data] Load Country Success',props<{ country: any[] }>());
export const loadCountryFailure = createAction('[Data] Load Country Failure',props<{ error: any }>());
// load Leave History
export const loadLeaveHistoryData = createAction('[Data] Load Leave History',props<{ employeeID: string }>());
export const loadLeaveHistorySuccess = createAction('[Data] Load Leave History Success',props<{ history: any[] }>());
export const loadLeaveHistoryFailure = createAction('[Data] Load Leave History Failure',props<{ error: any }>());
//load leave later
export const loadLeaveLetter = createAction('[Leave] Load Leave Letter',props<{ id: number }>());
export const loadLeaveLetterSuccess = createAction('[Leave] Load Leave Letter Success',props<{ file: Blob }>());
export const loadLeaveLetterFailure = createAction('[Leave] Load Leave Letter Failure',props<{ error: any }>());
// load Leave Return ro work Form
export const addLeaveReturnToWork = createAction('[Data] Add Leave Return To Work',props<{ newData: LeaveReturnToWorkPayload }>());
export const addLeaveReturnToWorkSuccess = createAction('[Data] Add Leave Return To Work Success',);
export const addLeaveReturnToWorkFailure = createAction('[Data] Add Leave Return To Work Failure',props<{ error: string }>());
//load leave Returned To Work Letter
export const loadLeaveReturnedToWorkLetter = createAction('[Leave] Load Leave Returned To Work Letter',props<{ id: number }>());
export const loadLeaveReturnedToWorkLetterSuccess = createAction('[Leave] Load Leave Returned To Work Letter Success',props<{ file: Blob }>());
export const loadLeaveReturnedToWorkLetterFailure = createAction('[Leave] Load Leave Returned To Work Letter Failure',props<{ error: any }>());

