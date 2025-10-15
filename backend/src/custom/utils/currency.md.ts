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
