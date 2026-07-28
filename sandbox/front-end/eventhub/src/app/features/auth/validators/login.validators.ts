import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const likelyEmailFormatValidator: ValidatorFn = (
   control: AbstractControl<string>
): ValidationErrors | null => {
   const rawValue = control.value;

   if (!rawValue) {
      return null;
   }

   return emailRegex.test(rawValue.trim()) ? null : { invalidEmailFormat: true };
};

export const noWhitespacePasswordValidator: ValidatorFn = (
   control: AbstractControl<string>
): ValidationErrors | null => {
   const rawValue = control.value;

   if (!rawValue) {
      return null;
   }

   return /\s/.test(rawValue) ? { passwordHasWhitespace: true } : null;
};
