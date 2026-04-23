import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TransferState } from './transfer_reducer';

export const selectEmployeeTransferState = createFeatureSelector<TransferState>('transfer');
export const selectEmployeeTransferData = createSelector(selectEmployeeTransferState,(state: TransferState) => state.EmployeeTransfer);

//form transfer
export const selectWorkStations = createSelector(selectEmployeeTransferState,state => state.Workstations);
export const selectTransferReasons = createSelector(selectEmployeeTransferState,state => state.Reasons);

//load and error
export const selectEmployeeTransferLoading = createSelector(selectEmployeeTransferState,(state: TransferState) => state.loading);
export const selectEmployeeTransferError = createSelector(selectEmployeeTransferState,(state: TransferState) => state.error);


