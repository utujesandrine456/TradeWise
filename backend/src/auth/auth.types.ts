import { EUnitType, SendMessage } from "generated/prisma";
import { EPaymentMethod } from "src/graphql/circular-dependency";

export interface IJwtPayload {
    sub: string; 
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
    name?: string,
    currency?: string,
    businessType?: string,
    industry?: string,
    foundedYear?: number,
    description?: string,
    website?: string,
    address?: string,
    businessHours?: string,
    phoneNumber?: string,
    anualRevenue?: number,
    numberOfEmployees?: number,
    paymentMethod?: EPaymentMethod,
    targetMarket?: string,
    competitors?: string,
    goals?: string,
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
