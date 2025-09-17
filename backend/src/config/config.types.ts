export interface Chainable<T> {
    get(): T;
    set(value: T): this;
}

export interface IConfigService {
    port(): Chainable<number>;
    jwt_secret(): Chainable<string>;
    databaseUrl(): Chainable<String>
}
