import {commentsRepository} from "../repositories/comments-repository";
import {CommentType} from "../types/comment-type";
import {UserDBType} from "../types/user-type";
import {ContentPageType} from "../types/content-page-type";
import {postsRouter} from "../routers/posts-router";
import {paginationContentPage} from "../paginationContentPage";

export const commentsService = {
    async createNewComment(comment: string, user: UserDBType): Promise<CommentType> {
        const newComment = {
            id: String(+new Date()),
            content: comment,
            userId: user.id,
            userLogin: user.login,
            createdAt: new Date().toISOString()
        }

        await commentsRepository.createNewComment({...newComment})
        return newComment
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
                           postId: string): Promise<ContentPageType | null> {

        const content = await commentsRepository.giveComments(sortBy, sortDirection, pageNumber, pageSize, postId)
        const totalCount = await commentsRepository.giveTotalCount(postId)

        if (!content) {
            return null
        }

        return paginationContentPage(pageNumber, pageSize, content, totalCount)
    },

    async deleteCommentById(id: string): Promise<boolean> {
        return await commentsRepository.deleteCommentById(id)
    }
}