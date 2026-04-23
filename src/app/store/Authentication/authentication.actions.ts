import { createAction, props } from '@ngrx/store';
import { LoginCredential, StaffRegistrationPayload } from './auth.models';

// login action
export const login = createAction(
    '[Authentication] Login', 
    props<{ email: string, password: string }>()
);
export const loginSuccess = createAction(
    '[Authentication] Login Success', 
    props<{ user: LoginCredential }>()
);
export const loginFailure = createAction(
    '[Authentication] Login Failure', 
    props<{ error: any }>()
);

//search employee data
export const loadSearchEmployee = createAction('[Employee] Load SearchEmployee', props<{ out_put_Data: { payroll: string; date_of_birth: string } }>());
export const loadSearchEmployeeSuccess = createAction('[Employee] Load SearchEmployee Success', props<{ search_list: any }>()); 
export const loadSearchEmployeeFailure = createAction('[Employee] Load SearchEmployee Failure', props<{ error: any }>());
export const clearSearchEmployee = createAction('[Employee] Clear SearchEmployee');
//register employee
export const addStaffRegistration = createAction('[Staff] Staff Registration', props<{ payload: StaffRegistrationPayload }>());
export const addStaffRegistrationSuccess = createAction('[Staff] Staff Registration Success');
export const addStaffRegistrationFailure = createAction('[Staff] Staff Registration Failure', props<{ error: string }>());

// logout action
export const logout = createAction('[Authentication] Logout');
export const logoutSuccess = createAction('[Authentication] Logout Success');


