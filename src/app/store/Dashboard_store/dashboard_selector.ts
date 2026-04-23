import { createFeatureSelector, createSelector } from "@ngrx/store";
import { DashboardState } from "./dashboard_reducer";


export const selectDashboardState = createFeatureSelector<DashboardState>('dashboard');

//staff dashboard data
export const selectStaffCountData = createSelector(selectDashboardState,(state: DashboardState) => state.StaffCountDashboard);
export const selectAdvertisementData = createSelector(selectDashboardState,(state: DashboardState) => state.AdvertisementDashboard);
export const selectGetApplicationData = createSelector(selectDashboardState,state => state.GetApplication);
export const selectAdvertPositionsIDData = createSelector(selectDashboardState,state => state.AdvertPositionsID);
export const selectAdvertProgramIDData = createSelector(selectDashboardState,state => state.AdvertProgramID);



//end of staff dashboar

//load and error data
export const selectDashboardLoading = createSelector(selectDashboardState,(state: DashboardState) => state.loading);
export const selectDashboardError = createSelector(selectDashboardState,(state: DashboardState) => state.error);