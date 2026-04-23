import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TrainingState } from "./training_reducer";

export const selectEmployeeTrainingState = createFeatureSelector<TrainingState>('training');
export const selectEmployeeTrainingData = createSelector(selectEmployeeTrainingState,(state: TrainingState) => state.EmployeeTrainingList);
export const selectTrainingAnnoucement = createSelector(selectEmployeeTrainingState, state => state.TrainingAnnoucement);

export const selectInstituteCountry = createSelector(selectEmployeeTrainingState,state => state.InstituteCountry);
export const selectInstitutes = createSelector(selectEmployeeTrainingState,state => state.Institutes);


//load and error
export const selectEmployeeTrainingLoading = createSelector(selectEmployeeTrainingState,(state: TrainingState) => state.loading);
export const selectEmployeeTrainingError = createSelector(selectEmployeeTrainingState,(state: TrainingState) => state.error);