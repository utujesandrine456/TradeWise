
export type TJwtPayload = {
    sub: string; // the id
    email?: string;
    phone?: string;
}

export type TRegisterTrader = {
    enterpriseName: string;
    email?: string;
    phone?: string;
    password: string;
}

export type TLoginTrader = {
    email?: string;
    phone?: string;
    password: string;
}

export type TUpdateTrader = {
    enterpriseName?: string;
    profilePicture?: string;
    password?: string;
}

export type TSendVerifyAccountDetails = {
    email?: string;
    phone?: string;
}

export type TForgotPasswordDetails = {
    email?: string;
    phone?: string;
}

export type TResetPasswordDetails = {
    token: string;
    password: string;
}

export type TOnboardingTrader = {
    enterpriseDescription: string;
    logo?: string;
    name: string; // trader name
    evaluationPeriod: number;
    deleteSoldStockAfterEvaluationPeriod: boolean;
    ussdCode: string;
}