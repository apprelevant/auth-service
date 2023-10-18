import { Express, Request, Response, NextFunction } from 'express';
import http from 'http';

export default function startServer(expressApplication: Express) {
  /** Rules of our API */
  expressApplication.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method == 'OPTIONS') {
      res.header(
        'Access-Control-Allow-Methods',
        'PUT, POST, PATCH, DELETE, GET'
      );
      return res.status(200).json({});
    } else {
      next();
      return;
    }
  });

  expressApplication.post('/', (_, res) =>
    res.status(200).json({ message: 'Ping' })
  );

  const serverPort = process.env.SERVER_PORT || process.env.PORT;
  http.createServer(expressApplication).listen(serverPort, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running at ${serverPort}`);
  });
}
