import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UpdateUserDto {
	@IsString({ message: 'name must be a string' })
	@IsNotEmpty({ message: 'name is required' })
	name: string

	@IsString({ message: 'email must be a string' })
	@IsEmail({}, { message: 'email must be a valid email' })
	@IsNotEmpty({ message: 'email is required' })
	email: string

	@IsBoolean({ message: 'isTwoFactorEnabled must be a boolean' })
	isTwoFactorEnabled: boolean
}
