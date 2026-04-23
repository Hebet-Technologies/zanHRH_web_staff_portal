import { ActionReducerMap } from "@ngrx/store";
import { LayoutState, layoutReducer } from "./layouts/layout-reducers";
import { authenticationReducer, AuthenticationState } from "./Authentication/authentication.reducer";
import { TransferReducer, TransferState } from "./Transfer_store/transfer_reducer";
import { LeaveState, LeaveReducer } from "./Leave_store/leave_reducer";
import { PersonalProfileState, PersonalProfileReducer } from "./Profile_store/profile_reducer";
import { TrainingState, TrainingReducer } from "./Training_store/training_reducer";
import { DashboardState, DashboardReducer } from "./Dashboard_store/dashboard_reducer";

export interface RootReducerState {
    layout: LayoutState;
    auth: AuthenticationState;
    transfer: TransferState;
    leaves: LeaveState,
    profile: PersonalProfileState,
    training: TrainingState,
    dashboard: DashboardState

}

export const rootReducer: ActionReducerMap<RootReducerState> = {
    layout: layoutReducer,
    auth: authenticationReducer,
    transfer: TransferReducer,
    leaves: LeaveReducer,
    profile: PersonalProfileReducer,
    training: TrainingReducer,
    dashboard: DashboardReducer




}