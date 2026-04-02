<<<<<<< HEAD
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
=======
import { Injectable, Module } from '@nestjs/common';

@Injectable()
export class CurrencyService {
  isValidCurrency(currencyCode: string): boolean {
    return /^[A-Z]{3}$/.test(currencyCode ?? '');
  }
}


@Module({
  providers: [CurrencyService],
  exports: [CurrencyService],
})

export class CurrencyModule {}
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
