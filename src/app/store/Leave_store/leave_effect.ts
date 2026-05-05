import { Injectable } from "@angular/core";

import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';

import { Actions, createEffect, ofType } from "@ngrx/effects";
import { LeavesService } from "src/app/core/services/leave-card/leaves.service";
import { fetchLeaveData, fetchLeaveSuccess, fetchLeaveFailure, loadLeaveStatusRequestForm, loadLeaveStatusRequestFormFailure, loadLeaveStatusRequestFormSuccess, loadPersonalDetail, loadPersonalDetailFailure, loadPersonalDetailSuccess, loadRepresentatives, loadRepresentativesFailure, loadRepresentativesSuccess, loadCountry, loadCountryFailure, loadCountrySuccess, loadLeaveHistoryData, loadLeaveHistoryFailure, loadLeaveHistorySuccess, addLeave, addLeaveFailure, addLeaveSuccess, deleteLeave, deleteLeaveFailure, deleteLeaveSuccess, loadLeaveLetter, loadLeaveLetterFailure, loadLeaveLetterSuccess, addLeaveReturnToWork, addLeaveReturnToWorkFailure, addLeaveReturnToWorkSuccess, loadLeaveReturnedToWorkLetter, loadLeaveReturnedToWorkLetterFailure, loadLeaveReturnedToWorkLetterSuccess, fetchStaffOnLeave, fetchStaffOnLeaveFailure, fetchStaffOnLeaveSuccess, fetchStaffWaitingForLeave, fetchStaffWaitingForLeaveFailure, fetchStaffWaitingForLeaveSuccess, fetchStaffOverdueLeave, fetchStaffOverdueLeaveFailure, fetchStaffOverdueLeaveSuccess, fetchStaffLeaveRequestStage, fetchStaffLeaveRequestStageFailure, fetchStaffLeaveRequestStageSuccess, fetchStaffDeniedLeaveRequest, fetchStaffDeniedLeaveRequestFailure, fetchStaffDeniedLeaveRequestSuccess, loadGeneralStaffLeaveLetterSuccess, loadGeneralStaffLeaveLetter, loadGeneralStaffLeaveLetterFailure, fetchStaffBackToWork, fetchStaffBackToWorkFailure, fetchStaffBackToWorkSuccess, addConfirmLeaveReturnToWork, addConfirmLeaveReturnToWorkFailure, addConfirmLeaveReturnToWorkSuccess, fetchLeaveRequestToApprove, fetchLeaveRequestToApproveFailure, fetchLeaveRequestToApproveSuccess } from "./leave_action";

@Injectable()
export class LeaveEffects {

