import * as Joi from 'joi';

export const registerSchema = Joi.object({
    enterpriseName: Joi.string().required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
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
    logo: Joi.string().optional(),
    evaluationPeriod: Joi.number().optional(),
    deleteSoldStockAfterEvaluationPeriod: Joi.boolean().optional(),
    ussdCode: Joi.string().optional(),
    sendMessage: Joi.string().optional(),
});

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
