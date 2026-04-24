import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthenticationState } from './authentication.reducer';

export const selectLayoutState = createFeatureSelector<AuthenticationState>('auth');

export const selectUser = createSelector(
    selectLayoutState,
    (state: AuthenticationState) => state.user
);

export const selectIsLoggedIn = createSelector(
    selectLayoutState,
    (state: AuthenticationState) => state.isLoggedIn
);

export const selectAuthError = createSelector(
    selectLayoutState,
    (state: AuthenticationState) => state.error
);

export const selectUserPermissions = createSelector(
  selectLayoutState,
  (state: AuthenticationState) => state.user?.permissions || []
);

export const selectAuthLoading = createSelector(
    selectLayoutState,
    (state: AuthenticationState) => state.loading
);

export const selectSeachEmployeeData = createSelector(selectLayoutState,state => state.SearchEmployee);
