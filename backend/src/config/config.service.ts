import { Injectable } from "@nestjs/common";
import { config } from "dotenv";
import { Chainable, IConfigService } from "./config.types";
import { IEmailEnvs } from "src/communication/email/email.types";

config();

@Injectable()
export class ConfigService implements IConfigService {
    private _port: number;
    private _jwt: string;
    private _node_env: string;
    private _database_url: string;
    private _email_envs: IEmailEnvs = {
        user: '',
        host: '',
        password: '',
        port: 25,
    }

    public constructor() {
        this._port = Number(process.env.PORT) || 3000;
        this._jwt = process.env.JWT_SECRET ?? 'madara';
        this._node_env = process.env.node_env ?? 'development';
        this._database_url = process.env.DATABASE_URL ?? '';

        this._email_envs.user = process.env.EMAIL_USER ?? '';
        this._email_envs.host = process.env.EMAIL_HOST ?? '';
        this._email_envs.password = process.env.EMAIL_PASSWORD ?? "";
        this._email_envs.port = Number(process.env.EMAIL_PORT) ?? 25;
    }

    public databaseUrl(): Chainable<String> {
        const chain = {
            get: () => this._database_url,
            set: (value: string) => {
                this._database_url = value;
                return chain;
            }
        };

        return chain;
    }

    public port(): Chainable<number>{
        const chain = {
            get: () => this._port,
            set: (value: number) => { 
                this._port = value; 
                return chain;
            }
        };

        return chain;
    }

    public jwt_secret(): Chainable<string> {
        const chain = {
            get: () => this._jwt,
            set: (value: string) => { 
                this._jwt = value; 
                return chain; 
            }
        };

        return chain;
    }

    public nodeEnv(): Chainable<string> {
        const chain = {
            get: () => this._node_env,
            set: (value: 'production'|'development') => {
                this._node_env = value;
                return chain;
            }
        }

        return chain;
    }

    public get getEmailEnv(): typeof ConfigService.prototype._email_envs {
        return this._email_envs;
    }
}
