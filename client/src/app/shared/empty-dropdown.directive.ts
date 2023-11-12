import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export const emptyStatusDropdownValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const status = control.get('status');
  if (!status) return null;

  return status.value !== 'Select Status' ? null : { emptyStatus: true };
};

export const emptyCategoryDropdownValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const tags = control.get('tags');
  if (!tags) return null;

  return tags.value !== 'Select Category' ? null : { emptyCategory: true };
};
