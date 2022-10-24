import {body} from "express-validator";
import {inputValidation} from "./input-validation";

export const commentsValidation = body('content').isString().trim().isLength({min: 20, max: 300})

export const commentsValidationMiddleware = [commentsValidation, inputValidation]