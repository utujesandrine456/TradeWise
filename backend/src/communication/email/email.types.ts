
export interface IEmailEnvs {
    user: string,
    host: string,
    password: string,
    port: number
}

export interface IEmailOptions {
    to: string,
    subject: string,
    text?: string,
    html?: string,
}