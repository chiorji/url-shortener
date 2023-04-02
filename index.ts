import express, { Express, Request, Response } from 'express';
import { connect } from 'mongoose'
import path from 'path';
import dotenv from 'dotenv'

import {TypedRequest, LoginRequest} from './types'

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, __dirname + '/../')));
app.use(express.urlencoded({ extended: false }));

(async () => {
    await connect('mongodb://127.0.0.1:27017/url-shortener');
    console.log('Connected to MongoDB');
})().catch((error) => { console.log(error); });

app.get('/', (req: Request, res: Response) => {
    console.log('Health check...');
    res.sendStatus(200)
})

app.post('/login', (req: TypedRequest<LoginRequest>, res: Response) => {
    console.log('Login request...');
    const {email, password} = req.body;
    res.status(200).json({email: email, password: password});
})

app.listen(PORT, () => {
    console.log('listening on port', PORT);
})