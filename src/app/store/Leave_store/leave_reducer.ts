import { Action, createReducer, on } from '@ngrx/store';
import { fetchLeaveData, fetchLeaveSuccess, fetchLeaveFailure, addLeave, addLeaveSuccess, addLeaveFailure, deleteLeaveSuccess, loadLeaveStatusRequestFormSuccess, loadPersonalDetailSuccess, loadRepresentativesSuccess, loadCountrySuccess, loadLeaveHistoryData, loadLeaveHistoryFailure, loadLeaveHistorySuccess, addLeaveReturnToWork, addLeaveReturnToWorkFailure, addLeaveReturnToWorkSuccess } from './leave_action';

export interface LeaveState {
    LeaveRequest: any[];
    LeaveStatusRequestForm: any[];
    PersonalDetails: any,
    Representatives: any[];
    LeaveHistory: any[];
    Countrys: any[];
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


);

// Selector
export function reducer(state: LeaveState | undefined, action: Action) {
    return LeaveReducer(state, action);
}
