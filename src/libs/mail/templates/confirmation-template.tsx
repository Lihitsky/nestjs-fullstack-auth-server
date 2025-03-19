import { Body, Heading, Link, Text } from "@react-email/components";
import { Html } from "@react-email/html";
import * as React from "react";

interface ConfirmationTemplateProps {
    domain: string;
    token: string;
}

export function ConfirmationTemplate({ domain, token }: ConfirmationTemplateProps) {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    return (
        <Html>
            <Body>
                <Heading>Email Confirmation</Heading>
                <Text>Hello,</Text>
                <Text>
                    Thank you for signing up. Please confirm your email address to complete your registration.
                </Text>
                <Link href={confirmLink}>Confirm Email Address</Link>
                <Text>If you did not sign up, please ignore this email.</Text>
            </Body>
        </Html>
    );
}