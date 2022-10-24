import {authenticationGuard} from "./validation-middleware/authentication-guard";
import {inputValidation} from "./validation-middleware/input-validation";
import {bodyBlogValidation} from "./validation-middleware/blogRouter-validation";
import {bodyPostValidationForBlogsRouter} from "./validation-middleware/postRouter-validation";
import {queryValidation, queryWithNameTermValidation} from "./validation-middleware/query-validation";

export const postBlogsRouterMiddleware = [authenticationGuard, ...bodyBlogValidation, inputValidation]
export const createPostForBlogsRouterMiddleware = [authenticationGuard, ...bodyPostValidationForBlogsRouter, inputValidation]
export const getBlogsRouterMiddleware = [...queryWithNameTermValidation]
export const getPostForBlogsRouterMiddleware = [...queryValidation]
export const putBlogsRouterMiddleware = [authenticationGuard, ...bodyBlogValidation, inputValidation]
export const deleteBlogsRouterMiddleware = [authenticationGuard]