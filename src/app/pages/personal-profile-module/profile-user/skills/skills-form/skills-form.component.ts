import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-skills-form',
  templateUrl: './skills-form.component.html',
  styleUrl: './skills-form.component.scss'
})
export class SkillsFormComponent implements OnInit, OnDestroy{
  @Input() skillsList: any[] = [];
  
  @Output() submitForm = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  skillsForm!: UntypedFormGroup;
  submitted = false;
  selectedFile: File | null = null;

  private destroy$ = new Subject<void>();

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.skillsForm = this.fb.group({
      skillID: [null, Validators.required],
      uploadSkillAttachement: [null, Validators.required]

    });
  }

  get form() {
    return this.skillsForm.controls;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      Swal.fire('Error', 'Only PDF allowed', 'error');
      event.target.value = ''; this.selectedFile = null; this.skillsForm.get('uploadSkillAttachement')?.setValue(null);
      return;
    }
    if (file.size > 1024 * 1024) {
      Swal.fire('Error', 'Max size is 1MB', 'error');
      event.target.value = ''; this.selectedFile = null; this.skillsForm.get('uploadSkillAttachement')?.setValue(null);
      return;
    }
    this.selectedFile = file;
    this.form['uploadSkillAttachement'].setValue(file);
  }

  saveSkills(): void {
    this.submitted = true;
    if (this.skillsForm.invalid) return;

    const payload = {
      skill_id: this.form['skillID'].value,
      upload_file_name: this.selectedFile || undefined
    };

    this.submitForm.emit(payload);
  }

  closeModal() {
    this.close.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
