import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	MinLength
} from 'class-validator'

/**
 * DTO for user login.
 */
export class LoginDto {
	/**
	 * User's email.
	 * @example example@example.com
	 */
	@IsString({ message: 'Email must be a string.' })
	@IsEmail({}, { message: 'Invalid email format.' })
	@IsNotEmpty({ message: 'Email is required.' })
	email: string

	/**
	 * User's password.
	 * @example password123
	 */
	@IsString({ message: 'Password must be a string.' })
	@IsNotEmpty({ message: 'Password cannot be empty.' })
	@MinLength(6, { message: 'Password must be at least 6 characters long.' })
	password: string

	/**
	 * Two-factor authentication code (optional).
	 * @example 123456
	 */
	@IsOptional()
	@IsString()
	code: string
}
