import {body} from "express-validator";
import {inputValidationResult} from "../input-validation-result";
import {authMiddleware} from "../auth-middleware";
import {notYourComment} from "../notYourContentValidation";

export const commentsValidation = body('content').isString().trim().isLength({min: 20, max: 300})

export const putCommentMiddleware = [authMiddleware, notYourComment, commentsValidation, inputValidationResult]
export const deleteCommentMiddleware = [authMiddleware, notYourComment]