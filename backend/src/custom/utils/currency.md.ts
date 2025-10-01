import { Injectable } from "@nestjs/common";
import { code } from 'currency-codes-ts';
import { Module } from "@nestjs/common";

@Injectable()
export class CurrencyService {
    public isValidCurrency(currencyCode: string): boolean {
        return !!code(currencyCode);
    }
}

@Module({
    providers: [CurrencyService],
    exports: [CurrencyService],
})
export class CurrencyModule {}
