import { Body, Heading, Text } from "@react-email/components";
import { Html } from "@react-email/html";
import * as React from "react";

interface TwoFactorAuthTemplateProps {
    token: string;
}

export function TwoFactorAuthTemplate({ token }: TwoFactorAuthTemplateProps) {
    return (
        <Html>
            <Body>
                <Heading>Two-Factor Authentication Code</Heading>
                <Text>Hello,</Text>
                <Text>
                    Your two-factor authentication code is:
                </Text>
                <Text style={{ fontSize: "24px", fontWeight: "bold" }}>
                    {token}
                </Text>
                <Text>
                    If you did not request this code, please ignore this email or contact support if you have concerns.
                </Text>
            </Body>
        </Html>
    );
}