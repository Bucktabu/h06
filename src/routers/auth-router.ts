import {Request, Response, Router} from "express";
import {usersService} from "../domain/user-service";
import {authRouterValidation} from "../middlewares/authRouter-validation-middleware";
import {authMiddleware} from "../middlewares/auth-middleware";
import {jwsService} from "../application/jws-service";

export const authRouter = Router({})

const POST = authRouter.post
const GET = authRouter.get

POST('/login',
    authRouterValidation,
    async (req: Request, res: Response) => {

        const user = await usersService.checkCredential(req.body.login, req.body.password)

        if (!user) {
            return res.sendStatus(401)
        }

        const token = await jwsService.createJWT(user)

        return res.status(200).send({accessToken: token})
    }
)

GET('/me',
    authMiddleware,
    async (req: Request, res: Response) => {
        const aboutMe = usersService.aboutMe(req.user!)

        return res.status(200).send(aboutMe)
    }
)