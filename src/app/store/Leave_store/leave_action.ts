import { createAction, props } from '@ngrx/store';
import { ConfirmLeaveReturnToWorkPayload, LeaveRequestPayload, LeaveReturnToWorkPayload } from './leave_model';

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





//management of leave request

//staff on leave
export const fetchStaffOnLeave = createAction('[Data] Fetch Staff On Leave');
export const fetchStaffOnLeaveSuccess = createAction('[Data] Fetch Staff On Leave Success', props<{ StaffOnLeave: any[] }>());
export const fetchStaffOnLeaveFailure = createAction('[Data] Fetch Staff On Leave Failure', props<{ error: string }>());
//staff waiting for leave
export const fetchStaffWaitingForLeave = createAction('[Data] Fetch Staff Waiting For Leave');
export const fetchStaffWaitingForLeaveSuccess = createAction('[Data] Fetch Staff Waiting For Leave Success', props<{ staffWaitingForLeave: any[] }>());
export const fetchStaffWaitingForLeaveFailure = createAction('[Data] Fetch Staff Waiting For Leave Failure', props<{ error: string }>());
//staff overdue leave 
export const fetchStaffOverdueLeave = createAction('[Data] Fetch Staff Overdue Leave');
export const fetchStaffOverdueLeaveSuccess = createAction('[Data] Fetch Staff Overdue Leave Success', props<{ staffOverdueLeave: any[] }>());
export const fetchStaffOverdueLeaveFailure = createAction('[Data] Fetch Staff Overdue Leave Failure', props<{ error: string }>());
// staff leave requests stage
export const fetchStaffLeaveRequestStage = createAction('[Data] Fetch Staff Leave Request Stage');
export const fetchStaffLeaveRequestStageSuccess = createAction('[Data] Fetch Staff Leave Request Stage Success', props<{ staffLeaveRequestStage: any[] }>());
export const fetchStaffLeaveRequestStageFailure = createAction('[Data] Fetch Staff Leave Request Stage Failure', props<{ error: string }>());
// staff denied leave request
export const fetchStaffDeniedLeaveRequest = createAction('[Data] Fetch Staff Denied Leave Request');
export const fetchStaffDeniedLeaveRequestSuccess = createAction('[Data] Fetch Staff Denied Leave Request Success', props<{ staffDeniedLeaveRequest: any[] }>());
export const fetchStaffDeniedLeaveRequestFailure = createAction('[Data] Fetch Staff Denied Leave Request Failure', props<{ error: string }>());
//general staff leave latter
export const loadGeneralStaffLeaveLetter = createAction('[Leave] Load General Staff Leave Letter', props<{ id: number }>());
export const loadGeneralStaffLeaveLetterSuccess = createAction('[Leave] Load General Staff Leave Letter Success', props<{ file: Blob }>());
export const loadGeneralStaffLeaveLetterFailure = createAction('[Leave] Load General Staff Leave Letter Failure', props<{ error: any }>());
//manage staff back to work
export const fetchStaffBackToWork = createAction('[Data] Fetch Staff Back To Work');
export const fetchStaffBackToWorkSuccess = createAction('[Data] Fetch Staff Back To Work Success', props<{ staffBackToWork: any[] }>());
export const fetchStaffBackToWorkFailure = createAction('[Data] Fetch Staff Back To Work Failure', props<{ error: string }>());
// add Confirm Leave Return to Work Form
export const addConfirmLeaveReturnToWork = createAction('[Data] Add Confirm Leave Return To Work',props<{ newData: ConfirmLeaveReturnToWorkPayload }>());
export const addConfirmLeaveReturnToWorkSuccess = createAction('[Data] Add Confirm Leave Return To Work Success',);
export const addConfirmLeaveReturnToWorkFailure = createAction('[Data] Add Confirm Leave Return To Work Failure',props<{ error: string }>());
//get leave request to approve
export const fetchLeaveRequestToApprove = createAction('[Data] Fetch Leave Request To Approve');
export const fetchLeaveRequestToApproveSuccess = createAction('[Data] Fetch Leave Request To Approve Success', props<{ leaveRequestToApprove: any[] }>());
export const fetchLeaveRequestToApproveFailure = createAction('[Data] Fetch Leave Request To Approve Failure', props<{ error: string }>());
//row selected data approve leave request
export const setSelectedLeaveRequest = createAction('[Leave] Set Selected',props<{ data: any }>());