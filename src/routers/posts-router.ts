import {Response, Router} from "express";

import {authenticationGuardMiddleware} from "../middlewares/authentication-guard-middleware";
import {authMiddleware} from "../middlewares/auth-middleware";
import {commentsValidationMiddleware} from "../middlewares/commentRouter-validation-middleware";
import {queryValidationMiddleware} from "../middlewares/query-validation-middleware";
import {postRouterValidation} from "../middlewares/postRouter-validation-middleware";

import {commentsService} from "../domain/comments-servise";
import {postsService} from "../domain/posts-service";

import {CreateNewComment} from "../models/postCreateNewComment"
import {QueryParameters} from "../models/queryParameters";
import {PostsCreateNewPost} from "../models/postsCreateNewPost";
import {PostsUpdatePost} from "../models/postsUpdatePost";
import {URIParameters} from "../models/URIParameters";

import {CommentType} from "../types/comment-type";
import {ContentPageType} from "../types/content-page-type";
import {PostType} from "../types/posts-type";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody, RequestWithParamsAndQuery,
    RequestWithQuery
} from "../types/request-types";

export const postsRouter = Router({})

postsRouter.post('/',
    authenticationGuardMiddleware,
    ...postRouterValidation,
    async (req: RequestWithBody<PostsCreateNewPost>,
           res: Response<PostType | null>) => {

        const newPost = await postsService.createNewPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)

        if (!newPost) {
            return res.sendStatus(404)
        }

        return res.status(201).send(newPost)
    }
)

postsRouter.post('/:id/comments',
    authMiddleware,
    ...commentsValidationMiddleware,
    async (req: RequestWithParamsAndBody<URIParameters, CreateNewComment>,
           res: Response<CommentType>) => {

        const post = postsService.givePostById(req.params.id)

        if (!post) {
            return res.sendStatus(404)
        }

        const createdComment = await commentsService.createNewComment(req.body.content, req.user!)

        return res.status(201).send(createdComment)
    }
)

postsRouter.get('/',
    ...queryValidationMiddleware,
    async (req: RequestWithQuery<QueryParameters>,
           res: Response<ContentPageType>) => {

        const pageWithPosts: ContentPageType = await postsService
            .givePostsPage(req.query.sortBy,
                           req.query.sortDirection,
                           req.query.pageNumber,
                           req.query.pageSize,
                           req.query.blogId)

        if (!pageWithPosts) {
            return res.sendStatus(404)
        }

        res.status(200).send(pageWithPosts)
    }
)

postsRouter.get('/:id', // postId
    async (req: RequestWithParams<URIParameters>,
                   res: Response<PostType>) => {

        const post = await postsService.givePostById(req.params.id)

        if (!post) {
            return res.sendStatus(404)
        }

        res.status(200).send(post)
    }
)

postsRouter.get('/:id/comments', // postId
    ...queryValidationMiddleware,
    async (req: RequestWithParamsAndQuery<URIParameters, QueryParameters>,
           res: Response<ContentPageType>) => {

        const pageWithComments: ContentPageType | null = await commentsService
            .giveCommentsPage(req.query.sortBy,
                              req.query.sortDirection,
                              req.query.pageNumber,
                              req.query.pageSize,
                              req.params.id)

        if (!pageWithComments) {
            return res.sendStatus(404)
        }

        res.status(200).send(pageWithComments)
    }
)

postsRouter.put('/:id', // postId
    authenticationGuardMiddleware,
    ...postRouterValidation,
    async (req: RequestWithParamsAndBody<URIParameters, PostsUpdatePost>,
           res: Response<PostType | null>) => {

        const isUpdate = await postsService
            .updatePost(req.params.id,
                        req.body.title,
                        req.body.shortDescription,
                        req.body.content,
                        req.body.blogId)

        if (!isUpdate) {
            return res.sendStatus(404)
        }

        const post = await postsService.givePostById(req.params.id)
        res.status(204).send(post)
    }
)

postsRouter.delete('/:id', // postId
    authenticationGuardMiddleware,
    async (req: RequestWithParams<URIParameters>,
           res: Response) => {

        const isDeleted = await postsService.deletePostById(req.params.id)

        if (isDeleted) {
            return res.sendStatus(204)
        }

        res.sendStatus(404)
    }
)