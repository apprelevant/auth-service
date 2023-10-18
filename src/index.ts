import dotenv from 'dotenv';
import mongoose from 'mongoose';
import express from 'express';
import passport from 'passport';

import setupJWTAuth from './auth/jwt-auth';
import authRouter from './routes/auth-router';
import startServer from './start-server';

// load env variables so they are available under process.env
dotenv.config({ path: `./config/.env.${process.env.NODE_ENV}` });

const expressApplication = express();

// setup PassportJS
setupJWTAuth();

expressApplication.use(express.urlencoded({ extended: true }));
expressApplication.use(express.json());
expressApplication.use(passport.initialize());

// Routing
expressApplication.use('/api/v1/auth', authRouter);

startServer(expressApplication);



/** Connect to Mongo */
mongoose
    .connect(`${process.env.DATABASE_URL}`, { retryWrites: true, w: 'majority' })
    .then(() => {
        console.log('Mongo connected successfully.');
    })
    .catch((error) => {
        console.log(error)
    });

