import { createAction, props } from "@ngrx/store";
import { StaffAdvertFormPayload } from "./dashboard_model";

//staff dashboard
//staff count dashboar
export const fetchStaffDashboardCount = createAction('[Staff] Fetch Staff Dashboard Count');
export const fetchStaffDashboardCountSuccess = createAction('[Staff] Fetch Staff Dashboard Count Success',props<{ StaffCount: any }>());
export const fetchStaffDashboardCountFailure = createAction('[Staff] Fetch Staff Dashboard Count Failure', props<{ error: string }>());
//advertisement
export const fetchAdvertisementDashboardCount = createAction('[Advertisement] Fetch Advertisement Dashboard');
export const fetchAdvertisementDashboardCountSuccess = createAction('[Advertisement] Fetch Advertisement Dashboard Success', props<{ AdvertisementCount: any[] }>());
export const fetchAdvertisementDashboardCountFailure = createAction('[Advertisement] Fetch Advertisement Dashboard Failure', props<{ error: string }>());
//load advertisement data ambayo ipo katika format ya post ila inaget data
export const loadGetApplication = createAction('[Application] Load GetApplication',props<{ personal_id: number }>());
export const loadGetApplicationSuccess = createAction('[Application] Load GetApplication Success', props<{ app_list: any[] }>());
export const loadGetApplicationFailure = createAction('[Application] Load GetApplication Failure', props<{ error: any }>());
//load advert position
export const loadAdvertPositions = createAction('[Data] Load Advert Positions', props<{ staffAdvertisementID: string }>());
export const loadAdvertPositionsSuccess = createAction('[Data] Load Advert Positions Success', props<{ advertPositionsID: any[] }>());
export const loadAdvertPositionsFailure = createAction('[Data] Load Advert Positions Failure', props<{ error: any }>());
//load advert program
export const loadAdvertProgram = createAction('[Data] Load Advert Program', props<{ staffAdvertisementID: string }>());
export const loadAdvertProgramSuccess = createAction('[Data] Load Advert Program Success', props<{ advertProgramID: any[] }>());
export const loadAdvertProgramFailure = createAction('[Data] Load Advert Program Failure', props<{ error: any }>());
//add staff advert
export const addStaffAdvertRequestForm = createAction('[Data] Add StaffAdvertRequestForm', props<{ newData: StaffAdvertFormPayload }>());
export const addStaffAdvertRequestFormSuccess = createAction('[Data] Add StaffAdvertRequestForm Success');
export const addStaffAdvertRequestFormFailure = createAction('[Data] Add StaffAdvertRequestForm Failure', props<{ error: string }>());
//delete staff advert
export const deleteStaffAdvertRequest = createAction('[Data] Delete StaffAdvertRequest', props<{ staffAdverApplicationID: number }>());
export const deleteStaffAdvertRequestSuccess = createAction('[Data] Delete StaffAdvertRequest Success', props<{ staffAdverApplicationID: number }>());
export const deleteStaffAdvertRequestFailure = createAction('[Data] Delete StaffAdvertRequest Failure', props<{ error: string }>());

// end staff dashboard