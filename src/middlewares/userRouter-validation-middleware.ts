import {body} from "express-validator";
import {inputValidationResult} from "./input-validation-result";
import {authenticationGuard} from "./authentication-guard";
import {usersQueryValidationMiddleware} from "./query-validation-middleware";

const loginValidation = body('login').isString().trim().isLength({min: 3, max: 10})
const passwordValidation = body('password').isString().trim().isLength({min: 6, max: 20})
const emailValidation = body('email').isString().trim().notEmpty().isEmail()

export const postUserMiddleware = [authenticationGuard, loginValidation, passwordValidation, emailValidation, inputValidationResult]
export const getUserMiddleware = [...usersQueryValidationMiddleware]
export const deleteUserMiddleware = [authenticationGuard]
