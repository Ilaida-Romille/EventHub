import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoginCredentials } from '../../../../core/models/auth.model';
import { LoginForm } from '../login-form/login-form.component';

@Component({
  selector: 'app-login-card',
  imports: [LoginForm],
  standalone: true,
  templateUrl: './login-card.component.html',
  styleUrl: './login-card.component.scss',
})
export class LoginCard {

  @Input() authError: string | null = null;

  @Input() isSubmitting = false;

  @Output() readonly loginSubmit = new EventEmitter<LoginCredentials>();

}
