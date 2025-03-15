import { ConflictException, Injectable } from '@nestjs/common'
import { AuthMethod, User } from '@prisma/__generated__'

import { UserService } from '@/user/user.service'

import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
	public constructor(private readonly userService: UserService) {}

	public async register(dto: RegisterDto) {
		const isExists = await this.userService.findByEmail(dto.email)

		if (isExists) {
			throw new ConflictException('User already exists')
		}

		const newUser = await this.userService.create(
			dto.email,
			dto.password,
			dto.name,
			'',
			AuthMethod.CREDENTIALS,
			false
		)

		return this.saveSession(newUser)
	}

	public async login() {}

	public async logout() {}

	private async saveSession(user: User) {
		console.log(`Session saved: ${user}`)
	}
}
