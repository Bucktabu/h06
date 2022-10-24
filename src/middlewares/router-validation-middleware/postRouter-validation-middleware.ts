import {body} from "express-validator";
import {inputValidationResult} from "../input-validation-result";
import {blogsRepository} from "../../repositories/blogs-repository";
import {authenticationGuard} from "../authentication-guard";
import {authMiddleware} from "../auth-middleware";
import {commentsValidation} from "./commentRouter-validation-middleware";
import {queryValidationMiddleware} from "../query-validation-middleware";

const titleValidation = body('title').isString().trim().isLength({min: 3, max: 30})
const shortDescriptionValidation = body('shortDescription').isString().trim().isLength({min: 3, max: 100})
const contentValidation = body('content').isString().trim().isLength(({min: 3, max: 1000}))

export const blogIdValidation = body('blogId').isString()
    .custom(async (id: string) => {
        const blog = await blogsRepository.giveBlogById(id)

        if (!blog) {
            throw new Error('blog not found')
        }

        return true
    })

export const createPostMiddleware = [authenticationGuard, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidationResult]
export const createCommentForPostMiddleware = [authMiddleware, commentsValidation, inputValidationResult]
export const getPostsMiddleware = [...queryValidationMiddleware, inputValidationResult]
export const putPostMiddleware = [authenticationGuard, titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidationResult]
export const deletePostMiddleware = [authenticationGuard]