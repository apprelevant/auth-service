import express, { Request, Response } from 'express';
import passport from 'passport';
import { AuthController } from '../controllers/auth-controller';
const router = express.Router();

const authController = new AuthController();

router.post(
  '/register/email',
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
  passport.authenticate('jwtNoExpiration', { session: false }),
  async (req: Request, res: Response) => {
    await authController.exchangeRefreshToken(req, res);
  }
);

router.post(
  '/verify',
  passport.authenticate('jwt', { session: false }),
  async (req: Request, res: Response) => {
    await authController.verifyToken(req, res);
  }
);

export default router;
