import {body} from "express-validator";
import {inputValidationResult} from "../input-validation-result";
import {authenticationGuard} from "../authentication-guard";
import {queryValidationMiddleware, queryWithNameTermValidation} from "../query-validation-middleware";
import {createPostMiddleware} from "./postRouter-validation-middleware";

const nameValidation = body('name').isString().trim().isLength({min: 3, max: 15})
const youtubeUrlValidation = body('youtubeUrl').isString().trim().isURL().isLength({min: 5, max: 100})

export const postBlogMiddleware = [authenticationGuard, nameValidation, youtubeUrlValidation, inputValidationResult]
export const createPostForBlogMiddleware = [...createPostMiddleware]
export const getBlogsMiddleware = [...queryWithNameTermValidation, inputValidationResult]
export const getPostsForBlogMiddleware = [...queryValidationMiddleware, inputValidationResult]
export const deleteBlogMiddleware = [authenticationGuard]