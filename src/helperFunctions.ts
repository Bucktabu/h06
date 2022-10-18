import {UserDBType} from "./types/user-type";

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

