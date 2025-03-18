import { Inject, Injectable } from '@nestjs/common'

import { ProviderOptionsSymbol, TypeOptions } from './provider.constants'
import { BaseOAuthService } from './services/base-oauth.service'

@Injectable()
export class ProviderService {
	public constructor(
		@Inject(ProviderOptionsSymbol) private readonly options: TypeOptions
	) {}

	public onModuleInit() {
		for (const provider of this.options.services) {
			provider.baseUrl = this.options.baseUrl
		}
	}

	public findByServiceName(serviceName: string): BaseOAuthService | null {
		return (
			this.options.services.find(
				provider => provider.name === serviceName
			) ?? null
		)
	}
}
