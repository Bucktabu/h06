import {Request, Response, Router} from "express";
import {usersService} from "../domain/user-service";
import {getAuthMiddleware,
        postAuthMiddleware} from "../middlewares/authRouter-validation-middleware";
import {jwsService} from "../application/jws-service";

export const authRouter = Router({})

authRouter.post('/login',
    postAuthMiddleware,
    async (req: Request, res: Response) => {

        const user = await usersService.checkCredential(req.body.login, req.body.password)

        if (!user) {
            return res.sendStatus(401)
        }

        const token = await jwsService.createJWT(user)

        return res.status(200).send({accessToken: token})
    }
)

authRouter.get('/me',
    getAuthMiddleware,
    async (req: Request, res: Response) => {
        const aboutMe = usersService.aboutMe(req.user!)

        return res.status(200).send(aboutMe)
    }
)