
export type TJwtPayload = {
    sub: string; // the id
    email: string;
}

export type TRegisterTrader = {
    enterpriseName: string;
    email: string;
    password: string;
}

export type TLoginTrader = {
    email: string;
    password: string;
}

export type TUpdateTrader = {
    enterpriseName?: string;
    profilePicture?: string;
    password?: string;
}