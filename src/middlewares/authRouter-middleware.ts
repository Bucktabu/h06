import {bodyAuthRouterValidation} from "./validation-middleware/authRouter-validation";
import {inputValidation} from "./validation-middleware/input-validation";
import {authentication} from "./validation-middleware/authentication";

export const postAuthRouterMiddleware = [...bodyAuthRouterValidation, inputValidation]
export const getAuthRouterMiddleware = [authentication]