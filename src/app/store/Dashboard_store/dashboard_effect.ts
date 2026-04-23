import { Injectable } from "@angular/core";
import { createEffect, ofType, Actions } from "@ngrx/effects";
import { mergeMap, map, catchError, of } from "rxjs";
import { DashboardApiService } from "src/app/core/services/dashboard-card/dashboard-api.service";
import { fetchStaffDashboardCount, fetchStaffDashboardCountSuccess, fetchStaffDashboardCountFailure, fetchAdvertisementDashboardCount, fetchAdvertisementDashboardCountFailure, fetchAdvertisementDashboardCountSuccess, loadGetApplication, loadGetApplicationFailure, loadGetApplicationSuccess, loadAdvertPositions, loadAdvertPositionsFailure, loadAdvertPositionsSuccess, loadAdvertProgram, loadAdvertProgramFailure, loadAdvertProgramSuccess, addStaffAdvertRequestForm, addStaffAdvertRequestFormFailure, addStaffAdvertRequestFormSuccess, deleteStaffAdvertRequest, deleteStaffAdvertRequestFailure, deleteStaffAdvertRequestSuccess } from "./dashboard_action";


@Injectable()
export class DashboardEffects {

    // staff count Data
    fetchStaffCountData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchStaffDashboardCount),
            mergeMap(() =>
                this._dashboarApiService.getStaffCountDashboardData().pipe(
                    map((res) => {
                        const StaffCount = res;
                        return fetchStaffDashboardCountSuccess({ StaffCount })
                    }),
                    catchError((error) =>
                        of(fetchStaffDashboardCountFailure({ error }))
                    )
                )
            ),
        ),
    );
     // Advertisement Data
    fetchAdvertisementData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchAdvertisementDashboardCount),
            mergeMap(() =>
                this._dashboarApiService.getAdvertisement().pipe(
                    map((res) => {
                        const AdvertisementCount = res.data;
                        return fetchAdvertisementDashboardCountSuccess({ AdvertisementCount })
                    }),
                    catchError((error) =>
                        of(fetchAdvertisementDashboardCountFailure({ error }))
                    )
                )
            ),
        ),
    );
    //hii ya kuselect data ikiwa katika fomati ya post na pia data zake za body ndio unaziweka katika api yenyewe
    loadGetApplicationData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadGetApplication),
            mergeMap(({ personal_id }) => {
            return this._dashboarApiService.getApplication({
                personal_information_id: personal_id
            }).pipe(
                map(res =>
                loadGetApplicationSuccess({app_list: res.data })),
                
                catchError(error =>
                of(loadGetApplicationFailure({ error }))
                )
            );
            })
        )
    );
    //advert position
    loadAdvertPositionsIDData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadAdvertPositions),
            mergeMap(({ staffAdvertisementID }) =>
            this._dashboarApiService.getAdvertWorkPlace(staffAdvertisementID).pipe(
                map(res =>
                loadAdvertPositionsSuccess({ advertPositionsID: res.data })
                ),
                catchError(error =>
                of(loadAdvertPositionsFailure({ error }))
                )
            )
            )
        )
    );
     //advert program
    loadAdvertProgramIDData$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadAdvertProgram),
            mergeMap(({ staffAdvertisementID }) =>
            this._dashboarApiService.getAdvertPrograms(staffAdvertisementID).pipe(
                map(res =>
                loadAdvertProgramSuccess({ advertProgramID: res.data })
                ),
                catchError(error =>
                of(loadAdvertProgramFailure({ error }))
                )
            )
            )
        )
    );
    addStaffAdvertForm$ = createEffect(() =>
        this.actions$.pipe(
        ofType(addStaffAdvertRequestForm),
        mergeMap(({ newData }) => {
            // Convert to FormData because backend expects file
            const formData = new FormData();
            formData.append('personal_information_id', newData.personal_information_id.toString());
            formData.append('staff_advertisement_id', newData.staff_advertisement_id.toString());
            formData.append('staff_adver_position_id', newData.staff_adver_position_id.toString());
            formData.append('program_id', newData.program_id.toString());

            if (newData.upload_file_name) {
            formData.append('upload_file_name', newData.upload_file_name);
            }
            if (newData.working_area) {
                formData.append('working_area', newData.working_area);
            }
            if (newData.working_position) {
                formData.append('working_position', newData.working_position);
            }
          
            return this._dashboarApiService.saveAdvertisement(formData).pipe(
                mergeMap(res => {
                if (res.statusCode === 201) {
                    return [
                        addStaffAdvertRequestFormSuccess(), // trigger success for component
                        loadGetApplication({personal_id: newData.personal_information_id}) // refresh table
                    ];
                } else {
                    return [addStaffAdvertRequestFormFailure({ error: res.message })];
                }
                }),
                catchError(err => of(addStaffAdvertRequestFormFailure({ error: err.message })))
            );
        })
        )
    );
    deleteStaffAdvert$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteStaffAdvertRequest),
            mergeMap(({ staffAdverApplicationID }) => {

            const user = JSON.parse(localStorage.getItem('user')!);
            const employeeID = user.personalInformationID;

            return this._dashboarApiService.deleteApplication(staffAdverApplicationID).pipe(
                mergeMap(() => [
                deleteStaffAdvertRequestSuccess({ staffAdverApplicationID }),
                loadGetApplication({ personal_id: employeeID }) // refresh table
                ]),
                catchError((error) =>
                of(deleteStaffAdvertRequestFailure({ error: error.message }))
                )
            );

            })
        )
        );
 





    constructor(
        private actions$: Actions,
        private _dashboarApiService: DashboardApiService
    ) { }
}