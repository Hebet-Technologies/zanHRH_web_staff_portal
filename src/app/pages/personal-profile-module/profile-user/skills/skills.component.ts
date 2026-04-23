import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { RootReducerState } from 'src/app/store';
import { fetchSkillsData, loadSkillsForm, addSkills, addSkillsSuccess, addSkillsFailure, deleteSkillsSuccess, deleteSkillsFailure, deleteSkills } from 'src/app/store/Profile_store/profile_action';
import { ProfileSkillPayload } from 'src/app/store/Profile_store/profile_model';
import { selectProfileLoading, selectSkillsData, selectSkillsForm } from 'src/app/store/Profile_store/profile_selector';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { SkillsFormComponent } from './skills-form/skills-form.component';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss'
})
export class SkillsComponent implements OnInit,OnDestroy{
  employeeSkills: any[] = [];
  allEmployeeSkills: any[] = [];

  isLoading = true;
  employeeID: any;
  deleteId!: number;
  searchTerm = '';

  skillsList: any[] = [];
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
    this.loadSkills();
    this.listenAllSkillsActions();
  }

  private loadSkills(): void {
    this.store.select(selectProfileLoading)
    .pipe(takeUntil(this.destroy$))
    .subscribe(loading => {
        this.isLoading = loading;
    });

    //Hobbies
    this.store.dispatch(fetchSkillsData({ employeeID: this.employeeID }));
    this.store.select(selectSkillsData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.allEmployeeSkills = data ? structuredClone(data) : [];
      this.employeeSkills = this.service.changePage(this.allEmployeeSkills);
    });

    this.store.dispatch(loadSkillsForm());
    this.store.select(selectSkillsForm)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.skillsList = data || []);

  }

  openModal(): void {
    const modalRef = this.modalService.open(SkillsFormComponent, { size: 'md', centered: true});
    modalRef.componentInstance.skillsList = this.skillsList;
    modalRef.componentInstance.submitForm.subscribe((data: any) => {
      const user = JSON.parse(localStorage.getItem('user')!);
      const payload: ProfileSkillPayload = {
        personal_information_id: user.personalInformationID,
        ...data
      };
      this.store.dispatch(addSkills({ newData: payload }));
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
    [addSkillsSuccess.type]: {icon: 'success',title: 'Skills submitted',closeModal: true,timer: 2000},
    [addSkillsFailure.type]: {icon: 'error',title: 'Skills failed'},
    //DELETE
    [deleteSkillsSuccess.type]: {icon: 'success',title: 'Deleted successfully',timer: 1500},
    [deleteSkillsFailure.type]: {icon: 'error',title: 'Delete failed'}
  };
  private listenAllSkillsActions(): void {
    this.actions$.pipe(
      ofType(
        addSkillsSuccess,addSkillsFailure,deleteSkillsSuccess,deleteSkillsFailure
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
    this.store.dispatch(deleteSkills({ personal_skill_id: this.deleteId }));
  }
  //delete end

  openAttachmentSkills(fileName: string): void {
    const fileUrl = `${environment.fileUrl}/${fileName}`;
    window.open(fileUrl, '_blank');
  }
  changePage(): void {
    this.employeeSkills = this.service.changePage(this.allEmployeeSkills);
  }
  performSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.employeeSkills = this.service.changePage(
      this.allEmployeeSkills.filter(item =>
        item.skill_name.toLowerCase().includes(term)
      )
    );
  }
  onSort(column: any): void {
    this.employeeSkills = this.service.onSort(column, this.employeeSkills);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
