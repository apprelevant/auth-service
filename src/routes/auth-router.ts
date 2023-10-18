import express, { Request, Response, NextFunction } from "express";
import {AuthController} from '../controllers/auth-controller';
import passport from "passport";
const router = express.Router();

const authController = new AuthController();

router.post('/register', async (req: Request, res: Response, next: NextFunction) => 
    await authController.registerNewUserViaEmail(req, res, next)
);

router.post('/login/email', async (req: Request, res: Response, next: NextFunction) =>
    await authController.loginUserViaEmail(req, res, next)
);

router.post('/refresh', passport.authenticate('jwt', {session: false}), async (req: Request, res: Response, next: NextFunction) => {
    await authController.exchangeRefreshToken(req, res, next)
});

export default router;



