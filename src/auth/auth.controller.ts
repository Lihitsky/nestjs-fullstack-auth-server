import {
	BadRequestException,
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Query,
	Req,
	Res,
	UseGuards
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response } from 'express'

import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { AuthProviderGuard } from './guards/provider.quard'
import { ProviderService } from './provider/provider.service'

@Controller('auth')
export class AuthController {
	public constructor(
		private readonly authService: AuthService,
		private readonly providerService: ProviderService,
		private readonly configService: ConfigService
	) {}

	@Post('register')
	@HttpCode(HttpStatus.OK)
	public async register(@Req() req: Request, @Body() dto: RegisterDto) {
		return this.authService.register(req, dto)
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	public async login(@Req() req: Request, @Body() dto: LoginDto) {
		return this.authService.login(req, dto)
	}

	@Get('oauth/callback/:provider')
	@UseGuards(AuthProviderGuard)
	@HttpCode(HttpStatus.OK)
	public async callback(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response,
		@Query('code') code: string,
		@Param('provider') provider: string
	) {
		if (!code) {
			throw new BadRequestException('Code not found')
		}

		await this.authService.extractProfileFromCode(req, provider, code)

		return res.redirect(
			`${this.configService.getOrThrow<string>('ALLOWED_ORIGIN')}/dashboard/settings`
		)
	}

	@Get('oauth/connect/:provider')
	@UseGuards(AuthProviderGuard)
	@HttpCode(HttpStatus.OK)
	public async connect(@Param('provider') provider: string) {
		const providerInstance =
			this.providerService.findByServiceName(provider)

		return {
			url: providerInstance.getAuthUrl()
		}
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	public async logout(
		@Req() req: Request,
		@Res({ passthrough: true }) res: Response
	) {
		return this.authService.logout(req, res)
	}
}
