import {
IsEmail,
IsOptional,
IsString,
MinLength,
Validate,
ValidatorConstraint,
ValidatorConstraintInterface,
ValidationArguments,
IsNotEmpty,
IsNumber,
IsBoolean,
} from 'class-validator';

@ValidatorConstraint({ name: 'emailOrPhone', async: false })
export class EmailOrPhoneConstraint implements ValidatorConstraintInterface {
    public validate(_: any, args: ValidationArguments) {
        const obj = args.object as any;
        return !!(obj.email || obj.phone); // valid if at least one is provided
    }

    public defaultMessage(_: ValidationArguments) {
        return 'Either email or phone must be provided';
    }
}

@ValidatorConstraint({ name: 'onlyOneEmailOrPhone', async: false })
export class OnlyOneEmailOrPhoneConstraint implements ValidatorConstraintInterface {
    public validate(_: any, args: ValidationArguments) {
        const obj = args.object as any;
        const hasEmail = !!obj.email;
        const hasPhone = !!obj.phone;
        return (hasEmail || hasPhone) && !(hasEmail && hasPhone);
    }

    public defaultMessage(_: ValidationArguments) {
        return 'Exactly one of email or phone must be provided';
    }
}

export class RegisterTraderDto {
    @IsString()
    @IsNotEmpty()
    enterpriseName: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @Validate(EmailOrPhoneConstraint)
    emailOrPhoneCheck: string; // virtual field to enforce rule
}

export class LoginTraderDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;
}

export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    enterpriseName?: string;

    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string;
}


export class ForgotPasswordDto {
    @IsEmail()
    @IsOptional()
    email?: string;
  
    @IsString()
    @IsOptional()
    phone?: string;
  
    @Validate(OnlyOneEmailOrPhoneConstraint)
    emailOrPhoneCheck: string; // ensures exactly one is provided
}

export class ResetPasswordDto {
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    token: string;
}

export class VerifyAccountDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @Validate(OnlyOneEmailOrPhoneConstraint)
    emailOrPhoneCheck: string; // ensuromg exactly one is provided

    @IsString()
    @IsNotEmpty()
    token: string;
}

export class OnboardingDto {
    @IsString()
    @IsNotEmpty()
    enterpriseDescription: string;

    @IsString()
    @IsNotEmpty()
    logo: string;

    @IsString()
    @IsNotEmpty()
    name: string; // trader name

    @IsNumber()
    @IsNotEmpty()
    evaluationPeriod: number;

    @IsBoolean() // using checkbox in frontend
    @IsNotEmpty()
    deleteSoldStockAfterEvaluationPeriod: boolean;

    @IsString()
    @IsNotEmpty()
    ussdCode: string;
}