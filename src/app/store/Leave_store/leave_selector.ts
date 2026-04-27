import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LeaveState } from './leave_reducer';

export const selectLeaveState = createFeatureSelector<LeaveState>('leaves');
export const selectLeaveData = createSelector(selectLeaveState,(state: LeaveState) => state.LeaveRequest);
export const selectLeaveHistory = createSelector(selectLeaveState,(state: LeaveState) => state.LeaveHistory);

// LeaveStatusRequestForm
export const selectLeaveStatusRequestForm = createSelector(selectLeaveState,state => state.LeaveStatusRequestForm);
export const selectPersonalDetail = createSelector(selectLeaveState,state => state.PersonalDetails);
export const selectRepresentatives = createSelector(selectLeaveState,state => state.Representatives);
export const selectCountry = createSelector(selectLeaveState,state => state.Countrys);

//management of leave request
export const selectStaffOnLeave = createSelector(selectLeaveState,state => state.StaffOnLeaves);
export const selectStaffWaitingForLeave = createSelector(selectLeaveState,state => state.StaffWaitingForLeave);
export const selectStaffOverdueLeave = createSelector(selectLeaveState,state => state.StaffOverdueLeave);
export const selectStaffLeaveRequestStage = createSelector(selectLeaveState,state => state.StaffLeaveRequestStage);
export const selectStaffDeniedLeaveRequest = createSelector(selectLeaveState,state => state.StaffDeniedLeaveRequest);
export const selectStaffBackToWork = createSelector(selectLeaveState,state => state.StaffBackToWork);

//load and error data
export const selectLeaveLoading = createSelector(selectLeaveState,(state: LeaveState) => state.loading);
export const selectLeaveError = createSelector(selectLeaveState,(state: LeaveState) => state.error);


