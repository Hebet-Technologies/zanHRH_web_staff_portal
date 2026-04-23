import { Action, createReducer, on } from '@ngrx/store';
import { addStaffAdvertRequestForm, addStaffAdvertRequestFormFailure, addStaffAdvertRequestFormSuccess, deleteStaffAdvertRequestSuccess, fetchAdvertisementDashboardCount, fetchAdvertisementDashboardCountFailure, fetchAdvertisementDashboardCountSuccess, fetchStaffDashboardCount, fetchStaffDashboardCountFailure, fetchStaffDashboardCountSuccess, loadAdvertPositionsSuccess, loadAdvertProgramSuccess, loadGetApplicationSuccess } from './dashboard_action';

export interface DashboardState {
    StaffCountDashboard: any;
    AdvertisementDashboard: any[];
    GetApplication: any[];
    AdvertPositionsID: any[];
    AdvertProgramID: any[];

    loading: boolean;
    error: any;
}

export const initialState: DashboardState = {
    StaffCountDashboard: {},
    AdvertisementDashboard: [],
    GetApplication: [],
    AdvertPositionsID: [],
    AdvertProgramID: [],


    loading: false,
    error: null,
};

export const DashboardReducer = createReducer(
    initialState,
    // staff data request
    on(fetchStaffDashboardCount, (state) => ({...state, loading: true, error: null })),
    on(fetchStaffDashboardCountSuccess, (state, { StaffCount }) => ({...state, StaffCountDashboard: StaffCount, loading: false })),
    on(fetchStaffDashboardCountFailure, (state, { error }) => ({...state,error, loading: false })),
    //AdvertisementDashboard
    on(fetchAdvertisementDashboardCount, (state) => ({...state, loading: true, error: null })),
    on(fetchAdvertisementDashboardCountSuccess, (state, { AdvertisementCount }) => ({...state, AdvertisementDashboard: AdvertisementCount, loading: false })),
    on(fetchAdvertisementDashboardCountFailure, (state, { error }) => ({...state,error, loading: false })),
    //get data kuenda katika form
    on(loadGetApplicationSuccess, (state, { app_list }) => ({...state, GetApplication: app_list })),
    on(loadAdvertPositionsSuccess, (state, { advertPositionsID }) => ({...state, AdvertPositionsID: advertPositionsID})),
    on(loadAdvertProgramSuccess, (state, { advertProgramID }) => ({...state, AdvertProgramID: advertProgramID})),
    //add data za staff anaefanya request ya data
    on(addStaffAdvertRequestForm, (state) => ({...state,loading: true,error: null})),
    on(addStaffAdvertRequestFormSuccess, (state) => ({...state,loading: false})),
    on(addStaffAdvertRequestFormFailure, (state, { error }) => ({...state,loading: false,error})),

    on(deleteStaffAdvertRequestSuccess, (state, { staffAdverApplicationID }) => {
        const updatedStaffAdvert = state.AdvertisementDashboard.filter((advert) => advert.staff_adver_application_id !== staffAdverApplicationID);
        return {
            ...state,
            AdvertisementDashboard: updatedStaffAdvert,
            loading: false,
            error: null
        };
    }),
    

);

// Selector
export function reducer(state: DashboardState | undefined, action: Action) {
    return DashboardReducer(state, action);
}
