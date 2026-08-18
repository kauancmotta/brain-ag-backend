import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { isValidDocument } from './is-document.validator';

@ValidatorConstraint({ name: 'IsDocument', async: false })
export class IsDocumentConstraint implements ValidatorConstraintInterface {
  validate(value: unknown): boolean {
    return typeof value === 'string' && isValidDocument(value);
  }

  defaultMessage(_args: ValidationArguments): string {
    return 'document must be a valid CPF or CNPJ';
  }
}

export function IsDocument(options?: ValidationOptions): PropertyDecorator {
  return (target, propertyKey) => {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyKey as string,
      options,
      constraints: [],
      validator: IsDocumentConstraint,
    });
  };
}