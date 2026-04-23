import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { mergeMap, map, catchError, of, switchMap } from "rxjs";
import { TrainingService } from "src/app/core/services/training-card/training.service";
import { fetchEmployeeTrainingData, fetchEmployeeTrainingSuccess, fetchEmployeeTrainingFailure, loadTrainingAnnoucement, loadTrainingAnnoucementFailure, loadTrainingAnnoucementSuccess, loadInstituteCountry, loadInstituteCountrySuccess, loadInstituteCountryFailure, loadInstitute, loadInstituteSuccess, loadInstituteFailure, addTrainingForm, addTrainingFormFailure, addTrainingFormSuccess, deleteTrainingForm, deleteTrainingFormFailure, deleteTrainingFormSuccess } from "./training_action";

@Injectable()
export class TrainingEffects {
    //hii ya kuselect data ikiwa katika fomati ya post na pia data zake za body ndio unaziweka katika api yenyewe
    loadEmployeeTrainingList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(fetchEmployeeTrainingData),
            mergeMap(({ personal_informationID }) => {

            return this._trainingService.getAllTraining({
                personal_information_id: personal_informationID
            }).pipe(
                map(res =>
                fetchEmployeeTrainingSuccess({
                    trainingList: res.data
                })
                ),
                catchError(error =>
                of(fetchEmployeeTrainingFailure({ error }))
                )
            );
            })
        )
    );
    //load training annoucement
    loadTrainingAnnoucementList$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadTrainingAnnoucement),
            mergeMap(() =>
                this._trainingService.getTrainingAnnoucement().pipe(
                    map(res =>
                        loadTrainingAnnoucementSuccess({ trainingAnnoucements: res.data })
                    ),
                    catchError(error =>
                        of(loadTrainingAnnoucementFailure({ error }))
                    )
                )
            )
        )
    );

    loadInstituteCountry$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadInstituteCountry),
            mergeMap(() =>
            this._trainingService.getCountries().pipe(
                map(res =>
                loadInstituteCountrySuccess({ country: res.data })
                ),
                catchError(error =>
                of(loadInstituteCountryFailure({ error }))
                )
            )
            )
        )
    );
    loadInstitute$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadInstitute),
            switchMap(({ countryCode, educationLevel }) =>
            this._trainingService.getInstitutes(countryCode,educationLevel).pipe(
                map(res =>
                loadInstituteSuccess({ institutes: res.data })
                ),
                catchError(error =>
                of(loadInstituteFailure({ error }))
                )
            )
            )
        )
    );
    addTrainingForm$ = createEffect(() =>
        this.actions$.pipe(
        ofType(addTrainingForm),
        mergeMap(({ newData }) => {
            // Convert to FormData because backend expects file
            const formData = new FormData();
            formData.append('personal_information_id', newData.personal_information_id.toString());
            formData.append('development_plan_vendor_id', newData.development_plan_vendor_id.toString());
            formData.append('institute_id', newData.institute_id.toString());
            formData.append('start_date', newData.start_date.toString());
            formData.append('end_date', newData.end_date.toString());

            if (newData.admission_letter) {
            formData.append('admission_letter', newData.admission_letter);
            }
            const user = JSON.parse(localStorage.getItem('user')!);
            const employeeID = user.personalInformationID;
            return this._trainingService.storeTraining(formData).pipe(
                mergeMap(res => {
                if (res.statusCode === 201) {
                    return [
                        addTrainingFormSuccess(), // trigger success for component
                        fetchEmployeeTrainingData({ personal_informationID: employeeID }) // refresh table
                    ];
                } else {
                    return [addTrainingFormFailure({ error: res.message })];
                }
                }),
                catchError(err => of(addTrainingFormFailure({ error: err.message })))
            );
        })
        )
    );
    deleteTraining$ = createEffect(() =>
        this.actions$.pipe(
            ofType(deleteTrainingForm),
            mergeMap(({ training_application_id }) =>
            this._trainingService.deleteTraining(training_application_id).pipe(
                map(() =>
                deleteTrainingFormSuccess({ training_application_id })
                ),
                catchError((error) =>
                of(deleteTrainingFormFailure({ error: error.message }))
                )
            )
            )
        )
    );




































    constructor(
        private actions$: Actions,
        private _trainingService: TrainingService
    ) { }
}