    // Leave Data
    fetchLeaveData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchLeaveData),
            mergeMap(() =>
                this._leaveApiService.getAllLeaveRequest().pipe(
                    map((leavelist) => {
                        const Leave = leavelist.data;
                        return fetchLeaveSuccess({ Leave })
                    }),
                    catchError((error) =>
                        of(fetchLeaveFailure({ error }))
                    )
                )
            ),
        ),
    );
    //ikiwa api ipo na parameter list mbele yake ndio unaandika hiv effect yake
    loadLeaveStatusRequestForms$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadLeaveStatusRequestForm),
            mergeMap(({ employeeID }) =>
            this._leaveApiService.getLeaveType(employeeID).pipe(
                map(res =>
                loadLeaveStatusRequestFormSuccess({ leaveStatus: res.data })
                ),
                catchError(error =>
                of(loadLeaveStatusRequestFormFailure({ error }))
                )
            )
            )
        )
    );
    loadPersonalDetail$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadPersonalDetail),
            switchMap(({ employeeID }) =>
            this._leaveApiService.getPersonalInformation(employeeID).pipe(
                map(res =>
                loadPersonalDetailSuccess({ personalDetail: res.data[0] })
                ),
                catchError(error =>
                of(loadPersonalDetailFailure({ error }))
                )
            )
            )
        )
    );
    loadRepresentatives$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadRepresentatives),
            mergeMap(() =>
            this._leaveApiService.getRepresentative().pipe(
                map(res => {
                const employees = res.data.map((emp: any) => ({
                    ...emp,
                    fullName: `${emp.first_name} ${emp.middle_name} ${emp.last_name}`,
                    displayName: `${emp.first_name} ${emp.middle_name} ${emp.last_name} - ${emp.phone_no} - ${emp.senority_name}`
                }));
                return loadRepresentativesSuccess({ representatives: employees });
                }),
                catchError(error =>
                of(loadRepresentativesFailure({ error }))
                )
            )
            )
        )
    );
    loadCoutryForms$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadCountry),
            mergeMap(() =>
            this._leaveApiService.getAllCountry().pipe(
                map(res =>
                loadCountrySuccess({ country: res.data })
                ),
                catchError(error =>
                of(loadCountryFailure({ error }))
                )
            )
            )
        )
    );
    loadLeaveHistoryData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadLeaveHistoryData),
            mergeMap(({ employeeID }) =>
            this._leaveApiService.getLeaveHistory(employeeID).pipe(
                map(res =>
                loadLeaveHistorySuccess({ history: res.data })
                ),
                catchError(error =>
                of(loadLeaveHistoryFailure({ error }))
                )
            )
            )
        )
    );

    addLeaveRequest$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addLeave),
            mergeMap(({ newData }) => {

            const formData = new FormData();

            // helper function (safe for backend)
            const appendSafe = (key: string, value: any) => {
                if (value === null) {
                formData.append(key, 'null');
                } else if (value === undefined) {
                formData.append(key, '');
                } else {
                formData.append(key, value.toString());
                }
            };

            // append ALL fields (backend requirement)
            appendSafe('personal_information_id', newData.personal_information_id);
            appendSafe('employement_status_id', newData.employement_status_id);
            appendSafe('proposed_start_date', newData.proposed_start_date);
            appendSafe('number_of_days', newData.number_of_days);
            appendSafe('contact_on_leave', newData.contact_on_leave);
            appendSafe('place_to_travel', newData.place_to_travel);
            appendSafe('representative_id', newData.representative_id);

            // file (special case)
            if (newData.upload_file_name) {
                formData.append('upload_file_name', newData.upload_file_name);
            } else {
                formData.append('upload_file_name', '');
            }

            return this._leaveApiService.createLeaveRequestForm(formData).pipe(
                mergeMap(res => {
                if (res.statusCode === 201) {
                    return [
                    addLeaveSuccess(),
                    fetchLeaveData()
                    ];
                } else {
                    return [addLeaveFailure({ error: res.message })];
                }
                }),
                catchError(err =>
                of(addLeaveFailure({ error: err.message || 'Something went wrong' }))
                )
            );
            })
        )       
    );

    deleteLeaveFormData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteLeave),
            mergeMap(({ leave_request_id }) =>
            this._leaveApiService.deleteLeaveForm(leave_request_id).pipe(
                map(() =>
                deleteLeaveSuccess({ leave_request_id })
                ),
                catchError((error) =>
                of(deleteLeaveFailure({ error: error.message }))
                )
            )
            )
        )
    );

    loadLeaveLetter$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadLeaveLetter),
            switchMap(({ id }) =>
            this._leaveApiService.getLeaveLetter(id).pipe(
                map((file: Blob) => loadLeaveLetterSuccess({ file })),
                catchError(error =>
                of(loadLeaveLetterFailure({ error }))
                )
            )
            )
        )
    );
    
    loadLeaveReturnedToWorkLeter$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadLeaveReturnedToWorkLetter),
            switchMap(({ id }) =>
            this._leaveApiService.getLeaveReturnedToWorkLetter(id).pipe(
                map((file: Blob) => loadLeaveReturnedToWorkLetterSuccess({ file })),
                catchError(error =>
                of(loadLeaveReturnedToWorkLetterFailure({ error }))
                )
            )
            )
        )
    );

    //add ya kawaida tu hii
    addLeaveReturnToWork$ = createEffect(() =>
    this.actions$.pipe(
        ofType(addLeaveReturnToWork),
        mergeMap(({ newData }) =>
        this._leaveApiService.returnToWork(newData).pipe(
            mergeMap(() => {
            const user = JSON.parse(localStorage.getItem('user')!);
            const employeeID = user.personalInformationID;
            return [
                addLeaveReturnToWorkSuccess(),
                loadLeaveHistoryData({ employeeID })
            ];
            }),
            catchError(error =>
            of(addLeaveReturnToWorkFailure({ error: error.message || 'Error occurred' }))
            )
        )
        )
    )
    );

    //management of leave request
    //staff on leave
    fetchStaffOnLeave$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchStaffOnLeave),
            mergeMap(() =>
                this._leaveApiService.getStaffOnLeave().pipe(
                    map((res) => {
                        const StaffOnLeave = res.current;
                        return fetchStaffOnLeaveSuccess({ StaffOnLeave })
                    }),
                    catchError((error) =>
                        of(fetchStaffOnLeaveFailure({ error: error.message || 'Failed to fetch staff on leave' }))
                    )
                )
            ),
        ),
    );
    //staff waiting for leave
    fetchStaffWaitingForLeave$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchStaffWaitingForLeave),
            mergeMap(() =>
                this._leaveApiService.getStaffWaitingLeave().pipe(
                    map((res) => {
                        const staffWaitingForLeave = res.current;
                        return fetchStaffWaitingForLeaveSuccess({ staffWaitingForLeave })
                    }),
                    catchError((error) =>
                        of(fetchStaffWaitingForLeaveFailure({ error: error.message || 'Failed to fetch staff waiting for leave' }))
                    )
                )
            ),
        ),
    );
    //staff overdue leave
    fetchStaffOverdueLeave$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchStaffOverdueLeave),
            mergeMap(() =>
                this._leaveApiService.getStaffLeaveOverdue().pipe(
                    map((res) => {
                        const staffOverdueLeave = res.current;
                        return fetchStaffOverdueLeaveSuccess({ staffOverdueLeave })
                    }),
                    catchError((error) =>
                        of(fetchStaffOverdueLeaveFailure({ error: error.message || 'Failed to fetch staff overdue for leave' }))
                    )
                )
            ),
        ),
    );
    //staff leave request stage
    fetchStaffLeaveRequestStage$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchStaffLeaveRequestStage),
            mergeMap(() =>
                this._leaveApiService.getStaffLeaveRequestStage().pipe(
                    map((res) => {
                        const staffLeaveRequestStage = res.data;
                        return fetchStaffLeaveRequestStageSuccess({ staffLeaveRequestStage })
                    }),
                    catchError((error) =>
                        of(fetchStaffLeaveRequestStageFailure({ error: error.message || 'Failed to fetch staff leave request stage' }))
                    )
                )
            ),
        ),
    );
    //staff denied leave request
    fetchStaffDeniedLeaveRequest$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchStaffDeniedLeaveRequest),
            mergeMap(() =>
                this._leaveApiService.getStaffDeniedRequest().pipe(
                    map((res) => {
                        const staffDeniedLeaveRequest = res.current;
                        return fetchStaffDeniedLeaveRequestSuccess({ staffDeniedLeaveRequest })
                    }),
                    catchError((error) =>
                        of(fetchStaffDeniedLeaveRequestFailure({ error: error.message || 'Failed to fetch staff denied leave request' }))
                    )
                )
            ),
        ),
    );
    //general staff leave letter
    loadGeneralStaffLeaveLetter$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadGeneralStaffLeaveLetter),
            switchMap(({ id }) =>
            this._leaveApiService.getGeneralLeaveLetter(id).pipe(
                map((file: Blob) => loadGeneralStaffLeaveLetterSuccess({ file })),
                catchError(error =>
                of(loadGeneralStaffLeaveLetterFailure({ error }))
                )
            )
            )
        )
    );
    //manage staff back to work
    fetchStaffBackToWork$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchStaffBackToWork),
            mergeMap(() =>
                this._leaveApiService.getStaffBackToWork().pipe(
                    map((res) => {
                        const staffBackToWork = res.current;
                        return fetchStaffBackToWorkSuccess({ staffBackToWork })
                    }),
                    catchError((error) =>
                        of(fetchStaffBackToWorkFailure({ error: error.message || 'Failed to fetch staff back to work data' }))
                    )
                )
            ),
        ),
    );
    //add ya kawaida tu hii
    addConfirmLeaveReturnToWork$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addConfirmLeaveReturnToWork),
            mergeMap(({ newData }) =>
            this._leaveApiService.saveConfirmReturnToWork(newData).pipe(
                mergeMap(() => {
                const user = JSON.parse(localStorage.getItem('user')!);
                const employeeID = user.personalInformationID;
                return [
                    addConfirmLeaveReturnToWorkSuccess(),
                    fetchStaffBackToWork()
                ];
                }),
                catchError(error =>
                of(addConfirmLeaveReturnToWorkFailure({ error: error.message || 'Error occurred' }))
                )
            )
            )
        )
    );
    //get leave request to approve
    fetchLeaveRequestToApprove$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchLeaveRequestToApprove),
            mergeMap(() =>
                this._leaveApiService.getLeaveRequestToApprove().pipe(
                    map((res) => {
                        const leaveRequestToApprove = res.data;
                        return fetchLeaveRequestToApproveSuccess({ leaveRequestToApprove })
                    }),
                    catchError((error) =>
                        of(fetchLeaveRequestToApproveFailure({ error: error.message || 'Failed to fetch leave request to approve' }))
                    )
                )
            ),
        ),
    );
 


    constructor(
        private actions$: Actions,
        private _leaveApiService: LeavesService
    ) { }
}