import { Body, Heading, Link, Text } from "@react-email/components";
import { Html } from "@react-email/html";
import * as React from "react";

interface ResetPasswordTemplateProps {
    domain: string;
    token: string;
}

export function ResetPasswordTemplate({ domain, token }: ResetPasswordTemplateProps) {
    const resetLink = `${domain}/auth/new-password?token=${token}`;

    return (
        <Html>
            <Body>
                <Heading>Reset Your Password</Heading>
                <Text>Hello,</Text>
                <Text>
                    We received a request to reset your password. Click the link below to set a new password:
                </Text>
                <Link href={resetLink}>Reset Password</Link>
                <Text>
                    If you did not request a password reset, please ignore this email or contact support if you have concerns.
                </Text>
            </Body>
        </Html>
    );
}