import {commentsRepository} from "../repositories/comments-repository";
import {CommentBDType, CommentsType, CommentType} from "../types/comment-type";
import {UserDBType} from "../types/user-type";
import {ContentPageType} from "../types/content-page-type";

import {paginationContentPage} from "../paginationContentPage";
import {commentBDtoCommentType} from "../helperFunctions";
import {ObjectId} from "mongodb";

export const commentsService = {
    async createNewComment(postId: string, comment: string, user: UserDBType): Promise<CommentType | null> {
        const newComment = {
            _id: new ObjectId(),
            id: String(+new Date()),
            content: comment,
            userId: user.id,
            userLogin: user.login,
            createdAt: new Date().toISOString(),
            postId: postId
        }

        const createdComment = await commentsRepository.createNewComment(newComment)

        if (!createdComment) {
            return null
        }

        return commentBDtoCommentType(createdComment)
    },

    async updateComment(id: string, comment: string): Promise<boolean> {
        return await commentsRepository.updateComment(id, comment)
    },

    async giveCommentById(id: string): Promise<CommentType | null> {
        return await commentsRepository.giveCommentById(id)
    },

    async giveCommentsPage(sortBy: string,
                           sortDirection: 'asc' | 'desc',
                           pageNumber: string,
                           pageSize: string,
                           userId: string): Promise<ContentPageType> {
        debugger
        const commentsDB = await commentsRepository.giveComments(sortBy, sortDirection, pageNumber, pageSize, userId)
        const comments = commentsDB.map(c => commentBDtoCommentType(c))
        const totalCount = await commentsRepository.giveTotalCount(userId)

        return paginationContentPage(pageNumber, pageSize, comments, totalCount)
    },

    async deleteCommentById(id: string): Promise<boolean> {
        return await commentsRepository.deleteCommentById(id)
    }
}