import {
	BadRequestException,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { URLSearchParams } from 'url'

import { TypeBaseProviderOptions } from './types/base-provider.options.types'
import { TypeUserInfo } from './types/user-info.types'

/**
 * BaseOAuthService is a base class for handling OAuth authentication.
 * It provides methods to generate authentication URLs, exchange authorization codes for tokens,
 * and retrieve user information from the OAuth provider.
 */
@Injectable()
export class BaseOAuthService {
	/**
	 * The base URL of the application.
	 */
	private BASE_URL: string

	/**
	 * Constructs a new instance of the BaseOAuthService.
	 * @param options - The options for the OAuth provider.
	 */
	public constructor(private readonly options: TypeBaseProviderOptions) {}

	/**
	 * Extracts user information from the provided data.
	 * @param data - The data containing user information.
	 * @returns A promise that resolves to the extracted user information.
	 */
	protected async extractUserInfo(data: any): Promise<TypeUserInfo> {
		return {
			...data,
			provider: this.options.name
		}
	}

	/**
	 * Generates the authentication URL for the OAuth provider.
	 * @returns The authentication URL.
	 */
	public getAuthUrl() {
		const query = new URLSearchParams({
			response_type: 'code',
			client_id: this.options.client_id,
			redirect_uri: this.getRedirectUrl(),
			scope: (this.options.scopes ?? []).join(' '),
			access_type: 'offline',
			prompt: 'select_account'
		})

		return `${this.options.authorize_url}?${query.toString()}`
	}

	/**
	 * Finds the user information by exchanging the authorization code for tokens.
	 * @param code - The authorization code.
	 * @returns A promise that resolves to the user information.
	 * @throws BadRequestException if the token request fails or no tokens are found.
	 * @throws UnauthorizedException if the user request fails.
	 */
	public async findUserByCode(code: string): Promise<TypeUserInfo> {
		const client_id = this.options.client_id
		const client_secret = this.options.client_secret

		const tokenQuery = new URLSearchParams({
			client_id,
			client_secret,
			code,
			redirect_uri: this.getRedirectUrl(),
			grant_type: 'authorization_code'
		})

		const tokenRequest = await fetch(this.options.access_url, {
			method: 'POST',
			body: tokenQuery,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: 'application/json'
			}
		})

		if (!tokenRequest.ok) {
			throw new BadRequestException(
				`Failed to retrieve user ${this.options.profile_url}. Check the validity of the access token.`
			)
		}

		const tokens = await tokenRequest.json()

		if (!tokens.access_token) {
			throw new BadRequestException(
				`No tokens found at ${this.options.access_url}. Make sure that the authorisation code is valid.`
			)
		}

		const userRequest = await fetch(this.options.profile_url, {
			headers: {
				Authorization: `Bearer ${tokens.access_token}`
			}
		})

		if (!userRequest.ok) {
			throw new UnauthorizedException(
				`Failed to retrieve user ${this.options.profile_url}. Check that the access token is correct.`
			)
		}

		const user = await userRequest.json()
		const userData = await this.extractUserInfo(user)

		return {
			...userData,
			access_token: tokens.access_token,
			refresh_token: tokens.refresh_token,
			expires_at: tokens.expires_at || tokens.expires_in,
			provider: this.options.name
		}
	}

	/**
	 * Gets the redirect URL for the OAuth callback.
	 * @returns The redirect URL.
	 */
	public getRedirectUrl() {
		return `${this.BASE_URL}/auth/oauth/callback/${this.options.name}`
	}

	/**
	 * Sets the base URL of the application.
	 * @param value - The base URL.
	 */
	set baseUrl(value: string) {
		this.BASE_URL = value
	}

	/**
	 * Gets the name of the OAuth provider.
	 * @returns The provider name.
	 */
	get name() {
		return this.options.name
	}

	/**
	 * Gets the access URL of the OAuth provider.
	 * @returns The access URL.
	 */
	get access_url() {
		return this.options.access_url
	}

	/**
	 * Gets the profile URL of the OAuth provider.
	 * @returns The profile URL.
	 */
	get profile_url() {
		return this.options.profile_url
	}

	/**
	 * Gets the scopes required by the OAuth provider.
	 * @returns The scopes.
	 */
	get scopes() {
		return this.options.scopes
	}
}
