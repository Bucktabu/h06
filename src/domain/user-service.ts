import bcrypt from 'bcrypt'
import {usersRepository} from "../repositories/users-repository";
import {UserDBType, UserType} from "../types/user-type";
import {ContentPageType} from "../types/content-page-type";
import {paginationContentPage} from "../paginationContentPage";
import {ObjectId} from "mongodb";
import {userDBtoUser, usersDBtoUserType} from "../helperFunctions";
import {AboutMeType} from "../types/aboutMe-type";

export const usersService = {
    async aboutMe(user: UserDBType): Promise<AboutMeType> {
        return userDBtoUser(user)
    },

    async createNewUser(login: string, password: string, email: string): Promise<UserType | null> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const createNewUser: UserDBType = {
            id: String(+new Date()),
            login,
            email,
            passwordHash,
            passwordSalt,
            createdAt: new Date().toISOString()
        }

        const createdNewUser = await usersRepository.createNewUser(createNewUser)

        if (!createdNewUser) {
            return null
        }

        return usersDBtoUserType(createdNewUser)
    },

    async giveUserById(id: string): Promise<UserDBType | null> {
        return usersRepository.giveUserById(id)
    },

    async giveUsersPage(sortBy: string,
                        sortDirection: string,
                        pageNumber: string,
                        pageSize: string,
                        searchLoginTerm: string,
                        searchEmailTerm: string): Promise<ContentPageType> {

        const users = await usersRepository.giveUsers(sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm)
        const totalCount = await usersRepository.giveTotalCount(searchLoginTerm, searchEmailTerm)

        return paginationContentPage(pageNumber, pageSize, users, totalCount)
    },

    async deleteUserById(userId: string): Promise<boolean> {
        return await usersRepository.deleteUserById(userId)
    },

    async checkCredential(login: string, password: string): Promise<UserDBType | null> {
        const user: UserDBType | null = await usersRepository.giveUserByLogin(login)

        if (!user) {
            return null
        }

        const passwordEqual = await bcrypt.compare(password, user.passwordHash)
        console.log('passwordEqual', passwordEqual)
        if (!passwordEqual) {
            return null
        }

        return user
    },

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }
}