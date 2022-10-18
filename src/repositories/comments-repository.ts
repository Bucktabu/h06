import {commentsCollection} from "./db";
import {CommentType} from "../types/comment-type";

export const commentsRepository = {
    async updateComment(id: string, comment: string): Promise<boolean> {
        const result = await commentsCollection.updateOne({id: id}, {$set:{content: comment}})

        return result.matchedCount === 1
    },

    async giveCommentById(id: string): Promise<CommentType | null> {
        return await commentsCollection.findOne({id: id}, {projection: {_id: false}})
    },

    async deleteCommentById(id: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({id: id})

        return result.deletedCount === 1
    },

    async deleteAllComments(): Promise<boolean> {
        try {
            await commentsCollection.deleteMany({})
            return true
        } catch (e) {
            console.log('commentsCollection => deleteAllComments =>', e)
            return false
        }
    }
}