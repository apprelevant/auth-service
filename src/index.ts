import dotenv from 'dotenv';
import mongoose from 'mongoose';

// load env variables so they are available under process.env
dotenv.config({ path: `./config/.env.${process.env.NODE_ENV}` });

/** Connect to Mongo */
mongoose
    .connect(`${process.env.DATABASE_URL}`, { retryWrites: true, w: 'majority' })
    .then(() => {
        console.log('Mongo connected successfully.');
    })
    .catch((error) => {
        console.log(error)
    });

