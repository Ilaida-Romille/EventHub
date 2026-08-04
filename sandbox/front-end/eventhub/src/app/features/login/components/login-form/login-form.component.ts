import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { form, FormField } from '@angular/forms/signals';
import { LoginCredentials } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormField],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginForm {

  @Input() isSubmitting = false;

  @Output() readonly loginSubmit = new EventEmitter<LoginCredentials>();

  readonly loginModel = signal<LoginCredentials>({
    email: '',
    password: '',
    remember: false
  });

  readonly loginForm = form(this.loginModel);

  readonly hidePassword = signal(true);

  togglePassword() {

    this.hidePassword.update(v => !v);

  }

  onSubmit(event: Event) {

    event.preventDefault();

    this.loginSubmit.emit(this.loginModel());

  }

}