import { createReducer, on } from '@ngrx/store';
import { addStaffRegistration, addStaffRegistrationFailure, addStaffRegistrationSuccess, clearSearchEmployee, loadSearchEmployeeSuccess, login, loginFailure, loginSuccess, logout, logoutSuccess } from './authentication.actions';
import { LoginCredential } from './auth.models';

export interface AuthenticationState {
    isLoggedIn: boolean;
    user: LoginCredential | null;
    error: any | null;
    loading: boolean;

    SearchEmployee: any;

}

const initialState: AuthenticationState = {
    SearchEmployee: {},

    isLoggedIn: false,
    user: null,
    error: null,
    loading: false,
};

export const authenticationReducer = createReducer(
    initialState,

    on(login, (state) => ({ 
        ...state, 
        loading: true,
        error: null 
    })),
    on(loginSuccess, (state, { user }) => ({ 
        ...state, 
        isLoggedIn: true, 
        user, 
        loading: false,
        error: null, 
    })),
    on(loginFailure, (state, { error }) => ({ 
        ...state, 
        loading: false,
        error 
    })),
    on(logout, (state) => ({ 
        ...state, 
        user: null 
    })),
    on(logoutSuccess, (state) => ({
        ...state,
        user: null,
        isLoggedIn: false,
        error: null
    })),



    //get data kuenda katika form
    on(loadSearchEmployeeSuccess, (state, { search_list }) => ({...state, SearchEmployee: search_list })),
    on(clearSearchEmployee, (state) => ({...state,SearchEmployee: null})),

    on(addStaffRegistration, (state) => ({...state,loading: true,error: null})),
    on(addStaffRegistrationSuccess, (state) => ({...state,loading: false,})),
    on(addStaffRegistrationFailure, (state, { error }) => ({...state,loading: false,error })),

);
