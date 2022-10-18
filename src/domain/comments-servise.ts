import {commentsRepository} from "../repositories/comments-repository";
import {CommentType} from "../types/comment-type";

export const commentsService = {
    async updateComment(id: string, comment: string): Promise<boolean> {
        return await commentsRepository.updateComment(id, comment)
    },

    async giveCommentById(id: string): Promise<CommentType | null> {
        return await commentsRepository.giveCommentById(id)
    },

    async deleteCommentById(id: string): Promise<boolean> {
        return await commentsRepository.deleteCommentById(id)
    }
}