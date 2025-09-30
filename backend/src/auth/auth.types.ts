import { EUnitType, SendMessage } from "generated/prisma";

export interface IJwtPayload {
    sub: string; // the id
    lastLoginAt: Date;
}

export type TRegisterDetails = {
    email?: string;
    phone?: string;
    enterpriseName: string;
    password: string;
}

export type TLoginDetails = {
    email?: string;
    phone?: string;
    password: string;
}

export type TUpdateDetails = {
    email?: string;
    phone?: string;
    enterpriseName?: string;
    password?: string;
}

export type TOnboardingDetails = {
    enterpriseDescription?: string,
    logoUrl?: string,
    logo_PublicId?: string,
    evaluationPeriod?: number,
    deleteSoldStockAfterEvaluationPeriod?: boolean,
    ussdCode?: string,
    sendMessage?: SendMessage,
    products?: {
        name: string;
        unit: EUnitType;
    }[]
}

export type TSendOtpDetails = {
    email?: string;
    phone?: string;
    isPasswordReset: boolean;
}

export type TVerifyOtpDetails = {
    email?: string;
    phone?: string;
    otp: string;
    isPasswordReset: boolean;
}

export type TResetPasswordDetails = {
    password: string;
}
