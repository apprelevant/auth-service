import express, { Request, Response } from 'express';
import { AuthController } from '../controllers/auth-controller';
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

router.post('/refresh', async (req: Request, res: Response) => {
  await authController.exchangeRefreshToken(req, res);
});

router.post('/verify', async (req: Request, res: Response) => {
  await authController.verifyToken(req, res);
});

export default router;
