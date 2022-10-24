import {Response, Router} from "express";

import {authenticationGuard} from "../middlewares/validation-middleware/authentication-guard";
import {userRouterValidation} from "../middlewares/validation-middleware/userRouter-validation";
import {usersQueryValidationMiddleware} from "../middlewares/validation-middleware/query-validation";

import {usersService} from "../domain/user-service";

import {CreateNewUser} from "../models/createNewUser";
import {QueryParameters} from "../models/queryParameters";
import {URIParameters} from "../models/URIParameters";

import {ContentPageType} from "../types/content-page-type";
import {RequestWithBody, RequestWithParams, RequestWithQuery} from "../types/request-types";

export const usersRouter = Router({})


usersRouter.post('/',
    authenticationGuard,
    userRouterValidation,
    async (req: RequestWithBody<CreateNewUser>, res: Response) => {

        const newUser = await usersService.createNewUser(req.body.login, req.body.password, req.body.email)

        if (!newUser) {
            return res.sendStatus(404)
        }

        return res.status(201).send(newUser)
    })

usersRouter.get('/',
    ...usersQueryValidationMiddleware,
    async (req: RequestWithQuery<QueryParameters>, res: Response) => {
        const pageWithUsers: ContentPageType = await usersService
            .giveUsersPage(req.query.sortBy,
                           req.query.sortDirection,
                           req.query.pageNumber,
                           req.query.pageSize,
                           req.query.searchLoginTerm,
                           req.query.searchEmailTerm)

        if (!pageWithUsers) {
            return res.sendStatus(404)
        }

        return res.status(200).send(pageWithUsers)
    })

usersRouter.delete('/:id', // userId
    authenticationGuard,
    async (req: RequestWithParams<URIParameters>, res: Response) => {

        const isDeleted = await usersService.deleteUserById(req.params.id)

        if (!isDeleted) {
            return res.sendStatus(404)
        }

        return res.sendStatus(204)
    }
)