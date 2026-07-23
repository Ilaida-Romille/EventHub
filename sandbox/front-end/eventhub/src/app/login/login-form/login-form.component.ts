import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

export interface LoginFormValue {
   email: string;
   password: string;
   remember: boolean;
}

@Component({
   selector: 'app-login-form',
   standalone: true,
   imports: [ReactiveFormsModule, RouterLink],
   templateUrl: './login-form.component.html',
   styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
   private fb = inject(FormBuilder);

   formSubmit = output<LoginFormValue>();

   loginForm = this.fb.nonNullable.group({});

   onSubmit(): void {}
}
