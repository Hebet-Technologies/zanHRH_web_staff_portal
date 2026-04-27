import { Action, createReducer, on } from '@ngrx/store';
import { fetchLeaveData, fetchLeaveSuccess, fetchLeaveFailure, addLeave, addLeaveSuccess, addLeaveFailure, deleteLeaveSuccess, loadLeaveStatusRequestFormSuccess, loadPersonalDetailSuccess, loadRepresentativesSuccess, loadCountrySuccess, loadLeaveHistoryData, loadLeaveHistoryFailure, loadLeaveHistorySuccess, addLeaveReturnToWork, addLeaveReturnToWorkFailure, addLeaveReturnToWorkSuccess, fetchStaffOnLeave, fetchStaffOnLeaveFailure, fetchStaffOnLeaveSuccess, fetchStaffWaitingForLeave, fetchStaffWaitingForLeaveFailure, fetchStaffWaitingForLeaveSuccess, fetchStaffOverdueLeaveFailure, fetchStaffOverdueLeaveSuccess, fetchStaffOverdueLeave, fetchStaffLeaveRequestStage, fetchStaffLeaveRequestStageFailure, fetchStaffLeaveRequestStageSuccess, fetchStaffDeniedLeaveRequest, fetchStaffDeniedLeaveRequestFailure, fetchStaffDeniedLeaveRequestSuccess, fetchStaffBackToWork, fetchStaffBackToWorkFailure, fetchStaffBackToWorkSuccess, addConfirmLeaveReturnToWork, addConfirmLeaveReturnToWorkFailure, addConfirmLeaveReturnToWorkSuccess } from './leave_action';

export interface LeaveState {
    LeaveRequest: any[];
    LeaveStatusRequestForm: any[];
    PersonalDetails: any,
    Representatives: any[];
    LeaveHistory: any[];
    Countrys: any[];

    StaffOnLeaves: any[];
    StaffWaitingForLeave: any[];
    StaffOverdueLeave: any[];
    StaffLeaveRequestStage: any[];
    StaffDeniedLeaveRequest: any[];
    StaffBackToWork: any[];

    loading: boolean;
    error: any;
}

export const initialState: LeaveState = {
    LeaveRequest: [],
    LeaveStatusRequestForm: [],
    PersonalDetails: null,
    Representatives: [],
    LeaveHistory: [],
    Countrys: [],

    StaffOnLeaves: [],
    StaffWaitingForLeave: [],
    StaffOverdueLeave: [],
    StaffLeaveRequestStage: [],
    StaffDeniedLeaveRequest: [],
    StaffBackToWork: [],


    loading: false,
    error: null,
};

export const LeaveReducer = createReducer(
    initialState,
    // Leave data request
    on(fetchLeaveData, (state) => ({...state, loading: true, error: null })),
    on(fetchLeaveSuccess, (state, { Leave }) => ({...state, LeaveRequest: Leave, loading: false })),
    on(fetchLeaveFailure, (state, { error }) => ({...state,error, loading: false })),
    // Leave data history
    on(loadLeaveHistoryData, (state) => ({...state, loading: true, error: null })),
    on(loadLeaveHistorySuccess, (state, { history }) => ({...state, LeaveHistory: history, loading: false })),
    on(loadLeaveHistoryFailure, (state, { error }) => ({...state,error, loading: false })),

    on(addLeave, (state) => ({...state,loading: true,error: null})),
    on(addLeaveSuccess, (state) => ({...state,loading: false,})),
    on(addLeaveFailure, (state, { error }) => ({...state,loading: false,error })),
    
    on(deleteLeaveSuccess, (state, { leave_request_id }) => {
        const updatedLeaves = state.LeaveRequest.filter((leave) => leave.leave_request_id !== leave_request_id);
        return {
            ...state,
            LeaveRequest: updatedLeaves,
            loading: false,
            error: null
        };
    }),

    // Leave Status Request Form
    on(loadLeaveStatusRequestFormSuccess, (state, { leaveStatus }) => ({...state, LeaveStatusRequestForm: leaveStatus})),
    on(loadPersonalDetailSuccess, (state, { personalDetail }) => ({...state, PersonalDetails: personalDetail})),
    on(loadRepresentativesSuccess, (state, { representatives }) => ({...state, Representatives: representatives})),
    on(loadCountrySuccess, (state, { country }) => ({...state, Countrys: country})),

    //leave return to work form
    on(addLeaveReturnToWork, (state) => ({...state,loading: true,error: null})),
    on(addLeaveReturnToWorkSuccess, (state) => ({...state,loading: false,})),
    on(addLeaveReturnToWorkFailure, (state, { error }) => ({...state,loading: false,error })),

    //management of leave request

    //staff on leave
    on(fetchStaffOnLeave, (state) => ({...state, loading: true, error: null })),
    on(fetchStaffOnLeaveSuccess, (state, { StaffOnLeave }) => ({...state, StaffOnLeaves: StaffOnLeave, loading: false })),
    on(fetchStaffOnLeaveFailure, (state, { error }) => ({...state,error, loading: false })),
    //staff waiting for leave
    on(fetchStaffWaitingForLeave, (state) => ({...state, loading: true, error: null })),
    on(fetchStaffWaitingForLeaveSuccess, (state, { staffWaitingForLeave }) => ({...state, StaffWaitingForLeave: staffWaitingForLeave, loading: false })),
    on(fetchStaffWaitingForLeaveFailure, (state, { error }) => ({...state,error, loading: false })),

    //staff overdue leave
    on(fetchStaffOverdueLeave, (state) => ({...state, loading: true, error: null })),
    on(fetchStaffOverdueLeaveSuccess, (state, { staffOverdueLeave }) => ({...state, StaffOverdueLeave: staffOverdueLeave, loading: false })),
    on(fetchStaffOverdueLeaveFailure, (state, { error }) => ({...state,error, loading: false })),

    //staff leave requests stage
    on(fetchStaffLeaveRequestStage, (state) => ({...state, loading: true, error: null })),
    on(fetchStaffLeaveRequestStageSuccess, (state, { staffLeaveRequestStage }) => ({...state, StaffLeaveRequestStage: staffLeaveRequestStage, loading: false })),
    on(fetchStaffLeaveRequestStageFailure, (state, { error }) => ({...state,error, loading: false })),

    //staff denied leave request
    on(fetchStaffDeniedLeaveRequest, (state) => ({...state, loading: true, error: null })),
    on(fetchStaffDeniedLeaveRequestSuccess, (state, { staffDeniedLeaveRequest }) => ({...state, StaffDeniedLeaveRequest: staffDeniedLeaveRequest, loading: false })),
    on(fetchStaffDeniedLeaveRequestFailure, (state, { error }) => ({...state,error, loading: false })),

    //staff back to work
    on(fetchStaffBackToWork, (state) => ({...state, loading: true, error: null })),
    on(fetchStaffBackToWorkSuccess, (state, { staffBackToWork }) => ({...state, StaffBackToWork: staffBackToWork, loading: false })),
    on(fetchStaffBackToWorkFailure, (state, { error }) => ({...state,error, loading: false })),

    //Confirm leave return to work form
    on(addConfirmLeaveReturnToWork, (state) => ({...state,loading: true,error: null})),
    on(addConfirmLeaveReturnToWorkSuccess, (state) => ({...state,loading: false,})),
    on(addConfirmLeaveReturnToWorkFailure, (state, { error }) => ({...state,loading: false,error })),

);

// Selector
export function reducer(state: LeaveState | undefined, action: Action) {
    return LeaveReducer(state, action);
}
