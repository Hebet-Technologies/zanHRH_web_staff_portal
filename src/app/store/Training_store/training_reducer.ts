import { createReducer, Action, on } from "@ngrx/store";
import { fetchEmployeeTrainingData, fetchEmployeeTrainingSuccess, fetchEmployeeTrainingFailure, loadTrainingAnnoucementSuccess, loadInstituteCountrySuccess, loadInstituteSuccess, addTrainingForm, addTrainingFormFailure, addTrainingFormSuccess, deleteTrainingFormSuccess } from "./training_action";

export interface TrainingState {
    EmployeeTrainingList: any[];
    TrainingAnnoucement: any[],
    InstituteCountry: any[];
    Institutes: any[];

    loading: boolean;
    error: any;

};

export const initialState: TrainingState = {
    EmployeeTrainingList: [],
    TrainingAnnoucement: [],
    InstituteCountry: [],
    Institutes: [],

    loading: false,
    error: null,

};

export const TrainingReducer = createReducer(
    initialState,
     // Training list
    on(fetchEmployeeTrainingData, (state) => ({...state, loading: true, error: null })),
    on(fetchEmployeeTrainingSuccess, (state, { trainingList }) => ({...state, EmployeeTrainingList: trainingList, loading: false })),
    on(fetchEmployeeTrainingFailure, (state, { error }) => ({...state,error, loading: false })),

    on(loadTrainingAnnoucementSuccess, (state, { trainingAnnoucements }) => ({...state, TrainingAnnoucement: trainingAnnoucements })),

    on(addTrainingForm, (state) => ({...state,loading: true,error: null})),
    on(addTrainingFormSuccess, (state) => ({...state,loading: false})),
    on(addTrainingFormFailure, (state, { error }) => ({...state,loading: false,error})),

    on(deleteTrainingFormSuccess, (state, { training_application_id }) => {
        const updatedTraining = state.EmployeeTrainingList.filter((training) => training.training_application_id !== training_application_id);
        return {
            ...state,
            EmployeeTrainingList: updatedTraining,
            loading: false,
            error: null
        };
    }),
    
    on(loadInstituteCountrySuccess, (state, { country }) => ({...state,InstituteCountry: country})),
    on(loadInstituteSuccess, (state, { institutes }) => ({...state,Institutes: institutes})),
    
);
// Selector
export function reducer(state: TrainingState | undefined, action: Action) {
    return TrainingReducer(state, action);
}
