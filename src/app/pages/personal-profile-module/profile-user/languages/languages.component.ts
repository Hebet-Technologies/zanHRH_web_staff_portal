import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { RootReducerState } from 'src/app/store';
import { fetchLanguagesData, loadLanguageForm, addLanguage, addLanguageSuccess, addLanguageFailure, deleteLanguageSuccess, deleteLanguageFailure, deleteLanguage } from 'src/app/store/Profile_store/profile_action';
import { ProfileLanguagePayload } from 'src/app/store/Profile_store/profile_model';
import { selectProfileLoading, selectLanguageData, selectLanguageForm } from 'src/app/store/Profile_store/profile_selector';
import Swal from 'sweetalert2';
import { LanguagesFormComponent } from './languages-form/languages-form.component';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrl: './languages.component.scss'
})
export class LanguagesComponent implements OnInit,OnDestroy{
  employeeLanguage: any[] = [];
  allEmployeeLanguage: any[] = [];

  isLoading = true;
  employeeID: any;
  deleteId!: number;
  searchTerm = '';

  languageList: any[] = [];

  // For unsubscribing
  private destroy$ = new Subject<void>();
  constructor(
    private modalService: NgbModal, 
    private actions$: Actions,
    public permission: PermissionService,
    private store: Store<{ data: RootReducerState }>, 
    public service: PaginationService,
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.employeeID = user.personalInformationID;
    this.loadLanguage();
    this.listenAllLanguageActions();
  }

  private loadLanguage(): void {
    this.store.select(selectProfileLoading)
    .pipe(takeUntil(this.destroy$))
    .subscribe(loading => {
        this.isLoading = loading;
    });

    //Hobbies
    this.store.dispatch(fetchLanguagesData({ employeeID: this.employeeID }));
    this.store.select(selectLanguageData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.allEmployeeLanguage = data ? structuredClone(data) : [];
      this.employeeLanguage = this.service.changePage(this.allEmployeeLanguage);
    });

    this.store.dispatch(loadLanguageForm());
    this.store.select(selectLanguageForm)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.languageList = data || []);

  }

  openModal(): void {
    const modalRef = this.modalService.open(LanguagesFormComponent, { size: 'lg', centered: true});
    modalRef.componentInstance.languageList = this.languageList;
    modalRef.componentInstance.submitForm.subscribe((data: any) => {
      const user = JSON.parse(localStorage.getItem('user')!);
      const payload: ProfileLanguagePayload = {
        personal_information_id: user.personalInformationID,
        ...data
      };
      this.store.dispatch(addLanguage({ newData: payload }));
      modalRef.close();
    });
    // close
    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });
  }

  //ujumbe unaokuja ndio huu hapa start
  private actionMessages: any = {
    //ADD transfer
    [addLanguageSuccess.type]: {icon: 'success',title: 'Language submitted',closeModal: true,timer: 2000},
    [addLanguageFailure.type]: {icon: 'error',title: 'Language failed'},
    //DELETE
    [deleteLanguageSuccess.type]: {icon: 'success',title: 'Deleted successfully',timer: 1500},
    [deleteLanguageFailure.type]: {icon: 'error',title: 'Delete failed'}
  };
  private listenAllLanguageActions(): void {
    this.actions$.pipe(
      ofType(
        addLanguageSuccess,addLanguageFailure,deleteLanguageSuccess,deleteLanguageFailure
      ),
      takeUntil(this.destroy$)
    ).subscribe((action: any) => {
      const config = this.actionMessages[action.type];
      if (!config) return;
      Swal.fire({
        icon: config.icon,
        title: config.title,
        text: action.error || '',
        timer: config.timer || undefined
      });
      //close modal only if needed
      if (config.closeModal) {
        this.modalService.dismissAll();
      }
    });
  }
  //ujumbe unaokuja ndio huu hapa end

  //delete start
  confirm(content: any, id: number): void {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }
  deleteData(): void {
    this.store.dispatch(deleteLanguage({ personal_language_id: this.deleteId }));
  }
  //delete end

  
  changePage(): void {
    this.employeeLanguage = this.service.changePage(this.allEmployeeLanguage);
  }
  performSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.employeeLanguage = this.service.changePage(
      this.allEmployeeLanguage.filter(item =>
        item.language_name.toLowerCase().includes(term)
      )
    );
  }
  onSort(column: any): void {
    this.employeeLanguage = this.service.onSort(column, this.employeeLanguage);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
