import { Injectable } from "@angular/core";

import { of } from 'rxjs';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from "@ngrx/effects";
import { TransferService } from "src/app/core/services/transter-card/transfer.service";
import { fetchEmployeeTransferData, fetchEmployeeTransferSuccess, fetchEmployeeTransferFailure, loadTransferReasons, loadTransferReasonsFailure, loadTransferReasonsSuccess, loadWorkStations, loadWorkStationsFailure, loadWorkStationsSuccess, addEmployeeTransferFailure, addEmployeeTransferSuccess, addEmployeeTransfer, deleteEmployeeTransfer, deleteEmployeeTransferFailure, deleteEmployeeTransferSuccess } from "./transfer_action";


@Injectable()
export class TransferEffects {

    // Employee Transfer
    fetchEmployeeTransferData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchEmployeeTransferData),
            mergeMap(() =>
                this._transferApiService.getAllTransfere().pipe(
                    map((transferlist) => {
                        // const Transfer = JSON.parse(transferlist).data;
                        const Transfer = transferlist.data;
                        return fetchEmployeeTransferSuccess({ Transfer })
                    }),
                    catchError((error) =>
                        of(fetchEmployeeTransferFailure({ error }))
                    )
                )
            ),
        ),
    );
    loadWorkStations$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadWorkStations),
            mergeMap(() =>
            this._transferApiService.getWorkStation().pipe(
                map(res =>
                loadWorkStationsSuccess({ workstations: res.data })
                ),
                catchError(error =>
                of(loadWorkStationsFailure({ error }))
                )
            )
            )
        )
    );
    loadTransferReasons$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadTransferReasons),
            mergeMap(() =>
            this._transferApiService.getTransfereReason().pipe(
                map(res =>
                loadTransferReasonsSuccess({ reasons: res.data })
                ),
                catchError(error =>
                of(loadTransferReasonsFailure({ error }))
                )
            )
            )
        )
    );
     // Add transfer
    addTransfer$ = createEffect(() =>
        this.actions$.pipe(
        ofType(addEmployeeTransfer),
        mergeMap(({ newData }) => {
            // Convert to FormData because backend expects file
            const formData = new FormData();
            formData.append('personal_information_id', newData.personal_information_id.toString());
            formData.append('working_station_id_to', newData.working_station_id_to.toString());
            formData.append('transfer_reason_id', newData.transfer_reason_id.toString());
            if (newData.upload_file_name) {
            formData.append('upload_file_name', newData.upload_file_name);
            }

            return this._transferApiService.createRequestTransfere(formData).pipe(
                mergeMap(res => {
                if (res.statusCode === 201) {
                    // Success, re-fetch all transfers
                    return [
                        addEmployeeTransferSuccess(), // trigger success for component
                        fetchEmployeeTransferData(), // refresh table
                    ];
                } else {
                    return [addEmployeeTransferFailure({ error: res.message })];
                }
                }),
                catchError(err => of(addEmployeeTransferFailure({ error: err.message })))
            );
        })
        )
    );

    deleteTransfer$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteEmployeeTransfer),
            mergeMap(({ transfer_request_id }) =>
            this._transferApiService.deleteTransfer(transfer_request_id).pipe(

                map(() =>
                deleteEmployeeTransferSuccess({ transfer_request_id })
                ),

                catchError((error) =>
                of(deleteEmployeeTransferFailure({ error: error.message }))
                )
            )
            )
        )
    );

    constructor(
        private actions$: Actions,
        private _transferApiService: TransferService
    ) { }
}