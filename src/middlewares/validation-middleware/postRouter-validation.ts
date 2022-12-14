import {body} from "express-validator";
import {blogsRepository} from "../../repositories/blogs-repository";

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

export const bodyPostValidationForBlogsRouter = [titleValidation, shortDescriptionValidation, contentValidation]
export const bodyPostValidationForPostsRouter = [titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation]