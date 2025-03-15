import {
	ValidationArguments,
	ValidatorConstraint,
	ValidatorConstraintInterface
} from 'class-validator'

import { RegisterDto } from '@/auth/dto/register.dto'

/**
 * Constraint for password matching validation.
 *
 * This class implements the ValidatorConstraintInterface and is used
 * to check if two passwords match during validation.
 */
@ValidatorConstraint({ name: 'IsPasswordsMatching', async: false })
export class IsPasswordsMatchingConstraint
	implements ValidatorConstraintInterface
{
	/**
	 * Checks if the password confirmation matches the main password.
	 *
	 * @param passwordRepeat - The password confirmation entered by the user.
	 * @param args - Validation arguments containing the object being validated.
	 * @returns true if the passwords match; otherwise false.
	 */
	public validate(passwordRepeat: string, args: ValidationArguments) {
		const obj = args.object as RegisterDto
		return obj.password === passwordRepeat
	}

	/**
	 * Returns the default message if validation fails.
	 *
	 * @param validationArguments - Validation arguments.
	 * @returns Error message.
	 */
	public defaultMessage(validationArguments?: ValidationArguments) {
		return 'Passwords do not match'
	}
}
