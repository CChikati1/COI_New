import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validator to check if the date format is DD/MM/YYYY and is valid
export function dateFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    // Regex for DD/MM/YYYY format (validating day, month, and year)
    const regex = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

    if (!regex.test(control.value)) {
      return { invalidDateFormat: true }; // Invalid format
    }

    // Extract day, month, year
    const [day, month, year] = control.value.split('/').map(Number);
    const inputDate = new Date(year, month - 1, day);

    // Check if the date is valid (e.g., not 31st Feb)
    if (inputDate.getFullYear() !== year || inputDate.getMonth() !== month - 1 || inputDate.getDate() !== day) {
      return { invalidDate: true };
    }

    return null; // Valid date
  };
}
