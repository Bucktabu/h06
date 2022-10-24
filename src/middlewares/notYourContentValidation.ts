import {NextFunction, Response} from "express";
import {commentsService} from "../domain/comments-servise";
import {RequestWithParamsAndBody} from "../types/request-types";
import {URIParameters} from "../models/URIParameters";
import {CommentType} from "../types/comment-type";

export const notYourComment = async (req: RequestWithParamsAndBody<URIParameters, CommentType>,
                                     res: Response, next: NextFunction) => {

    const comment = await commentsService.giveCommentById(req.params.id)

    if (!comment) {
        return res.sendStatus(404)
    }

    if (comment.userId !== req.user!.id) {
        return res.sendStatus(403) //	If try edit the comment that is not your own
    }

    next()
}