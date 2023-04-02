"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Url = void 0;
const mongoose_1 = require("mongoose");
const urlSchema = new mongoose_1.Schema({
    clickCount: { type: Number, default: 0 },
    owner: { type: mongoose_1.Schema.Types.ObjectId, ref: 'user' },
}, { timestamps: true });
exports.Url = (0, mongoose_1.model)('url', urlSchema);
