import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class RegisterTraderDto {
    @IsString()
    @IsNotEmpty()
    enterpriseName: string;
    
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string
}

export class LoginTraderDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password: string
}

export class UpdateProfileDto {
    @IsString()
    @IsNotEmpty()
    enterpriseName?: string;
    
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    password?: string
}

export class ForgotPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class ResetPasswordDto {
    @IsString()
    @MinLength(6)
    @IsNotEmpty()
    newPassword: string;

    @IsString()
    @IsNotEmpty()
    token: string;
}