import { Action, createReducer, on } from '@ngrx/store';
import { addEmployeeTransfer, addEmployeeTransferFailure, addEmployeeTransferSuccess, deleteEmployeeTransferSuccess, fetchEmployeeTransferData, fetchEmployeeTransferFailure, fetchEmployeeTransferSuccess, loadTransferReasonsSuccess, loadWorkStationsSuccess } from './transfer_action';

export interface TransferState {
    EmployeeTransfer: any[];
    Workstations: any[];
    Reasons: any[];
    loading: boolean;
    error: any;
}

export const initialState: TransferState = {
    EmployeeTransfer: [],
    Workstations: [],
    Reasons: [],
    loading: false,
    error: null,
};

export const TransferReducer = createReducer(
    initialState,
    // Employee Transfer
    on(fetchEmployeeTransferData, (state) => ({...state, loading: true, error: null })),
    on(fetchEmployeeTransferSuccess, (state, { Transfer }) => ({...state, EmployeeTransfer: Transfer, loading: false })),
    on(fetchEmployeeTransferFailure, (state, { error }) => ({...state,error, loading: false })),

    on(addEmployeeTransfer, (state) => ({...state,loading: true,error: null})),
    on(addEmployeeTransferSuccess, (state) => ({...state,loading: false})),
    on(addEmployeeTransferFailure, (state, { error }) => ({...state,loading: false,error})),
    
    on(deleteEmployeeTransferSuccess, (state, { transfer_request_id }) => {
        const updatedTransfers = state.EmployeeTransfer.filter((transfer) => transfer.transfer_request_id !== transfer_request_id);
        return {
            ...state,
            EmployeeTransfer: updatedTransfers,
            loading: false,
            error: null
        };
    }),

    //work station and reason transfer form
    on(loadWorkStationsSuccess, (state, { workstations }) => ({...state,Workstations: workstations})),
    on(loadTransferReasonsSuccess, (state, { reasons }) => ({...state,Reasons: reasons}))

    
);

// Selector
export function reducer(state: TransferState | undefined, action: Action) {
    return TransferReducer(state, action);
}
