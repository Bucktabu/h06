import {UserDBType} from "./types/user-type";
import {WithId} from "mongodb";
import {PostType} from "./types/posts-type";
import {blogsRepository} from "./repositories/blogs-repository";
import {BlogType} from "./types/blogs-type";

export const giveSkipNumber = (pageNumber: string,
                               pageSize: string) => {

    return (Number(pageNumber) - 1) * Number(pageSize)
}

export const givePagesCount = (totalCount: number, pageSize: string) => {
    return Math.ceil(totalCount / Number(pageSize))
}

export const usersDBtoUserType = (userDB: UserDBType) => {
    return {
        id: userDB.id,
        login: userDB.login,
        email: userDB.email,
        createdAt: userDB.createdAt
    }
}

export const userDBtoUser = (userDB: UserDBType) => {
    return {
        email: userDB.email,
        login: userDB.login,
        userId: userDB.id,
    }
}

export const blogDBtoBlogType = (blogDB: BlogType) => {
    return {
        id: blogDB.id,
        name: blogDB.name,
        youtubeUrl: blogDB.youtubeUrl,
        createdAt: blogDB.createdAt
    }
}

export const postBDtoPostType = (postsBD: PostType) => {
    return {
        id: postsBD.id,
        title: postsBD.title,
        shortDescription: postsBD.shortDescription,
        content: postsBD.content,
        blogId: postsBD.blogId,
        blogName: postsBD.blogName,
        createdAt: postsBD.createdAt
    }
}

