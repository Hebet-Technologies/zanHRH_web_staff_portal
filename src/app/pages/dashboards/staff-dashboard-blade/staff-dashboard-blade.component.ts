import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ToastService } from 'src/app/account/auth/signin/cover/toast-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { PermissionService } from 'src/app/core/services/auth-card/permission.service';
import { PaginationService } from 'src/app/core/services/pagination.service';
import { RootReducerState } from 'src/app/store';
import { selectAdvertisementData, selectDashboardLoading, selectGetApplicationData, selectStaffCountData } from 'src/app/store/Dashboard_store/dashboard_selector';
import { addStaffAdvertRequestForm, addStaffAdvertRequestFormFailure, addStaffAdvertRequestFormSuccess, deleteStaffAdvertRequest, deleteStaffAdvertRequestFailure, deleteStaffAdvertRequestSuccess, fetchAdvertisementDashboardCount, fetchStaffDashboardCount, loadGetApplication } from 'src/app/store/Dashboard_store/dashboard_action';
import { environment } from 'src/environments/environment';
import { StaffApplyAdvertisementComponent } from './staff-apply-advertisement/staff-apply-advertisement.component';
import { StaffAdvertFormPayload } from 'src/app/store/Dashboard_store/dashboard_model';
import Swal from 'sweetalert2';
import { loadTrainingAnnoucement } from 'src/app/store/Training_store/training_action';
import { selectTrainingAnnoucement } from 'src/app/store/Training_store/training_selector';
import { StaffApplyAdvertDetailComponent } from './staff-apply-advert-detail/staff-apply-advert-detail.component';

@Component({
  selector: 'app-staff-dashboard-blade',
  templateUrl: './staff-dashboard-blade.component.html',
  styleUrl: './staff-dashboard-blade.component.scss'
})
export class StaffDashboardBladeComponent implements OnInit{
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  statData!: any;
  currentDate: any;
  profileName: any;

  countStaffData: any = {};
  advertisementList: any[] = [];
  getApplicationList: any[] = [];
  allGetApplicationList: any[] = [];
  filteredList: any[] = [];
  searchTerm = '';
  isLoading = true;
  trainingAnnoucementList: any[] = [];
  existingTerm: any;
  deleteId!: number;
  currentDay: any;
  greeting: string = '';


  private toastShown = false; // Flag to track if toast has been shown
  private destroy$ = new Subject<void>();

