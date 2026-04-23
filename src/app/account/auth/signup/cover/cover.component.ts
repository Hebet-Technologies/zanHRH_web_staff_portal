import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { RootReducerState } from 'src/app/store';
import { StaffRegistrationPayload } from 'src/app/store/Authentication/auth.models';
import { selectSeachEmployeeData } from 'src/app/store/Authentication/authentication-selector';
import { addStaffRegistration, addStaffRegistrationFailure, addStaffRegistrationSuccess, clearSearchEmployee, loadSearchEmployee, loadSearchEmployeeFailure, loadSearchEmployeeSuccess } from 'src/app/store/Authentication/authentication.actions';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cover',
  templateUrl: './cover.component.html',
  styleUrls: ['./cover.component.scss']
})

/**
 * Signup Cover Component
 */
export class CoverComponent implements OnInit, AfterViewInit {

  // Login Form
  signupForm!: UntypedFormGroup;
  loadFormValidDate!: UntypedFormGroup;
  submitted = false;
  searchEmployeeListData: any[] = [];
  reportChainList: any[] = [];
  showEmployeeData = false;


  // set the current year
  year: number = new Date().getFullYear();
  // Carousel navigation arrow show
  showNavigationArrows: any;
  fieldTextType!: boolean;
  confirmfieldTextType!: boolean;

  maxDate = new Date(); // today
  private destroy$ = new Subject<void>();

  constructor(private fb: UntypedFormBuilder, 
    private modalService: NgbModal, 
    private actions$: Actions,
    private store: Store<{ data: RootReducerState }>, 
    private datePipe: DatePipe) {
      const today = new Date();
      this.maxDate = new Date(today.getFullYear() - 17, today.getMonth(), today.getDate());
     }

  ngOnInit(): void {
    this.store.dispatch(clearSearchEmployee());

    this.initFormLoadData();
    this.initFormSubmitData();

    this.store.select(selectSeachEmployeeData)
    .pipe(takeUntil(this.destroy$))
    .subscribe(res => {
      this.searchEmployeeListData = res?.data || [];
      this.reportChainList = res?.path || [];
      this.showEmployeeData = !!res?.data?.length;

      if (this.showEmployeeData) {
        setTimeout(() => this.handleValidation());
      }
    });


    this.listenSeachEmployeeActions();
  }
  ngAfterViewInit(): void {
    this.handleValidation();
  }

  private initFormLoadData(): void {
    this.loadFormValidDate = this.fb.group({
      payrollNumber: [null, Validators.required],
      dobDate: [null, Validators.required],
    });
  }
  get form() { return this.loadFormValidDate.controls; }

  saveEmployeeData(): void {
    this.submitted = true;
    if (this.loadFormValidDate.invalid) return;

    const formValue = this.loadFormValidDate.value;
    const payload = {
      payroll: this.form['payrollNumber'].value,
      date_of_birth: this.datePipe.transform(formValue.dobDate, 'yyyy-MM-dd') || '',
    };

    this.store.dispatch(loadSearchEmployee({ out_put_Data: payload }));
   
  }


