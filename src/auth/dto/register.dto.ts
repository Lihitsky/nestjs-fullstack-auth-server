import {
	IsEmail,
	IsNotEmpty,
	IsString,
	MinLength,
	Validate
} from 'class-validator'

import { IsPasswordsMatchingConstraint } from '@/libs/common/decorators/is-passwords-matching-constraint.decorator'

/**
 * DTO for user registration.
 */
export class RegisterDto {
	/**
	 * User name.
	 * @example John Doe
	 */
	@IsString({ message: 'Name must be a string.' })
	@IsNotEmpty({ message: 'Name is required.' })
	name: string

	/**
	 * User email.
	 * @example example@example.com
	 */
	@IsString({ message: 'Email must be a string.' })
	@IsEmail({}, { message: 'Incorrect email format.' })
	@IsNotEmpty({ message: 'Email is required.' })
	email: string

	/**
	 * User password.
	 * @example password123
	 */
	@IsString({ message: 'Password must be a string.' })
	@IsNotEmpty({ message: 'Password is required.' })
	@MinLength(6, {
		message: 'Password must contain at least 6 characters.'
	})
	password: string

	/**
	 * Confirmation of user password.
	 * @example password123
	 */
	@IsString({ message: 'Password confirmation must be a string.' })
	@IsNotEmpty({ message: 'Password confirmation field must not be empty.' })
	@MinLength(6, {
		message: 'Password confirmation must contain at least 6 characters.'
	})
	@Validate(IsPasswordsMatchingConstraint, {
		message: 'Passwords do not match.'
	})
	passwordRepeat: string
}