  constructor(public toastService: ToastService,
    private modalService: NgbModal, 
    private actions$: Actions,
    public service: PaginationService,
    public permission: PermissionService,
    private store: Store<{ data: RootReducerState }>, 

  ) {
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.currentDate = { from: firstDay, to: lastDay };
  }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Dashboards' },
      { label: 'Dashboard', active: true }
    ];

    if (localStorage.getItem('toast') === 'true' && !this.toastShown) {
      this.toastShown = true;
      this.toastService.show('Logged in Successfully.', { classname: 'bg-success text-center text-white', delay: 5000 });
      localStorage.removeItem('toast');
    }
    this.profileName = JSON.parse(localStorage.getItem('user')!);
    this.currentDay = new Date();

    this.loadStaffCountData();
    this.greeting = this.getGreeting();
    this.listenStaffAdvertActions();

  }

  private loadStaffCountData(): void {
    this.store.select(selectDashboardLoading)
    .pipe(takeUntil(this.destroy$))
    .subscribe(loading => {
        this.isLoading = loading;
    });

    this.store.dispatch(fetchStaffDashboardCount());
    this.store.select(selectStaffCountData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.countStaffData = data;
    });

    this.store.dispatch(fetchAdvertisementDashboardCount());
    this.store.select(selectAdvertisementData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.advertisementList = data;
    });

    this.store.dispatch(loadGetApplication({personal_id : this.profileName.personalInformationID}));
    this.store.select(selectGetApplicationData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => {
      this.allGetApplicationList = data ? structuredClone(data) : [];
      this.filteredList = [...this.allGetApplicationList]; // hii mpya
      this.getApplicationList = this.service.changePage(this.filteredList);
    });

    this.store.dispatch(loadTrainingAnnoucement());
    this.store.select(selectTrainingAnnoucement)
    .pipe(takeUntil(this.destroy$))
    .subscribe(data => this.trainingAnnoucementList = data || []);

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
  openModalStaffApplyAdvertDetail() {
    const modalRef = this.modalService.open(StaffApplyAdvertDetailComponent, { size: 'xl', centered: true });
    modalRef.componentInstance.getAdvertisementList = this.advertisementList; 
    modalRef.componentInstance.submitForm.subscribe((data: any) => {
    });
    modalRef.componentInstance.close.subscribe(() => {
      modalRef.close();
    });
  }


  //ujumbe unaokuja ndio huu hapa start
  private actionMessages: any = {
    //ADD transfer
    [addStaffAdvertRequestFormSuccess.type]: {icon: 'success',title: 'Staff advert submitted',closeModal: true,timer: 2000},
    [addStaffAdvertRequestFormFailure.type]: {icon: 'error',title: 'Staff advert failed'},
    //DELETE
    [deleteStaffAdvertRequestSuccess.type]: {icon: 'success',title: 'Deleted successfully',timer: 1500},
    [deleteStaffAdvertRequestFailure.type]: {icon: 'error',title: 'Delete failed'}
  };
  private listenStaffAdvertActions(): void {
    this.actions$.pipe(
      ofType(
        addStaffAdvertRequestFormSuccess,addStaffAdvertRequestFormFailure,deleteStaffAdvertRequestSuccess,deleteStaffAdvertRequestFailure
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
    this.store.dispatch(deleteStaffAdvertRequest({ staffAdverApplicationID: this.deleteId }));
  }
  //delete end


  openAttachment(fileName: string): void {
    const fileUrl = `${environment.staffAdvertisementfileUrl}/${fileName}`;
    window.open(fileUrl, '_blank');
  }

  openApplicationAttachment(fileName: string): void {
    const fileUrl = `${environment.fileUrl}/${fileName}`;
    window.open(fileUrl, '_blank');
  }

  isWithinDeadline(endDate: string): boolean {
    const today = new Date(this.currentDay);
    const end = new Date(endDate);
    // Ondoa time ili comparison iwe safi
    today.setHours(0,0,0,0);
    end.setHours(0,0,0,0);
    return today <= end;
  }

  getGreeting(): string {
    const now = new Date();
    const hour = Number(
      new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        hour12: false,
        timeZone: 'Africa/Dar_es_Salaam'
      }).format(now)
    );
    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  }
  //start search
  performSearch(): void {
    const term = this.searchTerm.toLowerCase();
    if (!term) {
      this.filteredList = [...this.allGetApplicationList];
    } else {
      this.filteredList = this.allGetApplicationList.filter(item =>
        item.title_name?.toLowerCase().includes(term) ||
        item.position_name?.toLowerCase().includes(term)
      );
    }
    this.service.page = 1; // reset page
    this.getApplicationList = this.service.changePage(this.filteredList);
  }
  changePage(): void {
    this.getApplicationList = this.service.changePage(this.filteredList);
  }
  //end search
  onSort(column: any): void {
    this.getApplicationList = this.service.onSort(column, this.getApplicationList);
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

    /**
 * Swiper Vertical  
   */
  Vertical = {
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: false,
    vertical: true // Enable vertical sliding
  };

  /**
   * Recent Activity
   */
  toggleActivity() {
    const recentActivity = document.querySelector('.layout-rightside-col');
    if (recentActivity != null) {
      recentActivity.classList.toggle('d-none');
    }

    if (document.documentElement.clientWidth <= 767) {
      const recentActivity = document.querySelector('.layout-rightside-col');
      if (recentActivity != null) {
        recentActivity.classList.add('d-block');
        recentActivity.classList.remove('d-none');
      }
    }
  }

  /**
   * SidebarHide modal
   * @param content modal content
   */
  SidebarHide() {
    const recentActivity = document.querySelector('.layout-rightside-col');
    if (recentActivity != null) {
      recentActivity.classList.remove('d-block');
    }
  }

}


