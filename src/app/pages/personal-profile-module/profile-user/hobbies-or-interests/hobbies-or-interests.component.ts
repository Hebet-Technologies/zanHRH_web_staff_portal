import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { RootReducerState } from 'src/app/store';
import { fetchHobbiesData, loadHobbiesForm, addHobbies, addHobbiesSuccess, addHobbiesFailure, deleteHobbiesSuccess, deleteHobbiesFailure, deleteHobbies } from 'src/app/store/Profile_store/profile_action';
import { ProfileHobbiesPayload } from 'src/app/store/Profile_store/profile_model';
import { selectProfileLoading, selectHobbiesInterestsData, selectHobbiesForm } from 'src/app/store/Profile_store/profile_selector';
import Swal from 'sweetalert2';
import { HobbiesOrInterestsFormComponent } from './hobbies-or-interests-form/hobbies-or-interests-form.component';

@Component({
  selector: 'app-hobbies-or-interests',
  templateUrl: './hobbies-or-interests.component.html',
  styleUrl: './hobbies-or-interests.component.scss'
})
export class HobbiesOrInterestsComponent implements OnInit,OnDestroy{
  employeeHobbies: any[] = [];
  allEmployeeHobbies: any[] = [];

  isLoading = true;
  employeeID: any;
  deleteId!: number;
  searchTerm = '';

  hobbyList: any[] = [];

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
    this.loadHobbies();
    this.listenAllHobbiesActions();
  }

  private loadHobbies(): void {
    this.store.select(selectProfileLoading)
    .pipe(takeUntil(this.destroy$))
    .subscribe(loading => {
        this.isLoading = loading;
    });

    //Hobbies
    this.store.dispatch(fetchHobbiesData({ employeeID: this.employeeID }));
    this.store.select(selectHobbiesInterestsData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.allEmployeeHobbies = data ? structuredClone(data) : [];
      this.employeeHobbies = this.service.changePage(this.allEmployeeHobbies);
    });

    this.store.dispatch(loadHobbiesForm());
    this.store.select(selectHobbiesForm)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.hobbyList = data || []);

  }

  openModal(): void {
    const modalRef = this.modalService.open(HobbiesOrInterestsFormComponent, { size: 'md', centered: true});
    modalRef.componentInstance.hobbyList = this.hobbyList;
    modalRef.componentInstance.submitForm.subscribe((data: any) => {
      const user = JSON.parse(localStorage.getItem('user')!);
      const payload: ProfileHobbiesPayload = {
        personal_information_id: user.personalInformationID,
        ...data
      };
      this.store.dispatch(addHobbies({ newData: payload }));
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
    [addHobbiesSuccess.type]: {icon: 'success',title: 'Hobbies submitted',closeModal: true,timer: 2000},
    [addHobbiesFailure.type]: {icon: 'error',title: 'Hobbies failed'},
    //DELETE
    [deleteHobbiesSuccess.type]: {icon: 'success',title: 'Deleted successfully',timer: 1500},
    [deleteHobbiesFailure.type]: {icon: 'error',title: 'Delete failed'}
  };
  private listenAllHobbiesActions(): void {
    this.actions$.pipe(
      ofType(
        addHobbiesSuccess,addHobbiesFailure,deleteHobbiesSuccess,deleteHobbiesFailure
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
    this.store.dispatch(deleteHobbies({ personal_hobby_id: this.deleteId }));
  }
  //delete end

 
  changePage(): void {
    this.employeeHobbies = this.service.changePage(this.allEmployeeHobbies);
  }
  performSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.employeeHobbies = this.service.changePage(
      this.allEmployeeHobbies.filter(item =>
        item.hobby_name.toLowerCase().includes(term)
      )
    );
  }
  onSort(column: any): void {
    this.employeeHobbies = this.service.onSort(column, this.employeeHobbies);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


}
