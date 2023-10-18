import express, { Request, Response } from 'express';
import { AuthController } from '../controllers/auth-controller';
import passport from 'passport';
const router = express.Router();

const authController = new AuthController();

router.post(
  '/register',
  async (req: Request, res: Response) =>
    await authController.registerNewUserViaEmail(req, res)
);

router.post(
  '/login/email',
  async (req: Request, res: Response) =>
    await authController.loginUserViaEmail(req, res)
);

router.post(
  '/refresh',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    await authController.exchangeRefreshToken(req, res);
  }
);

export default router;
