"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const md5_1 = __importDefault(require("md5"));
const users_1 = require("./schema/users");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3030;
app.use(express_1.default.static(path_1.default.join(__dirname, __dirname + '/../')));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
const EMAIL_REGEXP = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const isValidEmailAddress = (email) => EMAIL_REGEXP.test(email);
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, mongoose_1.connect)('mongodb://127.0.0.1:27017/url-shortener');
    console.log('Connected to MongoDB');
}))().catch((error) => { console.log(error); });
app.get('/', (req, res) => {
    console.log('Health check...');
    res.sendStatus(200);
});
// To create a url with the service, you need to provide email and password
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!isValidEmailAddress(email)) {
        return res.status(400).json({ message: 'Invalid email' });
    }
    ;
    const user = yield users_1.User.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    if ((0, md5_1.default)(password) !== user.password) {
        return res.status(404).json({ message: 'Password incorrect' });
    }
    return res.status(200).json({ message: 'Login successful' });
}));
app.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!(email || password) || !isValidEmailAddress(email)) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    const user = new users_1.User({ email, password: (0, md5_1.default)(password) });
    yield user.save();
    return res.status(200).json({ message: 'Successful onboarded', data: user });
}));
app.listen(PORT, () => {
    console.log('listening on port', PORT);
});
