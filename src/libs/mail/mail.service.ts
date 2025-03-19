import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class MailService {
	public constructor(private readonly mailerConfig: MailerService) {}

	private sendMail(email: string, subject: string, html: string) {
		return this.mailerConfig.sendMail({
			to: email,
			subject,
			html
		})
	}
}
