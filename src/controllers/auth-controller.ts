import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

import AuthService from "../services/auth-service";
import { UserCreationParams } from "../models/UserCreationParams";
import { AuthenticatedUser } from "../models/AuthenticatedUser";
import { LoginDetails } from "../models/LoginDetails";
import { ExchangeRefreshTokenParams } from "src/models/ExchangeRefreshTokenParams";

export class AuthController {
    private authService;

    constructor() {
        this.authService = new AuthService();
    }

    public async registerNewUserViaEmail(req: Request, res: Response, next: NextFunction): Promise<Response>{
        const { email, username, password } = req.body as UserCreationParams;

        const authorizedUser = await this.authService.registerUserViaEmail({ email, username, password });
        req.user = authorizedUser;
        return res.status(StatusCodes.CREATED).json(authorizedUser);

    }


    public async loginUserViaEmail(req: Request, res: Response, next: NextFunction): Promise<Response>{
        const { email, password } = req.body as LoginDetails;
        const authorizedUser = await this.authService.loginUserViaEmail({ email, password });
        req.user = authorizedUser;

        return res.status(StatusCodes.OK).json(authorizedUser)
        
    }

    public async exchangeRefreshToken(req: Request, res: Response, next: NextFunction){
        const { refreshToken } = req.body as ExchangeRefreshTokenParams;
        try {
            if (req.user) {
                const updated = await this.authService.exchangeRefreshToken({ refreshToken }, req.user as AuthenticatedUser)
                res.status(StatusCodes.OK).json(updated);
            } else {
                res.status(StatusCodes.UNAUTHORIZED);
            }
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
        }
    }


}