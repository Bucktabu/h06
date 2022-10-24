import {body} from "express-validator";
import {inputValidationResult} from "./input-validation-result";
import {authMiddleware} from "./auth-middleware";

const loginValidation = body('login').isString().trim()
const passwordValidation = body('password').isString().trim()

export const getAuthMiddleware = [authMiddleware]
export const postAuthMiddleware = [loginValidation, passwordValidation, inputValidationResult]