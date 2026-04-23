import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { RootReducerState } from 'src/app/store';
import { selectDashboardLoading } from 'src/app/store/Dashboard_store/dashboard_selector';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { addStaffAdvertRequestForm } from 'src/app/store/Dashboard_store/dashboard_action';
import { StaffAdvertFormPayload } from 'src/app/store/Dashboard_store/dashboard_model';
import { StaffApplyAdvertisementComponent } from '../staff-apply-advertisement/staff-apply-advertisement.component';

@Component({
  selector: 'app-staff-apply-advert-detail',
  templateUrl: './staff-apply-advert-detail.component.html',
  styleUrl: './staff-apply-advert-detail.component.scss'
})
export class StaffApplyAdvertDetailComponent implements OnInit, OnDestroy{
  @Input() getAdvertisementList: any[] = [];

  @Output() submitForm = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();
  
  private destroy$ = new Subject<void>();  

  isLoading = true;
  searchTerm = '';

  advertisementListDetail: any[] = [];
  allAdvertisementListDetail: any[] = [];
  filteredList: any[] = [];
  page: number = 1;

  constructor(
    private fb: UntypedFormBuilder,
    public service: PaginationService,
    private modalService: NgbModal,
    public permission: PermissionService,
    private store: Store<{ data: RootReducerState }>, 
  ) {}

  ngOnInit(): void {
    this.page = 1;
    this.service.page = 1;
    this.allAdvertisementListDetail = this.getAdvertisementList;
    this.filteredList = [...this.allAdvertisementListDetail];
    this.updateTable();

    this.loadStaffData();

  }

  private loadStaffData(): void {
    this.store.select(selectDashboardLoading)
    .pipe(takeUntil(this.destroy$))
    .subscribe(loading => {
        this.isLoading = loading;
    });

  }

  openModalStaffApplyAdvertisementForm(data:any) {
    const modalRef = this.modalService.open(StaffApplyAdvertisementComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.rowSelected = data; 

    modalRef.componentInstance.submitForm.subscribe((data: any) => {
      const user = JSON.parse(localStorage.getItem('user')!);
      const payload: StaffAdvertFormPayload = {
        personal_information_id: user.personalInformationID,
        ...data
      };
      this.store.dispatch(addStaffAdvertRequestForm({ newData: payload }));
      modalRef.close();
    });
    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });
  }

   // currently selected row data
  selectedAdvertList: any = null;
  openModalAdvertList(content: any, rowData: any, checkbox: HTMLInputElement) {
    checkbox.checked = true;
    this.selectedAdvertList = rowData; // save data ya row
    this.modalService.open(content, { size: 'lg', centered: true }).result
      .finally(() => {
        checkbox.checked = false;
        this.selectedAdvertList = null;
      });
  }
  openAttachment(fileName: string): void {
    const fileUrl = `${environment.staffAdvertisementfileUrl}/${fileName}`;
    window.open(fileUrl, '_blank');
  }

  //SEARCH (IMPORTANT)
  performSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.service.page = 1; // reset page
    if (!term) {
      this.filteredList = [...this.allAdvertisementListDetail];
    } else {
      this.filteredList = this.allAdvertisementListDetail.filter(item =>
        item.title_name?.toLowerCase().includes(term) ||
        item.working_area?.toLowerCase().includes(term)
      );
    }
    this.updateTable();
  }
  changePage(page: number): void {
    this.page = page; 
    this.service.page = page;   // IMPORTANT
    this.updateTable();
  }
  onSort(column: any): void {
    this.filteredList = this.service.onSort(column, this.filteredList);
    this.updateTable();
  }

  updateTable(): void {
    if (!this.filteredList) return;

    this.advertisementListDetail =
      this.service.changePage(this.filteredList);
  }
  //end search

  closeModal() {
    this.close.emit();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
