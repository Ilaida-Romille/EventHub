import { Component, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
   likelyEmailFormatValidator,
   noWhitespacePasswordValidator
} from '../../validators/login.validators';

export interface LoginFormValue {
   email: string;
   password: string;
   remember: boolean;
}

@Component({
   selector: 'app-login-form',
   standalone: true,
   imports: [ReactiveFormsModule],
   templateUrl: './login-form.component.html',
   styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
   private readonly formBuilder = inject(NonNullableFormBuilder);

   readonly isSubmitting = input<boolean>(false);
   readonly authError = input<string | null>(null);
   readonly formSubmit = output<LoginFormValue>();

   readonly loginForm = this.formBuilder.group({
      email: [
         '',
         [
            Validators.required,
            Validators.minLength(15),
            Validators.maxLength(100),
            likelyEmailFormatValidator
         ]
      ],
      password: [
         '',
         [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(128),
            noWhitespacePasswordValidator
         ]
      ],
      remember: [false]
   });

   onSubmit(): void {
      if (this.loginForm.invalid) {
         this.loginForm.markAllAsTouched();
         return;
      }

      const formValue = this.loginForm.getRawValue();

      this.formSubmit.emit({
         email: formValue.email.trim().toLowerCase(),
         password: formValue.password,
         remember: formValue.remember
      });
   }
}
