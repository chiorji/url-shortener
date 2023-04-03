import express, { Express, Request, Response } from 'express';
import { connect, HydratedDocument } from 'mongoose'
import path from 'path';
import { nanoid, customAlphabet } from 'nanoid'
import dotenv from 'dotenv'
import md5 from 'md5';

import { TypedRequest, LoginRequest, IGenerateRequest } from './types';
import { User, IUser } from './schema/users';
import { Url, IUrl } from './schema/urls';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3030;

app.use(express.static(path.join(__dirname, __dirname + '/../')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const EMAIL_REGEXP = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
// @ts-ignore
const URL_REGEXP = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i

const isValidEmailAddress = (email: string) => EMAIL_REGEXP.test(email);
const isValidUrl = (url: string) => URL_REGEXP.test(url);

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

    const user = await User.findOne({ email: email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (md5(password) !== user.password) {
        return res.status(404).json({ message: 'Password incorrect' })
    }

    return res.status(200).json({ message: 'Login successful' });
})

app.post('/signup', async (req: TypedRequest<LoginRequest>, res: Response) => {
    const { email, password } = req.body;

    if (!(email || password) || !isValidEmailAddress(email)) {
        return res.status(400).json({ message: 'Invalid email or password' })
    }

    const user: HydratedDocument<IUser> = new User({ email, password: md5(password) });
    await user.save();
    return res.status(200).json({ message: 'Successful onboarded', data: user });
});

app.post('/generate', async (req: TypedRequest<IGenerateRequest>, res: Response) => {
    const { url } = req.body;
    
    if (!isValidUrl(url)) {
        return res.status(400).json({ message: 'Invalid URL' });
    }
    // check if url already exists, if it doesn't, generate new url else return the existing url
    const itExists = await Url.findOne({ originalUrl: url });
    if (!itExists) {
        const shortId = customAlphabet('abcdefghijklmnopqrstuvwxyz', 5);
        const shortUrl = `http://127.0.0.1:${PORT}/${shortId()}`;
        const newUrl: HydratedDocument<IUrl> = new Url({ originalUrl: url, shortUrl })
        await newUrl.save();
        return res.status(201).json({ message: 'Url generated successfully', data: newUrl });
    }

    return res.status(201).json({ message: 'Url already exist', data: itExists });
});

app.listen(PORT, () => {
    console.log('listening on port', PORT);
})