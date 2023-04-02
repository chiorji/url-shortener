"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    urls: { type: mongoose_1.Schema.Types.ObjectId, ref: 'url' },
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('user', userSchema);
