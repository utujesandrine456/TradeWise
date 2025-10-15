import { EUnitType } from 'generated/prisma';
import * as Joi from 'joi';

export const registerSchema = Joi.object({
    enterpriseName: Joi.string().required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().optional().allow(''),
    phone: Joi.string().optional().allow(''),
}).or('phone', 'email')

export const loginSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
}).xor('phone', 'email')

export const updateSchema = Joi.object({
    password: Joi.string().min(6).optional(),
    enterpriseName: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
});

export const onboardingSchema = Joi.object({
    enterpriseDescription: Joi.string().optional(),
    name: Joi.string().optional(),
    currency: Joi.string().optional(),
    businessType: Joi.string().optional(),
    industry: Joi.string().optional(),
    foundedYear: Joi.number().integer().optional(),
    description: Joi.string().optional(),
    website: Joi.string().uri().optional(),
    address: Joi.string().optional(),
    businessHours: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
    anualRevenue: Joi.number().optional(),
    numberOfEmployees: Joi.number().integer().optional(),
    paymentMethod: Joi.string().valid('Cash', 'BankTransfer', 'MobileMoney', 'CreditCard', 'Other').optional(),
    targetMarket: Joi.string().optional(),
    competitors: Joi.string().optional(),
    goals: Joi.string().optional(),
    sendMessage: Joi.string().optional(),
})


export const forgetPasswordSchema = Joi.object({
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
}).xor('phone', 'email')


export const resetPasswordSchema = Joi.object({
    otp: Joi.string().required(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    password: Joi.string().min(6).required(),
}).xor('phone', 'email')

export const sendOtpSchema = Joi.object({
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
}).xor('phone', 'email')


export const verifyOtpSchema = Joi.object({
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    otp: Joi.string().required(),
}).xor('phone', 'email')
