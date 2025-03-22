import { IsEmail, IsNotEmpty } from 'class-validator'

export class ResetPasswordDto {
	@IsEmail({}, { message: 'Invalid email format' })
	@IsNotEmpty({ message: 'Email cannot be empty' })
	email: string
}
