import {
	BadRequestException,
	Injectable,
	NotFoundException
} from '@nestjs/common'
import { TokenType } from '@prisma/__generated__'

import { MailService } from '@/libs/mail/mail.service'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class TwoFactorAuthService {
	public constructor(
		private readonly prismaService: PrismaService,
		private readonly mailService: MailService
	) {}

	public async validateTwoFactorToken(email: string, token: string) {
		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email: email,
				type: TokenType.TWO_FACTOR
			}
		})

		if (!existingToken) {
			throw new NotFoundException(
				"Two-factor token not found. Please, make sure you've entered the correct token."
			)
		}

		if (existingToken.token !== token) {
			throw new BadRequestException(
				"Invalid two-factor token. Please, make sure you've entered the correct token."
			)
		}

		const isExpired = new Date(existingToken.expiresIn) < new Date()

		if (isExpired) {
			throw new BadRequestException(
				'Two-factor token is expired. Please, request a new one.'
			)
		}

		await this.prismaService.token.delete({
			where: {
				id: existingToken.id,
				type: TokenType.TWO_FACTOR
			}
		})

		return true
	}

	public async sendTwoFactorToken(email: string) {
		const twoFactorToken = await this.generateTwoFactorToken(email)
		await this.mailService.sendTwoFactorTokenEmail(
			twoFactorToken.email,
			twoFactorToken.token
		)

		return true
	}

	private async generateTwoFactorToken(email: string) {
		const token = Math.floor(100000 + Math.random() * 900000).toString() // 6-digit random number
		const expiresIn = new Date(new Date().getTime() + 300000) // 15 minutes

		const existingToken = await this.prismaService.token.findFirst({
			where: {
				email,
				type: TokenType.TWO_FACTOR
			}
		})

		if (existingToken) {
			await this.prismaService.token.delete({
				where: {
					id: existingToken.id
				}
			})
		}

		const twoFactorToken = await this.prismaService.token.create({
			data: {
				email,
				token,
				expiresIn,
				type: TokenType.TWO_FACTOR
			}
		})

		return twoFactorToken
	}
}
