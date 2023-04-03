import express, { Express, Request, Response } from 'express';
import { connect, HydratedDocument } from 'mongoose'
import path from 'path';
import dotenv from 'dotenv'
import md5 from 'md5';

import { TypedRequest, LoginRequest } from './types';
import { User, IUser } from './schema/users'

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3030;

app.use(express.static(path.join(__dirname, __dirname + '/../')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const EMAIL_REGEXP = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const isValidEmailAddress = (email: string) => EMAIL_REGEXP.test(email);

(async () => {
    await connect('mongodb://127.0.0.1:27017/url-shortener');
    console.log('Connected to MongoDB');
})().catch((error) => { console.log(error); });

app.get('/', (req: Request, res: Response) => {
    console.log('Health check...');
    res.sendStatus(200)
})

// To create a url with the service, you need to provide email and password
app.post('/login', async (req: TypedRequest<LoginRequest>, res: Response) => {
    const { email, password } = req.body;

    if (!isValidEmailAddress(email)) {
        return res.status(400).json({ message: 'Invalid email' })
    };

    const user = await User.findOne({ email: email});

    if(!user) {
        return res.status(404).json({ message: 'User not found'});
    }
    
    if (md5(password) !== user.password) {
        return res.status(404).json({ message: 'Password incorrect' })
    }

    return res.status(200).json({ message: 'Login successful' });
})

app.post('/signup', async (req: TypedRequest<LoginRequest>, res: Response) => {
    const { email, password } = req.body;

    if(!(email || password) || !isValidEmailAddress(email)) {
        return res.status(400).json({message: 'Invalid email or password'})
    }

    const user: HydratedDocument<IUser> = new User({ email, password: md5(password) });
    await user.save();
    return res.status(200).json({ message: 'Successful onboarded', data: user });
});

app.listen(PORT, () => {
    console.log('listening on port', PORT);
})