import {Response, Router} from "express";

import {commentsService} from "../domain/comments-servise";
import {authMiddleware} from "../middlewares/auth-middleware";
import {commentsValidationMiddleware} from "../middlewares/commentRouter-validation-middleware";
import {CommentType} from "../types/comment-type";
import {RequestWithParams, RequestWithParamsAndBody} from "../types/request-types";
import {URIParameters} from "../models/URIParameters";

export const commentsRouter = Router({})

const GET = commentsRouter.get
const PUT = commentsRouter.put
const DELETE = commentsRouter.delete

commentsRouter.get('/:id', // commentId
    async (req: RequestWithParams<URIParameters>,
           res: Response<CommentType>) => {

        const comment = await commentsService.giveCommentById(req.params.id)

        if (!comment) {
            return res.sendStatus(404)
        }

        return res.status(200).send(comment)
    }
)

commentsRouter.put('/:id', // commentId
    authMiddleware,
    ...commentsValidationMiddleware,
    async(req: RequestWithParamsAndBody<URIParameters, CommentType>,
           res: Response<CommentType>) => {

        const comment = await commentsService.giveCommentById(req.params.id)

        if (!comment) {
            return res.sendStatus(404)
        }

        if (comment!.userId !== req.user!.id) {
            return res.sendStatus(403) //	If try edit the comment that is not your own
        }

        const isUpdate = await commentsService.updateComment(req.params.id, req.body.content)

        if (!isUpdate) {
            return res.sendStatus(404)
        }

        return res.status(204).send(comment!)
    }
)

commentsRouter.delete('/:id', // commentId
    authMiddleware,
    async (req: RequestWithParams<URIParameters>,
           res: Response) => {

        const comment = await commentsService.giveCommentById(req.params.id)

        if (!comment) {
            return res.sendStatus(404)
        }

        if (comment.userId !== req.user!.id) {
            return res.sendStatus(403) //	If try edit the comment that is not your own
        }

        const isDeleted = await commentsService.deleteCommentById(req.params.id)

        if (!isDeleted) {
            return res.sendStatus(404)
        }

        return res.sendStatus(204)
    }
)