  private handleValidation(): void {
    // Inputs
    var passwordInput = document.getElementById("password-input") as HTMLInputElement;
    var confirmInput = document.getElementById("confirm-password-input") as HTMLInputElement;
    if (!passwordInput || !confirmInput) return;
    // Rules elements
    var letter = document.getElementById("pass-lower");
    var capital = document.getElementById("pass-upper");
    var number = document.getElementById("pass-number");
    var length = document.getElementById("pass-length");
    var special = document.getElementById("pass-special");

    // Reusable validation function
    const validatePassword = (value: string) => {
      // lowercase
      if (value.match(/[a-z]/g)) {
        letter?.classList.remove("invalid");
        letter?.classList.add("valid");
      } else {
        letter?.classList.remove("valid");
        letter?.classList.add("invalid");
      }

      // uppercase
      if (value.match(/[A-Z]/g)) {
        capital?.classList.remove("invalid");
        capital?.classList.add("valid");
      } else {
        capital?.classList.remove("valid");
        capital?.classList.add("invalid");
      }

      // number
      if (value.match(/[0-9]/g)) {
        number?.classList.remove("invalid");
        number?.classList.add("valid");
      } else {
        number?.classList.remove("valid");
        number?.classList.add("invalid");
      }

      // length
      if (value.length >= 8) {
        length?.classList.remove("invalid");
        length?.classList.add("valid");
      } else {
        length?.classList.remove("valid");
        length?.classList.add("invalid");
      }

      // ✅ SPECIAL CHARACTER (NEW)
      if (value.match(/[!@#$%^&*(),.?":{}|<>]/g)) {
        special?.classList.remove("invalid");
        special?.classList.add("valid");
      } else {
        special?.classList.remove("valid");
        special?.classList.add("invalid");
      }
    };

    // SHOW/HIDE BOX
    const showBox = () => {
      let input = document.getElementById("password-contain") as HTMLElement;
      input.style.display = "block";
    };

    const hideBox = () => {
      let input = document.getElementById("password-contain") as HTMLElement;
      input.style.display = "none";
    };

    // PASSWORD EVENTS
    passwordInput.onfocus = showBox;
    passwordInput.onblur = hideBox;
    passwordInput.onkeyup = () => {
      validatePassword(passwordInput.value);

      if (confirmInput.value) {
        if (confirmInput.value !== passwordInput.value) {
          confirmInput.classList.add("is-invalid");
        } else {
          confirmInput.classList.remove("is-invalid");
        }
      }
    };

    // CONFIRM PASSWORD EVENTS
    confirmInput.onfocus = showBox;
    confirmInput.onblur = hideBox;
    confirmInput.onkeyup = () => {
      validatePassword(confirmInput.value);

      if (confirmInput.value !== passwordInput.value) {
        confirmInput.classList.add("is-invalid");
      } else {
        confirmInput.classList.remove("is-invalid");
      }
    };
  }

  private initFormSubmitData(): void {
    this.signupForm = this.fb.group({
      email: [null, Validators.required],
      reportChainID: [null, Validators.required],
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required],

    });
  }
  get f() { return this.signupForm.controls; }

  saveRegisterEmployee(): void {
    this.submitted = true;
    if (this.signupForm.invalid) return;

    const formValue = this.signupForm.value;
    const payload: StaffRegistrationPayload = {
      first_name: this.searchEmployeeListData[0].first_name,
      middle_name: this.searchEmployeeListData[0].middle_name,
      last_name: this.searchEmployeeListData[0].last_name,
      sur_name: this.searchEmployeeListData[0].sur_name,
      gender: this.searchEmployeeListData[0].gender,
      location_id: Number(this.searchEmployeeListData[0].location_id),
      phone_no: this.searchEmployeeListData[0].phone_no,
      date_of_birth: this.searchEmployeeListData[0].date_of_birth,
      transfer_path_id: null,
      training_path_id: null,
      working_station_id: this.searchEmployeeListData[0].working_station_id,
      working_station_name: this.searchEmployeeListData[0].working_station_name,
      personal_information_id: Number(this.searchEmployeeListData[0].personal_information_id),
      email: formValue.email,
      path_id: Number(formValue.reportChainID),
      password: formValue.password,
      confirm_password: formValue.confirmPassword,
    };

    this.store.dispatch(addStaffRegistration({ payload: payload }));

  }

  //ujumbe unaokuja ndio huu hapa start
  private actionMessages: any = {
    [addStaffRegistrationSuccess.type]: {icon: 'success',title: 'User Account Created Successfuly',closeModal: true,timer: 2000},
    [addStaffRegistrationFailure.type]: {icon: 'error',title: 'Registration Failed'},
    [loadSearchEmployeeFailure.type]: {icon: 'error',title: 'Failed to load data'},
  };
  private listenSeachEmployeeActions(): void {
    this.actions$.pipe(
      ofType(
        addStaffRegistrationSuccess,addStaffRegistrationFailure,loadSearchEmployeeFailure
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
  /**
   * Password Hide/Show
   */
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  toggleConfirmFieldTextType() {
    this.confirmfieldTextType = !this.confirmfieldTextType;
  }

}
