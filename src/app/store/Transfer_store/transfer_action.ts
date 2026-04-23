import { createAction, props } from '@ngrx/store';
import { TransferRequestPayload } from './transfer_model';

// View Employee Transfer
export const fetchEmployeeTransferData = createAction('[Data] Fetch Employee Transfer');
export const fetchEmployeeTransferSuccess = createAction('[Data] Fetch Employee Transfer Success',props<{ Transfer: any[] }>());
export const fetchEmployeeTransferFailure = createAction('[Data] Fetch Employee Transfer Failure', props<{ error: string }>());
// Add Employee Transfer Data
// props<{ newData: EmployeeViewTransfer }>() hii unaweka pale tu api inaporejesha data yani object
export const addEmployeeTransfer = createAction('[Data] Add Employee Transfer',props<{ newData: TransferRequestPayload }>());
export const addEmployeeTransferSuccess = createAction('[Data] Add Employee Transfer Success');
export const addEmployeeTransferFailure = createAction('[Data] Add Employee Transfer Failure',props<{ error: string }>());
// Delete Employee Transfer Data
export const deleteEmployeeTransfer = createAction('[Data] Delete Employee Transfer',props<{ transfer_request_id: number }>());
export const deleteEmployeeTransferSuccess = createAction('[Data] Delete Employee Transfer Success',props<{ transfer_request_id: number }>());
export const deleteEmployeeTransferFailure = createAction('[Data] Delete Employee Transfer Failure',props<{ error: string }>());
//load work station
export const loadWorkStations = createAction('[Data] Load WorkStations');
export const loadWorkStationsSuccess = createAction('[Data] Load WorkStations Success',props<{ workstations: any[] }>());
export const loadWorkStationsFailure = createAction('[Data] Load WorkStations Failure',props<{ error: any }>());
//load loadTransferReasons
export const loadTransferReasons = createAction('[Data] Load Reasons');
export const loadTransferReasonsSuccess = createAction('[Transfer] Load Reasons Success',props<{ reasons: any[] }>());
export const loadTransferReasonsFailure = createAction('[Transfer] Load Reasons Failure',props<{ error: any }>());


