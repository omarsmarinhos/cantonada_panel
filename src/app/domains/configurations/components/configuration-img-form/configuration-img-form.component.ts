import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-configuration-img-form',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatGridListModule,
    ReactiveFormsModule
  ],
  templateUrl: './configuration-img-form.component.html',
  styleUrl: './configuration-img-form.component.scss'
})
export class ConfigurationImgFormComponent {

  @Input() formGroup!: FormGroup;
  @Input() titulo: string = '';
  @Input() colspan: number = 12;
  @Input() isDisabled: boolean = true;
  @Input() aspectRatios: string[] = [];

  @Output() cancel = new EventEmitter<void>();
  @Output() toggle = new EventEmitter<void>();

  onCancel() {
    this.cancel.emit();
  }

  toggleButton() {
    this.toggle.emit();
  }

}
