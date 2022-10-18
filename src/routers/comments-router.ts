import {Response, Router} from "express";
import {commentsService} from "../domain/comments-servise";
import {authMiddleware} from "../middlewares/auth-middleware";
import {commentsValidation} from "../middlewares/commentRouter-validation-middleware";
import {RequestWithParams} from "../types/request-types";
import {CommentType} from "../types/comment-type";
import {URIParameters} from "../models/URIParameters";

export const commentsRouter = Router({})

commentsRouter.put('/:commentId',
    authMiddleware,
    commentsValidation,
    async (req: RequestWithParams<URIParameters>,
           res: Response<CommentType>) => {

        const isUpdate = await commentsService.updateComment(req.params.id, req.body.content)

        if (!isUpdate) {
            return res.sendStatus(404)
        }

        const comment = await commentsService.giveCommentById(req.params.id)
        return res.status(204).send(comment!)
    })

commentsRouter.get('/:id',
    async (req: RequestWithParams<URIParameters>,
                   res: Response<CommentType>) => {
    const comment = await commentsService.giveCommentById(req.params.id)

    if (!comment) {
        return res.sendStatus(404)
    }

    return res.status(200).send(comment)
})

commentsRouter.delete('/:commentsId',
    authMiddleware,
    async (req: RequestWithParams<URIParameters>,
           res: Response) => {

        const isDeleted = await commentsService.deleteCommentById(req.params.id)

        if (!isDeleted) {
            return res.sendStatus(404)
        }

        return res.sendStatus(204)
    })